import React, {Component} from 'react';
//import  Axios from 'axios';
import ContextAuth from '../../context/Context_auth'

class Login extends Component {
  state= {
    isloggin: true
  }
  static contextType =  ContextAuth;
  constructor(props){
    super(props)
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef()
  }

  OnSingin = (event) => {
    event.preventDefault()
    this.setState(prevState => {
      return { loggin: !prevState.loggin };
    });
  }

  Onsubmit = (event) => {
    event.preventDefault()
    const  email = this.emailRef.current.value
    const password = this.passwordRef.current.value
    if (email.trim().length === 0 || password.trim().length === 0 ){
      return ;
  }

    let requestbody = {
      query: `
      query{ 
          loggin(email:"${email}", password : "${password}"){
            token
            userId
            tokenExpiration
          }
        }
      `
    }
    if(!this.state.loggin){
      requestbody = {
        query: `mutation{
                  createUser( userInput:{email: "${email}", password: "${password}"}){
                    _id
                    email
                  }
               }`
      }
    }
      
    fetch('http://localhost:3002/graphql',{
      method: "POST",
      body: JSON.stringify(requestbody),
      headers: {
        'Content-Type': 'application/json'
      }
 
    }).then(
      res => {
        if(res.status !== 200 && res.status !== 201){
          throw new Error ('bad request');
        }else {
          return res.json()
        }
      }
    ).then(
      resdata=>{console.log(resdata)
      if(resdata.data.loggin.token){
        this.context.loggin(
          resdata.data.loggin.token,
          resdata.data.loggin.tokenExpiration,
          resdata.data.loggin.userId
        )
      }}
    ).catch(
      err=> console.log(err)
    )
  }
  render () {
      return(
        <div>
           <form className="form-horizontal text-justify">
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="name">email</label>
                <div className="col-sm-4">
                    <input type="text" className="form-control" id="name" ref = {this.emailRef}  placeholder="Enter email"/>
                </div>
            </div>

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="password">password</label>
                <div className="col-sm-4"> 
                    <input type="password" className="form-control" ref = {this.passwordRef} id="password" placeholder="Enter text"/>
                </div>
            </div>
            <div className="form-group"> 
                <div className="col-sm-offset-2 col-sm-4">
                    <button type="submit" className="btn btn-default" onClick ={this.Onsubmit}>Submit</button>
                </div>
           </div>
           <div className="form-group"> 
                <div className="col-sm-offset-2 col-sm-4">
                    <button type="button" className="btn btn-default" onClick ={this.OnSingin}>switch to {this.state.loggin? 'singin': 'login'}</button>
                </div>
           </div>
            
       </form>
        </div>
      )
    
  }
}
export default Login;