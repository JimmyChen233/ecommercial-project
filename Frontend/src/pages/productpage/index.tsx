import { Component, ChangeEvent } from 'react';
import './index.scss'
import { NavBar } from '../../components/navbar';
import { TitleBar } from '../../components/titlebar';
import axios from 'axios';
import { toast } from '../../components/toast';
import { ProductR } from '../../components/productR';
import StarRatings from 'react-star-ratings';

interface Si{
  [key: string]: number;
}

interface Csi{
  [key: string]: Si
}

export class Product_page extends Component {
	state = {
		product_info: {
			name: '',
			price: 0,
			sales: 0,
			brand: '',
			mainPhoto: '',
			desc: '',
			descPhotos: '',
			color_size_inventory: {
				'red':{'big': 5}
			},
			is_delete: false,
		},
		select_color: '',
		select_size: '',
		select_quantity: 1,
		recommend: [],
		review_list: [],
	};

	pid = window.location.hash.split("=")[1] || window.localStorage.getItem('curr-product');

	coloroptions = (product_info: any) => {
		const colors = Object.keys(product_info.color_size_inventory);
		return(
			<>
			{
				colors.map((color) => (<option value={color} key={color}>{color}</option>))
			}
			</>
		)
	}

	sizeoptions = (color: any) => {
		if(color !== ''){
			const sizes = Object.keys((this.state.product_info.color_size_inventory as Csi)[color]);
			return(<>
				{
					sizes.map((size) => (<option value={size} key={size}>{size}</option>))
				}</>
			)
		}else{return(<></>)}
	}

	selectEnable = (props: string) =>{return props ? false : true}

	inventoryinfo = (size: any, color: any, product_info: any) => {
		if(size !== '' && color !== ''){
			console.log(product_info)
			const inventory = (product_info.color_size_inventory as Csi)[color][size];
			return(<><span>Available: {inventory}</span></>)
		}else{return(<></>)}
	}

	displayPhotos = (photos: string) => {
		if(photos == null){
			return(<div>Sorry, this product has no image</div>)
		}
		const photolist = photos.split(';;');
		return (<>{
	        photolist.map((photo, index) => (<img alt='' src={photo} key={index + 100}/>))
	    }</>)
	}

	handleAddToCart = () => {
		const token = window.localStorage.getItem('token');
		const { select_size, select_quantity, select_color } = this.state;
		if (select_color === '') {
			toast('please select color');
			return;
		}
		if (select_size === '') {
			toast('please select size');
			return;
		}
		if (select_quantity === 0) {
			toast('please select quantity');
			return;
		}
		let param = new URLSearchParams();
    param.append('pid', this.pid as string);
    param.append('size', select_size);
    param.append('color', select_color);
    param.append('quantity', select_quantity.toString());
		console.error(this.pid, select_size, select_color, select_quantity.toString())
    axios(
      {
        url:'/api1/user/cart/create',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        console.log('cart create success', response.data);
				toast('Product has already been added to cart successfully');
      },
      error => {
        console.log('cart create fail', error);
				toast('Network error');
      }
    )
	}

	handleAddToWishlist = () => {
		const token = window.localStorage.getItem('token');
		const { select_size, select_quantity, select_color } = this.state;
		if (select_color === '') {
			toast('please select color');
			return;
		}
		if (select_size === '') {
			toast('please select size');
			return;
		}
		if (select_quantity === 0) {
			toast('please select quantity');
			return;
		}
		let param = new URLSearchParams();
    param.append('pid', this.pid as string);
    param.append('size', select_size);
    param.append('color', select_color);
    param.append('quantity', select_quantity.toString());
		console.error(this.pid, select_size, select_color, select_quantity.toString())
    axios(
      {
        url:'/api1/user/wishlist/create',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        console.log('wishlist create success', response.data);
				toast('Product has already been added to wishlist successfully');
      },
      error => {
        console.log('wishlist create fail', error);
				toast('Network error');
      }
    )
	}

	handleBuyNow = () => {
		const token = window.localStorage.getItem('token');
		const { select_size, select_quantity, select_color } = this.state;
		if (select_color === '') {
			toast('please select color');
			return;
		}
		if (select_size === '') {
			toast('please select size');
			return;
		}
		if (select_quantity === 0) {
			toast('please select quantity');
			return;
		}
		let param = new URLSearchParams();
    param.append('pid', this.pid as string);
    param.append('size', select_size);
    param.append('color', select_color);
    param.append('quantity', select_quantity.toString());
    axios(
      {
        url:'/api1/user/cart/create',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
				// @ts-ignore
				if (response.data.err) {
					// @ts-ignore
					console.error('1111111', response.data.err);
					// @ts-ignore
					toast(response.data.err);
				} else {
					console.log('cart create success', response.data);
					toast('Product has already been added to cart successfully');
					window.location.assign('/user/cart');
				}
      },
      error => {
        console.log('cart create fail', error);
				toast('Network error');
      }
    )
	}

	displayDesc = (desc: string) => {
		const desc_split = desc.split(/\r?\n/);
		return(
			desc_split.map((data, index)=>{return (<p key={index + 200}>{data}</p>)}))
	}

