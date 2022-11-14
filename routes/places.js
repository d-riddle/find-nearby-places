const express = require("express");
const axiosServerInstance = require("../axiosConfig");
const router = express.Router();


const calculateDistance=(la1,lo1,la2,lo2)=>{
    let R=6371
    let dLat = toRad(la2 - la1)
    let dLon = toRad(lo2 - lo1)
    let lat1 = toRad(la1)
    let lat2 = toRad(la2)
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d
}

const toRad=(value)=>{
    return value*Math.PI/180
}

const isValid=(param)=>{
    if(param==null){
        return false;
    }
    const p1=param.trim();
    if(p1.length==0)
    return false;

    return true;
}

router.post("/",async(req,res)=>{
    console.log("we reached");
    const loc=req.body.lattitude+"%2C"+req.body.longitude;
    const radius=isValid(req.body.radius)?req.body.radius:50;
    console.log(loc);
    console.log(radius);
    console.log(process.env.PLACES_API_KEY);
    const allowedTypes=["bakery","bar","beauty_salon","bicycle_store",
                        "book_store","cafe","car_dealer","car_rental",
                        "car_repair","car_wash","casino",
                        "clothing_store","convenience_store",
                        "department_store","drugstore","electronics_store",
                        "furniture_store","gas_station","hardware_store","home_goods_store",
                        "jewelry_store","liquor_store","meal_delivery","meal_takeaway",
                        "movie_rental","movie theater","moving_company","night_club",
                        "pet_store","pharmacy","real_estate_agency","restaurant",
                        "shoe_store","shopping_mall","store","subway_station","supermarket",
                        "travel_agency"];

let allowedTypesSet=new Set(allowedTypes);
    try{
        // console.log(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.PLACES_API_KEY}&location=${loc}`);
        const apiResponse= await axiosServerInstance
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.PLACES_API_KEY}&location=${loc}&radius=${radius}`);
        // const apiResponse=await axiosServerInstance.get("https://mocki.io/v1/64efe212-aae1-46ad-b31e-0fb5d87c1585");
        if(apiResponse.data.status=="OK"){
            const filteredResponse=[];
            for(const place of apiResponse.data.results){
                let flag=false;
                for(const type of place.types){
                    if(allowedTypesSet.has(type)){
                        flag=true;
                        break;
                    }   
                }
                if(flag){
                    filteredResponse.push({
                        icon:place.icon,
                        name:place.name,
                        location: place.geometry.location.lat+":"+place.geometry.location.lng,
                        types:place.types,
                        dist: calculateDistance(place.geometry.location.lat,place.geometry.location.lng,req.body.lattitude,req.body.longitude),
                        address: place.vicinity
                    });
                }
            }
            filteredResponse.sort((a,b)=>a.dist-b.dist);
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
