from django.db import models
from db.base_model import BaseModel
# Create your models here.

class Wishlist(BaseModel):
    wishlist_id = models.AutoField(primary_key=True, verbose_name='wishlist id')
    user = models.ForeignKey('user.User', verbose_name='user',on_delete=models.CASCADE)
    spec=models.ForeignKey('products.SpecificationOption', verbose_name='spec id',on_delete=models.CASCADE)

    class Meta:
        db_table = 'df_wishlist'
        verbose_name = 'wishlist'
        verbose_name_plural = verbose_name
