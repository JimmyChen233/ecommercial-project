from django.db import models
from db.base_model import BaseModel
# Create your models here.

class OrderInfo(BaseModel):
    ORDER_STATUS_CHOICES = (
        (1, 'Order Placed'),
        (2, 'Preparing to Ship'),
        (3, 'Shipped'),
        (4, 'Delivered'),
        (5, 'Complete')
    )
    PAY_METHOD_CHOICES = (
        (1, "Cash on delivery"),
        (2, "We Chat"),
        (3, "Alipay"),
        (4, 'Visa Card')
    )
    order_id = models.BigIntegerField(primary_key=True, verbose_name='order id')
    user = models.ForeignKey('user.User', verbose_name='user',on_delete=models.CASCADE)
    addr = models.ForeignKey('user.Address', verbose_name='address',on_delete=models.CASCADE)
    pay_method = models.SmallIntegerField(choices=PAY_METHOD_CHOICES, default=1, verbose_name='pya method')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, verbose_name='total price')
    order_status = models.SmallIntegerField(choices=ORDER_STATUS_CHOICES, default=1, verbose_name='order status')

    class Meta:
        db_table = 'df_order_info'
        verbose_name = 'order'
        verbose_name_plural = verbose_name

class OrderProducts(BaseModel):
    
    
    order = models.ForeignKey('OrderInfo', verbose_name='order',on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', verbose_name='product',on_delete=models.CASCADE)
    brand = models.CharField(max_length=50, verbose_name='brand', null=True, blank = True)
    quantity = models.IntegerField(default=1, verbose_name='product quantity')
    name = models.CharField(max_length=100,verbose_name='product_name', null=True, blank = True)
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='product price')
    desc = models.CharField(max_length=1024, verbose_name='product_description', null=True, blank = True)
    image = models.TextField(verbose_name='default_image', null=True, blank = True)
    desc_image= models.TextField(null=True,verbose_name='desc_image', blank = True)
    tag = models.TextField(null=True, verbose_name='tag', blank = True)
    size = models.CharField(default='M',max_length=50, verbose_name='size')
    color = models.CharField(default='white',max_length=50, verbose_name='color')

    #comment = models.CharField(max_length=256, default='', verbose_name='comments')

    class Meta:
        db_table = 'df_order_products'
        verbose_name = 'order products'
        verbose_name_plural = verbose_name