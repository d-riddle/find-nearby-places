import { useState } from "react";
import Map from "../../components/map/Map";
import { axiosInstance } from "../../config";
import "./Home.css";
import Fuse from 'fuse.js'
// import {GoogleMap, useLoadScript, Marker, InfoWindow} from"@react-google-maps/api";


function Home(){
    const [lattitude,setLattitude]=useState(null);
    const [longitude,setLongitude]=useState(null);
    const [radius,setRadius]=useState(null);
    const [locationStatus,setLocationStatus]=useState(null);
    const [backendStatus,setBackendStatus]=useState(null);
    const [errorMessage,setErrorMessage]=useState(null);
    const [showLocation,setShowLocation]=useState(false);
    const [places,setPlaces]=useState([]);
    const [showSmallButton,setShowSmallButton]=useState(false);

    const [showRadiusInput,setShowRadiusInput]=useState(null);
    const [showCoorInput,setShowCoorInput]=useState(null);
    const [mapIndiaPlaces,setMapIndiaPlaces]=useState([]);
    const [mapIndiaError,setMapIndiaError]=useState(null);
    const [comparePlacesResult,setComparePlacesResult]=useState([]);
    const [comparePlacesError,setComparePlacesError]=useState("");

    // const {isLoaded, loadError}=useLoadScript({
    //     googleMapsApiKey: "AIzaSyChIV0PG1jDYaAXevQpXa8lIhNI1wN5sGU"
    // });
     
    const mapContainerStyle={
        width: "700px",
        hieght: "700px"
    };
    const center={
        lat: 43.653,
        lng: -79.383
    }
    // const [coorStatus,setCoorStatus]=useState(null);
    // const [places,setPlaces]=useState([]);
    // const [backendStatus,setBackendStatus]=useState(null);
    // const [progress,setProgress]=useState(null);
    // const [option1,setOption1]=useState(false);
    // const [option2,setOption2]=useState(false);

    const getLocation=async()=>{
        setLattitude(null);
        setLongitude(null);
        if(!navigator.geolocation){
            setLocationStatus('Geolocation is not supported by your browser');
        }else{
            setLocationStatus('Fetching your Coordinates...');
            navigator.geolocation.getCurrentPosition((position)=>{
                setLocationStatus(null);
                console.log("lat coming");
                console.log(position.coords.latitude);
                setLattitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },()=>{
                setLocationStatus('Unable to retrieve your location');
            });
        }
    }

    const callBackend=async()=>{
        setBackendStatus("Fetching Places from Google Places API....");
        try{
            const res=await axiosInstance.post("/places/",{
                radius:radius,
                lattitude:lattitude,
                longitude:longitude
            });
            if(res.data)
            console.log(res.data);
            if(res.status==200){
                if(res.data.length==0){
                    setErrorMessage("Zero places returned, Please go closer or increase radius!...");
                }
                setPlaces(res.data);
            }else {
                setErrorMessage(res.data);
                setPlaces([]);
            }
            setBackendStatus(null);
        }catch(err){
            console.log(err.response.data);
            setErrorMessage(err.response.data);
            setPlaces([]);
            setBackendStatus(null);
        }
    }
    const callMapMyIndiaBackend=async()=>{
        setMapIndiaError("");
        setMapIndiaPlaces([]);
        try{
            const mapMyIndiaRes=await axiosInstance.get("/mapmyindiaplaces");
            console.log(mapMyIndiaRes);
            if(mapMyIndiaRes.status==200){
                console.log(mapMyIndiaRes.data.suggestedLocations);
                    setMapIndiaPlaces(mapMyIndiaRes.data.suggestedLocations);
            }else{
                setMapIndiaError("Error fetching data from mapmyindia");
            }
        }catch(err){
            console.log("reached here");
            setMapIndiaError("error occured!!!");
            setMapIndiaPlaces([]);
        }
    }

    // const handleSelectOption=(e)=>{
    //     console.log("");
    //     setOption1(false);
    //     setOption2(false);
    //     if(e.target.id=="option1"){
    //         setOption1(true);
    //     }else {
    //         setOption2(true);
    //     }
    // }

    const isValidRadius=(param)=>{
        if(param==null){
            return false;
        }
        const p1=param.trim();
        if(p1.length==0)
        return false;
        for(let i=0;i<p1.length;i++){
            if(!((p1[i]>='0'&&p1[i]<='9')||p1[i]=='.')){
                return false;
            }
        }
        if(parseFloat(p1)==NaN||parseFloat(p1)<1||parseFloat(p1)>100){
            return false;
        }
        return true;
    }

    const isValidCoordinates=(param)=>{
        if(param==null){
            return false;
        }
        const p1=param.trim();
        if(p1.length==0)
        return false;
        for(let i=0;i<p1.length;i++){
            if(!((p1[i]>='0'&&p1[i]<='9')||p1[i]=='.'||p1[i]=='+'||p1[i]=='-')){
                return false;
            }
        }
        return true;
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setShowLocation(false);
        setShowSmallButton(false);
        setErrorMessage(null);
        setPlaces([]);
        if(showRadiusInput==null){
            setRadius(null);
            setErrorMessage("Please choose whether you want to enter radius or not!..");
        }
        else if(showCoorInput==null){
            setLattitude(null);
            setLongitude(null);
            setErrorMessage("Please choose whether you want to enter coordinates or not!..");
        }
        else {
            if(showRadiusInput=="NO"){
                setRadius(null);
            }else{
                if(!isValidRadius(radius)){
                    setErrorMessage("Please enter valid radius!...");
                }
            }
            if(showCoorInput=="NO"){
                setLattitude(null);
                setLongitude(null);
                setShowLocation(true);
                await getLocation();
            }else{
                if(!isValidCoordinates(lattitude)||!isValidCoordinates(longitude)){
                    setErrorMessage("Please enter valid coordinates!...");
                }
            }
            if(errorMessage==null){
                setShowSmallButton(true);
            }
        }
        console.log(showSmallButton);
        // console.log(isLoaded);
        // console.log(loadError);
    }

    const callComparePlaces=()=>{
        setComparePlacesResult([]);
        setComparePlacesError("");
        const fuseOptions={
            includeScore: true,
            keys:["placeName"]
        }
        try{
            console.log(mapIndiaPlaces);
            const fuse=new Fuse(mapIndiaPlaces,fuseOptions);
            console.log(places);
            for(let place of places){
                console.log(place.name);
                console.log(place.address);
                const temp=fuse.search(place.name);
                console.log(temp);
                const t1={mapMyIndiaSuggestions:[...temp],gMapsPlace:place}
                console.log(t1);
                setComparePlacesResult((prev)=>[...prev,t1]);
            }
        }catch(err){
            console.log("Error occured in comparing places");
            console.log(err);
            setComparePlacesError("Error occured in comparing places");
            setComparePlacesResult([]);
        }
    }


    return (
        <div className="home">
            <div className="content">
                <div className="heading">
                    Welcome to Places Finder
                </div>
                <form className="homeForm" onSubmit={handleSubmit}>
                    <p className="subHeading">Do you want to enter radius?</p>
                    <div className="radiusRadioGroup">
                        <input type={"radio"} id="radiusNo" name="radiusRadio" value={"NO"} onChange={(e)=>{setShowRadiusInput(e.target.value)}}/>
                        <label for="radiusNo">NO</label>
                    </div>
                    <div className="radiusRadioGroup">
                        <input type={"radio"} id="radiusYes" name="radiusRadio" value={"YES"} onChange={(e)=>{setShowRadiusInput(e.target.value)}}/>
                        <label for="radiusYes">YES</label>
                    </div>
                    {(showRadiusInput=="YES")&&<input type={"text"} className="radiusYesInput" placeholder={"Enter radius between 1 to 100 metres."} onChange={(e)=>{setRadius(e.target.value)}}/>}
                    <p className="subHeading">Do you want to enter Coordinates?</p>
                    <div className="coorRadioGroup">
                        <input type={"radio"} id="coorNo" name="coorRadio" value={"NO"} onChange={(e)=>{setShowCoorInput(e.target.value)}} />
                        <label for="coorNo">NO</label>
                    </div>
                    <div className="coorRadioGroup">
                        <input type={"radio"} id="CoorYes" name="coorRadio" value={"YES"} onChange={(e)=>{setShowCoorInput(e.target.value)}} />
                        <label for="coorYes">YES</label>
                    </div> 
                    {(showCoorInput=="YES")&&<><input type={"text"} className="coorYesInput" placeholder={"Enter lattitude"} onChange={(e)=>{setLattitude(e.target.value)}}/>
                    <input type={"text"} className="coorYesInput" placeholder={"Enter longitude"} onChange={(e)=>{setLongitude(e.target.value)}}/></>}
                    <button className="submitButton" type="submit">Submit</button>
                </form>
                {showLocation&&<>
                <p>{locationStatus}</p>
                {lattitude&&longitude&&<p className="coorNoResponseHeading">Yours Coordinates are: </p>}
                {lattitude&&<p className="coorNoResponse">Lattitude: {lattitude}</p>}
                {longitude&&<p className="coorNoResponse">Longitude: {longitude}</p>}
                </>}
                {showSmallButton&&lattitude&&longitude&&<button className="smallHomeButton" onClick={callBackend}>Find Nearby Places</button>}
                {<p>{backendStatus}</p>}
                {(places&&places.length>0)?(<>
                <div className='headerTitle'>
                [Nearby Places]
            </div>
                    <div className='homeBody'>
                <table className='hometable'>
                    <thead>
                        <tr>
                            <th className='homeBodyth'>Icon</th>
                            <th className='homeBodyth'>Name</th>
                            <th className='homeBodyth'>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {places&&places.map((p)=>(
                            <tr className='hometableBodyRow'>
                                <td className='homeBodytr'><img src={p.icon}/></td>
                                <td className='homeBodytr'>{p.name}</td>
                                <td className='homeBodytr'>{p.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mapContainer">
                <Map center={{lat:Number(lattitude),lng:Number(longitude)}} zoom={15} places={places}/>
            </div>
            <button className="smallHomeButton" onClick={callMapMyIndiaBackend}>Load MapmyIndiaData</button>
            {(mapIndiaPlaces&&mapIndiaPlaces.length)>0?(
                <>
                    {mapIndiaPlaces.map((mapmyindiaplace)=>(<><p>{mapmyindiaplace.placeName}</p></>))}
                    <button className="smallHomeButton" onClick={callComparePlaces}>Compare Places</button>
                    {(comparePlacesResult&&comparePlacesResult.length>0)?(
                        <>
                            <div className="headerTitle">
                                [compare Place Result]
                            </div>
                            <div className="homeBody">
                                <table className="homeTable">
                                    <thead>
                                        <tr>
                                            <th className="homeBodyth">GMaps Place Name</th>
                                            <th className="homeBodyth">MapMyIndia Matches</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparePlacesResult&&comparePlacesResult.map((comparePlaceResult)=>(
                                            <tr className="homeTableBodyRow">
                            <td className="homeBodytr">{comparePlaceResult.gMapsPlace.name}</td>
                            <td className="homeBodytr">{(comparePlaceResult.mapMyIndiaSuggestions&&comparePlaceResult.mapMyIndiaSuggestions.length>0)?(
                                <>
                                    {comparePlacesResult.mapMyIndiaSuggestions&&comparePlacesResult.mapMyIndiaSuggestions.map((el)=>(<>
                                        <p>el.item.placeName</p>
                                    </>))}
                                </>
                            ):(null)}</td>
                        </tr>))}                  
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ):(<p className="errorMessage">{comparePlacesError}</p>)}
                </>
            ):(<p className="errorMessage">{mapIndiaError}</p>)}
            </>):(<p className="errorMessage">{errorMessage}</p>)}

            </div>
        </div>
    );
}

export default Home;