from django.views.generic import View
from products.models import Product, SpecificationOption
from user.models import User, UserBehavour
from django.http import JsonResponse
from cart.models import Cart
from wishlist.models import Wishlist
from jwt_token import parse_jwt
# Create your views here.
#user/cart/create
class CartCreateView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            user= User.objects.filter(id=user_id).first()
            size=request.POST.get('size')
            color=request.POST.get('color')
            pid=int(request.POST.get('pid'))
            quantity=int(request.POST.get('quantity'))
            prod=Product.objects.filter(id=pid).first()
            spec=SpecificationOption.objects.filter(size=size,color=color,prod=prod).first()

            ub = UserBehavour.objects.create(
            userID = user_id,
            productID = prod.id,
            category1 = prod.category1_id,
            category2 = prod.category2_id,
            category3 = prod.category3_id,
            brand = prod.brand,
            behaviour = 3
            )
            ub.save()

            if(user,spec,quantity is not None):
                new_cart = Cart.objects.create(
                    user=user,
                    quantity=quantity,
                    spec=spec
                )
                return JsonResponse({'code':0,'message':'success'})
            else:
                return JsonResponse({'code':1,'message':'data error'})



#user/cart
class CartReadView(View):
    def get(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            user= User.objects.filter(id=user_id).first()
            if(user is not None):
                carts= Cart.objects.filter(user=user)
                ret={
                    'code':0,
                    'carts':[],
                    'total_price':0
                }
                for cart in carts:
                    spec=cart.spec
                    prod=spec.prod
                    ret['carts'].append({'cart_id':cart.cart_id,'quantity':cart.quantity,'product_id':prod.id,'product_name':prod.name,'price':prod.price,'size':spec.size,'color':spec.color,'image':prod.image})
                    ret['total_price']+=cart.quantity*prod.price

                return JsonResponse(ret)
            else:
                return JsonResponse({'code':1,'message':'data error'})



#user/cart/delete
class CartDeleteView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            cart_id=int(request.POST.get('cart_id'))
            wishlist=request.POST.get('wishlist')
            if(wishlist):
                wishlist=int(wishlist)
            user= User.objects.filter(id=user_id).first()
            cart= Cart.objects.filter(user=user,cart_id=cart_id).first()
            if(cart):
                if(wishlist):
                    new_wishlist = Wishlist.objects.create(
                    user=user,
                    spec=cart.spec
                )
                cart.delete()
                return JsonResponse({'code':0,'message':'success'})
            else:
                return JsonResponse({'code':1,'message':'data error'})