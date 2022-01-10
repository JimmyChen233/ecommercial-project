"""Backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from user.views import RegisterView, LoginView,  UserInfoView, ChangePasswordView, ChangeTheme
from products.views import ProductList,ReadDetails,UpdateDetails,CreateNewProduct, DeleteProduct,HomePageProduct, Browse
from order.views import CartCheckOutView, OrderList, AdminOrderList, OrderUpdate
from products.views import SelectCategory,CreateNewProduct,ReadDetails,UpdateDetails,DeleteProduct,HomePageProduct,ProductList,Search,UserHistory,AdminDetails
from cart.views import CartCreateView,CartReadView,CartDeleteView
from wishlist.views import WishlistCreateView,WishlistReadView,WishlistDeleteView
from chat.views import UserSendMessageView,AdminSendMessageView,UserReceiveMessageView,AdminReceiveMessageView
from reviews.views import ProductReviews, WriteReview
from recommend.views import UserRecommendView, ProductRecommendView
# from products.views import IndexView
urlpatterns = [
    # path('admin/', admin.site.urls),
    path('user/register', RegisterView.as_view(),name='register'),
    path('user/login', LoginView.as_view(),name='login'),
    # path('user/logout', LogoutView.as_view(),name='logout'),
    path('user/', UserInfoView.as_view(), name='index'),
    path('user/account/changepass', ChangePasswordView.as_view(),name='changepassword'),
    path('user/theme', ChangeTheme.as_view(), name='changetheme'),

    path('admin/products/update', UpdateDetails.as_view(), name='update'),
    path('admin/products/create', CreateNewProduct.as_view(), name='create'),
    path('admin/products/delete', DeleteProduct.as_view(), name='delete'),
    path('admin/products/details', AdminDetails.as_view(), name='admindetalils'),
    path('admin/products', ProductList.as_view(), name='product_list'),

    path('products/details', ReadDetails.as_view(), name='details'),
    path('homepage/', HomePageProduct.as_view(), name='homepage product'),

    path('user/order',OrderList.as_view(), name='user list orders'),
    path('admin/order',AdminOrderList.as_view(), name='admin list orders'),
    path('admin/order/update', OrderUpdate.as_view(), name='admin update order'),
    path('category/', SelectCategory.as_view(), name='SelectCategory'),
    path('search/', Search.as_view(), name='Search'),

    path('user/wishlist/create',WishlistCreateView.as_view(),name='Wishlist Create View'),
    path('user/wishlist',WishlistReadView.as_view(),name='Wishlist Read View'),
    path('user/wishlist/delete',WishlistDeleteView.as_view(),name='Wishlist Delete View'),

    path('user/cart/create',CartCreateView.as_view(),name='Cartlist Create View'),
    path('user/cart',CartReadView.as_view(),name='Cartlist Read View'),
    path('user/cart/delete',CartDeleteView.as_view(),name='Cartlist Delete View'),
    path('user/cart/checkout',CartCheckOutView.as_view(), name='add order'),

    path('user/message/send',UserSendMessageView.as_view(), name='user send message view'),
    path('admin/message/send',AdminSendMessageView.as_view(), name='admin send message view'),
    path('user/message/receive',UserReceiveMessageView.as_view(), name='user receive message view'),
    path('admin/message/receive',AdminReceiveMessageView.as_view(), name='admin receive message view'),

    path('user/order/review',WriteReview.as_view(), name='write review'),
    path('products/review', ProductReviews.as_view(),name='view all reviews of a product'),

    path('browse',Browse.as_view(), name='browse product'),

    path('user/history',UserHistory.as_view(), name='show user history'),

    path('product/recommend',ProductRecommendView.as_view(), name='product recommend'),
    path('user/recommend',UserRecommendView.as_view(), name='user recommend'),
]

