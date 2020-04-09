import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import { Button, Box} from 'grommet';


export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  constructor(props){ 
    super(props)
    this.state = {
      username: '',
      email: '', 
      password: '',
    };
  }

  signInLocal = () => { 
    this.props.onLogin({
      username: 'local',
      loggedIn: true,
    });
  }

  handleLogin = () => {
    const {email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( res => { 
      console.log('Signed In', res)
      this.props.onLogin({
        username: email,
        loggedIn: true,
      });
    
    })
    .catch(function(error) {
      // Handle Errors here.
      console.log(error)
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });


  };

  handleCreateAccount = () => { 
    const {email, password} = this.state
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
        // ...
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <div style={{backgroundColor: '#001D2D', height: '100vh', margin: 0}} >
        <TitleBar app="dotEnvy - Beta"  icon='../../dist-assets/icon.png' />

        <div style={{
          padding: 10, backgroundColor: '#173140', margin: 50, 
          borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', 
          color: '#efefef', 
        }}> 
          <Box animation="fadeIn">
          <h1>Login</h1>

          <Button onClick={this.signInLocal} label="Use Locally" primary/>  

          {/* <p>Email</p>
          <TextInput onChange={this.handleChange} name="email" type="text" value={this.state.email} />
          <p>Password</p>
          <TextInput onChange={this.handleChange} name="password" type="text" value={this.state.password} />

          <p></p>
          <Button onClick={this.handleLogin}>Log In</Button> */}
          </Box>
          {/* <Button onClick={this.handleCreateAccount}>Create Account</Button> */}
        </div>
      </div>
    );
  }
}


// const Button = (props) => { 
//   return (
//     <button {...props}
//       style={{
//         padding: 10,
//         backgroundColor: '#efefef',
//         margin: 5,
//         borderWidth: 0, 
//         width: 200, 
//         borderRadius: 5,
//         ...props.style,
//         }}
//     >{props.children}</button>
//   )
// }

const TextInput = (props) => {
  return (
    <input {...props}
      style={{
        backgroundColor: '#efefef', 
        borderWidth: 0, 
        borderRadius: 5, 
        padding: 5, 
        outline: 'none', 
        ...props.style
      }} 
    />
  )
}