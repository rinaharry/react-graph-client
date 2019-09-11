import React ,{Component} from 'react'
import Modal from '../../common/modal/Modal'
import AuthContent from '../../context/Context_auth'
import EventList from './EventList'

class Event extends Component {

    constructor(props){
        super(props)
        this.titleRef = React.createRef();
        this.descriptionRef = React.createRef()
        this.priceRef  = React.createRef();
        this.dateRef = React.createRef()
    }
  static contextType =AuthContent
   state = {
       creatEvent: null,
       events: [],
       selectedEvent : {},
       details: null
   }

  toCreateEvent = () => {
        this.setState({
            creatEvent: true
        })
  }
  toCancelEventCreate = () =>{
    this.setState({
        creatEvent: false,
        eventSelected : null,
        details: null
    })
  }
  componentDidMount(){
      this.fetchEvent()
      console.log("ok")
  }

  viewDetail=(item)=>{
       
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === item._id);
            return { selectedEvent: selectedEvent , details: true};
         });
         console.log("item",item)
         console.log(this.selectedEvent)
  }

  fetchEvent  ()  {
    const requestbody = {
        query: `
          query { 
            events{
                _id
               title
               description
               price
               date
               creator{
                 _id
                 email
               }
            }
          }
        `
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
        resdata=>{
           setTimeout(()=>{
            this.setState({
                events : resdata.data.events
            })
           },200) 
         
        }
      ).catch(
        err=> console.log(err)
      )

  }
  OnCreateEvent = () => {
      this.setState({  creatEvent: false })
      const description = this.descriptionRef.current.value;
      const title = this.titleRef.current.value
      const price  = + this.priceRef.current.value
      const date = this.dateRef.current.value
      console.log(description, title, price, date)
      if (
        title.trim().length === 0 ||
        price <= 0 ||
        date.trim().length === 0 ||
        description.trim().length === 0
      ) {
        return;
      }

      let requestbody = {
        query: `
          mutation { 
            createEvent(eventInput:{title:"${title}",price: ${price}, description :" ${description}", date: "${date}"}){
              _id
               title
               description
               price
               date
            }
          }
        `
      }
      const token = this.context.token
      fetch('http://localhost:3002/graphql',{
      method: "POST",
      body: JSON.stringify(requestbody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
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
      resdata=>{
          // console.log(resdata)
          // this.fetchEvent()
          this.setState(preventState=>{
            const updateEvent= [...preventState.events]
                 updateEvent.push({
                   _id : resdata.data.createEvent._id,
                   title: resdata.data.createEvent.title,
                   description: resdata.data.createEvent.description,
                   price: resdata.data.createEvent.price,
                   date: resdata.data.createEvent.date,
                   creator: {
                     _id:this.context.userId
                   }
                 })
                 return {events:updateEvent }
          })
         }
    ).catch(
      err=> console.log(err)
    )
        
    }
   bookingEvent = ()=>{
    let requestbody = {
      query: `
        mutation { 
          bookEvent(eventId: "${this.state.selectedEvent._id}"){
            _id
          }
        }
      `
    }
    const token = this.context.token
    fetch('http://localhost:3002/graphql',{
    method: "POST",
    body: JSON.stringify(requestbody),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
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
    resdata=>{
        console.log(resdata)
       
       }
  ).catch(
    err=> console.log(err)
  )
   } 
  render (){
    //   const event =  this.state.events.map((event,i)=>{
    //        return  <li key ={i}  >{event.title}</li>
    
    //        })

      return (
            
          <div> 
             <button onClick = {this.toCreateEvent}>create event</button>
             { this.state.creatEvent && 
                < Modal title = "create event" 
                       confirmText ="confirme"
                       canConfirm=" true"
                       canCancel
                       onConfirm = {this.OnCreateEvent}
                       onCancel= {this.toCancelEventCreate}
                >
                    <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={this.titleRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={this.priceRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={this.dateRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            ref={this.descriptionRef}
                    />
                  </div>

                 </form>
                </Modal>}
                 <div>
                   <EventList eventsk = {this.state.events} authUserId ={this.context.userId} viewDetail = {this.viewDetail}/>
                 </div>
    {this.state.details && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            confirmText ="confirme"
            onCancel= {this.toCancelEventCreate}
            onConfirm = {this.bookingEvent}
       
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
          </div>
        
      )
  }
}
export default Event