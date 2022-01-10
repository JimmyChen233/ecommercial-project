import React, { Component } from 'react';
import { Product } from '../product';
import { ProductR } from '../productR';
import axios from 'axios';
import './index.scss';

export interface ProductDetail{
  create_time: string,
  update_time: string,
  is_delete: boolean,
  name: string,
  price: string,
  sales: number,
  validdt: string,
  inventory: number,
  validity: number,
  desc: string,
  brand: string,
  size: string,
  imgurl: string
}

export interface ProductData{
  model: string,
  pk: number,
  fields: ProductDetail
}

export class Products extends Component {
  state = {
    recommend: [],
    data: [],
  };

  componentDidMount = () => {
    axios(
      {
        url:'/api1/homepage/',
        method: 'get'
      }
    ).then(
      response => {
        const { product_info } = response.data;
        this.setState({data: product_info});
        console.log('products success',product_info);
      },
      error => {
        console.log('network fail',error);
      }
    )
    const token = window.localStorage.getItem('token');
    if(token != null){
      axios(
        {
          url:'/api1/user/recommend',
          method: 'get',
          headers: {'Authorization': token as string},
        }
      ).then(
        response => {
          if(response.data['code'] === 0){
            const { messages } = response.data;
            this.setState({recommend: messages });
            console.log(response.data);
          }
        },
        error => {
          console.log('network fail',error);
        }
      )
    }
  }

  render() {
    const { recommend, data } = this.state;
    const recommend_word = (window.localStorage.getItem('token')) ? 'Recommended products for you:\n' : ''
    console.log(recommend)
    return (
      <div className='products-container'>
        <h3>{recommend_word}</h3>        
        <div className='products-recommend'>
          {recommend.map((item, index) => {
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
        <br/>
        <h3>Trends:</h3>
        <br/>
        <div className='products-normal'>
          {data.map((item, index) =>{
            if (item) {
              const { pk, name, price, image } = item;
              return (
                <Product key={index + 4} name={name} price={price} img={image} pid={pk}/>
              )
            }else {
              return null;
            }
          })}
        </div>
      </div>
    )
  }
}
