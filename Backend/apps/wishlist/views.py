from django.views.generic import View
from products.models import Product, SpecificationOption
from user.models import User,UserBehavour
from django.http import JsonResponse
from cart.models import Cart
from wishlist.models import Wishlist
from jwt_token import parse_jwt
# Create your views here.
#user/wishlist/create
class WishlistCreateView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if(info.get('user_id') is None):
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            user= User.objects.filter(id=user_id).first()
            size=request.POST.get('size')
            color=request.POST.get('color')
            pid=int(request.POST.get('pid'))
            prod=Product.objects.filter(id=pid).first()
            spec=SpecificationOption.objects.filter(size=size,color=color,prod=prod).first()

            ub = UserBehavour.objects.create(
            userID = user_id,
            productID = prod.id,
            category1 = prod.category1_id,
            category2 = prod.category2_id,
            category3 = prod.category3_id,
            brand = prod.brand,
            behaviour = 2
            )
            ub.save()

            if(user,spec is not None):
                new_wishlist = Wishlist.objects.create(
                    user=user,
                    spec=spec
                )
                return JsonResponse({'code':0,'message':'success'})
            else:
                return JsonResponse({'code':1,'message':'data error'})

#user/wishlist
class WishlistReadView(View):
    def get(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if(info.get('user_id') is None):
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            user= User.objects.filter(id=user_id).first()
            if(user is not None):
                wishlists= Wishlist.objects.filter(user=user)
                ret={
                    'code':0,
                    'wishlists':[],
                }
                for wishlist in wishlists:
                    spec=wishlist.spec
                    prod=spec.prod
                    ret['wishlists'].append({'wishlist_id':wishlist.wishlist_id,'product_id':prod.id,'product_name':prod.name,'price':prod.price,'size':spec.size,'color':spec.color,'image':prod.image})
                return JsonResponse(ret)
            else:
                return JsonResponse({'code':1,'message':'data error'})


#user/wishlist/delete
class WishlistDeleteView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if(info.get('user_id') is None):
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            wishlist_id=int(request.POST.get('wishlist_id'))
            cart=request.POST.get('cart')
            if(cart):
                cart=int(cart)
            user= User.objects.filter(id=user_id).first()
            wishlist= Wishlist.objects.filter(user=user,wishlist_id=wishlist_id).first()
            if(wishlist):
                if(cart):
                    new_cart = Cart.objects.create(
                    quantity=cart,
                    user=user,
                    spec=wishlist.spec
                )
                wishlist.delete()
                return JsonResponse({'code':0,'message':'success'})
            else:
                return JsonResponse({'code':1,'message':'data error'})