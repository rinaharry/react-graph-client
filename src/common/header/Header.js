import React from 'react';
import {NavLink} from 'react-router-dom'
import './Header.css';
import AuthContext from '../../context/Context_auth' 

const Header = (prop) => {
    return (
        <AuthContext.Consumer>
           {
               context => {
              return(  <header className='header'>
                    <div className="header__logo">
                        <h1>Easy Event</h1>
                    </div>
                    <nav className="header__items">
                        <ul>
                             {!context.token && ( <li><NavLink to ="auth">Loggin</NavLink></li>)}
                             <li><NavLink to ="event">Event</NavLink></li>
                             {context.token && ( <li><NavLink to = "booking">booking</NavLink></li>)}
                             {context.token &&(<li><button  onClick={context.logout}><NavLink to="event">loggout</NavLink></button></li>)}
                        </ul>
                    </nav>
              </header>)

               }
           } 
           
       </AuthContext.Consumer>
    )

}
export default Header;
