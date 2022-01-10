import { Component, ChangeEvent } from 'react';
import { Product } from '../product';
import axios from 'axios';
import './index.scss';

export class Search extends Component {
  state = {
    searchKeyword: '',
    searchCate1: '',
    searchCate2: '',
    searchCate3: '',
    searchBrand: '',
    page: '',
    page_input: null,
    page_count: 1,
    searchSort: '',
    searchResult: []
  }

  componentDidMount = () => {
    const searchKeyword = window.localStorage.getItem('search-keyword');
    const searchCate1 = window.localStorage.getItem('search-cate1');
    const searchCate2 = window.localStorage.getItem('search-cate2');
    const searchCate3 = window.localStorage.getItem('search-cate3');
    this.setState({
      searchKeyword,
      searchCate1,
      searchCate2,
      searchCate3,
      page: 1,
      searchSort: "sales+desc",
    })

  }

  componentDidUpdate = (_prevProps: any, prevState: any) => {
    if(prevState.searchKeyword !== this.state.searchKeyword ||
      prevState.searchCate1 !== this.state.searchCate1 ||
      prevState.searchCate2 !== this.state.searchCate2 ||
      prevState.searchCate3 !== this.state.searchCate3 ||
      prevState.searchBrand !== this.state.searchBrand ||
      prevState.searchSort !== this.state.searchSort ||
      prevState.page !== this.state.page){
      const token = window.localStorage.getItem('token');
      let param = new URLSearchParams();
      if(this.state.searchKeyword !== ''){
        param.append('keywords', this.state.searchKeyword);
      }
      if(this.state.searchCate1 !== ''){
        let cate = this.state.searchCate1;
        if(this.state.searchCate2 !== ''){
          cate += ( '+' + this.state.searchCate2);
        }
        if(this.state.searchCate3 !== ''){
          cate += ('+' + this.state.searchCate3);
        }
        param.append('cate', cate);
        console.log(cate)
      }
      param.append('sort', this.state.searchSort);
      param.append('page', String(this.state.page));
      if(this.state.searchBrand !== ''){
        param.append('brand', this.state.searchBrand);
      }
      axios(
        {
          url:'/api1/search/',
          method: 'GET',
          params: param,
          headers: {'Authorization': token as string}
        }
      ).then(
        response => {
            // @ts-ignore
          if(response.data.code === 0){
            
            console.log('success', response.data)
            this.setState({
              page_count: response.data["total_page"],
              searchResult: response.data["product_info"],
            });
          }else{
            console.log('fail', response.data)
            this.setState({
              page_count: 1,
              searchResult: [],
            });
          }},
        error => {
          console.log('search fail',error);
        }
      )
    }
  }

  cateEnable = (props: any) => {
    if(props){return false}else{return true}
  }


