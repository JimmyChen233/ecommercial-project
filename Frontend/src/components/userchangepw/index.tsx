import { Component, ChangeEvent } from 'react';
import axios from 'axios';

export class UserChangePW extends Component {
	state = {
		toast: false,
		oldpw: '',
		newpw1: '',
		newpw2: '',
		nonempty: false,
		oldpwcorrect: false,
		newpwmatch: false,
		change: false
    }

	handleOldpwInput = (e: ChangeEvent<HTMLInputElement>) => {
		const oldpw = e.target.value;
		this.setState({oldpw});
	}

  handleNewpwInput1 = (e: ChangeEvent<HTMLInputElement>) => {
    const newpw1 = e.target.value;
    this.setState({newpw1});
  }

  handleNewpwInput2 = (e: ChangeEvent<HTMLInputElement>) => {
    const newpw2 = e.target.value;
    this.setState({newpw2});
  }

  

  handleChangepwClick = () => {
    const { oldpw, newpw1, newpw2} = this.state;
    if(newpw1 === "" || newpw2 === ""){
      this.setState({
        toast: true,
        nonempty: false
      });
        setTimeout(()=>{
          this.setState({toast: false});
        },1000)
        return; 
    } else if(oldpw !== window.localStorage.getItem('password')){
      this.setState({
        toast: true,
        nonempty: true,
        oldpwcorrect: false
      });
      setTimeout(()=>{
        this.setState({toast: false});
      },1000)
      return;
    } else if(newpw1 !== newpw2){
      this.setState({
        toast: true,
        nonempty: true,
        oldpwcorrect: true,
        newpwmatch: false,
        change: false
      });
      setTimeout(()=>{
        this.setState({toast: false});
      },1000)
      return;
    }
    let param = new URLSearchParams();
    console.log(param);
    param.append('password', newpw1);
    console.log(param);
    const token = window.localStorage.getItem('token');
    axios(
      {
        url:'/api1/user/account/changepass',
        method: 'post',
        data: param,
        headers: {'Authorization': token as string}
      }
    ).then(

      response => {
        console.log('success',response.data);
        const { code } = response.data;
        if (code === 0) {
          window.localStorage.setItem('password',newpw1);
          window.localStorage.setItem('user','user');
          this.setState({
            change: true,
            toast: true
          });
          setTimeout(()=>{
            this.setState({toast: false});
            window.location.assign('/');
          },2000)
        }
      },
      error => {
        console.log('fail',error);
        this.setState({
          change: false,
          toast: true
        });
        setTimeout(()=>{
          this.setState({toast: false});
        },1000)
      }
    )
  }

	render(){
		const {toast, change} = this.state;
		return(
			<div className='userpanel-change-pw'>
              <div className='userpanel-password-box'>Old Password: <input id='oldpassword' onChange={this.handleOldpwInput}/></div>
              <div className='userpanel-password-box'>New Password: <input id='newpw1' onChange={this.handleNewpwInput1}/></div>
              <div className='userpanel-password-box'>Repeat New Password: <input id='newpw2' onChange={this.handleNewpwInput2}/></div>
              <button type="submit" onClick={this.handleChangepwClick} style={{marginLeft: '1vw'}}>Submit</button>
              <div className={toast ? 'toast-success' : 'toast-none'}>
                {change ? 'Change password successfully' : 'Change password failed'}

              </div>
            </div>
		)
	}
}