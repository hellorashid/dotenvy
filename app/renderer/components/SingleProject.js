import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
// import shell from 'shelljs'
import { Box, Grommet, Heading, Button, Text, TextInput, Grid} from 'grommet';
const {shell} = require('electron') // deconstructing assignment
import {FolderOpen} from 'grommet-icons'
import Peer from 'peerjs';

// import dotenv from 'dotenv'

const { dialog } = require('electron').remote
var fs = require('fs'); 


const SingleProject = ({project, updateProject}) => { 
  const [folder, setFolder] = React.useState('')

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

  const showFolder = () => { 
    let x = shell.openItem(project.filePath)
  }

  const saveFolder = (folder) => { 
    let proj = {...project}
    proj.filePath = folder
    console.log(proj)
    updateProject(proj)
  }

  const saveEnvFile = () => {
   if (project.filePath != '') { 
      let fileName = project.filePath + "/.env"
  
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
    <Grid align="center"
      columns={['3/4', '1/4']}
    >
    <FolderPathView openFolder={openFolder} folder={project.filePath}/>
    <Button  label="" size="small" onClick={showFolder} icon={<FolderOpen />} />
    </Grid>

    <Grid align="center"  columns={['2/3', '1/3']}>
    <Box>
    <h2>Env Variables</h2>
    {
      project.variables.map( x => { 
        return(<Box key={x.key} hoverIndicator>
            <p> {x.key}={x.value}</p>
           </Box>)
      })
    }
    <NewVariable createVariable={createVariable}/>
    <SaveEnvFile saveEnvFile={saveEnvFile} />

    </Box>

    <Box background="#2C4351" style={{height: '100%', marginLeft: 10}}>
      <ShareProject  />
    </Box>

    </Grid>
  </Box>)

}


const ShareProject = (props) => { 
  const projectUid = '12mjnc9280' 
  const [importId, setImportId] = useState('') 
  
  return(<Box margin="small" >
      <Heading level="5" margin="xsmall">Share</Heading>
      <p>Project ID:<span style={{fontWeight: 'bold'}}>{projectUid}</span></p>
      
      <Heading level="5">Import</Heading>
      <TextInput
        placeholder="Import ID"
        value={importId}
        onChange={event => setImportId(event.target.value)}
      />

    </Box>
  )
}

const SaveEnvFile = ({saveEnvFile}) => { 
  
  return(<Box margin="small" width="small">
      <Button 
        size="small"
        style={{color: 'white'}}
        label="Save .Env File"
        onClick={saveEnvFile}
      />
    </Box>
  )
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
      <Text size="small" color="light-1" style={{fontFamily: 'monospace'}}>Project Directory: {folder}</Text>
    </Box>
  )
}

export default SingleProject;