# Create your views here.
from django.views.generic import View
from user.models import User
from chat.models import Message
from django.http import JsonResponse
from jwt_token import parse_jwt

# Create your views here.
#user/message/send
class UserSendMessageView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if info.get('role')==1:
            return JsonResponse({'code':1,'message':'login as user'})
        user_id=info['user_id']
        is_from_user=1
        user= User.objects.filter(id=user_id).first()
        text=request.POST.get('text')
        img=request.POST.get('img')
        if(user is not None):
            new_message = Message.objects.create(
                user=user,
                is_from_user=is_from_user,
                is_read=0,
                text=text,
                img=img
            )
            return JsonResponse({'code':0,'message':'success'})
        else:
            return JsonResponse({'code':1,'message':'user not found'})

#admin/message/send
class AdminSendMessageView(View):
    def post(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if info.get('role')==0:
            return JsonResponse({'code':1,'message':'login as admin'})

        user_id=int(request.POST.get('user_id'))
        text=request.POST.get('text')
        img=request.POST.get('img')
        is_from_user=0
        user= User.objects.filter(id=user_id).first()
        if(user is not None):
            new_message = Message.objects.create(
                user=user,
                is_from_user=is_from_user,
                is_read=0,
                text=text,
                img=img
            )
            return JsonResponse({'code':0,'message':'success'})
        else:
            return JsonResponse({'code':1,'message':'user not found'})

#user/message/receive
class UserReceiveMessageView(View):
    def get(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if info.get('role')==1:
            return JsonResponse({'code':1,'message':'login as user'})
        
        check=request.GET.get('check')
        if(check):
            check=int(check)

        user_id=info['user_id']

        user= User.objects.filter(id=user_id).first()
        if(user is not None):
            if(check==1):
                messages=Message.objects.filter(user=user,is_read=0,is_from_user=0)
                return JsonResponse({'code':0,'messages':len(messages)})

            messages=Message.objects.filter(user=user)

            retval=list(messages.values())
            retval.reverse()
            for message in messages:
                if(message.is_from_user == 0):
                    message.is_read=1
                    message.save()
            return JsonResponse({'code':0,'messages':retval})
        else:
            return JsonResponse({'code':1,'message':'user not found'})

class AdminReceiveMessageView(View):
    def get(self,request):
        token = request.META.get('HTTP_AUTHORIZATION')
        info = parse_jwt(token)
        if info is None:
            return JsonResponse({'code':1,'message':'unauthorized'})
        if info.get('role')==0:
            return JsonResponse({'code':1,'message':'login as admin'})

        check=request.GET.get('check')
        if(check):
            check=int(check)

        if(check==1):
            messages=Message.objects.filter(is_read=0,is_from_user=1)
            return JsonResponse({'code':0,'messages':len(messages)})
        else:

            messages=Message.objects.filter()
            retval=list(messages.values())
            retval.reverse()
            for i in range(len(messages)):
                retval[i].update({'username':messages[i].user.username,'email':messages[i].user.email})
                if(messages[i].is_from_user == 1):
                    messages[i].is_read=1
                    messages[i].save()
            return JsonResponse({'code':0,'messages':retval})
