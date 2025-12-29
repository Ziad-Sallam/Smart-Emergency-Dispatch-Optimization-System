import os
import django
import pymysql

pymysql.install_as_MySQLdb()

from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

procedure_sql = """
CREATE PROCEDURE assign_responder_to_vehicle(
    IN p_responder_id INT,
    IN p_new_vehicle_id INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback transaction on error
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Failed to assign responder to vehicle';
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Delete old vehicle assignment if exists
    DELETE FROM responder_vehicle
    WHERE responder_id = p_responder_id;

    DELETE FROM responder_vehicle
    WHERE vehicle_id = p_new_vehicle_id;
    
    -- Insert new vehicle assignment
    INSERT INTO responder_vehicle (vehicle_id, responder_id)
    VALUES (p_new_vehicle_id, p_responder_id);
    
    -- Commit transaction
    COMMIT;
    
END
"""

with connection.cursor() as cursor:
    try:
        cursor.execute("DROP PROCEDURE IF EXISTS assign_responder_to_vehicle")
        cursor.execute(procedure_sql)
        print("Successfully created procedure 'assign_responder_to_vehicle'")
    except Exception as e:
        print(f"Error: {e}")
