import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import shell from 'shelljs'
import { Box, Grommet, Heading, Button, Text, TextInput, Grid} from 'grommet';

import dotenv from 'dotenv'

const { dialog } = require('electron').remote
var fs = require('fs'); 


const SingleProject = ({project, updateProject}) => { 
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const [folder, setFolder] = React.useState('')
  const [test, setTest] = React.useState('')

  const openFolder = () => { 
    const f = dialog.showOpenDialogSync({
      title:"Select Project Directory",
      properties: ["openDirectory"]
    })

    if (f != undefined) { 
      saveFolder(f[0])
    } else { 
      console.log('No Folder Selected')
    }
      // shell.cd(folderPaths[0])
      // setTest(shell.ls().length)
  }

  const saveFolder = (folder) => { 
    let proj = {...project}
    proj.filePath = folder
    console.log(proj)
    updateProject(proj)
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

  const createVariable = (key, value) => {
    let proj = { ... project}
    proj.variables.push({key, value})
    updateProject(proj)

    // firebase.firestore().collection('projects').doc(project.id).update({
    //   variables: firebase.firestore.FieldValue.arrayUnion({key: key, value: value})
    // })
    // setKey('')
    // setValue('')
    // updateProjects()
    // console.log(project.id)
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
  <Box style={{color: 'white', padding: 10, margin: 20}} animation="fadeIn" animation="fadeIn">
    <Heading margin="small">{project.name}</Heading>
    <FolderPathView openFolder={openFolder} folder={project.filePath}/>
    {/* <button onClick={()=>console.log(folder)}>TEST</button> */}

    <h2>Env Variables</h2>
    {
      project.variables.map( x => { 
        return(<div key={x.key}>
            <p> {x.key}={x.value}</p>
           </div>)
      })
    }

    <NewVariable createVariable={createVariable}/>

  </Box>)

}

const NewVariable = ({createVariable}) => { 
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const submit = () => { 
    if (key != '' && value != '') { 
      createVariable(key, value)
      setKey('')
      setValue('')
    } else { 
      console.log('Key or Value cannot be empty')
    }
  }
  return(
    <Box>
      <Grid
        columns={['1/4', '1/2', '1/4']}
      >
      <TextInput
        placeholder="Key"
        value={key}
        onChange={event => setKey(event.target.value)}
        />
      <TextInput
        placeholder="Value"
        value={value}
        onChange={event => setValue(event.target.value)}
        />
      <Button color="light" style={{color: 'white'}} label="Create" 
        onClick={submit}
        round={false}
      />
      </Grid>
    </Box>
  )
}

const FolderPathView = ({folder, openFolder, saveEnvFile}) => { 
  return(
    <Box background="dark-3" elevation="small" round="xsmall" pad={{left: "xsmall"}}
      onClick={openFolder}
    >
    {/* { folder == '' ? 
        <button onClick={openFolder}>Open Folder</button>
        : 
        <button onClick={saveEnvFile}>Save Env</button>
      } */}
      <Text size="small" color="light-1" style={{fontFamily: 'monospace'}}>Project Directory: {folder}</Text>
    </Box>
  )
}

export default SingleProject;