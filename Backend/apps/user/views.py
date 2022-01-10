from django.views.generic import View
from user.models import Address, User
from django.http import HttpResponse, JsonResponse
from jwt_token import authorize, parse_jwt
import re
# Create your views here.
def authenticate(email=None,password=None):
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            return user
    except Exception as e:
        return None
# /user/register
class RegisterView(View):
    def get(self, request):
        return HttpResponse('register page')

    def post(self, request):
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            # check data
            if not all([username, password, email]):
                # data incomplete
                dic = {'code': 1,'message': 'data incomplete'}
                return JsonResponse(dic)
                
            # check email form
            if not re.match(r'^[a-z0-9][\w.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$', email):
                dic = {'code': 1,'message': 'invalid email address'}
                return JsonResponse(dic)
                
            # check email duplicate
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = None

            if user:
                dic = {'code': 1,'message': 'email already exists'}
                return JsonResponse(dic)
            # register user
            user = User.objects.create_user(username, email, password)
            user.is_active = 1 # 自动激活，此处可改为邮箱激活等     
            user.is_staff=0
            user.save()
            info = {'role':user.is_staff ,'username': user.username, 'user_id':user.id, 'email': user.email}
            token = authorize(info)
            dic = {'code': 0,'message': 'account has been created successfully','token': token}
            return JsonResponse(dic)
        except Exception as err:
            print(err)


# /user/login
class LoginView(View):
    def get(self, request):
        
        dic = {'code': 0,'message': 'user login page'}
        return JsonResponse(dic)

    def post(self, request):
        
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not all([email, password]):
            dic = {'code': 1,'message': 'data incomplete'}
            return JsonResponse(dic)

        user = authenticate(email=email, password=password)
        #dic = {'code': 400,'message':'hi'}
        #return JsonResponse(dic)
        if user is not None:
            # login as user
            #addr = Address.objects.get(user_id=user.id,is_default=1)
            info = {'role':user.is_staff ,'username': user.username, 'user_id':user.id, 
            'email': user.email, 'theme':user.theme}
            token = authorize(info)
            dic = {'code': 0,'message': 'user login successfully','token':token,'user_info':info}
            return JsonResponse(dic)

        else:
            dic = {'code': 400,'message': 'wrong email or password'}
            return JsonResponse(dic)


# /user/account/info
class UserInfoView(View):
    def get(self, request):
        token=request.GET.get('token')



# user/theme
class ChangeTheme(View):
    def get(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)
        if(user_info):
            user_id=int(user_info['user_id'])
            user = User.objects.get(id=user_id)
        if user is None:
            dic = {'code':1, 'message':'login required'}
            return JsonResponse(dic)
        
        dic = {'code': 200,'message': 'success', 'current_theme':user.theme}
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

        user.theme = request.POST.get('theme')
        user.save()
        dic = {'code': 200,'message': 'success'}
        return JsonResponse(dic)

# /user/account/changepass
class ChangePasswordView(View):
    def post(self, request):
        token=request.META.get('HTTP_AUTHORIZATION')
        user_info=parse_jwt(token)
        user = None
        if(user_info):
            user_id=user_info['user_id']
            user = User.objects.get(id=user_id)
        if user is not None:
            user.set_password(request.POST.get('password'))
            user.save() 
            dic = {'code': 0,'message': 'change password successfully'}
            return JsonResponse(dic)
        else:
            dic = {'code': 1,'message': 'user unauthorized'}
            return JsonResponse(dic)
