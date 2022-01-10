import axios from 'axios';
import { Component, ChangeEvent } from 'react';
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

export class Cart extends Component {
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


  componentDidMount = () => {
    let { products } = this.state;
    const token = window.localStorage.getItem('token');

    axios(
      {
        url:'/api1/user/cart',
        method: 'get',
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        // @ts-ignore
        console.log('cart success', response.data);
        // @ts-ignore
        const productList = response.data.carts;
        // @ts-ignore
        const total_price = response.data.total_price;
        // @ts-ignore
        productList.forEach(product => {
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
          products[product.cart_id] = productContainer;
        });
        this.setState({products, total_price});
      },
      error => {
        console.log('cart fail', error);
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


	handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		this.setState({[target.name]: target.value});
	}

	handleSubmit = () => {
    const { receiver, phone, country, state, city, street, post_code } = this.state;
    const address = {
      receiver,
      phone,
      country,
      state,
      city,
      street,
      post_code
    }
    const token = window.localStorage.getItem('token');
    let param = new URLSearchParams();
    param.append('Address', JSON.stringify(address));
    param.append('pay_method', '1');
    axios(
      {
        url:'/api1/user/cart/checkout',
        method: 'post',
        data: param,
        headers: {
          'Authorization': token as string,
        }
      }
    ).then(
      response => {
        console.log('checkout success', response.data);
        this.setState({toast: true});
        setTimeout(()=>{
          this.setState({toast: false});
          window.location.assign('/');
        }, 5000);
      },
      error => {
        console.log('checkout fail', error);
      }
    )
	}

  handleRemove = (e: any) => {
    const token = window.localStorage.getItem('token');
    let param = new URLSearchParams();
    param.append('cart_id', e.target.id);
    axios(
      {
        url:'/api1/user/cart/delete',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        toast('Remove successfully');
        console.log('cart remove success', response.data);
        window.location.reload();
      },
      error => {
        toast('Remove failed');
        console.log('cart remove fail', error);
      }
    )
  }

  handleAddToWishlist = (e: any) => {
		const token = window.localStorage.getItem('token');
    let param = new URLSearchParams();
    param.append('cart_id', e.target.id);
    param.append('wishlist', '1');
    axios(
      {
        url:'/api1/user/cart/delete',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        toast('Add to wishlist successfully');
        console.log('add to wishlist success', response.data);
        window.location.reload();
      },
      error => {
        toast('Add to wishlist failed');
        console.log('add to wishlist fail', error);
      }
    )
	}

	beginCheckout = () => {
		this.setState({checkout: true})
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
		  					<div>Color:&nbsp;&nbsp;&nbsp;&nbsp;{props[cpid].color}</div>
		  					<div>Size:&nbsp;&nbsp;&nbsp;&nbsp;{props[cpid].size}</div>
		  					<div>Price:&nbsp;&nbsp;&nbsp;&nbsp;AU&nbsp;${props[cpid].price}</div>
		  				</div>
		  				<div className='checkout-product-quantity'>x{props[cpid].quantity}</div>
		  				<div className='checkout-cart-buttons'>
		  					<button id={cpid} onClick={this.handleAddToWishlist} className='checkout-cart-button' >Move to WishList</button>
		  					<button id={cpid} onClick={this.handleRemove} className='checkout-cart-button'>Remove from Cart</button>
		  				</div>
		  			</div>
	  			))
	  		}</>
	  	)
	}

	render(){
		const {toast, checkout, products, total_price } = this.state;
		let display_on = (checkout || !total_price) ? 'checkout-display-off' : ''
		let display_off = checkout ? '' : 'checkout-display-off'
		return(
			<div className='checkout-container'>
	  		<div className="checkout-logo">
          <img alt='' src="../../logo.png"/>
        </div>
        <button className='checkout-container-back-to-home' onClick={this.backToHomepage}>Back to homepage</button>
	  		<div className='checkout-products-container'>
	  			{this.displayProducts(products)}
	  		</div>
	  		<hr/>
	  		<div className='checkout-total-price'>
          <span>Total price:</span>
          <span>AU&nbsp;${total_price}</span>
        </div>
        <div className={display_on}>
        	<button className='checkout-cart-button checkout-big-button' onClick={this.beginCheckout}>Go to checkout</button>
        </div>
        <div className={display_off}>
	      	<div className='checkout-inputs'>
		  			<label htmlFor="address1">Receiver: </label>
		  			<input type="text" onChange={this.handleInput} id="address1" name="receiver" required />
		  			<label htmlFor="address2">Phone: </label>
		  			<input type="text" onChange={this.handleInput} id="address2" name="phone" required />
		  			<label htmlFor="address3">Country: </label>
		  			<input type="text" value={'Australia'} disabled={true} onChange={this.handleInput} id="address3" name="country" required />
		  			<label htmlFor="phonenum">State: </label>
		  			<input type="text" onChange={this.handleInput} id="phonenum" name="state" required />
		  			<label htmlFor="realname">Suburb: </label>
		  			<input type="text" onChange={this.handleInput} id="realname" name="city" required />
            <label htmlFor="realname">Street: </label>
		  			<input type="text" onChange={this.handleInput} id="realname" name="street" required />
            <label htmlFor="realname">Post code: </label>
		  			<input type="text" onChange={this.handleInput} id="realname" name="post_code" required />
		  			<button onClick={this.handleSubmit} className='checkout-cart-button checkout-big-button'>Confirm and pay</button>
		  		</div>
	  		</div>
  			

				<div className={toast ? 'checkout-toast-success' : 'checkout-toast-none'}>
					<div>√√√ Your order's in!</div><br/>
					<div>We're processing your order. You can view your orders in user panel.</div><br/>
					<div>Redirecting to the home page ...</div>
				</div>
        
		  </div>
		)
	}
}
