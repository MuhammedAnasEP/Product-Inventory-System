# Generated by Django 5.0.6 on 2024-06-08 16:42

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_rename_varint_variant'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='variant',
            options={'ordering': ('name',)},
        ),
        migrations.AlterUniqueTogether(
            name='variant',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='variant',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='products.products'),
        ),
        migrations.AlterField(
            model_name='variant',
            name='stock',
            field=models.IntegerField(),
        ),
        migrations.AlterModelTable(
            name='variant',
            table=None,
        ),
        migrations.CreateModel(
            name='SubVariant',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('option', models.CharField(max_length=255)),
                ('stock', models.IntegerField()),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='products.variant')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sub_variants', to='products.products')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.RemoveField(
            model_name='variant',
            name='parent',
        ),
    ]
