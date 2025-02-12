import mongoose from "mongoose";

// service schema
const servicesSchema = new mongoose.Schema({

    title: {
        type: String,      
        required: false,    
           
    },
    coverImage: {
        type: String,    // cloudnry   
        
    },
    description: {
        type: String,      
        required: false,    
        
    }, 
  

}, {
     timestamps: true 
    }  
);

 const Services = mongoose.model("Services", servicesSchema);

  export default Services;
