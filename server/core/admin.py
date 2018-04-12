from django.contrib import admin

from .models import Book, BookshelfEntry

admin.site.register(Book)
admin.site.register(BookshelfEntry)
