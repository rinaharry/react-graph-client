import React from 'react'
import './EventList.css'

const EventList = (props) => 
    {
        const eventlist = props.eventsk.map((event,i)=>{
            return  <li className="events__list-item" key ={i}  >
                     <div>
                        <h1>{event.title}</h1>
                        <h2>{event.price} - {new Date(event.date).toLocaleDateString()}</h2>
                        
                      </div>
                     <div>     
                        {props.authUserId === event.creator._id ? <p>this your event</p> :<button  className="btn" onClick= {()=>props.viewDetail(event)}>
                            View Details
                         </button>}
                        
                         </div>     
                    </li>
              })
       return(
           <ul  className="event__list">
               {eventlist}
               
           </ul>
       )
    }

export default EventList;