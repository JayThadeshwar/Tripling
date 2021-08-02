import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW4wMyIsImEiOiJja3J1ZzVidHUwaTM4MnZvY2M1eWp2OHVuIn0.8-9M1R0lPpVbG-2utQA8JQ';

class Map extends React.Component {

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [77.947998, 23.473324],
      zoom: 4,
      scrollZoom: false
    });

    let directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving-traffic',
      routePadding: 200
    })

    console.log(map.getCanvas())

    directions.setOrigin(this.props.source);
    directions.setDestination(this.props.dest);

    map.addControl(directions, 'top-left');
    map.addControl(new mapboxgl.NavigationControl());
  }

  render() {
    return (
      <div 
        ref={el => (this.mapWrapper = el)} 
        className="mapWrapper" 
      />
    );
  }
}

function NavBar(){
  return (
    <nav>
      <ul>
        <li>
          <span className='fas fa-umbrella-beach' style={{fontSize:'20px'}}/>
          &nbsp;Tripling - Planning memorable trips
        </li>
        <li>
          <span className='fas fa-save' style={{fontSize:'20px'}}/>
          &nbsp;Save my plan
        </li>
      </ul>
    </nav>
  );
}

function AddSpot(props){
  return(
    <div id='addSpot'>
      
    </div>
  );
}

function MyModal(props){
  return(
    <div className='myModal' style={props.modalSty}>
      <div className='modalHead'>
        <span>Explore</span>
        <button onClick={()=> props.openModal()}>X</button>
      </div>
      <div className='modalBody'> 
        <button className='modalBut'><a href='#addSpot'>Add attraction</a></button>
        <button className='modalBut'><a href='#addSpot'>Add hotels</a></button>
        <button className='modalBut'><a href='#addSpot'>Add tourist services</a></button>        
      </div>
    </div>
  );
}

class ContainerPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isMyModalOpen: false
    }
  }

  openModal(){
    this.setState({
      isMyModalOpen: !this.state.isMyModalOpen
    });
  }

  render(){
    const source = 'Mumbai';
    const dest = 'Chennai';
    // const source = [72.8773928,19.0759899];
    // const dest = [70.8028335,22.3051991];

    const modalSty = this.state.isMyModalOpen ? {display:'block'} : {display:'none'};
    const modalButSty = this.state.isMyModalOpen ? {display:'none'} : {display:'block'};

    return(
      <div>
        <NavBar/>
        <Map source = {source} dest = {dest}/>
        <button className='planBut' onClick={()=> this.openModal()} style={modalButSty}>Start Planning</button>
        <MyModal modalSty={modalSty} openModal={()=>this.openModal()}/>
        <AddSpot/>
      </div>
    );
  }
}

ReactDOM.render(
    <ContainerPage/>,
    document.getElementById('root')
);