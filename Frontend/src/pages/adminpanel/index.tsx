import { Component } from 'react';
import './index.scss';
import { BrowserRouter,Route } from 'react-router-dom';

import { Product_manage } from '../../components/productlist'
import { Product_create } from '../../components/productcreate';
import { Product_detail } from '../../components/productdetail';
import { AdminOrderList } from '../../components/adminOrderList';
import { AdminOrderDetail } from '../../components/adminOrderDetail';
import { Admin_Message } from '../../components/adminMessage';

export class Admin_panel extends Component {
  state = {
    active: 'Product Info'
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
      case 'Product Info':
        window.location.assign('/admin/product');
        break;
    
      case 'Order List':
        window.location.assign('/admin/orders');
        break;

      case 'Message':
        window.location.assign('/admin/message');
        break;
      
      default:
        break;
    }
  }

  Body = () => {
    return (
      <BrowserRouter>
        <Route exact path='/admin/product' component={Product_manage}></Route>
        <Route exact path='/admin/product/create' component={Product_create}></Route>
        <Route exact path='/admin/product/detail' component={Product_detail}></Route>
        <Route exact path='/admin/orders' component={AdminOrderList}></Route>
        <Route exact path='/admin/orders/detail' component={AdminOrderDetail}></Route>
        <Route exact path='/admin/message' component={Admin_Message}></Route>
      </BrowserRouter>
    );
  }

  render() {
    const {active} = this.state;
    return (
      <div className='panel-container'>
        <div className='panel-titlebar-container'>
            <img src='../../logo.png' className='panel-title-icon' onClick={this.jumptohomepage} alt=''/>
            <div className='panel-title-name'>Admin Panel</div>
        </div>
        <div style={{display:'flex', height: 'auto'}}>
          <div style={{flex:1,borderRight:'solid 3px grey',marginRight:'-3px',paddingTop:'30px',paddingLeft:'2%'}}>
            <button className={active === 'Product Info' ? 'sidebutton-on' : 'sidebutton-off'} onClick={this.handleClick}>Product Info</button>
            <button className={active === 'Order List' ? 'sidebutton-on' : 'sidebutton-off'} onClick={this.handleClick}>Order List</button>
            <button className={active === 'Message' ? 'sidebutton-on' : 'sidebutton-off'} onClick={this.handleClick}>Message</button>
          </div>
          <div className='panel-body'>
            {this.Body()}
          </div>
        </div>
      </div>
    )
  }
}