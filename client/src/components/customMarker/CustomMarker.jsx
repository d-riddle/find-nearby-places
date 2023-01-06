import { useState } from "react";
import "./CustomMarker.css";

function CustomMarker({place}){
    return <>
    {place.name}
    <div className="pin">
    </div>
    <div className="pulse"></div>
  </>
}

export default CustomMarker;
