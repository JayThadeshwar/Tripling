// import React from 'react';
// import ReactDOM from 'react-dom';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
// import { useState } from 'react';
// import { useMapEvents } from 'react-leaflet';
// import './index.css';

// // mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW4wMyIsImEiOiJja3J1ZzVidHUwaTM4MnZvY2M1eWp2OHVuIn0.8-9M1R0lPpVbG-2utQA8JQ';

// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//       click() {
//         map.locate()
//       },
//       locationfound(e) {
//         setPosition(e.latlng)
//         map.flyTo(e.latlng, map.getZoom())
//       },
//     })
  
//     return position === null ? null : (
//       <Marker position={position}>
//         <Popup>You are here</Popup>
//       </Marker>
//     )
//   }

// function Map(props){
//     return (
//             <MapContainer className='map' center={[22.3511148, 78.6677428]} zoom={5} scrollWheelZoom={true}>
//                 <TileLayer
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <Marker position={props.source}>
//                     <Popup>
//                         This is source location
//                     </Popup>
//                 </Marker>
//                 <Marker position={props.dest}>
//                     <Popup>
//                         This is destination location
//                     </Popup>
//                 </Marker>
//                 <Polyline positions={[props.source,props.dest]}/>
//                 <LocationMarker/>
//             </MapContainer>        
//     );
// }

// class MyPage extends React.Component{
//     render(){
//         const source = [19.0759899,72.8773928];
//         const dest = [22.3051991,70.8028335]

//         return(
//             <Map source={source} dest={dest}/>
//         );        
//     }
    
// }

// ReactDOM.render(
//     <MyPage/>,
//     document.getElementById('root')
// );