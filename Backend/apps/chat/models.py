from django.db import models
from db.base_model import BaseModel
# Create your models here.

class Message(BaseModel):
    m_id = models.AutoField(primary_key=True, verbose_name='cart id')
    is_from_user = models.SmallIntegerField(default=1, verbose_name='from_user', null=True,blank = True)
    is_read = models.SmallIntegerField(default=0, verbose_name='is_read', null=True,blank = True)
    user = models.ForeignKey('user.User', verbose_name='user',on_delete=models.CASCADE)
    text = models.TextField(verbose_name='text', null=True, blank = True)
    img = models.TextField(verbose_name='img', null=True, blank = True)
    class Meta:
        db_table = 'df_message'
        verbose_name = 'message'
        verbose_name_plural = verbose_name