# Generated by Django 3.2.8 on 2021-10-15 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20211015_1436'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='birthday',
            field=models.DateField(default=None),
        ),
    ]