  handleCategory1Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const searchCate1 = e.target.value;
    // @ts-ignore
    document.getElementById('searchCate2').value = "placeholder";
    // @ts-ignore
    document.getElementById('searchCate3').value = "placeholder";
    // @ts-ignore
    document.getElementById('searchCate3').disabled = true;
    this.setState({searchCate1, searchCate2:'', searchCate3:''});

  }
  handleCategory2Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const searchCate2 = e.target.value;
    // @ts-ignore
    document.getElementById('searchCate3').value = "placeholder";
    this.setState({searchCate2, searchCate3:''});
  }
  handleCategory3Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const searchCate3 = e.target.value;
    this.setState({searchCate3});
  }

  handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    const searchSort = e.target.value;
    this.setState({searchSort});
  }

  cate1Default = () => {
    if(this.state.searchCate1 === ''){return "placeholder"}
      else{return this.state.searchCate1}
  }

  cate2Default = () => {
    if(this.state.searchCate2 === ''){return "placeholder"}
      else{return this.state.searchCate2}
  }

  cate3Default = () => {
    if(this.state.searchCate3 === ''){return "placeholder"}
      else{return this.state.searchCate3}
  }

  cate2options = (cate1: string) => {
    if(cate1 === "kids" ){
      return(<>
        <option value="clothing">clothing</option>
        <option value="shoes">shoes</option>
        <option value="accessories">accessories</option>
      </>)
    }
    else{
      return(<>
        <option value="clothing">clothing</option>
        <option value="shoes">shoes</option>
        <option value="bags">bags</option>
      </>)
    }
  }

  cate3options = (cate1: string, cate2: string) => {
    if(cate1 === "man" ){
      if(cate2 === 'clothing'){
        return(<><option value="shirts">shirts</option>
          <option value="coats">coats</option>
          <option value="pants">pants</option></>)
      }else if(cate2 === 'shoes'){
        return(<><option value="boots">boots</option>
          <option value="oxfords">oxfords</option>
          <option value="sneakers">sneakers</option></>)
      }else if(cate2 === 'bags'){
        return(<><option value="backpack">backpack</option>
          <option value="shoulder-bags">shoulder-bags</option>
          <option value="wallets">wallets</option></>)
      }
    }else if(cate1 === "woman"){
      if(cate2 === 'clothing'){
        return(<><option value="skirt">skirt</option>
          <option value="coats">coat</option>
          <option value="pants">pants</option></>)
      }else if(cate2 === 'shoes'){
        return(<><option value="boots">boots</option>
          <option value="pumps">pumps</option>
          <option value="sneakers">sneakers</option></>)
      }else if(cate2 === 'bags'){
        return(<><option value="clutch-bags">clutch-bags</option>
          <option value="shoulder-bags">shoulder-bags</option>
          <option value="wallets">wallets</option></>)
      }
    }else if(cate1 === "kids"){
      if(cate2 === 'clothing'){
        return(<><option value="shirt">shirt</option>
          <option value="coat">coat</option>
          <option value="pants">pants</option></>)
      }else if(cate2 === 'shoes'){
        return(<><option value="boots">boots</option>
          <option value="sandals">sandals</option>
          <option value="athletic_shoes">athletic shoes</option></>)
      }else if(cate2 === 'accessories'){
        return(<><option value="hat">hat</option>
          <option value="sunglasses">sunglasses</option>
          <option value="bag">bag</option></>)
      }
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
    const {searchKeyword, searchCate1, searchCate2, searchCate3, searchResult, searchSort, page_count} = this.state;
    console.log(typeof searchCate1)
    const searchCate1display = (searchCate1 === 'man') ? 'men' : ((searchCate1 === 'woman') ? 'women' : searchCate1)
    console.log(typeof searchCate1display, searchCate1display)
    return (
      <div className='search-container'>
        <div className='search-left-panel'>
          <div>Category Filter:</div>
          <span>Together with keyword search</span><br/><br/>
          <label htmlFor="category1">Category1: </label>
            <select onChange={this.handleCategory1Input}  value={this.cate1Default()} id="searchCate1" name="searchCate1">
              <option disabled value="placeholder"> -- select an option -- </option>
              <option value="woman">women</option>
              <option value="man">men</option>
              <option value="kids">kids</option>
            </select>
            <label htmlFor="category2">Category2: </label>
            <select onChange={this.handleCategory2Input} id="searchCate2" name="searchCate2" value={this.cate2Default()} disabled={this.cateEnable(searchCate1)}>
              <option disabled value="placeholder"> -- select an option -- </option>
              {this.cate2options(searchCate1)}
            </select>
            <label htmlFor="category3">Category3: </label>
            <select onChange={this.handleCategory3Input} id="searchCate3" name="searchCate3" value={this.cate3Default()} disabled={this.cateEnable(searchCate2)}>
              <option disabled value="placeholder"> -- select an option -- </option>
              {this.cate3options(searchCate1, searchCate2)}
            </select>

          <div>Brand Filter:</div>
          <input type="text" onChange={this.handleNormalInput} id="searchBrand" name="searchBrand"/>

        </div>
        <div className='search-container-right'>
          <div className='search-container-header'>
            <div style={{width: '100%'}}>
              <p style={{fontSize: 'large'}}>{`Current search keywords:  ${searchKeyword}`}</p>
              <p style={{fontSize: 'large'}}>{`Current search category:  ${searchCate1display} ${searchCate2} ${searchCate3}`}</p>
            </div>
            <div>
              <select onChange={this.handleSort} id="searchSort" name="searchSort" value={searchSort}>
                <option value="sales+desc">Sort by Best sellers</option>
                <option value="time+desc">Sort by What's new</option>
                <option value="price+desc">Price: High to Low</option>
                <option value="price+asc">Price: Low to High</option>
              </select>
            </div>
          </div>
          <div className='search-container-body'>
            {searchResult.map((item, index) => {
              const {pk, name, price, image } = item ; 
              return (
                <Product key={index} name={name} price={price} img={image} pid={pk}/>
              )
            })}
          </div>
          <div className='pageindex-box'>
            <input type="number" className="pageindex-input" onChange= {this.handleNormalInput} name="page_input" min={1} defaultValue={1}/>&nbsp;/&nbsp;{page_count}
            <button onClick = {this.handlePageChange}>Go</button>
          </div>
        </div>
      </div>
    )
  }
}
