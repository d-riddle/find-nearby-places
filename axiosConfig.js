const axios=require("axios");
const https=require("https");
const axiosServerInstance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  module.exports=axiosServerInstance;