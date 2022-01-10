import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />,document.getElementById('root'));
//document.getElementById('root').className = 'theme-dark';
//document.getElementById('root').className = 'theme-light';
const theme = window.localStorage.getItem('theme');
if(theme === 'dark'){
	document.getElementById('root').className = 'theme-dark';
}else if(theme === 'black'){
	document.getElementById('root').className = 'theme-black';
}else{
	document.getElementById('root').className = 'theme-light';
}