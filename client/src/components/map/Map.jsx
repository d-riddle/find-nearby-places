import React from "react";
import GoogleMapReact from 'google-map-react';
import CustomMarker from "../customMarker/CustomMarker";

export default function Map({center, zoom, places}){

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '1000px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_PLACES_API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {places.map((place) => <CustomMarker lat={places.lattitude} lng={places.longitude} text={places.address}/>)}
      </GoogleMapReact>
    </div>
  );
}