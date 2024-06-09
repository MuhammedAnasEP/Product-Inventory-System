from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('product', views.ProductView.as_view(), name='product'),
    path('product-details/<int:id>', view=views.ProductDetailsView.as_view(), name='product-details'),
    path('add-remove-stock/<int:id>', view=views.AddAndRemoveStockView.as_view(), name='product-details')

]