# Generated by Django 4.2.6 on 2023-11-11 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0031_activity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='activity_type',
            field=models.CharField(choices=[('new_story', 'New Story Created'), ('story_liked', 'Story Liked'), ('story_unliked', 'Story Unliked'), ('followed_user', 'Followed User'), ('unfollowed_user', 'Unfollowed User')], max_length=30),
        ),
    ]
