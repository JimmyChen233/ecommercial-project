from django.db.models.query import QuerySet
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from user.models import User, UserBehavour
from products.models import ProductCategory, Product
import numpy as np
import math
from apps.jwt_token import parse_jwt
import pandas as pd 
from django.forms.models import model_to_dict
import random
import traceback
# Create your views here.


# GET user/recommend
class UserRecommendView(View):
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        else:
            user_id=info['user_id']
            user_buy_count=UserBehavour.objects.filter(userID=user_id,behaviour=5).count()
            if(user_buy_count<3):
                products=Product.objects.filter(is_delete=0).order_by('sales')[0:4]
                retval=list(products.values())
                return JsonResponse({'code':0,'messages':retval})
            else:

                try:
                    user_behaviours=UserBehavour.objects.filter(behaviour=5,).values_list('userID','star','category3')
                    data_all = pd.DataFrame(list(user_behaviours), columns=['user_id','rating','category'])

                    data_buy=data_all.groupby('category').count()['user_id']
                    data_buy=data_buy.sort_values(ascending=False)
                    data_buy=pd.DataFrame(data_buy)
                    data_buy.columns=['count']
                    data_buy.reset_index(inplace=True)
                    data1=data_buy
                    del data1['count']
                    data=data_all.merge(data1,on='category',how='inner')

                    data_user=data.groupby('user_id').count()['category']
                    data_user=data_user.sort_values(ascending=False)
                    data_user=pd.DataFrame(data_user)
                    data_user.columns=['count']
                    data_user.reset_index(inplace=True)
                    data2=data_user[data_user['count']>=3]
                    data_new=data.merge(data2,on='user_id',how='inner')
                    del data_new['count']

                    df1 = data_new.copy()

                    df1['mean_rating'] = df1.groupby(['user_id','category'])['rating'].transform('mean')

                    df1 = df1.drop_duplicates()

                    del df1['rating']
                    df1 = df1.rename({'mean_rating':'rating'},axis=1)

                    df1 = df1[['user_id','rating','category']]
                    df1 = df1.drop_duplicates()

                    df1['rating'] = df1.groupby('user_id')['rating'].transform(lambda x: 0 if np.std(x)==0 else (x-np.mean(x))/(np.std(x)))


                    train = dict()  
                    for _ ,user, score, category in df1.itertuples():
                        train.setdefault(user, {})
                        train[user][category] = int(float(score))
                    C = dict()  
                    N = dict()  
                    for user, items in train.items():
                        for i in items.keys():
                            N.setdefault(i, 0)
                            N[i] += 1
                            C.setdefault(i, {})
                            for j in items.keys():
                                C[i].setdefault(j, 0)
                                C[i][j] += 1

                    W = dict()
                    for i, related_items in C.items():
                        W.setdefault(i, {})
                        for j, cij in related_items.items():
                            W[i][j] = cij / (math.sqrt(N[i] * N[j]))

                    rank = dict()
                    action_item = train[user_id]  
                    for item, score in action_item.items():
                        for j, wj in sorted(W[item].items(), key=lambda x: x[1], reverse=True)[0:3]:
                            rank.setdefault(j, 0)
                            rank[j] += score * wj
                            
                    final = dict(sorted(rank.items(), key=lambda x: x[1], reverse=True)[0:4])

                    retval=[]
                    for cate in final.keys():
                        product=Product.objects.filter(is_delete=0,category3=cate).order_by('sales').first()
                        retval.append(model_to_dict(product))

                    return JsonResponse({'code':0,'messages':retval})
                except Exception as err:
                    traceback.print_exc()
                    return JsonResponse({'err':str(err)})

#product/recommend
class ProductRecommendView(View):
    def get(self, request):
        pid = int(request.GET.get('pid'))
        prod=Product.objects.filter(id=pid).first()
        products=Product.objects.filter(category3=prod.category3).exclude(id=pid).order_by('sales')[0:4]
        retval=list(products.values())
        return JsonResponse({'code':0,'messages':retval})