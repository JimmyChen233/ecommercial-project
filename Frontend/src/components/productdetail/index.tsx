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

export class Product_detail extends Component {

  state = {
    pk: 0,
    name: '',
    price: '',
    brand: '',
    desc: '',
    tag: '',
    
    color: '',
    size: '',
    inventory: 0,
    color_size_inventory: {},
    new_csi: {},
    mainPhoto: '',
    descPhotos: '',
    is_delete: '',
  }

  componentDidMount = () => {
    const token = window.localStorage.getItem('token');
    const curr_item = window.localStorage.getItem('curr_item');
    let param = new URLSearchParams();
    param.append('pid', curr_item as string);
    axios(
      {
        url:'/api1/admin/products/details',
        method: 'get',
        params: param,
        headers: {'Authorization': token as string},
      }
    ).then(
      response => {
        console.log(response.data);
        const { product_info } = response.data;
        const { pk, fields} = product_info[0];
        const { name, price, brand, desc, tag, color_inventory, image, desc_image, is_delete } = fields;
        const is_delete_string = is_delete ? '1' : '0';
        this.setState({pk, name, price, brand, desc, tag, color_size_inventory: color_inventory, mainPhoto: image, descPhotos: desc_image, is_delete: is_delete_string});
      },
      error => {
        console.log('fail',error);
      }
    )
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
        <label><br/>Existing Color-Size-Inventory Combination:</label>
        {
          p.map((csi, index) => (
            <div key={index}>
              <span>{csi[0]}-{csi[1]}-{csi[2]}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span> Change this inventory if you want: </span>
              <input type='number' value={csi[2]} onChange={event => {this.setState(prevState => {
                // @ts-ignore
                let old_csi = Object.assign({}, prevState.color_size_inventory);
                old_csi[csi[0]][csi[1]] = event.target.value;
                return old_csi;
              })}}/>
            </div>))
        }<br/>
      </div>)
  }

  newInventory = (props: Csi) => {
    let p = [];
    for(const color of Object.keys(props)){
      for(const size of Object.keys(props[color])){
        p.push([color, size, props[color][size]])
      }
    }
    return (
      <div>
        <label>New added Color-Size-Inventory Combination:</label>
        {
          p.map((csi, index) => (<div key={index}>{csi[0]}-{csi[1]}-{csi[2]}</div>))
        }
      </div>)
  }

  handleInventoryInput = () => {
    const {color, size, inventory, new_csi} = this.state;
    if(color === '' || size === '' || inventory === 0){
      toast('Forms cannot be empty');
      return;
    }
    const si = {};
    (si as Si)[size] = inventory;
    const csi = new_csi as Csi;
    if(csi[color] === undefined){csi[color] = si}
      else{csi[color][size] = inventory}
    this.setState({new_csi: csi})
  }


  handleNormalInput = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    this.setState({[target.name]: target.value});
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

  displayPhotos = (photos: string) => {
    if(photos == null){
      return(<div>Sorry, this product has no image</div>)
    }
    const photolist = photos.split(';;');
    return (<>{
          photolist.map((photo, index) => (<img alt='' src={photo} key={index}/>))
      }</>)
  }

  handleMainPhotoInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files != null){
      const file = e.target.files[0];
      if(file === undefined){
        return;
      }
      await this.fileToDataUrl(file).then((data)=>{this.setState({mainPhoto: data});})
    }
  }

  handleDescPhotosInput = async (e: ChangeEvent<HTMLInputElement>) => {
    let strings: any = null;
    if(e.target.files != null){
      const files = e.target.files;
      for (let i = 0; i < files.length; i++){
        // eslint-disable-next-line
        await this.fileToDataUrl(files[i]).then(data=>{
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
  }


  handleUpdate = () => {
    const { pk, name, price, brand, desc, tag, color_size_inventory, new_csi, mainPhoto, descPhotos, is_delete } = this.state;
    const token = window.localStorage.getItem('token');
    let param = new URLSearchParams();
    param.append('pid', String(pk));
    if(name)
    {param.append('name', name);}
    if(price)
    {param.append('price', price);}
    if(brand)
    {param.append('brand', brand);}
    if(desc)
    {param.append('desc', desc);}
    if(tag)
    {param.append('tag',tag);}
    param.append('color_size_inventory',JSON.stringify(color_size_inventory));
    if(Object.keys(new_csi).length > 0)
    {param.append('new_color_size_inventory',JSON.stringify(new_csi));}
    if(mainPhoto)
    {param.append('image', mainPhoto);}
    if(descPhotos)
    {param.append('desc_image', descPhotos);}
    // @ts-ignore
    if(is_delete === '0' || is_delete === '1' )
    {param.append('is_delete', is_delete);}
    axios(
      {
        url:'/api1/admin/products/update',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(
      response => {
        console.log('update success',response);
        window.location.assign('/admin/product/');
      },
      error => {
        console.log('update fail',error);
      }
    )
  }


  render() {
    const { is_delete, name, price, brand, desc, tag, color_size_inventory, new_csi, mainPhoto, descPhotos } = this.state;
    console.log(is_delete)
    return (
      <div style={{flex:4,borderLeft:'3px grey',marginLeft:'-3px',paddingTop:'30px',paddingLeft:'2%'}}>
        <div className='product-detail-input-list'>
          <label htmlFor="is_delete">Product status: </label>
          <select onChange={this.handleNormalInput} value={is_delete} id="is_delete" name="is_delete" required>
            <option value="1">Close</option>
            <option value="0">Open</option>
          </select>
          <label htmlFor="name">Product name: </label>
          <input type="text" onChange={this.handleNormalInput} id="name" name="name" value={name} required />
          <label htmlFor="price">Product price: </label>
          <input type="text" onChange={this.handleNormalInput} id="price" name="price" value={price} required/>
          <label htmlFor="brand">Product brand: </label>
          <input type="text" onChange={this.handleNormalInput} id="brand" name="brand" value={brand} required/>
          <label htmlFor="tag">Product tags: </label>
          <input type="text" onChange={this.handleNormalInput} id="tag" name="tag" value={tag} required/>
          <label htmlFor="desc">Product detail: </label>
          <textarea onChange={this.handleNormalInput} id="desc" name="desc" value={desc} required/>

          {this.addedInventory(color_size_inventory)}
          {this.newInventory(new_csi)}
          <br/>
          <label>Create new Color-Size-Inventory Combination (optional)</label>
          <div><span>Color: </span>
          <input type="text" onChange={this.handleNormalInput} id="color" name="color" required/></div>
          <div><span>Size: </span>
          <input type="text" onChange={this.handleNormalInput} id="size" name="size" required/></div>
          <div><span>Inventory: </span>
          <input type="number" onChange={this.handleNormalInput} id="inventory" name="inventory" required/></div>   
          <button onClick={this.handleInventoryInput}>Add</button>
          <br/>
          <br/>
          <label>Existing images:</label>
          <div>Main photo</div>
          <img src={mainPhoto} alt=''/>
          <div>Gallery photos</div>
          {this.displayPhotos(descPhotos)}
          <br/>
          <label>You could re-uploaded images here (optional)</label>
          <br/>
          <label htmlFor="mainPhoto">Product main photo: </label>
          <input type="file" onChange={this.handleMainPhotoInput} id="mainPhoto" name="mainPhoto" required/>
          <label htmlFor="descPhotos">Product gallery photo(s): </label>
          <input type="file" onChange={this.handleDescPhotosInput} id="descPhotos" name="descPhotos" multiple required/>

          <div className='product-detail-buttons'>
            <button onClick={this.handleUpdate}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}