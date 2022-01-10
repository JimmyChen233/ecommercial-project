# Create your views here.
from django.views.generic import View
from apps.jwt_token import parse_jwt
from user.models import User, UserBehavour
from order.models import OrderInfo, OrderProducts
from user.models import Address
from products.models import Product, SpecificationOption
from django.http import JsonResponse
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from cart.models import Cart
import json
from django.db import transaction



#user/cart/checkout
class CartCheckOutView(View):
    @transaction.atomic
    def post(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)
        if(user_info):
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        
        address = request.POST.get('Address')
        address = json.loads(address)
        addrs = Address.objects.create(
            receiver = address['receiver'],
            phone = address['phone'],
            p_code = address['post_code'],
            user_id = user.id,
            is_default = 0,
            country = address['country'],
            city = address['city'],
            state = address['state'],
            street_addr = address['street']
            )


        paymethod = int(request.POST.get('pay_method'))
        carts = Cart.objects.filter(user=user)
    
        order_id = datetime.now().strftime('%Y%m%d%H%M%S')+str(user.id)
        order = OrderInfo.objects.create(
            order_id=order_id,
            user = user,
            addr = addrs,
            pay_method = paymethod,
            order_status = 1,
        )


        subs=[]
        total_price = 0
        for cart in carts:
            spec=cart.spec
            prod=spec.prod
            if cart.quantity>spec.inventory:
                return JsonResponse({'code':1,'message':'wrong quantity'})

            subs.append((spec,prod))
            spec.inventory-=cart.quantity
            prod.inventory-=cart.quantity
            prod.sales+=cart.quantity

            ub = UserBehavour.objects.create(
                userID = user_id,
                productID = prod.id,
                category1 = prod.category1_id,
                category2 = prod.category2_id,
                category3 = prod.category3_id,
                brand = prod.brand,
                behaviour = 4,
                star = 0
            )
            ub.save()



            op = OrderProducts.objects.create(
                order = order,
                product = prod,
                brand = prod.brand,
                quantity = cart.quantity,
                price = prod.price,
                desc = prod.desc,
                image = prod.image,
                desc_image = prod.desc_image,
                tag = prod.tag,
                color=spec.color,
                size=spec.size
            )
            total_price+=op.quantity*op.price
        order.total_price = total_price
        order.save()
        carts.delete()
        for sub in subs:
            sub[0].save()
            sub[1].save()



        dic = {'code': 0, 'message': '“success”'}
        return JsonResponse(dic)

        
class  OrderList(View):
    """默认每页25个订单"""
    def get(self, request):     
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)      
        user = None
        if(user_info):
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        page = request.GET.get('page')
        oid = request.GET.get('oid')
        if page is not None:
            return self.viewAll(page,user_id)
        elif oid is not None:
            return self.viewOne(oid)
        else:
            dic = {'code': 200, 'message': '“missing args”'}
            return JsonResponse(dic)
    
    # /user/order?page=
    def viewAll(self,page,user_id):
        orders = OrderInfo.objects.filter(user_id=user_id).order_by('-order_id')  
        paginator = Paginator(orders, 25)
        orders=paginator.get_page(page)
        order_list = []
        for order in orders:
            order_info = dict(oid=order.order_id, orderDate=order.create_time, uid=order.user_id, 
            totalprice=order.total_price, status=order.order_status)
            order_list.append(order_info)
        dic = {'code':200, 'message':'success','page_count': paginator.num_pages, 
        'order_list': order_list}
        return JsonResponse(dic)

    # /user/order?oid=
    def viewOne(self,oid):
        order = OrderInfo.objects.get(order_id=oid)
        op_list = []
        ops = OrderProducts.objects.filter(order_id = oid)
        addr = Address.objects.get(id=order.addr_id)
        for op in ops:
            p=Product.objects.get(id=op.product_id)
            op_info = dict(productID=p.id, name=p.name, price=op.price, mainPhoto=op.image,size=op.size,color=op.color,quantity=op.quantity)
            op_list.append(op_info)
        
        address=dict(id=addr.id,receiver=addr.receiver,post_code=addr.p_code, phone=addr.phone, city=addr.city, country=addr.country, state=addr.state, street=addr.street_addr)
        dic = {'code':200, 'message':'success', 'oid':oid,'orderDate':order.create_time, 
        'uid':order.user_id, 'totalPrice':order.total_price, 'products':op_list, 
        'address':address, 'status':order.order_status}
        return JsonResponse(dic)

# /admin/order?page=
class AdminOrderList(View):
    def get(self, request):     
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)      
        user = None
        if(user_info):
            if user_info['role']!=1:
                dic = {'code':1, 'message':'permission denied.'}
                return JsonResponse(dic)
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        page = request.GET.get('page')
        oid = request.GET.get('oid')
        if page is not None:
            return self.viewAll(page)
        elif oid is not None:
            return self.viewOne(oid)
        else:
            dic = {'code': 200, 'message': '“missing args”'}
            return JsonResponse(dic)

     # /admin/order?page=
    def viewAll(self,page):
        orders = OrderInfo.objects.all().order_by('-order_id')  
        paginator = Paginator(orders, 25)
        orders=paginator.get_page(page)
        order_list = []
        for order in orders:
            user = User.objects.get(id=order.user_id)
            # customer_Info = dict()
            order_info = dict(oid=order.order_id, orderDate=order.create_time, uid=order.user_id, 
            totalprice=order.total_price, status=order.order_status,username=user.username,userID=user.id)
            order_list.append(order_info)
        dic = {'code':200, 'message':'success','page_count': paginator.num_pages, 
        'order_list': order_list}
        return JsonResponse(dic)

    # /admin/order?oid=
    def viewOne(self,oid):
        order = OrderInfo.objects.get(order_id=oid)
        op_list = []
        ops = OrderProducts.objects.filter(order_id = oid)
        addr = Address.objects.get(id=order.addr_id)
        user = User.objects.get(id=order.user_id)
        for op in ops:
            p=Product.objects.get(id=op.product_id)
            op_info = dict(productID=p.id, name=p.name, price=op.price, mainPhoto=op.image,size=op.size,color=op.color,quantity=op.quantity)
            op_list.append(op_info)
        address=dict(id=addr.id,receiver=addr.receiver,post_code=addr.p_code, phone=addr.phone, city=addr.city, country=addr.country, state=addr.state, street=addr.street_addr)
        dic = {'code':200, 'message':'success', 'oid':oid, 'orderDate':order.create_time, 
        'uid':user.id, 'username':user.username, 'totalPrice':order.total_price, 
        'products':op_list, 'address':address, 'status':order.order_status}
        return JsonResponse(dic)
    

# /admin/order/update
class OrderUpdate(View):
    def post(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)      
        user = None
        if(user_info):
            if user_info['role']!=1:
                dic = {'code':1, 'message':'permission denied.'}
                return JsonResponse(dic)
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        oid = request.POST.get('oid')
        status = int(request.POST.get('status'))
        order = OrderInfo.objects.get(order_id=oid)
        order.order_status = status
        order.save()
        dic = {'code':200, 'message':'success'}
        return JsonResponse(dic)