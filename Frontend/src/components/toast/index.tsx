import { Component } from 'react'
import ReactDOM from 'react-dom';
import './index.scss';

interface ToastProps {
  toastContent: string;
}

class Toast extends Component<ToastProps> {
  render() {
    const {toastContent} = this.props;
    return (
      <div className='toast-container'>
        {toastContent}
      </div>
    )
  }
}

export function toast(content: string) {
  const oldToast = document.getElementById('toast');
  if (oldToast) {
    return;
  }
  const toastRoot = document.createElement('div');
  toastRoot.id = 'toast';
  document.body.appendChild(toastRoot);
  ReactDOM.render(<Toast toastContent={content}/>, toastRoot);
  setTimeout(()=>{
    document.body.removeChild(toastRoot);
  },2000);
}
