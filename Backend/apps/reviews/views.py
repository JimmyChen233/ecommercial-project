from typing import Text
from django.views.generic import View
from apps.jwt_token import parse_jwt
from order.models import OrderInfo
from user.models import User, UserBehavour
from reviews.models import Review
from products.models import Product
from django.http import JsonResponse
from django.db.models import Q
# Create your views here.



# user/order/review
class WriteReview(View):
    def get(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)
        if(user_info):
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        orderID = int(request.GET.get('orderID'))
        productID = int(request.GET.get('productID'))
        if not all([orderID, productID]):
                # data incomplete
                dic = {'code': 1,'message': 'data incomplete'}
                return JsonResponse(dic)
        order = OrderInfo.objects.get(order_id=orderID)
        product = Product.objects.get(id=productID)
        if not all([order, product]):
                # data incomplete
                dic = {'code': 1,'message': 'wrong data'}
                return JsonResponse(dic)

        review = Review.objects.filter(Q(order=order) & Q(user=user) & Q(product=product)).first()
        if not review:  
            dic = {'code': 200, 'message': '“success”', 'text':None, 'image':None, 'star':None}
            return JsonResponse(dic)
        dic = {'code': 200, 'message': '“success”', 'text':review.text, 'image':review.image, 'star':review.star}
        return JsonResponse(dic)

    def post(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)
        if(user_info):
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        orderID = int(request.POST.get('orderID'))
        productID = int(request.POST.get('productID'))
        if not all([orderID, productID]):
                # data incomplete
                dic = {'code': 1,'message': 'data incomplete','productID':productID,'orderID':orderID}
                return JsonResponse(dic)
        order = OrderInfo.objects.get(order_id=orderID)
        product = Product.objects.get(id=productID)
        if not all([order, product]):
                # data incomplete
                dic = {'code': 1,'message': 'wrong data'}
                return JsonResponse(dic)

        review = Review.objects.filter(Q(order=order) & Q(user=user) & Q(product=product)).first()
        if not review:  
            review = Review.objects.create(
                order=order,
                user=user, 
                product=product,
            )
        text = request.POST.get('text')
        image = request.POST.get('image')
        star = request.POST.get('star')
        review.text=text
        review.image= image
        review.star = star
        review.save()

        ub = UserBehavour.objects.create(
            userID = user_id,
            productID = product.id,
            category1 = product.category1_id,
            category2 = product.category2_id,
            category3 = product.category3_id,
            brand = product.brand,
            behaviour = 5,
            star = int(star)
        )
        ub.save()

        dic = {'code': 200, 'message': '“success”', 'text':text, 'image':image,'star':star,'productID':productID,'orderID':orderID}
        return JsonResponse(dic)


#GET products/review
class ProductReviews(View):
    def get(self, request):
        productID = int(request.GET.get('productID'))
        p=Product.objects.get(id=productID)
        p_reviews = Review.objects.filter(product=p).order_by('-update_time')
        reviewlist = []
        for r in p_reviews:  
            user = r.user
            review_info = dict(reviewID=r.id, username=user.username, userID=user.id,
            reviewtime=r.update_time, image=r.image, text=r.text, star=r.star)
            reviewlist.append(review_info)
        dic = {'code': 200, 'message': '“success”','reviewlist':reviewlist}
        return JsonResponse(dic)
