import json
from django.core.paginator import Paginator
from django.shortcuts import redirect
from django.views.generic import View

from products.models import ProductCategory, Product, SpecificationOption, BrowseHistory
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Sum,Q

from apps.jwt_token import parse_jwt
from django.utils import timezone
from datetime import datetime
from urllib.parse import unquote
from reviews.models import Review
from user.models import UserBehavour
from copy import deepcopy
import time


def whetherAdmin(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    info = parse_jwt(token)
    return info['role']

def cate_select(cate):

    cid = ProductCategory.objects.get(name=cate[0]).id
    if len(cate)>0:
        for i in cate[1:]:
            cid = ProductCategory.objects.get(**dict(name=i,parent_id=cid)).id

    category = 'category' + str(len(cate)) + '_id'

    return {category: cid}

def crea_upda_cate(cate):

    cate_list = cate.split('+')
    cid = ProductCategory.objects.filter(name=cate_list[0])
    cate_id = [cid[0].id]
    for i in cate_list[1:]:
        cid = ProductCategory.objects.filter(**{'name':i,'parent_id':cate_id[-1]})
        cate_id.append(cid[0].id)

    return cate_id




class CreateNewProduct(View):
    def post(self, request):
        role = whetherAdmin(request)
        if not role:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        brand = request.POST.get('brand')
        cate = request.POST.get('cate')
        cate = crea_upda_cate(cate)
        name = request.POST.get('name')
        price = request.POST.get('price')
        description = request.POST.get('description')
        default_img = request.POST.get('default_img')
        desc_img = request.POST.get('desc_img')
        tag = request.POST.get('tag')
        cs_inventory = request.POST.get('color_size_inventory')

        if not all([brand, cate,name, price,
                    description, default_img,
                    tag, cs_inventory]):
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        cs_inventory = json.loads(cs_inventory)

        new_item = Product.objects.create(
            brand=brand,
            name=name,
            price=price,
            desc=description,
            image=default_img,
            category1_id=cate[0],
            category2_id=cate[1],
            category3_id=cate[2],
            desc_image=desc_img,
            tag=tag
        )

        new_id = new_item.id
        count = 0
        for i in cs_inventory:
            color_inventory = cs_inventory[i]
            for j in color_inventory:
                SpecificationOption.objects.create(
                    prod_id=new_id,
                    color=i,
                    size=j,
                    inventory=int(color_inventory[j])
                )

                count += int(color_inventory[j])

        Product.objects.filter(id=new_id).update(inventory=count)

        dic = {'code': 0, 'message': '“success”'}
        return JsonResponse(dic)


class UpdateDetails(View):
    def post(self, request):
        role = whetherAdmin(request)
        if not role:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)
        req_dict = request.POST
        temp = {}
        pid = request.POST.get('pid')
        if not Product.objects.filter(id=pid):
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)
        for i in req_dict:

            if i == 'pid':
                continue
            elif i == 'cate':
                cate = request.POST.get('cate')
                if cate:
                    cate = crea_upda_cate(cate)
                    temp['category1_id'] = cate[0]
                    temp['category2_id'] = cate[1]
                    temp['category3_id'] = cate[2]
            elif i == 'is_delete':
                temp['is_delete'] = int(request.POST.get('is_delete'))
            elif i == 'color_size_inventory':
                cs_inventory = json.loads(request.POST.get('color_size_inventory'))
                for cs in cs_inventory:
                    color_inventory = cs_inventory[cs]
                    for j in color_inventory:
                        temp1 = {}
                        temp1['prod'] = pid
                        temp1['color'] = cs
                        temp1['size'] = j
                        SpecificationOption.objects.filter(**temp1).update(
                            inventory=int(color_inventory[j])
                        )
            elif i == 'new_color_size_inventory':
                new_cs_inventory = json.loads(request.POST.get('new_color_size_inventory'))
                for ncs in new_cs_inventory:
                    new_color_inventory = new_cs_inventory[ncs]
                    for j in new_color_inventory:
                        SpecificationOption.objects.create(
                            prod_id=pid,
                            color=ncs,
                            size=j,
                            inventory=int(new_color_inventory[j])
                        )
            else:
                if request.POST.get(i):
                    temp[i] = request.POST.get(i)
        temp['update_time'] = timezone.now()
        Product.objects.filter(id=pid).update(**temp)

        total_invent = SpecificationOption.objects.filter(prod=pid).aggregate(Sum("inventory"))

        Product.objects.filter(id=pid).update(inventory=total_invent['inventory__sum'])

        dic = {'code': 0, 'message': '“success”'}
        return JsonResponse(dic)


class DeleteProduct(View):
    def post(self, request):
        role = whetherAdmin(request)
        if not role:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        pid = request.POST.get('pid')
        if not pid:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)
        elif not Product.objects.filter(id=pid):
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        Product.objects.filter(id=pid).update(is_delete=1)
     

        dic = {'code': 0, 'message': 'success'}
        return JsonResponse(dic)


