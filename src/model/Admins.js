const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/Lana-2
    email: {
        type: String,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    }
});
<<<<<<< HEAD

module.exports = mongoose.model('Admin', adminSchema);
=======
name:{
    type:String,
    required:true
}

})
const Admin=mongoose.model('Admin', adminSchema);
module.exports=Admin
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
=======

module.exports = mongoose.model('Admin', adminSchema);
>>>>>>> origin/Lana-2
