# Generated by Django 4.2.1 on 2023-05-25 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("table", "0003_delete_summerstaff_remove_weeklyjobassignment_job_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="JobAssignments",
            fields=[
                (
                    "id",
                    models.IntegerField(default=1, primary_key=True, serialize=False),
                ),
                ("data", models.JSONField(default=dict)),
            ],
        ),
        migrations.DeleteModel(
            name="WeekOfJobAssignments",
        ),
    ]