class ReadDetails(View):
    def get(self, request):
        
        token = request.META.get('HTTP_AUTHORIZATION')
        pid = request.GET.get('pid')

        if token:
            info = parse_jwt(token)
            role = info['role']
            if role == 0:
                user_id = info['user_id']
                prod_data = Product.objects.get(id=pid)
                UserBehavour.objects.create(
                    userID=user_id,
                    productID=pid,
                    category1=prod_data.category1_id,
                    category2=prod_data.category2_id,
                    category3=prod_data.category2_id,
                    brand=prod_data.brand,
                    behaviour=1
                )
                hist_temp = {}
                hist_temp['user_id'] = user_id
                hist_temp['prod_id'] = pid
                his_exist = BrowseHistory.objects.filter(**hist_temp)
                if his_exist:
                    his_exist.update(create_time=timezone.now())
                else:
                    BrowseHistory.objects.create(**hist_temp)
               

        
        detail_dict = {}
        detail_dict['id'] = pid
        detail_dict['is_delete'] = 0

        details = Product.objects.filter(**detail_dict)

       
        if not details:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        details = json.loads(serializers.serialize('json', details))

        spec_color = SpecificationOption.objects.filter(prod=pid).values('color').distinct()
        color_dic = {}
        for i in spec_color:
            temp = SpecificationOption.objects.filter(**{'prod': pid, 'color': i['color']}).values('size',
                                                                                                      'inventory')
            temp_dic = {}
            for j in temp:
                temp_dic[j['size']] = j['inventory']
            color_dic[i['color']] = temp_dic

        details[0]['fields']['color_inventory'] = color_dic
        reviews = Review.objects.filter(product_id=pid)
        num_reviews = len(reviews)
        totalstar = 0
        if num_reviews:
            for r in reviews:
                totalstar+=int(r.star)
            avg_star=totalstar/num_reviews
        else:
            avg_star = 'no reviews'
        dic = {'code': 0, 'message': 'success', 'product_info': details,
        'num_reviews':num_reviews, 'avg_star':avg_star}

        return JsonResponse(dic)

class HomePageProduct(View):
    def get(self,request):

        prod_list = Product.objects.filter(is_delete=0).defer('create_time','update_time','desc_image','desc','tag').order_by('?')[:30]
        product_list = []
        for prod in prod_list:
            product = dict( pk=prod.id, name=prod.name,price=prod.price,
                            image=prod.image)
            product_list.append(product)
        dic = {'code': 0, 'message': 'success', 'product_info': product_list}
        return JsonResponse(dic)



class ProductList(View):
    def get(self, request):
        role = whetherAdmin(request)
        if not role:
            dic = {'code': 1, 'message': 'failure'}
            return JsonResponse(dic)

        prod_list = Product.objects.all().order_by('-create_time')

        page = request.GET.get('page')
        if page:

            pageSize = 12
            pgtr = Paginator(prod_list, pageSize)

            list_ppage = pgtr.get_page(page)
            prod_list = list_ppage
            total_page = pgtr.num_pages
        else:
            total_page = 1
        p_list = []

        for prod in prod_list:
            prod_info = dict(pk=prod.id, name=prod.name, price=prod.price, inventory=prod.inventory,
                             is_delete=prod.is_delete, sales=prod.sales, image=prod.image)
            
            p_list.append(prod_info)

        dic = {'code': 0, 'message': 'success', 'total_page': total_page, 'product_info': p_list}
        return JsonResponse(dic)


class SelectCategory(View):

    def get(self, request):
        cate = request.GET.get('cate')
        if cate:
            cate_list = cate.split('+')
            cate_filter = cate_select(cate_list)
            cate_filter['is_delete'] = 0
            prod_list = Product.objects.filter(**cate_filter)
            page = request.GET.get('page')
            if page:

                pageSize = 12
                pgtr = Paginator(prod_list, pageSize)

                list_ppage = pgtr.get_page(page)
                prod_list = list_ppage
                total_page = pgtr.num_pages
            else:
                total_page = 1
            prod_list = json.loads(serializers.serialize('json', prod_list))
            dic = {'code': 0, 'message': 'success', 'total_page': total_page,'product_info': prod_list}

        else:
            dic = {'code': 1, 'message': 'failure'}

        return JsonResponse(dic)


