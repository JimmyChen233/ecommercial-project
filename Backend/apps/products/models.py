from django.db import models
from django.utils import timezone
from user.models import User
from db.base_model import BaseModel
# Create your models here.



class ProductCategory(BaseModel):
    name = models.CharField(max_length=10, null=True, blank=True, verbose_name='category_name')
    parent = models.ForeignKey('self', null = True, blank = True, on_delete=models.CASCADE,verbose_name = 'parent')

    class Meta:
        db_table = 'df_product_category'
        verbose_name = 'product_category'
        verbose_name_plural = verbose_name

class Product(BaseModel):

    status_choices = (
        (0, 'on shelves'),
        (1, 'off shelves'),
    )

    brand = models.CharField(max_length=50, verbose_name='brand', null=True, blank = True)
    category1 = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name='cat1_spu', verbose_name='primary_category', null=True, blank = True)
    category2 = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name='cat2_spu', verbose_name='second_category', null=True, blank = True)
    category3 = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name='cat3_spu', verbose_name='third_category', null=True, blank = True)
    # gender = models.CharField(max_length=1, null=True, choices=genderChoice)
    name = models.CharField(max_length=100,verbose_name='product_name', null=True, blank = True)
    price = models.DecimalField(max_digits=10,decimal_places=2,verbose_name='product_price', null=True, blank = True)
    sales = models.IntegerField(default=0, verbose_name='Quantity_sold', null=True, blank = True)
    validdt = models.DateTimeField(default=timezone.now,verbose_name='product_valid_date_and_time', null=True, blank = True)
    inventory = models.IntegerField(default=0, verbose_name='product_inventory', null=True, blank = True)
    validity = models.SmallIntegerField(default=0, choices=status_choices, verbose_name='product_validity', null=True, blank = True)
    desc = models.CharField(max_length=1024, verbose_name='product_description', null=True, blank = True)
    # size = models.CharField(max_length=10, verbose_name='size')
    image = models.TextField(verbose_name='default_image', null=True, blank = True)
    desc_image= models.TextField(null=True,verbose_name='desc_image', blank = True)
    tag = models.TextField(null=True, verbose_name='tag', blank = True)
    class Meta:
        db_table = 'df_products'
        verbose_name = 'product'
        verbose_name_plural = 'products'





class SpecificationOption(BaseModel):
    prod = models.ForeignKey(Product, related_name='options', on_delete=models.CASCADE, verbose_name='specification', null=True, blank = True)
    size = models.CharField(max_length=10, verbose_name='size', null=True, blank = True)
    color = models.CharField(max_length=10, verbose_name='color', null=True, blank = True)
    inventory = models.IntegerField(default=0, verbose_name='spec_prod_inventory', null=True, blank = True)


    class Meta:
        db_table = 'df_specification_option'
        verbose_name = 'specification_option'
        verbose_name_plural = verbose_name

class BrowseHistory(BaseModel):
    prod = models.ForeignKey(Product, related_name='product', on_delete=models.CASCADE, verbose_name='hist_prod',
                             null=True, blank=True)
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE, verbose_name='hist_user',
                             null=True, blank=True)
    name = models.CharField(max_length=100, verbose_name='his_product_name', null=True, blank=True)
    price = models.DecimalField(max_digits=10,decimal_places=2,verbose_name='his_product_price', null=True, blank = True)
    image = models.TextField(verbose_name='his_default_image', null=True, blank = True)


    class Meta:
        db_table = 'df_browse_history'
        verbose_name = 'browse_history'
        verbose_name_plural = verbose_name