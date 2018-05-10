from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from custom_user.models import AbstractEmailUser
from django.utils import timezone

class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()


# Not needed
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('title', 'author')

    def __str__(self):
        return self.title + ' (' + self.author + ')'

# Not needed
class Group(models.Model):
    name = models.CharField(max_length=32, unique=True)
    name_url = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

    @staticmethod
    def get_url_from_name(name):
        return name.strip().lower().replace('.', '').replace(',', '').replace(' ', '-')



class CustomUser(AbstractEmailUser):
    username = models.CharField(max_length=31, blank=True)
    first_name = models.CharField(max_length=31, blank=True)
    last_name = models.CharField(max_length=31, blank=True)
    profile_image = models.CharField(max_length=128, blank=True, default='default.png')
    groups = models.ManyToManyField(Group, through='Membership', symmetrical=False, related_name='members')
    books = models.ManyToManyField(Book, through='BookshelfEntry', symmetrical=False, related_name='users')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

# new

class Experiment(models.Model):
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)
    number_of_participants = models.PositiveSmallIntegerField(null=True)

class Session(models.Model):
    experiment = models.ForeignKey(Experiment)
    user = models.ForeignKey(CustomUser)
    #session_config
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'experiment')

class Block(models.Model):
    user = models.ForeignKey(CustomUser)
    session = models.ForeignKey(Session)
    #block_config
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'session')

class EventHistory(models.Model):
    session = models.ForeignKey(Session)
    block = models.ForeignKey(Block)
    screen = models.CharField(max_length=255)
    event = models.CharField(max_length=255)
    nudge = models.CharField(max_length=255)
    time_stamp = models.DateTimeField(default=timezone.now)



#TODO
# class BlockConfig(models.Model)
# class SessionConfig(models.Model)













# not needed
class BookshelfEntry(models.Model):
    user = models.ForeignKey(CustomUser)
    book = models.ForeignKey(Book)
    state = models.CharField(max_length=31) # to-read, read, ...
    rating = models.PositiveSmallIntegerField(null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'book')

# not needed
class GroupInvite(models.Model):
    group = models.ForeignKey(Group)
    email = models.CharField(max_length=63)
    first_name = models.CharField(max_length=31, blank=True)
    last_name = models.CharField(max_length=31, blank=True)
    verification_token = models.CharField(max_length=64, unique=True)
    created_by = models.ForeignKey(CustomUser, related_name='sent_invites')
    consumed = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    invitee = models.ForeignKey(CustomUser, related_name='received_invites', default=None, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('email', 'group')

# not needed
class BookRecommendationForFriend(models.Model):
    created_by = models.ForeignKey(CustomUser)
    first_name = models.CharField(max_length=31, blank=True)
    last_name = models.CharField(max_length=31, blank=True)
    book_title = models.CharField(max_length=63)
    book_author = models.CharField(max_length=63)
    created_at = models.DateTimeField(default=timezone.now)
    friend_email = models.CharField(max_length=63)
    email_sent = models.BooleanField(default=False)

# not needed
class Membership(models.Model):
    user = models.ForeignKey(CustomUser)
    group = models.ForeignKey(Group)
    invite = models.ForeignKey(GroupInvite, default=None, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'group')