	componentDidMount = () => {
		if(window.location.hash.split("=")[1]){
			let temp = parseInt(window.location.hash.split("=")[1])
			if(!isNaN(temp)){
				window.localStorage.setItem('curr-product', String(temp))
				this.pid = String(temp)
				window.location.hash = '#pid=' + this.pid
			}else{
				return;
			}
		}else{
			this.pid = window.localStorage.getItem('curr-product') as string;
			if(this.pid === '')
				{return}
			else{window.location.hash = '#pid=' + this.pid}
		}

		let param = new URLSearchParams();
    param.append('pid', this.pid);
    const token = window.localStorage.getItem('token');

    axios(
      {
        url:'/api1/products/details',
        method: 'GET',
        params: param,
        headers: {'Authorization': token as string},
      }
    ).then(
      response => {
      	// @ts-ignore
				if(response.data.product_info === undefined){
					toast('Sorry, this product page does not exist. Redirect to home page ...')
					setTimeout(()=>{window.location.assign('/')}, 2000)
					return
				}
				// @ts-ignore
        console.log('Product Detail:',response.data.product_info[0].fields);
				// @ts-ignore
				const data = response.data.product_info[0].fields;
				const { brand, name, sales, price, image, desc, desc_image, color_inventory, is_delete } = data;
				const productInfo = {
					name,
					price,
					sales,
					brand,
					mainPhoto: image,
					desc,
					descPhotos: desc_image,
					color_size_inventory: color_inventory,
					is_delete,
				}
				if(is_delete === true){
					toast('Sorry, this product has been closed by admin. We will redirect you to home page')
					setTimeout(()=>{window.location.assign('/')}, 2000)
					return
				}
				this.setState({product_info: productInfo})
      },
      error => {
        console.log('product fail',error);
      }
    )

    let param2 = new URLSearchParams(); 
    param2.append('productID', this.pid);
    axios(
      {
        url:'/api1/products/review',
        method: 'GET',
        params: param2,
      }
    ).then(
    	response => {console.log('Reviews:', response.data); this.setState({review_list: response.data['reviewlist']})}
    )
    let param3 = new URLSearchParams();
    param3.append('pid', this.pid);
    axios(
      {
        url:'/api1/product/recommend',
        method: 'GET',
        params: param3,
      }
    ).then(
    	response => {console.log('Recommend', response.data); this.setState({recommend: response.data['messages']})}
    )
	}
	
	handleInput = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		this.setState({[target.name]: target.value});
	}

	render() {
		const { product_info, select_size, select_color, recommend, review_list } = this.state;
		return(
			<div className='home-container'>
				<TitleBar />
	  		<NavBar/>
	  		<div id='productpage-root-container'>
	  			<div id='productpage-main-container'>
	  				<div id='productpage-mainphoto'><img alt='' src={product_info.mainPhoto}/></div>
	  				<div id='product-text'>
	  					<div id='productpage-brand'>{product_info.brand}</div>
	  					<div id='productpage-name'>{product_info.name}</div>
	  					<div id='productpage-sales'>{product_info.sales} sold</div>
	  					<div id='productpage-price'>$ {product_info.price}</div>
	  					<div id='productpage-select'>
	  						<select onChange={this.handleInput} defaultValue={'DEFAULT'} id="productpage-select-color" name="select_color" required>
			            	<option value="DEFAULT" disabled> -- select color -- </option>
			            	{this.coloroptions(product_info)}
			            </select>
			            <select onChange={this.handleInput} defaultValue={'DEFAULT'} id="productpage-select-size" name="select_size" disabled={this.selectEnable(select_color)} required>
			            	<option value="DEFAULT" disabled> -- select size -- </option>
			            	{this.sizeoptions(select_color)}
			            </select>
	  					</div>
	  					<div>
	  						<span>Quantity: </span>
	  						<input type="number" onChange={this.handleInput} id="productpage-quantity" min={1} defaultValue={1} name="select_quantity" required/>
	  						{this.inventoryinfo(select_size, select_color, product_info)}
	  					</div>
	  					<div id='productpage-buttons'>
	  						<button onClick={this.handleAddToCart}>Add to Cart</button>
	  						<button onClick={this.handleBuyNow}>But it Now</button>
	  						<button onClick={this.handleAddToWishlist}>Add to Wishlist</button>
	  					</div>
	  					<hr/>
	  					<div className='productpage-small-title'>Details</div>
	  					<div id='productpage-desc'>{this.displayDesc(product_info.desc)}</div>
	  				</div>
	  			</div>
	  			<div id="productpage-recommend-box">
	  			  <h2 style={{color: 'var(--dark-text)'}}>Other Hot Products</h2>
	  			  <div style={{display: 'flex'}}>
		  			  {recommend.map((item, index) =>{
		            if (item) {
		              const { id, name, price, image } = item;
		              return (
		                <ProductR key={index} name={name} price={price} img={image} pid={id}/>
		              )
		            }else {
		              return null;
		            }
		          })}
	          </div>
	  			</div>
	  			<div id="displayDescPhotos">
	  				<div className='productpage-big-title'>PRODUCT GALLERY</div>
	  				{this.displayPhotos(product_info.descPhotos)}
	  			</div>
	  		</div>
	  		<div id='productpage-review-container'>
	  			<hr/>
	  			<div className='productpage-big-title'>Reviews</div>
	  			{review_list.map((item, index) =>{
	  				const { username, reviewtime, star, text, image } = item;
	  				return(<div key={index + 4}>
	  					<div className='productpage-review-title'><span>{username}</span><span> Reviewed at </span><span>{new Date(reviewtime).toLocaleString()}</span></div>
	  					<StarRatings rating={parseInt(star)} starDimension="20px" starSpacing="0px" starRatedColor='rgb(109, 122, 130)'	starEmptyColor='rgb(203, 211, 227)' />
	  					<div>{text}</div>
	  					<div className='productpage-review-image'>{this.displayPhotos(image)}</div>
	  				</div>)
	  			})}
	  		</div>
			</div>
		)
	}
}