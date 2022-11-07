const express = require("express");
const axiosServerInstance = require("../axiosConfig");
const router = express.Router();


router.post("/",async(req,res)=>{
    console.log("we reached");
    const loc=req.body.lattitude+"%2C"+req.body.longitude;
    // const radius=req.body.radius;
    console.log(loc);
    console.log(process.env.PLACES_API_KEY);
    try{
        // console.log(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.PLACES_API_KEY}&location=${loc}`);
        const apiResponse= await axiosServerInstance
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.PLACES_API_KEY}&location=${loc}&rankby=distance`);
        // const apiResponse=await axiosServerInstance.get("https://mocki.io/v1/2e6af44f-041f-4abd-a54a-81f688b07ebb");
        if(apiResponse.data.status=="OK"){
            const filteredResponse=[];
            for(const place of apiResponse.data.results){
                filteredResponse.push({
                    icon:place.icon,
                    name:place.name,
                    location: place.geometry.location.lat+":"+place.geometry.location.lng
                });
            }
            res.status(200).json(filteredResponse);
        }else{
            res.status(500).json(apiResponse.data.status);
        }
    }catch(err){
        console.log(err);
        if(err.response){
            console.log(err.response.data);
            res.status(500).json(err.response.data);
        }else {
            res.status(500).json("Internal Server Error!");
        }
    }
});


module.exports=router;
