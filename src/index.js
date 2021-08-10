import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW4wMyIsImEiOiJja3J1ZzVidHUwaTM4MnZvY2M1eWp2OHVuIn0.8-9M1R0lPpVbG-2utQA8JQ';
const source = 'Mumbai';
const sourceCords = [72.877655,19.075983];
const dest = 'Chennai';
const destCords = [80.270721,13.082680];
const openTripMap = '5ae2e3f221c38a28845f05b681d64e946dfd5450129b33de543db865';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      map: null
    }
  }

  componentDidMount() {
    const mp = new mapboxgl.Map({
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

    directions.setOrigin(this.props.source);
    directions.setDestination(this.props.dest);

    mp.addControl(directions, 'top-left');
    mp.addControl(new mapboxgl.NavigationControl());

    this.setState({
      map: mp
    });
  }

  render() {
    if(this.state.map != null && this.props.markers.length > 0){
      for(let i = 0; i < this.props.markers.length; i++){
        const marker = new mapboxgl.Marker().setLngLat(this.props.markers[i]).setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>")).addTo(this.state.map)
      }      
    }

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

function MyCard(props){
  return(
    <div className='card'>
      <img src={props.cimg} className='card-img' alt='View of location'/>
      <div className='card-body'>
        <div className='card-title'>{props.title}</div>
        <div className='card-content'>
          {props.content}
        </div>
      </div>
      <div className='card-footer'>
        <button className='card-but'><a href={props.wikiLink} target='_blank' rel="noreferrer">More Info</a></button>
        <button className='card-but' onClick={props.handleClick}>Add location</button>
      </div>
    </div>
  );
}

class AddSpot extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      result: [],
    }
  }

  async componentDidMount(){
    const options = {
      lon_min: Math.min(sourceCords[0],destCords[0]),
      lon_max: Math.max(sourceCords[0],destCords[0]),
      lat_min: Math.min(sourceCords[1],destCords[1]),
      lat_max: Math.max(sourceCords[1],destCords[1]),
      rate: 3,
      limit: 15,
      kinds: 'historic_architecture,natural,cultural',
      apikey: openTripMap
    }
    let url = new URL('http://api.opentripmap.com/0.1/en/places/bbox')
    url.search = new URLSearchParams(options).toString();

    var response = await fetch(url);
    var res = await response.json()
    
    var listOfXids = [];
    var arrOfWikiIds = [];
    for(let i = 0; i < res.features.length; i++){
      if(! arrOfWikiIds.includes(res.features[i].properties.wikidata)){
        listOfXids.push(res.features[i].properties.xid)
        arrOfWikiIds.push(res.features[i].properties.wikidata)
      }      
    }        
    listOfXids = listOfXids.slice(0,8);

    var cardData = await getCardData(listOfXids)

    this.setState({
      isLoaded: true,
      result: cardData
    });
  }

  handleLocClick(i){
    console.log(i)
  }

  render(){
    let { error, isLoaded, result } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {  

      var cards = result.map((res,ind)=>{        
        return <MyCard key={ind} handleClick={()=>this.handleLocClick(ind)} cimg={res.preview.source} title={res.name} content={res.wikipedia_extracts.text} wikiLink={res.wikipedia}/>        
      })

      return (
        <div id='addSpot'>
          <h1 className='card-title'>Places you would like to visit on the way!</h1>
          <div className='card-container'>            
            {cards}
          </div>          
        </div>
      );
    }
  }
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

    const modalSty = this.state.isMyModalOpen ? {display:'block'} : {display:'none'};
    const modalButSty = this.state.isMyModalOpen ? {display:'none'} : {display:'block'};

    return(
      <div>        
        <NavBar/>
        <Map source = {source} dest = {dest} markers = {[]}/>
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

async function getCardData(setXids){
  let urlX = 'https://api.opentripmap.com/0.1/en/places/xid/'
  const optionsX = {          
    apikey: openTripMap
  }

  var finRes = []
  for(let i = 0; i < setXids.length; i++){
    let furl = new URL(urlX+setXids[i])
    furl.search = new URLSearchParams(optionsX).toString()
    let data = await fetch(furl)
    let finData = await data.json()
    finRes.push(finData)            
  }  

  return finRes
}
