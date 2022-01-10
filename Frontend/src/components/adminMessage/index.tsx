import axios from 'axios';
import { Component, ChangeEvent } from 'react';
import '../message.scss';
import { toast } from "../toast";

interface Msg{
  create_time: string, 
  email: string,
  m_id: number, 
  is_from_user: number, 
  is_read: number, 
  user_id: number, 
  username: string,
  text: any, 
  img: string,
}

class UserMsg extends Component<Msg>{
  render(){
    const { create_time, email, is_from_user, is_read, user_id, username, text, img } = this.props;
    const read = is_read ? '' : 'new'
    const direction = (is_from_user ? 'From User ' : 'To User ') + username + '  #' + user_id + '  ' + email;
    const photos = img ? img.split(';;') : [];
    return(
      <div className='message-box'>
        <div className='message-small-title'><span>{direction}</span><span>{read}</span></div>
        <div>{new Date(create_time).toLocaleString()}</div>
        <div>{text}</div>
        {photos.map((photo, index) => (<img alt='' src={photo} key={index}/>))}
      </div>
    )
  }
}

export class Admin_Message extends Component<Msg>{
  state = {
    messages: [],
    text: '',
    photos: '',
    userID: '',
  }

  fileToDataUrl = (file: any) =>{
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file); 
    return dataUrlPromise;
  }

  handleMsgPhotos = (e: ChangeEvent<HTMLInputElement>) => {
      let strings: any = null;
      if(e.target.files != null){
          const files = e.target.files;
          for (let i = 0; i < files.length; i++){
            // eslint-disable-next-line
            this.fileToDataUrl(files[i]).then(data=>{
                if(strings === null){
                  strings = data;
                }else{
                  strings = strings + ';;' + data;
                }
                if(i === files.length - 1){
                  this.setState({photos: strings});
                }
            })
          }
      }
      //const photos = e.target.value;
      //this.setState({photos});
  }

  componentDidMount = () => {
    const token = window.localStorage.getItem('token');
      let param = new URLSearchParams();
      axios(
        { 
          url:'/api1/admin/message/receive',
          method: 'GET',
          params: param,
          headers: {'Authorization': token as string}
        }
      ).then(
        response => {
          //@ts-ignore
          console.log(response.data.messages)
          //@ts-ignore
          this.setState({messages: response.data.messages})
        },
        error => {
          console.log('order fail',error);
        }
      )
  }

  handleNormalInput = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.setState({[target.name]: target.value});
  }

  handleSubmit = () => {
    const { text, photos, userID } = this.state;
    const token = window.localStorage.getItem('token');
    if(text === '' || userID === ''){
      toast('UserID and Text cannot be empty');
      return;
    }
      let param = new URLSearchParams();
      param.append('text', text);
      param.append('img', photos);
      param.append('user_id', userID)
      axios(
      {
        url:'/api1/admin/message/send',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        console.log(response)
        if(response.status === 200){
          if(response.data['code'] === 0){
            window.location.reload();
          }else if(response.data['code'] === 1){
            toast('UserID not exist')
          }
        }
      },
      error => {
        console.log('fail',error);
      }
    )

  }

  render() {
    const {messages} = this.state;
    return (
      <div className='message-container'>
        <div className='message-send-area'>
          <div>Send message to User</div>
          <div><span>Receiver's ID number: </span><input type='text' onChange={this.handleNormalInput} name='userID'/></div>
          <textarea onChange={this.handleNormalInput} name='text'></textarea>
          <div><span>Add images </span><input type='file' onChange={this.handleMsgPhotos} multiple /></div>
          <button onClick={this.handleSubmit}>Send</button>
        </div>
        <div>
          <p className='message-mid-title'>History messages:</p>
          {
            messages.map((msg: any, index: any) =>{
                if (msg) {
                    const { create_time, m_id, is_from_user, is_read, user_id, username, email, text, img } = msg as Msg;
                    return (
                      <UserMsg key={index} create_time={create_time} m_id={m_id} is_from_user={is_from_user} is_read={is_read} user_id={user_id} username={username} email={email} text={text} img={img}/>
                    )
                }else {
                  return null;
                }
              })}
        </div>
      </div>
    )
  }
}
