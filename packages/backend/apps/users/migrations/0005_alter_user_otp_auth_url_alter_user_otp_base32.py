# Generated by Django 4.0.8 on 2023-03-28 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_otp_auth_url_user_otp_base32_user_otp_enabled_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='otp_auth_url',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='otp_base32',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
