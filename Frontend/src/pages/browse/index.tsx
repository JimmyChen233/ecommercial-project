import { Component } from 'react'
import axios from 'axios';
import './index.scss';

export default class Browse extends Component {
  state = {
    products: []
  }

  componentDidMount = () => {
    const token = window.localStorage.getItem('token');

    axios(
      {
        url:'/api1/browse',
        method: 'get',
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        // @ts-ignore
        const { data } = response;
        // @ts-ignore
        this.setState({products: data.itemlist})
        // @ts-ignore
        console.log('browse success', data.itemlist);
      },
      error => {
        console.log('browse failed', error);
      }
    )
  }

  jumpToDetail = (e: any) => {
    window.localStorage.setItem('curr-product', e.target.id);
    window.location.assign('/product/details#pid=' + e.target.id);
  }


  render() {
    const { products } = this.state;
    return (
      <div className="browse-container">
        {
          products.length !== 0 && products.map((item, index) => {
            return (
              <div key={index}>
                <img className='browse-container-image' onClick={this.jumpToDetail} src={item['image']} id={item['prodID']} alt='browse'></img>
              </div>
            )
          })
        }
      </div>
    )
  }
}
