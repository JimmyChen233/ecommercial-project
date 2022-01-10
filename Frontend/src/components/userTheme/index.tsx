import axios from 'axios';
import { Component } from 'react';
import './index.scss';

export class UserTheme extends Component {
	themeLight = () => {
		window.localStorage.setItem('theme', 'default');
		const token = window.localStorage.getItem('token');
		let param = new URLSearchParams();
		param.append('theme', 'default');
		axios(
		{
			url:'/api1/user/theme',
			method: 'POST',
			data: param,
			headers: {'Authorization': token as string}
		}).then((response)=>{console.log(response); window.location.reload();})
	}

	themeDark = () => {
		window.localStorage.setItem('theme', 'dark');
		const token = window.localStorage.getItem('token');
		let param = new URLSearchParams();
		param.append('theme', 'dark');
		axios(
		{
			url:'/api1/user/theme',
			method: 'POST',
			data: param,
			headers: {'Authorization': token as string}
		}).then((response)=>{console.log(response); window.location.reload();})
	}

	themeBlack = () => {
		window.localStorage.setItem('theme', 'black');
		const token = window.localStorage.getItem('token');
		let param = new URLSearchParams();
		param.append('theme', 'black'); 
		axios(
		{
			url:'/api1/user/theme',
			method: 'POST',
			data: param,
			headers: {'Authorization': token as string}
		}).then((response)=>{console.log(response); window.location.reload();})
	}

	render(){
		return(<div className='user-theme-container'>
			<div className='user-theme-box'>
				<img src='../../light-theme.jpg' alt='light-theme'/>
				<p>Default theme</p>
				<button onClick={this.themeLight}>Try this</button>
			</div>
			<hr/>
			<div className='user-theme-box'>
				<img src='../../dark-theme.jpg' alt='dark-theme'/>
				<p>Dark mode</p>
				<button onClick={this.themeDark}>Try this</button>
			</div>
			<hr/>
			<div className='user-theme-box'>
				<img src='../../black-theme.jpg' alt='black-theme'/>
				<p>Black-white world</p>
				<button onClick={this.themeBlack}>Try this</button>
			</div>
		</div>)
	}
}