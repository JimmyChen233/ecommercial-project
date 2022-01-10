import { Component } from "react";
import './index.scss';

interface TabProps {
  tabName: string;
}

export class Tab extends Component<TabProps> {
  state = {display: false}

  tabJump = (cate1: string, cate2: string, cate3: string) => {   
    if(cate2 === ''){
      window.localStorage.setItem('search-keyword', '');
      window.localStorage.setItem('search-cate1', cate1);
      window.localStorage.setItem('search-cate2', '');
      window.localStorage.setItem('search-cate3', '');
      window.location.assign('/search');
    }else if(cate3 === ''){
      window.localStorage.setItem('search-keyword', '');
      window.localStorage.setItem('search-cate1', cate1);
      window.localStorage.setItem('search-cate2', cate2);
      window.localStorage.setItem('search-cate3', '');
      window.location.assign('/search');
    }else{
      window.localStorage.setItem('search-keyword', '');
      window.localStorage.setItem('search-cate1', cate1);
      window.localStorage.setItem('search-cate2', cate2);
      window.localStorage.setItem('search-cate3', cate3);
      window.location.assign('/search');
    }
  }

  tabMainOptions = (tabName: string) => {
    if(tabName === 'Women'){
      this.tabJump('woman', '', '')
    }else if(tabName === 'Men'){
      this.tabJump('man', '', '')
    }else{
      this.tabJump('kids', '', '')
    }
  }

  tabSelectOptions = () => {
    let cate1 = 'woman'
    if(this.props.tabName === 'Women'){
      cate1 = 'woman';
      return(
        <div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'clothing', '')}}>Clothing</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'skirt')}}>Skirt</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'coats')}}>Coat</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'pants')}}>Pants</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'shoes', '')}}>Shoes</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'boots')}}>Boots</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'pumps')}}>Pumps</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'sneakers')}}>Sneakers</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'bags', '')}}>Bags</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'clutch-bags')}}>Clutch Bags</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'shoulder-bags')}}>Shoulder Bags</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'wallets')}}>Wallets</div>
        </div>)
    }
    else if(this.props.tabName === 'Men'){
      cate1 = 'man'
      return(
        <div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'clothing', '')}}>Clothing</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'shirts')}}>Shirt</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'coats')}}>Coat</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'pants')}}>Pants</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'shoes', '')}}>Shoes</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'boots')}}>Boots</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'oxfords')}}>Oxfords</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'sneakers')}}>Sneakers</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'bags', '')}}>Bags</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'backpack')}}>Backpack</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'shoulder-bags')}}>Shoulder Bags</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'bags', 'wallets')}}>Wallets</div>
        </div>)
    }
    else if(this.props.tabName === 'Kids'){
      cate1 = 'kids'
      return(
        <div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'clothing', '')}}>Clothing</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'shirt')}}>Shirt</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'coat')}}>Coat</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'clothing', 'pants')}}>Pants</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'shoes', '')}}>Shoes</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'boots')}}>Boots</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'sandals')}}>Sandals</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'shoes', 'athletic_shoes')}}>Athletic shoes</div>
          <div className='tab-title-text' onClick={()=>{this.tabJump(cate1, 'accessories', '')}}>Accessories</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'accessories', 'hat')}}>Hat</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'accessories', 'sunglasses')}}>Sunglasses</div>
          <div className='tab-title-text cate3-option' onClick={()=>{this.tabJump(cate1, 'accessories', 'bag')}}>Bag</div>
        </div>)
    }
  }

  render() {
    const { tabName } = this.props;
    const display_on = this.state.display ? "tab-dropdown" : "tab-dropdown tab-dropdown-off" 
    return (
      <div className='tab-item' onMouseEnter={() => this.setState({display: true})} onMouseLeave={() => this.setState({display: false})}>
        <div className='tab-title-text' onClick={()=>{this.tabMainOptions(tabName)}}>{tabName}</div>
        <div className={display_on}>{this.tabSelectOptions()}</div>
      </div>
    )
  }
}