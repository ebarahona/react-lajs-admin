import React, {Component} from 'react';

export default class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  handleLoginBtnClick = e => {
    e.preventDefault();
    this.props.getUserToken(this.state.email, this.state.password);
  };

  handleEmailInputChange = event => {
    this.setState({...this.state, email: event.target.value});
  };

  handlePasswordInputChange = event => {
    this.setState({...this.state, password: event.target.value});
  };

  render() {
    return (
      <section className='lgn'>
        <div className='login-box'>
          <div className='login-logo'>
            <b>LiveArt</b> Control Panel
          </div>
          <form type='submit' className='login-box-body'>
            <p className='login-box-msg'>Sign In</p>
            <div className='form-group has-feedback'>
              <p>Email:</p>
              <input className='form-control' type='email' value={this.state.email}
                     onChange={this.handleEmailInputChange}/>
            </div>
            <div className='form-group has-feedback'>
              <p>Password:</p>
              <input className='form-control' type='password' value={this.state.password}
                     onChange={this.handlePasswordInputChange}/>
            </div>
            <div className='row'>
              <div className='col-xs-8'>
              </div>
              <div className='col-xs-4'>
                <button className='btn btn-primary btn-block btn-flat' onClick={this.handleLoginBtnClick}>
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
