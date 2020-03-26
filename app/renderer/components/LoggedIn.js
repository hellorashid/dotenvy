import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import ProjectsView from './ProjectsView.js'

import SimpleBar from 'simplebar-react';

const Store = require('electron-store');
const store = new Store();


// import 'simplebar/dist/simplebar.min.css';

export default class LoggedIn extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
  };

  constructor(props) { 
    super(props)
    this.state = { 
      folder: '', 
      currentUser: {}, 
      currentUid: undefined
    }
  }

  componentDidMount = () => { 
    firebase.auth().onAuthStateChanged(user => { 
      if (user) { 
        console.log('Auth:', user)
        this.setState({currentUid: user.uid})
        this.setupUserSnapshot(user.uid, user.email)
      }
    });
  }

  setupUserSnapshot = async (uid, email) => { 
    const exists = await this.checkIfUserExists(uid)

    if (exists) { 
      this.createUserSnapshot(uid)
    } else { 
      await this.createUser(uid,email)
      await this.createUserSnapshot(uid)
    }
  }

  createUserSnapshot = async (uid) => { 
    console.log('Creating Snapshot...')
    return firebase.firestore().collection('users').doc(uid)
    .onSnapshot((doc) => { 
      console.log('Updated Snapshot ... ')
      this.setState({
        currentUser: doc.data()
      })
    })
  }

  checkIfUserExists = async (uid) => { 
    const docRef = firebase.firestore().collection('users').doc(uid)
    return docRef.get()
      .then(doc => doc.exists)
      .catch( e => console.log('checkIfUserExists:', e))
  } 

  createUser = async (uid, email) => {
    return firebase.firestore().collection('users').doc(uid).set({
      email: email, 
      team: '', 
      firstName: '', 
      lastName: '', 
      profileUrl: '', 
      projects: []
    }).then(()=>{ 
      console.log('User profile created!')
    }).catch (e => { 
      console.log('Error creating user',e)
    })
  }

  handleLogout = () => {
    firebase.auth().signOut().then(()=> {
      this.props.onLogout({
        username: '',
        loggedIn: false,
      })
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    return (
      <div style={{backgroundColor: '#001D2D', height: '100vh', margin: 0, overflow: 'hidden'}} >
      <TitleBar app="dotEnvy Beta" icon='../../dist-assets/icon.png'/>
        
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10}}> 
        <img onClick={this.handleLogout} src="https://img.icons8.com/ios-filled/24/000000/logout-rounded-left.png" style={{width: 30, height: 30}}></img>
        <img src={'https://api.adorable.io/avatars/400/69b794e37ce183bb7018e105e937749b.png'} style={{width: 40, height: 40, borderRadius: 25, marginLeft: 10}}/>
      </div>

      <AppView />

      </div>
    );
  };
}

class AppView extends React.Component {
  constructor(props) { 
    super(props)
    this.state = { 
      projects : [], 
      loading: true
    }
  }

  componentDidMount = () => { 
    this.getProjects()
  }

  getProjects = () => { 
    console.log('projects')
    let projects = store.get('projects')
    if (projects) { 
      this.setState({projects, loading: false})
    } else { 
      this.setState({loading: false})
    }
  }

 

  render() { 
  const {projects, loading} = this.state
  return ( 
    <div>
      <div style={{position: 'absolute', left: 10, color: '#efefef'}}>
        <h3>Projects</h3>
        { !loading && 
          <React.Fragment>
            { projects.length == 0 && 
                <div> No Projects...</div> 
            }
          </React.Fragment>
        }
      </div>
    
      <div style={{
          padding: 10, backgroundColor: '#173140', width: '80%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          overflowY: 'scroll', 
          position: 'absolute', right: 0, height: '80%', 
          borderTopLeftRadius: 20, borderBottomLeftRadius: 20, 
          
        }}>

        {/*
        { this.state.currentUid != undefined && 
          <ProjectsView user={this.state.currentUser} uid={this.state.currentUid}/>
        } 
        */}
      </div>
    </div>
  )} 
} 




