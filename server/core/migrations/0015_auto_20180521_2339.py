# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-05-21 23:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_auto_20180520_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='block',
            name='block_status',
            field=models.CharField(blank=True, max_length=31),
        ),
        migrations.AddField(
            model_name='session',
            name='session_status',
            field=models.CharField(blank=True, max_length=31),
        ),
        migrations.AddField(
            model_name='sessionconfig',
            name='session_config_status',
            field=models.CharField(default='active', max_length=31),
        ),
        migrations.AlterField(
            model_name='sessionconfig',
            name='number_of_sessions',
            field=models.PositiveSmallIntegerField(blank=True),
        ),
    ]