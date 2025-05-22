const mongoose=require('mongoose');
//const User=require('./src/model/User');
const Admin=require('../model/Admins');

async function connectdb() {
    await mongoose.connect('mongodb://localhost:27017/online-event-ticketing'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
}
    connectdb().then(()=>{
        console.log("connected")
    })

    const userone=new Admin({name:"Lana"})
    userone.save().then(()=>{
        console.log("saved")
    })