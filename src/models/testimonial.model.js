import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
   role:{
    type:String
   },
   description : String,
   
   rating : {
    type:Number,
    min:1,
    max:5
   }
},{
    timestamps:true
});

const Testimonials = mongoose.model('Testimonials',testimonialSchema);

export default Testimonials;
;