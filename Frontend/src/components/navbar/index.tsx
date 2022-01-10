import { Component } from "react";
import { Tab } from "../tab";
import './index.scss';

export class NavBar extends Component {
  JumpToExplore = () => {
    window.location.assign('/browse');
  }

  render() {
    return (
      <div className='navbar-container'>
        <button className='navbar-button' onClick={this.JumpToExplore}>Explore</button>  
        <Tab tabName='Women'/>
        <Tab tabName='Men'/>
        <Tab tabName='Kids'/>
      </div>
    )
  }
}