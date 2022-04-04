require("dotenv").config();
require("./api/data/db");
const routes=require("./api/routes");
const express=require("express");
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
});

app.use("/api",routes);

const server=app.listen(process.env.PORT,function(){
    console.log(process.env.SERVER_START_MSG,server.address().port);
})