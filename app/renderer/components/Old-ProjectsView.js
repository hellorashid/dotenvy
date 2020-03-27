// NOT USED ANYMORE - contains FireBase logic. 

class ProjectsView extends Component {
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