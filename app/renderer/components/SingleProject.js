import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleBar from 'frameless-titlebar';
import shell from 'shelljs'
import { Box, Grommet, Heading, Button, TextInput, Layer, List} from 'grommet';

import dotenv from 'dotenv'

var app = require('electron').remote; 
var dialog = app.dialog;
var fs = require('fs'); 


const SingleProject = ({project, updateProjects}) => { 
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const [folder, setFolder] = React.useState('')
  const [test, setTest] = React.useState('')

  const openFolder = () => { 
    console.log('opening')
    dialog.showOpenDialog({
      title:"Select a folder",
      properties: ["openDirectory"]
    }, (folderPaths) => {
        console.log("Open Folder")
        // folderPaths is an array that contains all the selected paths
        if(folderPaths === undefined){
            console.log("No destination folder selected");
            return;
        }else{
            console.log(folderPaths);
            setFolder(folderPaths[0])
            // shell.cd(folderPaths[0])
            // setTest(shell.ls().length)
            // console.log(shell.ls().length)
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
  <div style={{color: 'white', padding: 10, margin: 20}}>
    <Heading>{project.name}</Heading>
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

export default SingleProject;