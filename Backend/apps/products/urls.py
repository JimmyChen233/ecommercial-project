from django.conf.urls import url
from products.views import IndexView

urlpatterns = [
    url(r'^index$',IndexView.as_view(), name='index'), # 商品首页
]
