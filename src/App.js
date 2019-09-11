import React, {Component} from 'react';
import {Route, BrowserRouter, Redirect, Switch} from 'react-router-dom'
import './App.css';
import Login from './component/login/Login'
import Event from './component/event/Event'
import booking from './component/booking/Booking'
import Header from './common/header/Header'
import ContextAuth from './context/Context_auth'


class  App extends Component {
  state= {
    token: null,
    userId: null
  }

  loggin = (token, userId,tokenExpiration)=>{
    this.setState({
     token : token,
     userId: userId
    })
  }

  logout = ()=>{
    this.setState({
      token : null,
      userId: null
     })
  }
  render(){
  return (
    <BrowserRouter>
    <ContextAuth.Provider value={{token: this.state.token,userId: this.state.userId, loggin: this.loggin, logout: this.logout}}>
    <Header/>
    <main className="main-content">
      <Switch>
      
        {this.state.token && <Redirect from="/" to ="/event" exact/>}
        {this.state.token && <Redirect from="/auth" to ="/event" exact/>}
        {!this.state.token && <Route path="/auth" component= {Login}/>}
                              <Route path="/event" component= {Event}/>
        {this.state.token && <Route path="/booking" component= {booking}/> }
        {!this.state.token && <Redirect to="/auth"  exact/>}

       </Switch>
     </main>
     </ContextAuth.Provider> 
    </BrowserRouter>
  );
}
}

export default App;
