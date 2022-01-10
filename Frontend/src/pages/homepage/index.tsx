import React, {Component} from 'react';
import { NavBar } from '../../components/navbar';
import { Search } from '../../components/search';
import { TitleBar } from '../../components/titlebar';
import { Products } from '../../components/products';
import { Route, BrowserRouter } from 'react-router-dom';
import Browse from '../browse';

export class HomePage extends Component {
  render() {
    return (
      <div className='root-container'>
        <TitleBar />
        <NavBar/>
        <div>
          <BrowserRouter>
            <Route exact path='/'><Products/></Route>
            <Route exact path='/search'><Search/></Route>
            <Route exact path='/browse'><Browse/></Route>
          </BrowserRouter>
        </div>       
      </div>
    )
  }
}