import { Component, ChangeEvent } from 'react';
import './index.scss';
import axios from 'axios';
import { toast } from "../toast";

interface Si{
  [key: string]: number;
}

interface Csi{
  [key: string]: Si
}

export class Product_create extends Component {
  state = {
    name: '',
    price: '',
    brand: '',
    desc: '',
    tag: '',
    category1: '',
    category2: '',
    category3: '',

    color: '',
    size: '',
    inventory: 0,
    color_size_inventory: {},
    mainPhoto: '',
    descPhotos: '',
  }

  fileToDataUrl = (file: any) =>{
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    if (!valid) {
        toast('provided file is not a png, jpg or jpeg image.');
        return Promise.resolve('')
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  }

  cate2enable = (props: any) => {
    if(props){return false}else{return true}
  }

  cate3enable = (props: any) => {
    if(props){return false}else{return true}
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
        return(<><option value="shirts">shirt</option>
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

  addedInventory = (props: Csi) => {
    let p = [];
    for(const color of Object.keys(props)){
      for(const size of Object.keys(props[color])){
        p.push([color, size, props[color][size]])
      }
    }
    return (
      <div>
        <div>Added Color-Size-Inventory Combination:</div>
        {
          p.map((csi, index) => (<div key={index}>{csi[0]}-{csi[1]}-{csi[2]}</div>))
        }
      </div>)
  }

  handleCategory1Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const category1 = e.target.value;
    // @ts-ignore
    document.getElementById('category2').value = "placeholder";
    // @ts-ignore
    document.getElementById('category3').value = "placeholder";
    // @ts-ignore
    document.getElementById('category3').disabled = true;
    this.setState({category1, category2: '', category3: ''});
  }

  handleCategory2Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const category2 = e.target.value;
    // @ts-ignore
    document.getElementById('category3').value = "placeholder";
    this.setState({category2, category3: ''});
  }
  handleCategory3Input = (e: ChangeEvent<HTMLSelectElement>) => {
    const category3 = e.target.value;
    this.setState({category3});
  }

  handleInventoryInput = () => {
    const {color, size, inventory, color_size_inventory} = this.state;
    if(color === '' || size === '' || inventory <= 0){
      toast('Forms cannot be empty');
      return;
    }
    const si = {};
    (si as Si)[size] = inventory;
    const csi = color_size_inventory as Csi;
    if(csi[color] === undefined){csi[color] = si}
      else{csi[color][size] = inventory}
    this.setState({color_size_inventory: csi})
  }

  handleMainPhotoInput = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files != null){
      const file = e.target.files[0];
      if(file === undefined){
        return;
      }
      this.fileToDataUrl(file).then((data)=>{this.setState({mainPhoto: data});})
    }
  }

  handleDescPhotosInput = (e: ChangeEvent<HTMLInputElement>) => {
    let strings: any = null;
    if(e.target.files != null){
      const files = e.target.files;
      for (let i = 0; i < files.length; i++){
        // eslint-disable-next-line
        this.fileToDataUrl(files[i]).then(data=>{
          if(strings === null){
            strings = data;
          }else{
            strings = strings + ';;' + data;
          }
          if(i === files.length - 1){
            this.setState({descPhotos: strings});
          }
        })
      }
    }
    const descPhotos = e.target.value;
    this.setState({descPhotos});
  }

  handleNormalInput = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    this.setState({[target.name]: target.value});
  }

  handleSubmit = () => {
    const { name, price, brand, desc, tag, category1, category2, category3, color_size_inventory, mainPhoto, descPhotos } = this.state;
    const token = window.localStorage.getItem('token');
    if(Object.keys(color_size_inventory).length === 0 || name === '' || price === '' || brand === '' || category3 === '' || mainPhoto === ''){
      toast('Forms cannot be empty');
      return;
    }
    let param = new URLSearchParams();
    param.append('name', name);
    param.append('price', price);
    param.append('brand', brand);
    param.append('description', desc);
    param.append('tag',tag);
    param.append('cate',category1 + '+' + category2 + '+' + category3);
    param.append('color_size_inventory',JSON.stringify(color_size_inventory));
    param.append('default_img',mainPhoto);
    param.append('desc_img',descPhotos);
    axios(
      {
        url:'/api1/admin/products/create',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        if(response.data['code'] === 0){
          toast('Create product successfully')
          setTimeout(()=>{window.location.assign('/admin/product/');}, 2000)
        }else{
          console.log(response)
        }
      },
      error => {
        console.log('fail',error);
      }
    )
  }

  render() {
    const {category1, category2, color_size_inventory} = this.state;
    return (
      <div style={{flex:4,borderLeft:'3px grey',marginLeft:'-3px',paddingTop:'30px',paddingLeft:'2%'}}>
        <div>
          <div className='product-create-input-list'>
            <label htmlFor="name">Product name: </label>
            <input type="text" onChange={this.handleNormalInput} id="name" name="name" required />
            <label htmlFor="price">Price: </label>
            <input type="text" onChange={this.handleNormalInput} id="price" name="price" required/>
            <label htmlFor="brand">Brand: </label>
            <input type="text" onChange={this.handleNormalInput} id="brand" name="brand" required/>
            <label htmlFor="desc">Description: </label>
            <textarea onChange={this.handleNormalInput} id="desc" name="desc" required/>
            <label htmlFor="tag">Tages: </label>
            <input type="text" onChange={this.handleNormalInput} id="tag" name="tag" required/>

            <br/>
            <label>Notice: You cannot change the category of product after created</label>
            <label htmlFor="category1">Category1: </label>
            <select onChange={this.handleCategory1Input}  defaultValue="placeholder" id="category1" name="category1" required>
              <option disabled value="placeholder"> -- select an option -- </option>
              <option value="woman">women</option>
              <option value="man">men</option>
              <option value="kids">kids</option>
            </select>
            <label htmlFor="category2">Category2: </label>
            <select onChange={this.handleCategory2Input} id="category2" name="category2" defaultValue="placeholder" disabled={this.cate2enable(category1)}required>
              <option disabled value="placeholder"> -- select an option -- </option>
              {this.cate2options(category1)}
            </select>
            <label htmlFor="category3">Category3: </label>
            <select onChange={this.handleCategory3Input} id="category3" name="category3" defaultValue="placeholder" disabled={this.cate3enable(category2)} required>
              <option disabled value="placeholder"> -- select an option -- </option>
              {this.cate3options(category1, category2)}
            </select>
            <br/>
            <label>Product inventory: </label>
            {this.addedInventory(color_size_inventory)}
            <br/>
            <div>New Color-Size-Inventory Combination</div>
            <div><span>Color: </span>
            <input type="text" onChange={this.handleNormalInput} id="color" name="color" required/></div>
            <div><span>Size: </span>
            <input type="text" onChange={this.handleNormalInput} id="size" name="size" required/></div>
            <div><span>Inventory: </span>
            <input type="number" onChange={this.handleNormalInput} id="inventory" name="inventory" required/></div>   
            <button onClick={this.handleInventoryInput}>Add</button>
            <br/>
            <label htmlFor="mainPhoto">Main photo: </label>
            <input type="file" onChange={this.handleMainPhotoInput} id="mainPhoto" name="mainPhoto" required/>
            <label htmlFor="mainPhoto">Gallery photos: </label>
            <input type="file" onChange={this.handleDescPhotosInput} id="descPhotos" name="descPhotos"  multiple required/>            
            <button onClick={this.handleSubmit}>Submit</button>

          </div>
        </div>
      </div>
    )
  }
}

