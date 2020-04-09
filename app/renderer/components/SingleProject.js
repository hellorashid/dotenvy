import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
// import shell from 'shelljs'
import { Box, Grommet, Heading, Button, Text, TextInput, Grid} from 'grommet';
const {shell} = require('electron') // deconstructing assignment
import {FolderOpen} from 'grommet-icons'


import dotenv from 'dotenv'

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

    <Box>
      <SaveEnvFile saveEnvFile={saveEnvFile} />
    </Box>

  </Box>)

}

const SaveEnvFile = ({saveEnvFile}) => { 
  
  return(<Box width="small" margin="small">
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