import { Component, ChangeEvent } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

export class Product_manage extends Component {
  state = {
    page: null,
    page_input: null,
    product_info: [],
    page_count: null,
  };

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
          url:'/api1/admin/products',
          method: 'GET',
          params: param,
          headers: {'Authorization': token as string},
        }
      ).then(
        response => {
          console.log(response.data);
          const { total_page, product_info } = response.data;
          this.setState({page_count: total_page, product_info});
        },
        error => {
          console.log('network fail',error);
        }
      )
    }
  }

  handleClick = (pk: string) => {
    return () => {
      window.localStorage.setItem('curr_item', pk);
      window.location.assign('/admin/product/detail');
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


  render(){
    const { page_count, product_info } = this.state;
    return(
      <div style={{flex:4,paddingTop:'30px', paddingBottom: '30px'}}>
        <div style={{margin: '0 0 30px 0', cursor: 'pointer'}}><Link to="/admin/product/create"><button style={{height: '30px', width: '300px'}}>Create new product</button></Link></div>
        <div className='admin-product-list'>
          {product_info && product_info.map((item, index) =>{
            const { pk, name, price, image, inventory, sales, is_delete } = item;
            return (
              <div className='admin-product-box' key={index}>
                <div style={{flex:1}}><img className='product-img' src={image} alt=''/></div>
                <div style={{flex:5, paddingLeft:'20px'}}>
                  Product name: {name}{'\n'}Product price: {price}{'\n'}
                  Product inventory: {inventory}{'\n'}Product sales: {sales}{'\n'}
                  Product status: {is_delete ? 'Closed' : 'Public'}{'\n'}
                  <button onClick={this.handleClick(pk)}>Edit</button>
                </div>
              </div>  
            )

          })}
        </div>
        <div className='pageindex-box'>
          <input type="number" className="pageindex-input" onChange= {this.handleNormalInput} name="page_input" min={1} defaultValue={1}/>&nbsp;/&nbsp;{page_count}&nbsp;&nbsp;
          <button onClick = {this.handlePageChange}>Go</button>
        </div>
      </div>
    )
  }
}