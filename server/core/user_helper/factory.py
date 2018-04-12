import factory
from django.contrib.auth import get_user_model
from ..models import Book, BookshelfEntry



def create_test_admin(users):
    """Create admin user if none exist"""
    if not users:
        get_user_model().objects.create_superuser(
                email="admin@test.com",
                password="test_password",
                first_name="John",
                last_name="Doe",
        )


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')

class BookFactory(factory.DjangoModelFactory):
    class Meta:
        model = Book

    title = factory.Faker('word')
    author = factory.Faker('last_name')

class BookshelfEntryFactory(factory.DjangoModelFactory):
    class Meta:
        model = BookshelfEntry

    user = get_user_model().objects.first()
    book = Book.objects.first()
    state = factory.Faker('word')
    rating = 1


def generate_fake_users(number_of_users=25):
    """Generate 25 fake users"""
    for _ in range(0, number_of_users):
        UserFactory()



def generate_fake_books(number_of_books=25):
    """Generate 25 fake books"""
    for _ in range(0, number_of_books):
        BookFactory()


def generate_fake_bookshelf_entries(number_of_bookshelf_entries=25):
    """Generate 25 fake bookshelf_entries"""
    for _ in range(0, number_of_bookshelf_entries):
        BookshelfEntryFactory()
