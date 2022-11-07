import { useState } from "react";
import { axiosInstance } from "../../config";
import "./Home.css";



function Home(){
    const [lattitude,setLattitude]=useState(null);
    const [longitude,setLongitude]=useState(null);
    const [coorStatus,setCoorStatus]=useState(null);
    const [places,setPlaces]=useState([]);
    const [backendStatus,setBackendStatus]=useState(null);
    const [progress,setProgress]=useState(null);

    const handleSubmit=()=>{
        setLattitude(null);
        setLongitude(null);
        setCoorStatus(null);
        setBackendStatus(null);
        setPlaces(null);
        setProgress(null);
        if(!navigator.geolocation){
            setCoorStatus('Geolocation is not supported by your browser');
        }else{
            setCoorStatus('Fetching your Coordinates...');
            navigator.geolocation.getCurrentPosition((position)=>{
                setCoorStatus(null);
                console.log("lat coming");
                console.log(position.coords.latitude);
                setLattitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },()=>{
                setCoorStatus('Unable to retrieve your location');
            });
        }
    }

    const getBusinesses=async()=>{
        setProgress("Fetching Places from Google Places API....");
        try{
            const res=await axiosInstance.post("/places/",{
                lattitude:lattitude,
                longitude:longitude
            });
            if(res.data)
            console.log(res.data);
            if(res.status==200){
                setPlaces(res.data);
            }else {
                setBackendStatus(res.data);
                setPlaces([]);
                setProgress()
            }
            setProgress(null);
        }catch(err){
            console.log(err.response.data);
            setBackendStatus(err.response.data);
            setPlaces([]);
            setProgress(null);
        }
    }
    return (
        <div className="home">
            <div className="content">
                <div className="heading">
                    Welcome to Places Finder
                </div>
                <button className="homeButton" onClick={handleSubmit}>Find Current location</button>
                <p>{coorStatus}</p>
                {lattitude&&longitude&&<p>Yours Coordinates are: </p>}
                {lattitude&&<p>Lattitude: {lattitude}</p>}
                {longitude&&<p>Longitude: {longitude}</p>}
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
            </>):(<h1>{backendStatus}</h1>)}  
            </div>
        </div>
    );
}

export default Home;