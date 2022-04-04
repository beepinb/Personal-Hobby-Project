const mongoose=require("mongoose");

const actor=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
});

const tvSeries=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    cast:[actor]
});

mongoose.model(process.env.SERIES_MODEL,tvSeries,process.env.DB_NAME);