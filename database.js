const mongoose = require("mongoose");
//mongoose.set('useNewUrlParser', true)
//mongoose.set('useUnifiedTopology', true)

class Database {

    constructor() {

        this.connect();
    }


    connect() {
        mongoose.connect("mongodb+srv://mshaik791:Cresselia1234@twtrclonecluster.urzsr6i.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("database connection error" + err);
        })
    }
}

module.exports = new Database();