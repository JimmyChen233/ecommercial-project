from django.db import models
from db.base_model import BaseModel
# Create your models here.

class Cart(BaseModel):
    cart_id = models.AutoField(primary_key=True, verbose_name='cart id')
    user = models.ForeignKey('user.User', verbose_name='user',on_delete=models.CASCADE)
    spec = models.ForeignKey('products.SpecificationOption', verbose_name='spec_id',on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1, verbose_name='product quantity')


    class Meta:
        db_table = 'df_cart'
        verbose_name = 'cart'
        verbose_name_plural = verbose_name