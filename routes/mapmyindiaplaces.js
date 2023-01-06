const express = require("express");
const axiosServerInstance = require("../axiosConfig");
const router = express.Router();
const fs=require("fs");
const path=require("path");


router.get("/",async(req,res)=>{
    try{
        //reading data from a json file which is a mapmyindia data around my office desk
        fs.readFile(path.join(__dirname+"/../mapMyIndiaData/data.json"),'utf-8',(err,data)=>{
            if(err){
                console.log("Backend error: while reading data from mapmyindia json file");
                console.log(err);
                res.status(500).json("maymyindia:reading file error");
            }else{
                console.log(data);
                res.status(200).json(JSON.parse(data));
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json("Mapmyindia: Internal Server Error!");
    }
});


module.exports=router;