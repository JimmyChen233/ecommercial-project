import axios from 'axios';
import { Component } from 'react';
import { toast } from '../../components/toast';
import '../checkout.scss';

interface inner{
	pid: string,
	name: string,
	color: string,
	size: string,
	quantity: number,
	price: string,
	mainPhoto: string,
}

interface outer{
  [key: string]: inner
}

export class Wishlist extends Component<outer> {
	state = {
		toast: false,
		checkout: false,
		products: {},
    remove_id: 0,
    receiver: '',
    phone: '',
    country: 'Australia',
    state: '',
    city: '',
    street: '',
    post_code: '',
    total_price: 0,
	};
  quantity = {};

  componentDidMount = () => {
    let { products } = this.state;
    const token = window.localStorage.getItem('token');

    axios(
      {
        url:'/api1/user/wishlist',
        method: 'get',
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        // @ts-ignore
        console.log('wishlist success', response.data);
        // @ts-ignore
        const productList = response.data.wishlists;
        // @ts-ignore
        const total_price = response.data.total_price;
        // @ts-ignore
        productList && productList.forEach(product => {
          let productContainer: inner = {
            pid: '',
            name: '',
            color: '',
            size: '',
            quantity: 0,
            price: '',
            mainPhoto: ''

          };
          productContainer.pid = product.product_id;
          productContainer.name = product.product_name;
          productContainer.color = product.color;
          productContainer.size = product.size;
          productContainer.quantity = product.quantity;
          productContainer.price = product.price;
          productContainer.mainPhoto = product.image;
          // @ts-ignore
          products[product.wishlist_id] = productContainer;
        });
        this.setState({products, total_price});
      },
      error => {
        console.log('wishlist fail', error);
      }
    )
  }

  backToHomepage = () => {
    window.location.assign('/');
  }

  jumpToDetail = (e: any) => {
    window.localStorage.setItem('curr-product', e.target.id);
    window.location.assign('/product/details');
  }

  handleRemove = (e: any) => {
    const token = window.localStorage.getItem('token');
    let param = new URLSearchParams();
    param.append('wishlist_id', e.target.id);
    axios(
      {
        url:'/api1/user/wishlist/delete',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        toast('Wishlist remove successfully');
        console.log('wishlist remove success', response.data);
        window.location.reload();
      },
      error => {
        toast('Wishlist remove failed');
        console.log('wishlist remove fail', error);
      }
    )
  }

  handleMoveToCart = (e: any) => {
    const token = window.localStorage.getItem('token');
    // @ts-ignore
    let quantity = this.quantity && this.quantity[e.target.id];
    if (quantity === undefined || quantity < 1) {
      quantity = 1;
    }
    let param = new URLSearchParams();
    param.append('wishlist_id', e.target.id);
    param.append('cart', quantity);
    console.error('move to cart', quantity)
    axios(
      {
        url:'/api1/user/wishlist/delete',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        toast('Move to cart successfully');
        setTimeout(() => {window.location.reload()}, 2000)
      },
      error => {
        toast('Move to cart failed');
        console.log('move to cart fail', error);
      }
    )
  }

  handleQuantityChange = (e: any) => {
    if(e.target['value'] <= 0){
      toast('Quantity cannot be less than 1');
      return
    }
    // @ts-ignore
    this.quantity[e.target.id] = e.target.value;
    console.error('change', this.quantity);
  }

	displayProducts = (props: outer) => {
		const cpids = Object.keys(props);
		return(<>
			{
				cpids.map((cpid) => (
		  			<div id={`checkout-product-container-${cpid}`} className='checkout-product-container' key={cpid}>
		  				<div className='checkout-product-photo'>
                <img alt='' src={props[cpid].mainPhoto}/>
              </div>
		  				<div className='checkout-product-info'>
                <div id={props[cpid].pid} className='checkout-link' onClick={this.jumpToDetail}>{props[cpid].name}</div>
		  					<div>Color:&nbsp;&nbsp;&nbsp;{props[cpid].color}</div>
		  					<div>Size:&nbsp;&nbsp;&nbsp;{props[cpid].size}</div>
		  					<div>Price:&nbsp;&nbsp;&nbsp;AU&nbsp;${props[cpid].price}</div>
                <label htmlFor="input">Quantity: </label><input id={cpid} onChange={this.handleQuantityChange} defaultValue={1} type="number" />
		  				</div>
		  				<div className='checkout-cart-buttons'>
		  					<button id={cpid} onClick={this.handleRemove} className='wishlist-button'>Remove from Wishlist</button>
                <button id={cpid} onClick={this.handleMoveToCart} className='wishlist-button'>Move to cart</button>
		  				</div>
		  			</div>
	  			))
	  		}</>
	  	)
	}

	render(){
		const { products } = this.state;
		return(
			<div className='checkout-container'>
        <button className='checkout-container-back-to-home' onClick={this.backToHomepage}>Back to homepage</button>
	  		<div className='checkout-products-container'>
	  			{this.displayProducts(products)}
	  		</div>
        {JSON.stringify(products) === '{}' && 
        <div className='checkout-total-price'>
          <span>There is nothing here right now.</span>
        </div>}
		  </div>
		)
	}
}
