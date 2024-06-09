from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Products, Variant, SubVariant
from .serializers import ProductsSerializer, VariantSerializer, SubVariantSerializer, StockSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .pagination import ProductListPagination
from rest_framework.permissions import IsAuthenticated


# Create your views here.

class ProductView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        query_set = Products.objects.all()
        if query_set:
            paginator = ProductListPagination()
            paginated_products = paginator.paginate_queryset(query_set, request)
            serializer = ProductsSerializer(paginated_products, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    def post(self, request):
        variant_name = request.data['variant_name']
        variant = request.data['variant']
        sub_variant = request.data['sub_variant']
        stock = request.data['stock']
        image = request.data['ProductImage']
        sub_variant_name = request.data['sub_variant_name']
        request.data.pop('variant_name')
        request.data.pop('sub_variant_name')
        request.data.pop('variant')
        request.data.pop('sub_variant')
        request.data.pop('stock')
        request.data.pop('ProductImage')
        data = request.data
        new_data = {}
        for key in data:
            new_data[key] = data[key]
        
        product = Products.objects.filter(Q(ProductCode=request.data['ProductCode']) | Q(ProductID=request.data['ProductID']))
        if product:
            return Response({"detail":"Product already exists"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProductsSerializer(data=new_data)
        request.data.pop('CreatedUser')
        id = request.data['ProductID']
        
        if serializer.is_valid():
            user = User.objects.get(id=request.user.id)
            new_data['CreatedUser'] = user
            product = Products.objects.create(ProductImage=image, **new_data, TotalStock=stock)
            parent = Variant.objects.create(name=variant_name, product=product, option=variant, stock=stock)
            sub_variant = SubVariant.objects.create(parent=parent, name=sub_variant_name, option=sub_variant, stock=stock, product=product)

            return Response({'status':'Created', 'data':serializer.data}, status=status.HTTP_201_CREATED)                    
        return Response({'detail':'Check the fields'}, status=status.HTTP_400_BAD_REQUEST)
    
class ProductDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            products = Products.objects.get(ProductID = id)
            serializer = ProductsSerializer(products)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"detail":"Product is not available"},status=status.HTTP_404_NOT_FOUND)

class AddAndRemoveStockView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, id):
        serializer = StockSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        
        try:
            product = Products.objects.get(ProductID=id)
        except Products.DoesNotExist:
            return Response({"detail": "Product is not available"}, status=status.HTTP_404_NOT_FOUND)
        
        variant = Variant.objects.filter(
            Q(product=product) & Q(name=request.data['variant_name']) & Q(option=request.data['variant'])
        ).first()
        
        if variant is None:
            variant = Variant.objects.create(
                name=request.data['variant_name'],
                product=product,
                option=request.data['variant'],
                stock=int(request.data['stock'])
            )
        else:
            variant.stock += int(request.data['stock'])
            variant.save()
        
        sub_variant = SubVariant.objects.filter(
            Q(parent=variant) & Q(name=request.data['sub_name']) & Q(option=request.data['sub_variant'])
        ).first()
        
        if sub_variant is None:
            sub_variant = SubVariant.objects.create(
                parent=variant,
                product=product,
                name=request.data['sub_name'],
                option=request.data['sub_variant'],
                stock=int(request.data['stock'])
            )
        else:
            sub_variant.stock += int(request.data['stock'])
            sub_variant.save()

        product.TotalStock += int(request.data['stock'])
        product.save()

        response_data = {
            "detail": "Stock updated successfully",
            "variant_id": variant.id
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        serializer = StockSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        
        try:
            product = Products.objects.get(ProductID=id)
        except Products.DoesNotExist:
            return Response({"detail": "Product is not available"}, status=status.HTTP_404_NOT_FOUND)

        variant = Variant.objects.filter(
            Q(product=product) & Q(name=request.data['variant_name']) & Q(option=request.data['variant'])
        ).first()

        if variant is None:
            return Response({"detail": "Variant is not available"}, status=status.HTTP_404_NOT_FOUND)
        else:
            if variant.stock - int(request.data['stock']) < 0:
                variant.stock = 0
            else:
                variant.stock -= int(request.data['stock'])
                variant.save()
        
        sub_variant = SubVariant.objects.filter(
            Q(parent=variant) & Q(name=request.data['sub_name']) & Q(option=request.data['sub_variant'])
        ).first()
        
        if sub_variant is None:
            return Response({"detail": "Sub Variant is not available"}, status=status.HTTP_404_NOT_FOUND)
        else:
            if sub_variant.stock - int(request.data['stock']) < 0:
                sub_variant.stock = 0
            else:
                sub_variant.stock -= int(request.data['stock'])
                sub_variant.save()
        
        if product.TotalStock - int(request.data['stock']) < 0:
            product.TotalStock = 0
        else:
            product.TotalStock -= int(request.data['stock'])
            product.save()

        response_data = {
            "detail": "Stock updated successfully",
            "variant_id": variant.id
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
