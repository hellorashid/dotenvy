import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import shell from 'shelljs'
import dotenv from 'dotenv'

var app = require('electron').remote; 
var dialog = app.dialog;
var fs = require('fs'); 


export default class ProjectsView extends Component {
  // static propTypes = {
  //   onLogout: PropTypes.func.isRequired,
  // };

  constructor(props) { 
    super(props)
    this.state = { 
      folder: '', 
      newProjectTitle: '', 
      projects: [], 
      currentProject: undefined
    }
  }

  componentDidMount = () => { 
    console.log('whhat', this.props.user)
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.user.projects !== prevProps.user.projects) {
      console.log('Updated Projects..')
      this.getAllProjects(this.props.user.projects)
    }
  }

  createProject = async () => { 
    const {uid} = this.props
    firebase.firestore().collection('projects').add({
      name: this.state.newProjectTitle, 
      members: [uid], 
      variables: []
    }).then( async doc => { 
      console.log(doc.id)
      await this.addProjectToUser(uid, doc.id)
      console.log('done')
    }).catch( e => { 
      console.log('Error creating project', e)
    })
  }

  addProjectToUser = async (uid, projectId) => { 
    return firebase.firestore().collection('users').doc(uid)
    .update({ 
      projects: firebase.firestore.FieldValue.arrayUnion(projectId)
    })
  }

    // if (this.state.folder != '') { 
    //   let fileName = this.state.folder[0] + "\\.env"
    //   fs.writeFile(fileName, content, (err) => {
    //     if(err){
    //         alert("An error ocurred creating the file "+ err.message)
    //     }
                    
    //     alert("The file has been succesfully saved");
    //   });

    // }

    // dialog.showSaveDialog((fileName) => {
    //   if (fileName === undefined){
    //       console.log("You didn't save the file");
    //       return;
    //   }
      
    //   let content = 'console.log(hi)'
    //   console.log(fileName)
    //   // fileName is a string that contains the path and filename created in the save file dialog.  
    // }); 

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getAllProjects = async (projectsArray) => { 
    let projects = []
    Promise.all(
      projectsArray.map(async proj => { 
        return await this.getProject(proj)
      })
    ).then( res => { 
        this.setState({projects: res})
    })
  }

  getProject = async (project) => { 
    return await firebase.firestore().collection('projects').doc(project).get()
      .then(doc => { 
        return {id: doc.id, ...doc.data()}
      })
  }

 
  render() {

    return (
      <div style={{backgroundColor: 'white', borderRadius: 20, padding: 20, margin: 20}}>
        
        <h1> Projects </h1>


        <input onChange={this.handleChange} name="newProjectTitle" type="text" value={this.state.newProjectTitle} />
        <button onClick={this.createProject}>New</button>

        <div>
          { this.state.projects.map( proj => { 
            return <div
               key={proj.id} 
              onClick={()=>this.setState({currentProject: proj})}
              style={{backgroundColor: '#efefef'}}
              > 
              <h3>{proj.name}</h3> 
              {/* <button onClick={()=>this.setState({currentProject: proj})}> select</button> */}
               </div>
          })
          }
        </div>

        <p></p>
        {/* <button onClick={this.openFolder}>Open Folder</button> */}
        {/* <button onClick={()=>{ 
          console.log(this.state.currentProject)
        }}> All proj</button> */}

        { this.state.currentProject && 
        <SingleProject project={this.state.currentProject} updateProjects={this.getAllProjects} />
        }
      </div>
    );
  }

}


const SingleProject = ({project, updateProjects}) => { 
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const [folder, setFolder] = React.useState('')
  const [test, setTest] = React.useState('')

  const openFolder = () => { 
    dialog.showOpenDialog({
      title:"Select a folder",
      properties: ["openDirectory"]
    }, (folderPaths) => {
        // folderPaths is an array that contains all the selected paths
        if(folderPaths === undefined){
            console.log("No destination folder selected");
            return;
        }else{
            console.log(folderPaths);
            setFolder(folderPaths[0])
            shell.cd(folderPaths[0])
            setTest(shell.ls().length)
            console.log(shell.ls().length)
        }
    });
  }

  const saveEnvFile = () => {
   if (folder != '') { 
      let fileName = folder + "\\.env"
  
      let contents = ''
      project.variables.map( v => {
        contents +=  `${v.key}=${v.value}\n`
      })

      fs.writeFile(fileName, contents, (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message)
        }
        alert("The file has been succesfully saved");
      });

    }
  }

  const createVariable = () => { 
    firebase.firestore().collection('projects').doc(project.id).update({
      variables: firebase.firestore.FieldValue.arrayUnion({key: key, value: value})
    })
    setKey('')
    setValue('')
    // updateProjects()
    console.log(project.id)
  }

  const testFunc = () => { 
    console.log('run')
    console.log(shell.grep('dotenv', 'package.json'))
    // shell.exec(` dotenv dotenv_config_path=${folder}`, function(code, stdout, stderr) {
    //   console.log('Exit code:', code);
    //   console.log('Program output:', stdout);
    //   console.log('Program stderr:', stderr);
    //   setTest(stdout)
    //   alert(code, stdout, stderr)
    // })
  }

  return(
  <div style={{backgroundColor: '#efefef', padding: 10, margin: 20}}>
    <h1>{project.name}</h1>
    { folder == '' ? 
    <button onClick={openFolder}>Open Folder</button>
      : 
    <button onClick={saveEnvFile}>Save Env</button>
    }

    <h2>Env Variables</h2>
    {
      project.variables.map( x => { 
        return(<div key={x.key}>
            <p> {x.key}={x.value}</p>
           </div>)
      })
    }


  <input onChange={(e)=>setKey(e.target.value)} type="text" value={key} placeholder="key"/>
  <input onChange={(e)=>setValue(e.target.value)} type="text" value={value} placeholder="value"/>
  <button onClick={createVariable}>New Variable</button>

  <h1>test</h1>
  <button onClick={testFunc}> {test} test </button>
  <button onClick={()=>{ 
    alert(JSON.stringify(process.env))
  }}> {test} all envs </button>

<button onClick={()=>{ 
    alert(JSON.stringify(process.env.TEST))
  }}>test var </button>


  </div>)

}