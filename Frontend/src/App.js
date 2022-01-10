import { HomePage } from './pages/homepage';
import { BrowserRouter,Route, Switch } from 'react-router-dom';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Admin_panel } from './pages/adminpanel';
import { User_panel } from './pages/userpanel';
import { Product_page } from './pages/productpage';
import { Cart } from './pages/cart';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login}></Route>
        <Route exact path='/register' component={Register}></Route>
        <Route exact path="/user/cart" component={Cart}></Route>
        <Route path="/admin" component={Admin_panel}></Route>
        <Route path='/user' component={User_panel}></Route>
        <Route exact path='/product/details' component={Product_page}></Route>
        <Route exact path='/*' component={HomePage}></Route>
      </Switch>

    </BrowserRouter>
  );
}

export default App;
