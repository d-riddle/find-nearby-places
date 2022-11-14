import { useState } from "react";
import { axiosInstance } from "../../config";
import "./Home.css";



function Home(){
    const [lattitude,setLattitude]=useState(null);
    const [longitude,setLongitude]=useState(null);
    const [radius,setRadius]=useState(null);
    const [locationStatus,setLocationStatus]=useState(null);
    const [backendStatus,setBackendStatus]=useState(null);
    const [errorMessage,setErrorMessage]=useState(null);
    const [showLocation,setShowLocation]=useState(false);
    const [places,setPlaces]=useState(null);
    const [showSmallButton,setShowSmallButton]=useState(false);

    const [showRadiusInput,setShowRadiusInput]=useState(null);
    const [showCoorInput,setShowCoorInput]=useState(null);
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
            </>):(<p className="errorMessage">{errorMessage}</p>)}
                {/* <button className="homeButton" onClick={handleSelectOption} id="option1">Provide Coordinates</button>
                <button className="homeButton" onClick={handleSelectOption} id="option2">Find Current location</button>
                {option2&&(option2?(<><p>{coorStatus}</p>
                {lattitude&&longitude&&<p>Yours Coordinates are: </p>}
                {lattitude&&<p>Lattitude: {lattitude}</p>}
                {longitude&&<p>Longitude: {longitude}</p>}</>):(<>
                    <label>Enter the Coordinates:</label>
                    <input type="text" placeholder="Enter lattitude" onChange={(e)=>{setLattitude(e.target.value)}}/>
                    <input type="text" placeholder="Enter longitude" onChange={(e)=>{setLongitude(e.target.value)}}/>
                </>))}
                {lattitude&&longitude&&<button className="smallHomeButton" onClick={getBusinesses}>Find Nearby Places</button>}
                {<p>{progress}</p>}
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
                                <td className='homeBodytr'>{p.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>):(<h1>{backendStatus}</h1>)}   */}
            </div>
        </div>
    );
}

export default Home;