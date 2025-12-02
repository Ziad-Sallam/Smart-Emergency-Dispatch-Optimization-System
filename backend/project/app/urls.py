# app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello_world, name='home'),  # example homepage
    # path('run-query/', views.run_query, name='run_query'),
    path('login/', views.login),
    path('check-old-password/', views.check_old_password),
    path('change-password/', views.change_password),
    path('refresh-token/', views.refresh_token)
]
