import React, { Component } from 'react';
import './index.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { UserChangePW } from '../../components/userchangepw';
import { UserOrderList } from '../../components/userOrderList';
import { UserOrderDetail } from '../../components/userOrderDetail';
import { UserMessage } from '../../components/userMessage';
import { UserHistory } from '../../components/userHistory';
import { Wishlist } from '../wishlist';
import { UserTheme } from '../../components/userTheme';

export class User_panel extends Component {
  state = {
    active: 'My Order'
  }

  componentDidMount = () => {
    const active = window.localStorage.getItem('active-tab');
    this.setState({active});
  }

  jumptohomepage = () => {
    window.location.assign('/');
  }

  handleClick = (e: any) => {
    this.setState({
      active: e.target.innerText
    })
    window.localStorage.setItem('active-tab', e.target.innerText)
    switch (e.target.innerText) {     
      case 'My Order':
        window.location.assign('/user/orders');
        break;

      case 'Change Password':
        window.location.assign('/user/pwchange');
        break;

      case 'Message':
        window.location.assign('/user/message');
        break;

      case 'Browse History':
        window.location.assign('/user/history');
        break;

      case 'UI Theme':
        window.location.assign('/user/theme');
        break;

      case 'My favorite':
        window.location.assign('/user/wishlist');
        break;
      
      default:
        break;
    }
  }

  Body = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/user/pwchange' component={UserChangePW}/>
          <Route exact path='/user/orders/detail' component={UserOrderDetail}/>
          <Route exact path='/user/message' component={UserMessage}/>
          <Route exact path='/user/orders' component={UserOrderList}/>
          <Route exact path='/user/history' component={UserHistory}/>
          <Route exact path='/user/theme' component={UserTheme}/>
          <Route exact path='/user/wishlist' component={Wishlist}/>
        </Switch>
      </BrowserRouter>
    );
  }

  render() {
    const { active } = this.state;
    return (
      <div className='userpanel-root-container'>
        <div className='userpanel-titlebar-container'>
            <img src='../../logo.png' className='userpanel-title-icon' onClick={this.jumptohomepage} alt=''/>
            <div className='userpanel-title-name'>User Panel</div>
        </div>
        <div style={{display:'flex'}}>
          <div className='userpanel-button-area'>
            <button className={active === 'My Order' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>My Order</button>
            <button className={active === 'Change Password' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>Change Password</button>
            <button className={active === 'Browse History' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>Browse History</button>
            <button className={active === 'My favorite' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>My favorite</button>
            <button className={active === 'UI Theme' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>UI Theme</button>
            <button className={active === 'Message' ? 'user-sidebutton-on' : 'user-sidebutton-off'} onClick={this.handleClick}>Message</button>
          </div>
          <div style={{flex:4,borderLeft:'solid 3px var(--grey-background)',marginLeft:'-3px',paddingTop:'30px',paddingLeft:'2%'}}>
            {this.Body()}
          </div>
        </div>
      </div>
    )
  }
}