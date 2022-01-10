import axios from 'axios';
import { Component, ChangeEvent } from 'react';
import '../order.scss';

export class UserHistory extends Component {
	state = {
		page: null,
		page_input: null,
		product_list: [],
		page_count: null,
	}

	componentDidMount = () => {
		this.setState({page: 1})
	}

	componentDidUpdate = (_prevProps: any, prevState: any) => {
		if(prevState.page !== this.state.page){
			const token = window.localStorage.getItem('token');
	      	let param = new URLSearchParams();
	      	param.append('page', String(this.state.page));
	      	axios(
	        {
				url:'/api1/user/history',
				method: 'GET',
				params: param,
				headers: {'Authorization': token as string}
	        }).then(response => {
	        	console.log(response.data)
	        	const { brow_hist_info, total_page } = response.data;
	        	this.setState({product_list: brow_hist_info, page_count: total_page})
	        })
		}
	}

	handleNormalInput = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		this.setState({[target.name]: target.value});
	}

	handlePageChange = () => {
		// @ts-ignore
		if(this.state.page_input <= this.state.page_count){
			this.setState({page: this.state.page_input})
		}else{
			this.setState({page: this.state.page_count})
		}
	}

	jumpToDetail = (e: any) => {
		window.localStorage.setItem('curr-product', e.target.id);
		window.location.assign('/product/details');
	}

	render() {
		const { product_list, page_count } = this.state;
		return(
			<div className='order-list-container'>
				<div>
				{
					product_list?.map((item, index) =>{
						const { name, price, image, pk, browse_time } = item;
						return(
							<div className='order-product-container' key={index}>
								<div className='order-product-photo'><img src={image} alt='product'/></div>
								<div className='order-product-info'>
									<div id={pk} className='order-link' onClick={this.jumpToDetail}>{name}</div>
									<div>{`Browsed at ${new Date(browse_time).toLocaleString()}`}</div>
									<div>$AU {parseInt(price).toFixed(2)}</div>
								</div>
							</div>
						)

					})
				}
				</div>
				<div className='pageindex-box'>
					<input type="number" className="pageindex-input" onChange= {this.handleNormalInput} name="page_input" min={1} defaultValue={1}/>&nbsp;/&nbsp;{page_count}&nbsp;&nbsp;
					<button onClick = {this.handlePageChange}>Go</button>
				</div>
			</div>
		)
	}
}