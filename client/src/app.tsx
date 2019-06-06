import * as React from 'react';
import * as ReactDOM from 'react-dom';

type MyState = {
   latitude: Number,
   longitude: Number,
   needsBox: Boolean,
   location: string
}

class App extends React.Component<{}, MyState > {
  constructor(props:any){
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      needsBox: false,
      location: ''
    }
    this.geo = this.geo.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.geo();
  }


  geo(){
    //Use first arg in callback to update state w/ longitude+latitude+whether or input is needed if user allows geolocation.
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos.coords.latitude, pos.coords.longitude)
      let lat: Number = pos.coords.latitude;
      let lon: Number = pos.coords.longitude
      this.setState({
        latitude: lat,
        longitude: lon,
        needsBox: false,
      })
    //If there is an error w/ geolocation, we change state, so needsBox is true.
    }, (err) => {
      if (err) {
        this.setState({
          needsBox: true
        })
      }
    })
  }

  changeCity(event: any){
    this.setState({
      location: event.target.value
    })
  }

  handleSubmit(event: any){
    event.preventDefault();
    let location: string = this.state.location
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: location
    })
    .then((results) => {console.log('res: ',results)})
  }


  render() {
    //We check if needsBox is true, if it is then we start w/ a form and text box.
    return (
      <div>
        {this.state.needsBox
          // ? <form action="http://127.0.0.1:7878/" method="post">
          //       First Name: <input name="city" type="text" /> <br />
          //       <input type="submit" />
          //   </form>
          ? <form onSubmit={this.handleSubmit} >
                Location: <input type="text" onChange={this.changeCity}/> <br />
                <input type="submit" />
            </form>
          : null
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))