import React from "react";
import GoogleMapReact from 'google-map-react';
import CustomMarker from "../customMarker/CustomMarker";

export default function Map({center, zoom, places}){

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_PLACES_API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {places&&places.map((place) => <CustomMarker key={`${place.lattitude}${place.longitude}`} lat={Number(place.lattitude)} lng={Number(place.longitude)} place={place}/>)}
      </GoogleMapReact>
    </div>
  );
}