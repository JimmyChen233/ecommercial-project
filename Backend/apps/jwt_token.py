import jwt
import time

key='i am an apple'
time_limit=1000*24*60*60
algorithm='HS256'
headers={
    'alg': algorithm
}

#input : dict require 'role' , 'username' , 'user_id' , 'email' 
#default None
#return jwt
def authorize(info):
    payload={
        'role':info.get('role'),
        'username':info.get('username'),
        'user_id':info.get('user_id'),
        'email':info.get('email'),
        'exp':int(time.time())+time_limit
    }
    
    token=jwt.encode(payload=payload,key=key,algorithm=algorithm,headers=headers)
    return token


#input : jwt
#return 'role','user_id','username','email','exp'
def parse_jwt(token):
    try:
        info = jwt.decode(token, key, algorithms=[algorithm],options={'verify_signature':True,"verify_exp": True})
        return info
    except Exception as e:
        print(e)
        return None

