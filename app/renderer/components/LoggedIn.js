import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import SingleProject from './SingleProject.js'
import SimpleBar from 'simplebar-react';
import { Box, Grommet, Heading, Button, TextInput, Layer, List} from 'grommet';
import { Add, Logout} from 'grommet-icons';

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
        
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10, marginBottom: 15}}> 
        <Logout onClick={this.handleLogout}/>
        {/* <img src={'https://api.adorable.io/avatars/400/sssdsd.png'} style={{width: 40, height: 40, borderRadius: 25, marginLeft: 10}}/> */}
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
      loading: true, 
      newProjectName: '', 
      showNewModal: false, 
      currentProject: undefined
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

  saveProjects = (projects) => { 
    store.set('projects', projects)
  }

  createNewProject = () => { 
    let newProject = { 
      name: this.state.newProjectName, 
      filePath: '', 
      variables: [], 
    }
    const projects = this.state.projects.concat(newProject)
    this.setState(state => {
      const projects = state.projects.concat(newProject)
      return {
        projects,
        newProjectName: '',
        showNewModal: false
      };
    }, () => { 
    });
    this.saveProjects(projects)
  }

  selectProject = (currentProject) => { 
    this.setState({currentProject: currentProject})
  }

  handleProjectNameChange = (e) => { 
    this.setState({newProjectName: e.target.value})
  }

  toggleNewModal = () => { 
    this.setState({showNewModal: !this.state.showNewModal})
  }

  render() { 
  const {projects, loading} = this.state
  return ( 
    <div>
      <div style={{position: 'absolute', left: 10, color: '#efefef'}}>
        <Heading level='3'>Projects   <Add onClick={this.toggleNewModal} color='brand'/></Heading>

        { !loading && 
          <React.Fragment>
            { projects.length == 0 ? 
              <div> No Projects...</div> 
              : 
              <ProjectsList projects={projects} selectProject={this.selectProject}/>
            }
          </React.Fragment>
        }

      </div>
    
      <Box 
        // background='dark-1'
        elevation='xlarge'
        animation='fadeIn'
        style={{
          padding: 10,
          backgroundColor: '#173140',
          width: '80%',
          display: 'flex', flexDirection: 'column', alignItems: 'left', 
          overflowY: 'scroll', 
          position: 'absolute', right: 0, height: '80%', 
          borderTopLeftRadius: 20, borderBottomLeftRadius: 20, 
        }}>

        {
          this.state.showNewModal && 
          <Layer
            onEsc={this.toggleNewModal}
            onClickOutside={this.toggleNewModal}
            backgroundColor=""
          >
            <Box pad="large">
            <TextInput
              placeholder="Project Name"
              value={this.state.newProjectName}
              onChange={this.handleProjectNameChange}
              />
             <Button  
                margin="small"
                size="small"
                label="Create Project"
                onClick={this.createNewProject}
              /> 
            </Box>
          </Layer>
        }

        { this.state.currentProject != undefined && 
          <SingleProject project={this.state.currentProject} updateProject={(proj)=>console.log('hi', proj)}/>
        } 
       
      </Box>
    </div>
  )} 
} 


const ProjectsList = ({projects, selectProject}) => { 
  return(
    <Box>
      {
        projects.map(proj => { 
          return (
            <Box 
              key={proj.name}
              focusIndicator={true}
              onClick={()=>selectProject(proj)}
              hoverIndicator={true}
              pad="small"
            >
              {proj.name}
            </Box>)
          
        })
      }
    </Box>
  )
}



