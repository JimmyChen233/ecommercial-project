import React, { Component, ChangeEvent } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';

export class Login extends Component {
  state = {
    toast: false,
    login: false,
    email: '',
    password: '',
  }

  componentDidMount = () => {}

  handleClick = () => {
    let param = new URLSearchParams();
    const { email, password } = this.state;
    param.append('email', email);
    param.append('password', password);
    axios(
      {
        url:'/api1/user/login',
        method: 'post',
        data: param
      }
    ).then(
      response => {
        console.log('success',response.data);
        const { message, user_info = {role: '', username: '', theme: ''}, token } = response.data;
        // login successfully
        if (message === 'user login successfully' && user_info) {
          window.localStorage.setItem('user', user_info.role ? 'admin' : 'user');
          window.localStorage.setItem('username', user_info.username);
          window.localStorage.setItem('password', password);
          window.localStorage.setItem('token', token);
          window.localStorage.setItem('theme', user_info.theme);
          this.setState({
            toast: true,
            login: true
          });
          setTimeout(()=>{
            this.setState({toast: false});
            window.location.assign('/');
          },2000)
        } else if (message !== 'user login successfully') {
          console.log('login fail', email, password);
          this.setState({
            toast: true,
            login: false
          });
          setTimeout(()=>{
            this.setState({toast: false});
          },1000)
        }
      },
      error => {
        console.log('network fail',error);
        this.setState({
          toast: true,
          login: false
        });
        setTimeout(()=>{
          this.setState({toast: false});
        },1000)
      }
    )
  }

  handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    this.setState({email});
  }

  handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    this.setState({password});
  }

  render() {
    const { toast, login } = this.state;
    return (
      <div className='login-container'>
        <div className='login-window'>
          <div className='login-window-top'>
            <Link to='/' className='login-window-back'>
              <img src='../../logo.png' className='login-window-img' alt='' />
            </Link>
            <p>Log in</p>
            <Link to='/' className='login-window-back'>
              <img src='../../home.png' className='login-window-img' alt='' />
            </Link>
          </div>
          <div className='login-window-bottom'>
            <div className='input-container'>
              <p>Email:</p>
              <input className='input-bar' onChange={this.handleEmailInput}/>
            </div>
            <div className='input-container'>
              <p>Password:</p>
              <input className='input-bar' type='password' onChange={this.handlePasswordInput}/>
            </div>
            <div className='input-container'>
              <button onClick={this.handleClick} className='log-in-button'>Submit</button>
            </div>
            <Link to='/register' className='go-to-register'>Don't have any account? Create one</Link>
            <div className={toast ? 'toast-success' : 'toast-none'}>
              {login ? 'login successfully' : 'login failed'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
