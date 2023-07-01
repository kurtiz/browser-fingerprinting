import mongoose from 'mongoose';
const connect_database = (successCallbackFunction) => {
    mongoose.set("strictQuery", false);
    mongoose.
        connect('mongodb+srv://fingerprintserver:ZpyeFvox3EvuOU4r@finngerprinter.p2ezahd.mongodb.net/fingerprintdb?retryWrites=true&w=majority')
        .then(() => {
            successCallbackFunction();
        })
        .catch((error) => console.log(error));
}


export default connect_database;