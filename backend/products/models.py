from django.db import models
from versatileimagefield.fields import VersatileImageField
import uuid

# Create your models here.

class Products(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    ProductID = models.BigIntegerField(unique=True)    
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)    
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)    
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey("auth.User", related_name="user%(class)s_objects", on_delete=models.CASCADE)    
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)    
    HSNCode = models.CharField(max_length=255, blank=True, null=True)    
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)
    Price = models.DecimalField(default=0.00, max_digits=20, decimal_places=2, blank=True, null=True)
  
    class Meta:
        db_table = "products_product"
        verbose_name = ("product")
        verbose_name_plural = ("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

class Variant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=255)
    option = models.CharField(max_length=255)
    stock = models.IntegerField(default=0)
    class Meta:
        ordering = ("name",)

class SubVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='sub_variants')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='sub_variants_product')
    name = models.CharField(max_length=255)
    option = models.CharField(max_length=255)
    stock = models.IntegerField(default=0)
    class Meta:
        ordering = ("name",)