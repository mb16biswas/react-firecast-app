import React, {Component} from 'react'
import {db} from "./firebaseconfig"

import {firebase} from "./firebaseconfig"
import "./App.css"
import Chat from "./Chat"
import {TextField} from '@material-ui/core'

class App extends Component{
 constructor(){
   super()
   this.state = {
     data : "", 
     message : [] , 
     cur_user : "" , 
     status : "true",
     url : ""
   }

  }
  change = (e) =>{
    this.setState({data :e.target.value })
  }



  addtodo = () =>{
   
    db.collection('Mes').add({
      message : this.state.data , 
      name : this.state.cur_user ,
      timestamp : Date.now() , 
      url : this.state.url
      

    })
    this.setState({data : ""})
 

  }

  signup = () =>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
     
     
    }).catch((error) => {
      console.log(error)
      
    });
  

  
  }

  signout = () =>{
    firebase.auth().signOut().then(() => {
     
      
    }).catch((error) => {
      console.log(error)
     
    });
    
  }
  


  componentDidMount(){

    firebase.auth().onAuthStateChanged((user) =>{
      if(user){
        
        this.setState({cur_user : user.displayName})
        this.setState({status : "true"})
        this.setState({url : user.photoURL})
      }
      else{
        
        this.setState({status : "false"})
      }

    })

    
    db.collection("Mes").orderBy("timestamp" , "desc").onSnapshot((snap) =>{
      // const data = snap.docs.map(doc => doc.data())
      const data = snap.docs.map((doc) =>{
        return(
          {
            id : doc.id , 
            message : doc.data().message , 
            name : doc.data().name , 
            timestamp : doc.data().timestamp , 
            url : doc.data().url
          }
        )
      })
     
      this.setState({message : data})
      
    })




  }


   render(){
     if(this.state.status === "true"){

      return(
        <div className = "App">
          
          <button onClick = {this.signout} >log out</button>
         
          <TextField className = "type" label='enter your message' placeholder='type........' 
                                        onChange={this.change}
                                        value = {this.state.data} 
                                        style = {{padding : 20}}/>

          <button onClick = {this.addtodo}>send to the group</button>
         
          <div>
            {
              this.state.message.map((doc) =>{
                
                return(
                  <div key = {doc.id}>
                    <Chat   curr_user = {this.state.cur_user} name = {doc.name}  message = {doc.message} url  = {doc.url} />
                   
                  </div>  
                )
              })
            }
 
          </div>
        </div>  

      )
       
        
       
     }

    else{
      return(
        <div className = "sign" >
          
           <button className="sign-in" onClick = {this.signup}>sing up</button>

        </div>

      

      )
     
    }

   }


    
}

export default App 





