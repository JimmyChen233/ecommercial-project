import { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "../toast";
import axios from 'axios';

import './index.scss';

export class TitleBar extends Component {
  state = {
    count: 0,
  }

  componentDidMount = () => {
    if(window.localStorage.getItem('user') === 'user'){
      const token = window.localStorage.getItem('token');
      let param = new URLSearchParams();
      param.append('check', '1')
      axios(
        { 
          url:'/api1/user/message/receive',
          method: 'GET',
          params: param,
          headers: {'Authorization': token as string}
        }
      ).then(response => {
        // @ts-ignore
        const count = response.data.messages
        this.setState({count}) 
      })
    }
  }

  checkNewMsg = () => {
    const { count } = this.state;
    if(count > 0){
      return(<div className='titlebar-msg-reminder'>{count}</div>)
    }
  }

  handleClick = () => {
    window.localStorage.setItem('user','guest');
    window.localStorage.setItem('password','');
    window.localStorage.setItem('token', '');
    this.setState({user: 'guest'});
  }

  getUserType = () => {
    let user = window.localStorage.getItem('user');
    if(user === null){
      user = 'guest'
    }
    return user;
  }

  handleJumpToAccount = () => {
    const user = this.getUserType();
    if (user === 'user') {
      window.localStorage.setItem('active-tab', 'My Order')
      window.location.assign('/user/orders');
    } else if (user === 'admin') {
      window.localStorage.setItem('active-tab', 'Product Info')
      window.location.assign('/admin/product/');
    } else{
      toast('Sorry, guest do not have access to user panel. Please log in.')
    }
  }

  handleJumpToCart = () => {
    const user = this.getUserType();
    if (user === 'user' || user === 'admin') {
      window.location.assign('/user/cart');
    } else{
      toast('Sorry, guest do not have shopping cart. Please log in.')
    }
  }

  jumptohomepage = () => {
    window.location.assign('/');
  }

  handleSearchClick = () => {
    const searchInput = document.getElementById('search-input');
    // @ts-ignore
    const searchContent = searchInput?.value;
    if (!searchContent) {
      toast('The search keywords must not be empty!');
      return;
    }
    window.localStorage.setItem('search-keyword',searchContent);
    window.localStorage.setItem('search-cate1', '');
    window.localStorage.setItem('search-cate2', '');
    window.localStorage.setItem('search-cate3', '');
    window.location.assign('/search');
  }

  render() {
    const user = this.getUserType();
    const username = (user === 'guest') ? 'guest' : ((user === 'admin') ? 'admin' : window.localStorage.getItem('username'));
    return (
      <div className='titlebar-container'>
        <img src='../../logo.png' className='title-icon' onClick={this.jumptohomepage} alt=''/>
        <div className='titlebar-search'>
          <img src='../../search.png' className='search-icon' alt='' />
          <input id='search-input' className='titlebar-search-input-bar'/>
        </div>
        <button className="titlebar-search-button" onClick={this.handleSearchClick}>Search</button>
        <div className='titlebar-account'>
          <div className='text-box'>
            <div>{`Hello ${username}`}</div>
            {user === 'guest' ? <Link to='/login' className='logout' >Log in</Link> : <a href='' className='logout' onClick={this.handleClick}>log out</a>}
          </div>
          <div className='titlebar-user-icon'>
            <img src='../../user.png' onClick={this.handleJumpToAccount} className='titlebar-icon' alt=''/>
            {this.checkNewMsg()}
          </div>
          <img src='../../cart.png' onClick={this.handleJumpToCart} className='titlebar-icon' alt=''/>
        </div>
      </div>
    )
  }
}