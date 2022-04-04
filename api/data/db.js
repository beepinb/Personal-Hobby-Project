const mongoose=require("mongoose");
require("./tvseries-model");
mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected",function(){
    console.log("Mongoose connected in server");
});
mongoose.connection.on("disconnected",function(){
    console.log("Mongoose disconnected from server");
});
mongoose.connection.on("error",function(err){
    console.log("Error: ",err);
});

process.on("SIGINT",function(){
    mongoose.connection.close(function(){
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});