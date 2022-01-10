from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from db.base_model import BaseModel
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class User(AbstractUser, BaseModel):
    first_name=models.CharField(max_length=50)
    last_name=models.CharField(max_length=50)
    boolChoice = (
        ("M","Male"),("F","Female")
        )
    gender=models.CharField(max_length=1, null=True, choices=boolChoice)
    birthday=models.DateField(null=True,verbose_name='date of birth')
    age = models.IntegerField(null=True,
        validators=[MaxValueValidator(150), MinValueValidator(0)])
    theme=models.CharField(max_length=50,default='default')
    class Meta:
        db_table = 'df_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class AddressManager(models.Manager):
    def get_default_address(self, user):
        try:
            address = self.get(user=user, is_default=True)  # models.Manager
        except self.model.DoesNotExist:
            address = None

        return address

class Address(BaseModel):
    # '''address'''
    # countryChoice = (
    #     ("Australia","Australia"),
    #     # ("United States","United States"),
    # )
    # stateChoice = (
    #     ("NSW", "New South Wales"),
    #     ("QLD", "Queensland"),
    #     ("SA", "South Australia"),
    #     ("TAS", "Tasmania"),
    #     ("VIC", "Victoria"),
    #     ("WA", "Western Australia"),
    #     ("ACT", "Australian Capital Territory"),
    #     ("JBT", "Jervis Bay Territory"),
    #     ("NT", "Northern Territory")
    # )
    user = models.ForeignKey('User',on_delete=models.CASCADE, verbose_name='Owned account')
    receiver = models.CharField(max_length=50, verbose_name='recipient')
    street_addr = models.CharField(max_length=256, null=True, verbose_name='Street Address')
    city = models.CharField(max_length=50, null=True, verbose_name='City')
    state = models.CharField(max_length=50, null=True, verbose_name='State/Province')
    p_code = models.CharField(max_length=6, null=True, verbose_name='post code')
    country = models.CharField(max_length=50,null=True,verbose_name='Country')
    phone = models.CharField(max_length=11,verbose_name='contact number')
    is_default = models.BooleanField(default=False, verbose_name='is default address or not')

    objects = AddressManager()
    class Meta:
        db_table = 'df_address'
        verbose_name = 'address'
        verbose_name_plural = verbose_name

class UserBehavour(BaseModel):
    behaviours = (
        (1, 'view product page'),
        (2, 'add to wishlist'),
        (3, 'add to cart'),
        (4, 'place an order'),
        (5, 'review rating'),
        (0, 'default'),
    )
    star_choice = (
        ("1", "One"),
        ("2", "Two"),
        ("3", "Three"),
        ("4", "Four"),
        ("5", "Five"),
    )
    userID = models.BigIntegerField(null=True, verbose_name='user-id')
    productID = models.BigIntegerField(null=True, verbose_name='product-id')
    category1= models.BigIntegerField(null=True, verbose_name='category1-id')
    category2= models.BigIntegerField(null=True, verbose_name='category2-id')
    category3= models.BigIntegerField(null=True, verbose_name='category3-id')
    brand = models.CharField(max_length=50, verbose_name='brand', null=True, blank = True)
    behaviour = models.SmallIntegerField(default=0, choices=behaviours, verbose_name='user-behaviour', null=True, blank = True)
    star = models.CharField(max_length=5, null=True, verbose_name="Satisfaction Degree", 
    choices=star_choice)
    class Meta:
        db_table = 'df_user-behaviour'
        verbose_name = 'user-behaviour'
        verbose_name_plural = verbose_name