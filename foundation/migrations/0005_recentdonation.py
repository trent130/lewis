# Generated by Django 5.1.3 on 2024-11-13 09:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foundation', '0004_alter_chat_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecentDonation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('viewed_at', models.DateTimeField(auto_now_add=True)),
                ('donation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='foundation.donation')),
            ],
        ),
    ]
