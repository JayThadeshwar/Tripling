import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW4wMyIsImEiOiJja3J1ZzVidHUwaTM4MnZvY2M1eWp2OHVuIn0.8-9M1R0lPpVbG-2utQA8JQ';

class Map extends React.Component {
    constructor(props) {
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

        console.log(this.props.source)
        directions.setOrigin(this.props.source);
        directions.setDestination(this.props.dest);

        mp.addControl(directions, 'top-left');
        mp.addControl(new mapboxgl.NavigationControl());

        this.setState({
            map: mp
        });
    }

    render() {        
        if (this.state.map != null && this.props.markers.length > 0) {            
            for (let i = 0; i < this.props.markers.length; i++) {
                new mapboxgl.Marker().setLngLat(
                    this.props.markers[i].lnglat
                ).setPopup(
                    new mapboxgl.Popup().setHTML(
                        this.props.markers[i].name
                    )
                ).addTo(this.state.map)
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

export default Map;