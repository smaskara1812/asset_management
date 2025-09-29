# Generated manually to remove Department model and department field from Asset

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('asset_backend_app', '0003_alter_assetcategory_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='asset',
            name='department',
        ),
        migrations.DeleteModel(
            name='Department',
        ),
    ]
