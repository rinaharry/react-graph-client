import React ,{Component}  from 'react'

class Booking extends Component {
    state= {
        bookings: []
    }
     componentDidMount(){
       this.fetchBookign()

     }
     fetchBookign = () => {
        console.log("booking ok")
        let requestbody = {
            query: `
                query{ 
                    bookings{
                        _id
                        createdAt
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
              if(res.status !== 200 && res.status !== 201) {
                throw new Error ('bad request');
              }else {
                return res.json()
              }
            }
        ).then(
            resdata => {
                console.log(resdata)
              this.setState({
                  bookings: resdata.data.bookings
              })
            }
          ).catch(
            err=> console.log(err)
          )}
   render() {
        return (
            <div>
                <h3>Booking event </h3>
            </div>
        )
     }

}
export default Booking;