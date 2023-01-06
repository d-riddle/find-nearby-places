import { mappls } from  'mappls-web-maps';


function MapMyIndia({lat,lng}){
    const  styleMap  = {width:  '99%', height:  '99vh', display:'inline-block'}
const  mapProps  = { center: [lat, lng], traffic:  false, zoom:  4, geolocation:  false, clickableIcons:  false }
var mapObject ;
var mapplsClassObject=  new  mappls();

	mapplsClassObject.initialize("4934db03f4804fd39cda947612559fce",()=>{
		mapObject = mapplsClassObject.Map({id:  "map", properties: mapProps});

		//load map layers/components after map load, inside this callback (Recommended)
		mapObject.on("load", ()=>{
		// Activites after mapload
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
    const options = {
        keywords: allowedTypes,
        refLocation: [lat, lng],
        radius: 2000
      }
      let nr=mapObject.nearby(options);
      console.log(nr);
      });
		})
}

export default MapMyIndia;