class Search(View):
    def get(self, request):
        start_time = time.time()
        try:

            prod_list = Product.objects.filter(is_delete=0).defer('create_time','update_time','desc_image','desc','tag')

            cate = request.GET.get('cate')
            keywords = request.GET.get('keywords')
            brand = request.GET.get('brand')
            sort = request.GET.get('sort')

            if cate:

                cate_list = cate.split('+')
                cate_filter = cate_select(cate_list)
                prod_list = prod_list.filter(**cate_filter)


            if brand:
 
                brand_list = brand.split('+')
                brand_filter = Q(brand__icontains=brand_list[0])
                if len(brand_list) >1:
                    for i in brand_list[1:]:
                        brand_filter |= Q(brand__icontains=i)

                prod_list = prod_list.filter(brand_filter)


            if keywords:

                keywords_list = keywords.split('+')
                keywords_filter = (Q(name__icontains=keywords_list[0])|Q(tag__icontains=keywords_list[0])|
                                   Q(brand__icontains=keywords_list[0]))

                if len(keywords_list) >1:
                    for i in keywords_list[1:]:
                        keywords_filter &= (Q(name__icontains=i)|Q(tag__icontains=i)|Q(brand__icontains=i))


                prod_list = prod_list.filter(keywords_filter)
 
            if not prod_list.exists():
                dic = {'code': 1, 'message': 'failure', 'product_info': 'No such product'}
                return JsonResponse(dic)

            sort_method = '-sales'
 
            if sort:
                sort_list = sort.split('+')
                sort_method = sort_list[0]
                if sort_method=='time':
                    sort_method = 'update_time'
                if sort_method == 'price':
                    sort_method = 'price'

                if sort_list[1] == 'desc':
                    sort_method = '-' + sort_method

            prod_list = prod_list.order_by(sort_method,'id')


            page = request.GET.get('page')
            if page:

                pageSize = 12
                pgtr = Paginator(prod_list, pageSize)

                list_ppage = pgtr.page(page)
                prod_list = list_ppage
                total_page = pgtr.num_pages
            else:
                total_page = 1

            prodinfo = []
            for prod in prod_list:
                info=dict(pk=prod.id,name=prod.name,price=prod.price,image=prod.image)
                prodinfo.append(info)
            dic = {'code': 0, 'message': 'success', 'total_page': total_page,'product_info': prodinfo}
            print(8)
            print("--- %s seconds ---" % (time.time() - start_time))
            return JsonResponse(dic)
        except Exception as err:
            return JsonResponse({'err':str(err)})


class UserHistory(View):

    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token:
            info = parse_jwt(token)
            user_id = info['user_id']
            page = request.GET.get('page')
            user_hist = BrowseHistory.objects.filter(user_id=user_id).order_by('-create_time')
            if not user_hist:
                dic = {'code': 1, 'message': 'No records of this user'}
                return JsonResponse(dic)
            if page:

                pageSize = 12
                pgtr = Paginator(user_hist, pageSize)

                list_ppage = pgtr.page(page)
                user_hist = list_ppage
                total_page = pgtr.num_pages
            else:
                total_page = 1
            user_hist = json.loads(serializers.serialize('json', user_hist))
            hist_list = []
            for history in user_hist:
                product_id = history['fields']['prod']
                pd = Product.objects.get(id=product_id)
                hist_dict = dict(pk=history['pk'], browse_time=history['fields']['create_time'],
                                 prod_id=product_id, user_id=user_id, name=pd.name, price=pd.price,image=pd.image)
                hist_list.append(hist_dict)
            dic = {'code': 0, 'message': 'success', 'total_page': total_page, 'brow_hist_info': hist_list}
            return JsonResponse(dic)
        else:
            dic = {'code': 1, 'message': 'No a registered user'}
            return JsonResponse(dic)

class Browse(View):
    def get(self, request):
        items = Product.objects.filter(is_delete=0).order_by('?')[:10]
        itemlist=[]
        for item in items:
            info=dict(prodID = item.id, image = item.image)
            itemlist.append(info)
        dic = {'code': 200, 'message': 'success','itemlist':itemlist}
        return JsonResponse(dic)


class AdminDetails(View):
    def get(self, request):
        role = whetherAdmin(request)
        if not role:
            dic = {'code': 1, 'message': 'you are not admin'}
            return JsonResponse(dic)

        pid = request.GET.get('pid')
        details = Product.objects.filter(id=pid)
        details = json.loads(serializers.serialize('json', details))

        spec_color = SpecificationOption.objects.filter(prod=pid).values('color').distinct()
        color_dic = {}
        for i in spec_color:
            temp = SpecificationOption.objects.filter(**{'prod': pid, 'color': i['color']}).values('size',
                                                                                                      'inventory')
            temp_dic = {}
            for j in temp:
                temp_dic[j['size']] = j['inventory']
            color_dic[i['color']] = temp_dic

        details[0]['fields']['color_inventory'] = color_dic
        reviews = Review.objects.filter(product_id=pid)
        num_reviews = len(reviews)
        totalstar = 0
        if num_reviews:
            for r in reviews:
                totalstar+=int(r.star)
            avg_star=totalstar/num_reviews
        else:
            avg_star = 'no reviews'
        dic = {'code': 0, 'message': 'success', 'product_info': details,
        'num_reviews':num_reviews, 'avg_star':avg_star}

        return JsonResponse(dic)