import { Component } from 'react';
import './index.scss';

interface IProps{
  name: string;
  price: string;
  img: string;
  pid: string;
}

export class ProductR extends Component<IProps> {

  jumpToDetail = (e: any) => {
    window.localStorage.setItem('curr-product', e.target.parentNode.id);
    window.location.assign('/product/details#pid=' + e.target.parentNode.id);
  }
  
  render() {
    const { name, price, img, pid } = this.props;
    return (
      <div className='product-recommend' id={pid}>
        <img className='product-img' src={img} onClick={this.jumpToDetail} alt=''/>
        <div className='product-name' onClick={this.jumpToDetail}>{name}</div>
        <div className='product-price'>{`$${price}`}</div>
      </div>
    )
  }
}
