import axios from 'axios';
import { Component, ChangeEvent } from 'react';
import '../order.scss';



interface OrderStructure {
  oid: number,
  orderDate: string,
  totalprice: number,
  status: number,
}


class OrderCard extends Component<OrderStructure> {
  handleViewClick = (oid: number) => {  
    window.localStorage.setItem('curr-order', String(oid));
    window.location.assign('/user/orders/detail');
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

  render() {
    const {oid, orderDate, totalprice, status} = this.props;
    return (
      <div className='order-card-container' key={oid}>
        <div className='order-card-cell order-cells-long order-cells-smallfont'>{`${oid}`}</div>
        <div className='order-card-cell order-cells-long order-cells-smallfont'>{`${new Date(orderDate).toLocaleString()}`}</div>
        <div className='order-card-cell order-cells-short'>{`${totalprice}`}</div>
        <div className='order-card-cell order-cells-short'>{this.stateTranslate(status)}</div>
        <button className='order-button order-cells-short' onClick={()=>this.handleViewClick(oid)}>View Detail</button>
      </div>
    )
  }
}


export class UserOrderList extends Component {
  state = {
    page: null,
    page_input: null,
    order_list: [],
    page_count: null,
  }

  componentDidMount = () => {
    this.setState({page: 1})
  }

  componentDidUpdate = (_prevProps: any, prevState: any) => {
    console.log(prevState.page, this.state.page)
    if(prevState.page !== this.state.page)
    {
      const token = window.localStorage.getItem('token');
      let param = new URLSearchParams();
      param.append('page', String(this.state.page));
      axios(
        {
          url:'/api1/user/order',
          method: 'GET',
          params: param,
          headers: {'Authorization': token as string}
        }
      ).then(
        response => {
          console.log('order success',response.data);
          this.setState({
            order_list: response.data["order_list"],
            page_count: response.data["page_count"]});
        },
        error => {
          console.log('order fail',error);
        }
      )
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

  render() {
    const {order_list, page_count} = this.state;
    return (
      <div className='order-list-container'>
        <div className='order-list-title'>
          <div className='order-list-title-cell order-cells-long'>Order Id</div>
          <div className='order-list-title-cell order-cells-long'>Order Date</div>
          <div className='order-list-title-cell order-cells-short'>Total Price</div>
          <div className='order-list-title-cell order-cells-short'>Status</div>
          <div className='order-cells-short'></div>
        </div>
        {order_list.map((item, index)=>{
          const {oid, orderDate, totalprice, status} = item as OrderStructure;
          return (
            <OrderCard key={index} oid={oid} orderDate={orderDate} totalprice={totalprice} status={status}/>
          )
          })
        }
        <div className='pageindex-box'>
          <input type="number" className="pageindex-input" onChange= {this.handleNormalInput} name="page_input" min={1} defaultValue={1}/>&nbsp;/&nbsp;{page_count}&nbsp;&nbsp;
          <button onClick = {this.handlePageChange}>Go</button>
        </div>
      </div>
    )
  }
}