import axios from 'axios';
import { Component } from 'react';
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

class UserOrderItem extends Component<IProps>{

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

export class UserOrderDetail extends Component<IProps> {
	state = {
		oid: '',
		orderDate: '',
		totalPrice: '',
		products: [],
		address: {},
		status: 0,
		review_list: {},
	}


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

	handleReviewPhotos = async (target: any) => {
	    let strings: any = null;
	    if(target.files != null){
	        const files = target.files;
	        for (let i = 0; i < files.length; i++){
	        	// eslint-disable-next-line
	        	await this.fileToDataUrl(files[i]).then(data=>{
	          		if(strings === null){
	            		strings = data;
	          		}else{
	            		strings = strings + ';;' + data;
	          		}
	        	})
	      	}
	    }
	    return Promise.resolve(strings);
	}

	handleSubmit = (oid: any, pid: string, index: number) => {
		const token = window.localStorage.getItem('token');
		// @ts-ignore
		const text = document.getElementById('text' + String(index)).value;
		const img_target = document.getElementById('photo' + String(index));
		const img = this.handleReviewPhotos(img_target);
		// @ts-ignore
		// const star = document.getElementById('star' + String(index)).value;
		const query = `input[name="${pid}"]:checked`
		// @ts-ignore
		const star = document.querySelector(query).value;

		if(text === ''){
			toast('Text cannot be empty');
			return;
    	}
    	let param = new URLSearchParams();
	    param.append('text', text);
	    param.append('star', star);
	    param.append('orderID', oid)
	    param.append('productID', pid)
	    img.then((data)=>{
	    	if(data == null){
	    		param.append('image', '')
	    	}else{
	    		param.append('image', data)
	    	}
	    	console.log(oid, pid, text, star)
	    	axios(
				{
					url:'/api1/user/order/review',
					method: 'post',
					data: param,
					headers: {'Authorization': token as string}
				}
			).then(
				response => {
					toast('Post review successfully!')
				},
				error => {
					console.log('fail',error);
				}
			)
		})
	}

	checkExistingReview = (oid: any, pid: any) => {
		const token = window.localStorage.getItem('token'); 
		let param = new URLSearchParams();
	    param.append('orderID', oid);
	    param.append('productID ', pid);
	    const url = '/api1/user/order/review?orderID=' + oid + '&productID=' + pid
	    console.log(oid, pid, url)
	    // 2021110321510714 80
	    //'/api1/user/order/review?orderID=2021110321510714&productID=80'
		axios(
				{
					url: url,
					method: 'get',
					//params: param,
					headers: {'Authorization': token as string}
				}
			).then(
				response => {
					console.log(pid, response)
				},
				error => {
					console.log('fail',error);
				}
			)
	}


	componentDidMount = () => {
		const token = window.localStorage.getItem('token');
	    const oid = window.localStorage.getItem('curr-order');
	    let param = new URLSearchParams();
	    param.append('oid', oid as string);
	    axios(
	      {
	        url:'/api1/user/order',
	        method: 'GET',
	        params: param,
	        headers: {'Authorization': token as string}
	      }
	    ).then(
	      response => {
	      	console.log(response.data);
	      	// @ts-ignore 
	      	if(response.data.code === 200){
		      	console.log('order success',response.data);
		      	const {oid, orderDate, uid, username, totalPrice, products, address, status} = response.data;
		      	const review_list = {}
		      	// @ts-ignore 
		      	products.map((item) => {review_list[item.productID] = item.name; return 0})
		      	this.setState({
					oid: oid,
					orderDate: orderDate,
					uid: uid,
					username: username,
					totalPrice: totalPrice,
					products: products,
					address: address,
					status: status,
					review_list: review_list,
				})
		    // @ts-ignore 
		    }else if(response.data.message === 'login required'){
		    	toast('Login session expired, please log in again');
		    	window.localStorage.removeItem('token');
		    	setTimeout(()=>{
    				window.location.assign('/login');
  				},2000);
		    }
	      },
	      error => {
	        console.log('order fail',error);
	      }
	    )
	}

	render(){
		const {oid, orderDate, totalPrice, products, address, status, review_list } = this.state;
		const {receiver, phone, country, state, city, street, post_code} = address as Address;
		return(<div className='order-list-container'>
			<div className='order-detail-bigtitle'>ORDER # {oid}</div>
			<div className='order-detail-textbox'>
				<p><span>Current Status:</span>&nbsp;{this.stateTranslate(status)}</p>
				<p><span>Date: </span>{new Date(orderDate).toLocaleString()}</p>
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
		            	<UserOrderItem key={index} productID={productID} name={name} price={price} mainPhoto={mainPhoto} size={size} color={color} quantity={quantity}/>
		            )
	         	}else {
	        		return null;
	        	}
	        })}

	        <div className='order-detail-textbox'>
	        	<hr/>
	        	<p><span>Write Review</span></p>
	        </div>


	        {(Object.keys(review_list)).map((item, index) =>{	
	        // <input type='number' id={'star' + String(index)}/>        	
        		return(
        			<div className='order-review-box' key={index}>
        				<div>Item {index + 1}: {(review_list as any)[item]}</div>
        				{this.checkExistingReview(oid, item)}

        				<span>
        					<span>Star: </span>
							<input type="radio" name={String(item)} value="1" id={String(index) + "-1"}/>
							<label htmlFor={String(index) + "-1"}>1</label>
							<input type="radio" name={String(item)} value="2" id={String(index) + "-2"}/>
							<label htmlFor={String(index) + "-2"}>2</label>
							<input type="radio" name={String(item)} value="3" id={String(index) + "-3"}/>
							<label htmlFor={String(index) + "-3"}>3</label>
							<input type="radio" name={String(item)} value="4" id={String(index) + "-4"}/>
							<label htmlFor={String(index) + "-4"}>4</label>
							<input type="radio" name={String(item)} value="5" id={String(index) + "-5"}/>
							<label htmlFor={String(index) + "-5"}>5</label>
						</span>

	        			<textarea id={'text' + String(index)}></textarea>
						<div><span>Add images </span><input type='file' id={'photo' + String(index)} multiple /></div>
						<button onClick={() => this.handleSubmit(oid, item, index)}>Send</button>
        			</div>
        		)
	        })}
		</div>)
	}
}