from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .hasher import hash_password, check_password
from .jwt_utils import generate_access_token, generate_refresh_token, refresh_access_token
from .auth import auth_user 
from .repo import update_user_password, get_user_by_email, get_user_by_user_id
import json


# Create your views here.
@csrf_exempt
def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})


@csrf_exempt
def run_query(request):
    """
    View to run arbitrary SQL queries sent via POST request.
    this is for testing purposes only and should not be used in production without proper security measures.
    """
    if request.method == "POST":
        try:
            # Get query from request
            if request.content_type == "application/json":
                data = json.loads(request.body)
                query = data.get("query", "")
            else:
                query = request.POST.get("query", "")

            if not query:
                return JsonResponse({"error": "No query provided"}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(query)

                # Handle SELECT queries (that return data)
                if query.strip().upper().startswith("SELECT"):
                    rows = cursor.fetchall()
                    # Get column names
                    columns = (
                        [col[0] for col in cursor.description]
                        if cursor.description
                        else []
                    )

                    # Convert rows to list of dictionaries
                    result_data = []
                    for row in rows:
                        row_dict = {}
                        for i, value in enumerate(row):
                            row_dict[columns[i]] = (
                                str(value) if value is not None else None
                            )
                        result_data.append(row_dict)

                    result = {
                        "success": True,
                        "query": query,
                        "columns": columns,
                        "data": result_data,
                        "row_count": len(rows),
                        "message": f"Query returned {len(rows)} rows",
                    }
                else:
                    # Handle INSERT, UPDATE, DELETE queries
                    result = {
                        "success": True,
                        "query": query,
                        "row_count": cursor.rowcount,
                        "message": f"Query executed successfully. {cursor.rowcount} rows affected.",
                    }

            return JsonResponse({"result": result})

        except Exception as e:
            return JsonResponse(
                {
                    "success": False,
                    "error": str(e),
                    "query": query if "query" in locals() else "Unknown",
                },
                status=500,
            )

    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)

@csrf_exempt
def login(request):
    err = check_request_method(request, "POST")
    if err:
        return JsonResponse({"message": str(err)})

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    user = None
    try:
        user = get_user_by_email(email)
    except Exception as e:
        return JsonResponse({"message": f"Invalid user + {str(e)}"}, status=400)
    print
    # password is not correct
    if not check_password(password, user["password"]):
        return JsonResponse({"message": "Invalid password"}, status=400)

    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)

    user.pop("password")
    return JsonResponse(
        {
            "message": "Login successful",
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        status=200,
    )

@csrf_exempt
@auth_user
def check_old_password(request):
    err = check_request_method(request, "POST")
    if err:
        return JsonResponse({"message": str(err)})

    user_id = request.user_id
    data = json.loads(request.body)
    old_password = data.get("old_password")
    user = None
    try:
        user = get_user_by_user_id(user_id)
    except Exception as e:
        return JsonResponse({"message": f"Invalid user + {str(e)}"}, status=400)
    
    if not check_password(old_password, user["password"]):
        return JsonResponse({"message": "Invalid old password"}, status=400)

    return JsonResponse({"message": "Old password is correct"}, status=200)

@csrf_exempt
@auth_user
def change_password(request):
    err = check_request_method(request, "POST")
    if err:
        return JsonResponse({"message": str(err)})

    user_id = request.user_id
    data = json.loads(request.body)
    new_password = data.get("new_password")
    new_hashed_password = hash_password(new_password)
    
    try:
        update_user_password(user_id, new_hashed_password)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
    return JsonResponse({"message": "Password changed successfully"})

@csrf_exempt
def refresh_token(request):
    err = check_request_method(request, "POST")
    if err:
        return JsonResponse({"message": str(err)}, status=400)

    data = json.loads(request.body)
    refresh_token = data.get("refresh")

    try:
        new_access_token = refresh_access_token(refresh_token)
    except Exception as e:
        return JsonResponse({'message': str(e)}, 500)
    return JsonResponse({"access_token": new_access_token}, status=200)


def check_request_method(request, method):
    if request.method != method:
        return f"Invalid request method. Use {method}."
    return None
