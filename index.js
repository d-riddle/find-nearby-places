const express=require("express");
const cors=require("cors");
const app=express();
const path=require("path");


const dotenv=require("dotenv");

const placesRoute=require("./routes/places");

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/places",placesRoute);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});


app.listen(process.env.PORT||5000,()=>{
    console.log("backend is running");
});


