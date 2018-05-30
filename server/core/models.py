from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from custom_user.models import AbstractEmailUser
from django.utils import timezone

class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()

class CustomUser(AbstractEmailUser):
    username = models.CharField(max_length=31, blank=True)
    first_name = models.CharField(max_length=31, blank=True)
    last_name = models.CharField(max_length=31, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)

# currently not in use
class Experiment(models.Model):
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)
    number_of_participants = models.PositiveSmallIntegerField(null=True)

class NudgeStatic(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=180)
    heading = models.CharField(max_length=30)
    text = models.CharField(max_length=200)
    image = models.CharField(max_length=30)
    nudge_type = models.CharField(max_length=30)

class NudgeDynamic(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=180)
    heading = models.CharField(max_length=30)
    text = models.CharField(max_length=200)
    image = models.CharField(max_length=30)
    nudge_type = models.CharField(max_length=30)

class FeedbackConfig(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=180)
    heading = models.CharField(max_length=30)
    text = models.CharField(max_length=400)
    feedback_type = models.CharField(max_length=30)

class ContextConfig(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=180)
    heading = models.CharField(max_length=30)
    text = models.CharField(max_length=400)
    context_type = models.CharField(max_length=30)

class BlockConfig(models.Model):
    name = models.CharField(max_length=31)
    description = models.CharField(max_length=180)
    context = models.ForeignKey(ContextConfig)
    feedback = models.ForeignKey(FeedbackConfig)

    clocktime = models.DateTimeField(default=timezone.now)
    charge_status =  models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    charge_distance = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    charge_capacity = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    energy_price = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    power_price = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    representation_current_state = models.CharField(max_length=31, blank=True)

    flexibility_time_request = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    default_charge_level = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    time_to_full_charge = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    #full_charge_price = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    minimum_charge_level = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    representation_target_state = models.CharField(max_length=31, blank=True)

    flexibility_time_provision = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    saved_emissions = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    avoided_environmental_costs = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    avoided_energy_costs = models.DecimalField(max_digits=30, decimal_places=5, blank=True)

    penalty_probability = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    penalty_amount = models.DecimalField(max_digits=30, decimal_places=5, blank=True)

    nudge_static = models.ForeignKey(NudgeStatic)
    nudge_dynamic = models.ForeignKey(NudgeDynamic)

class SessionConfig(models.Model):
    name = models.CharField(max_length=31, blank=True)
    description = models.CharField(max_length=180)
    number_of_sessions = models.PositiveSmallIntegerField(blank=True)
    session_config_status = models.CharField(max_length=31, default="active")

class Session(models.Model):
    #experiment = models.ForeignKey(Experiment)
    user = models.ForeignKey(CustomUser)
    session_config = models.ForeignKey(SessionConfig)
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)
    session_status = models.CharField(max_length=31, blank=True)

    class Meta:
        unique_together = ('user', 'session_config')


class Block(models.Model):
    user = models.ForeignKey(CustomUser)
    session = models.ForeignKey(Session)
    block_config = models.ForeignKey(BlockConfig)
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)
    block_status = models.CharField(max_length=31, blank=True)

    class Meta:
        unique_together = ('session', 'block_config')


class SessionBlockConfig(models.Model):
    session_config = models.ForeignKey(SessionConfig)
    block_config = models.ForeignKey(BlockConfig)

    class Meta:
        unique_together = ('session_config', 'block_config')


class Event(models.Model):
    event = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser)
    block = models.ForeignKey(Block)
    session = models.ForeignKey(Session)

    screen = models.CharField(max_length=50)
    time_stamp = models.DateTimeField(default=timezone.now)

    provided_flexibility_time = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    target_charging_level = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    target_minimum_charging_level = models.DecimalField(max_digits=30, decimal_places=5, blank=True)
    charging_level_representation = models.CharField(max_length=50)
