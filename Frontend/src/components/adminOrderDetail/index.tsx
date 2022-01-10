import axios from 'axios';
import { Component, ChangeEvent } from 'react';
import '../order.scss';
import { toast } from '../../components/toast';

interface Address{
  	receiver: string,
	phone: string,
	country: string,
	state: string,
	city: string,
	street: string,
	post_code: string,
}

interface IProps{
	productID: number,
	name: string,
	price: string,
	mainPhoto: string,
	size: string,
	color: string,
	quantity: number,
}

class AdminOrderItem extends Component<IProps>{

	jumpToDetail = (e: any) => {
	    window.localStorage.setItem('curr-product', e.target.id);
	    window.location.assign('/product/details#pid=' + e.target.id);
	}

	render(){
		const { productID, name, price, mainPhoto, size, color, quantity } = this.props;
		return(
			<div className='order-product-container' key={productID}>
				<div className='order-product-photo'>
		            <img alt='' src={mainPhoto}/>
				</div>
				<div className='order-product-info'>
	                <div id={String(productID)} className='order-link' onClick={this.jumpToDetail}>{name}</div>
					<div>Color:&nbsp;&nbsp;&nbsp;&nbsp;{color}</div>
					<div>Size:&nbsp;&nbsp;&nbsp;&nbsp;{size}</div>
					<div>Price:&nbsp;&nbsp;&nbsp;&nbsp;AU&nbsp;${price}</div>
	  			</div>
				<div className='order-product-quantity'>x{quantity}</div>
		  	</div>
		)
	}
}

export class AdminOrderDetail extends Component<IProps> {
	state = {
		oid: '',
		orderDate: '',
		uid: '',
		username: '',
		totalPrice: '',
		status: 0,
		products: [],
		address: {},
	}

	select_status = 0;

	stateTranslate = (status: number) => {
		if(status === 1){
			return 'Processing'
		}else if(status === 2){
			return 'Preparing'
		}else if(status === 3){
			return 'In transit'
		}else if(status === 4){
			return 'Completed'
		}
	}

	componentDidMount = () => {
		const token = window.localStorage.getItem('token');
	    const oid = window.localStorage.getItem('curr-order');
	    let param = new URLSearchParams();
	    param.append('oid', oid as string);
	    axios(
	      {
	        url:'/api1/admin/order',
	        method: 'GET',
	        params: param,
	        headers: {'Authorization': token as string}
	      }
	    ).then(
	      response => {
	      	const {oid, orderDate, uid, username, totalPrice, products, address, status} = response.data;
	      	this.setState({
				oid: oid,
				orderDate: orderDate,
				uid: uid,
				username: username,
				totalPrice: totalPrice,
				products: products,
				address: address,
				status: status,
			})
	        console.log('order success',response.data);
	        // window.location.assign('/admin/product/');
	      },
	      error => {
	        console.log('order fail',error);
	      }
	    )
	}

	handleSelectInput = (e: ChangeEvent<HTMLSelectElement>) => {
	    const status = e.target.value;
	    this.select_status = parseInt(status)
	    // this.setState({status});
	}

	handleStatusChange = (e: any) => {
		const oid = this.state.oid;
		const token = window.localStorage.getItem('token');
		if(this.select_status === 0){return;}
		let param = new URLSearchParams();
	    param.append('oid', String(oid));
	    param.append('status', String(this.select_status));
	    axios(
			{
				url:'/api1/admin/order/update',
				method: 'POST',
				data: param,
				headers: {'Authorization': token as string},
			}
	    ).then(
			response => {
				this.setState({status: this.select_status})
				toast('Switch status successfully');
				// window.location.assign('/admin/product/');
			},
			error => {
			console.log('order fail',error);
	     })
	}

	render(){
		const {oid, orderDate, uid, username, totalPrice, products, address, status } = this.state;
		const {receiver, phone, country, state, city, street, post_code} = address as Address;
		return(<div className='order-list-container'>
			<div className='order-detail-bigtitle'>ORDER # {oid}</div>
			<select onChange={this.handleSelectInput}  defaultValue="placeholder" id="status" name="status" required>
			    <option disabled value="placeholder"> -- select an option -- </option>
			    <option value="1">Processing</option>
			    <option value="2">Preparing</option>
			    <option value="3">In transit</option>
			    <option value="4">Completed</option>
            </select>
			<button className='order-button order-cells-short' onClick={this.handleStatusChange}>Change Status</button>
			<div className='order-detail-textbox'>
				<p><span>Current Status:</span>&nbsp;{this.stateTranslate(status)}</p>
				<p><span>Date: </span>${new Date(orderDate).toLocaleString()}</p>
				<p><span>Username&Id: </span>{`${username} #${uid}`}</p>
				<p><span>Total Pice: </span>AU&nbsp;{parseInt(totalPrice).toFixed(2)}</p>
				<hr/>
				<p><span>Sent to</span></p>
				<div className='order-detail-address'>
					<p>{receiver}</p>
					<p>{phone}</p>
					<p>{street}</p>	
					<p>{`${city}, ${state} ${post_code}`}</p>
					<p>{country}</p>
				</div>
				<hr/>
				<div><span>Items Ordered</span></div>
			</div>

			{products.map((item, index) =>{
	        	if (item) {
	        		
		            const { productID, name, price, mainPhoto, size, color, quantity } = item as IProps;
		            
		            return (
		            	<AdminOrderItem key={index} productID={productID} name={name} price={price} mainPhoto={mainPhoto} size={size} color={color} quantity={quantity}/>
		            )
	         	}else {
	        		return null;
	        	}
	        })}

		</div>)
	}
}