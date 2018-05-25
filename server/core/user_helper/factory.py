import factory
from django.contrib.auth import get_user_model


def create_test_admin(users):
    """Create admin user if none exist"""
    if not users:
        get_user_model().objects.create_superuser(
                email="admin@test.com",
                password="test_password",
                first_name="John",
                last_name="Doe",
        )
