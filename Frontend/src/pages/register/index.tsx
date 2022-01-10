import React, { Component, ChangeEvent } from 'react';
import './index.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Register extends Component {

  state = {
    toast: false,
    register: false,
    username: '',
    password: '',
    confirmPwd: '',
    email: ''
  }

  handleUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    this.setState({username});
  }

  handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    this.setState({password});
  }

  handleConfirmInput = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmPwd = e.target.value;
    this.setState({confirmPwd});
  }

  handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    this.setState({email});
  }

  handleClick = () => {
    const { username, password, confirmPwd, email } = this.state;
    if (password !== confirmPwd) {
      this.setState({
        toast: true,
        register: false
      });
      setTimeout(()=>{
        this.setState({toast: false});
      },1000)
      return;
    }
    let param = new URLSearchParams();
    param.append('username', username);
    param.append('password', password);
    param.append('email',email);
    axios(
      {
        url:'/api1/user/register',
        method: 'post',
        data: param
      }
    ).then(
      response => {
        console.log('success',response.data);
        const { message, token } = response.data;
        if (message === 'account has been created successfully') {
          window.localStorage.setItem('user','user');
          window.localStorage.setItem('password',password);
          window.localStorage.setItem('token', token);
          this.setState({
            toast: true,
            register: true
          });
          window.localStorage.setItem('username', username);
          setTimeout(()=>{
            this.setState({toast: false});
            window.location.assign('/');
          },2000)
        }
      },
      error => {
        console.log('fail',error);
        this.setState({
          toast: true,
          register: false
        });
        setTimeout(()=>{
          this.setState({toast: false});
        },1000)
      }
    )
  }

  render() {
    const { toast, register } = this.state;
    return (
      <div className='register-container'>
        <div className='register-window'>
          <div className='register-window-top'>
            <Link to='/' className='register-window-back'>
              <img src='../../logo.png' className='register-window-img' alt='' />
            </Link>
            <p>Sign in</p>
            <Link to='/' className='register-window-back'>
              <img src='../../home.png' className='register-window-img' alt='' />
            </Link>
          </div>
          <div className='register-window-bottom'>
            <div className='register-input-container'>
              <p>User Name:</p>
              <input className='register-input-bar' onChange={this.handleUsernameInput}/>
            </div>
            <div className='register-input-container'>
              <p>Password:</p>
              <input className='register-input-bar' type='password' onChange={this.handlePasswordInput}/>
            </div>
            <div className='register-input-container'>
              <p>Input password again:</p>
              <input className='register-input-bar' type='password' onChange={this.handleConfirmInput}/>
            </div>
            <div className='register-input-container'>
              <p>Email:</p>
              <input className='register-input-bar' onChange={this.handleEmailInput}/>
            </div>
            <div className='register-input-container'>
              <button className='register-button' onClick={this.handleClick}>Submit</button>
              <Link to='/login' className='go-to-login'>Go to log in</Link>
            </div>
            <div className={toast ? 'toast-success' : 'toast-none'}>
              {register ? 'register successfully' : 'register failed'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
