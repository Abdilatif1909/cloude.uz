from django.db import migrations, models

import utils.validators


class Migration(migrations.Migration):

    dependencies = [
        ("materials", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lecture",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="lectures/", validators=[utils.validators.validate_pdf_file]),
        ),
        migrations.AlterField(
            model_name="practical",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="practicals/", validators=[utils.validators.validate_pdf_file]),
        ),
    ]