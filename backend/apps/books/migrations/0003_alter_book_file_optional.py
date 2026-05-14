from django.db import migrations, models

import utils.validators


class Migration(migrations.Migration):

    dependencies = [
        ("books", "0002_book_source_path_book_file_hash"),
    ]

    operations = [
        migrations.AlterField(
            model_name="book",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="books/", validators=[utils.validators.validate_pdf_file]),
        ),
    ]