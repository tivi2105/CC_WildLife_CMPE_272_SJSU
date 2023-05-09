const mongoose = require('mongoose');

const animalSchema=new mongoose.Schema({
    name: {type:String, required:true},
    location: {type:String, required:true},
    threat: {type:String, required:true},
})
mongoose.model('animals', animalSchema);