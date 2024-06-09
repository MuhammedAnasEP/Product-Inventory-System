from rest_framework import serializers
from .models import Products, SubVariant, Variant
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = '__all__'

class VariantSerializer(serializers.ModelSerializer):
    sub_variants = SubVariantSerializer(many=True)
    class Meta:
        model = Variant
        fields = '__all__'

class ProductsSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    CreatedUser = UserSerializer(read_only=True)
    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName','CreatedUser', 'variants', 'TotalStock', 'Price', 'ProductImage']

class StockSerializer(serializers.Serializer):
    stock = serializers.CharField()
    variant = serializers.CharField()
    sub_variant = serializers.CharField()