const express=require("express");
// const cors=require("cors");
const app=express();
const path=require("path");


const dotenv=require("dotenv");

const placesRoute=require("./routes/places");

dotenv.config();
app.use(express.json());
// app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/api/places",placesRoute);

if (process.env.NODE_ENV === 'production') {
    //*Set static folder up in production
    app.use(express.static('client/build'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
  }


app.listen(process.env.PORT||5000,()=>{
    console.log("backend is running");
});


