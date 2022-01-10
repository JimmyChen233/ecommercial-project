from django.db import models
from db.base_model import BaseModel

# Create your models here.

class Review(BaseModel):

    star_choice = (
        (1, "One"),
        (2, "Two"),
        (3, "Three"),
        (4, "Four"),
        (5, "Five"),
    )

    order = models.ForeignKey('order.OrderInfo', verbose_name='order',on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', verbose_name='product',on_delete=models.CASCADE)
    user = models.ForeignKey('user.User', verbose_name='user',on_delete=models.CASCADE)
    
    text = models.TextField(verbose_name='review_text', null=True, blank = True)
    image = models.TextField(verbose_name='review_image', null=True, blank = True)
    star = models.CharField(max_length=5, null=True, verbose_name="Satisfaction Degree", 
    choices=star_choice)
    class Meta:
        db_table = 'df_reviews'
        verbose_name = 'reviews'
        verbose_name_plural = verbose_name
