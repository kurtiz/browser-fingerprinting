import mongoose from 'mongoose';

/**
 * Connects to mongodb. The connection URI has been hardcoded so to change
 * the URI you would have to modify this function
 * @param successCallbackFunction { function } callback function to be called when the connection to
 * the database is successful
 */
const connect_database = (successCallbackFunction) => {
    // hides the logs and makes it less verbose
    mongoose.set("strictQuery", false);
    // connects to the database
    mongoose.
        connect('mongodb+srv://fingerprintserver:ZpyeFvox3EvuOU4r@finngerprinter.p2ezahd.mongodb.net/fingerprintdb?retryWrites=true&w=majority')
        .then(() => {
            successCallbackFunction(); // calling callback function on connection success
        })
        .catch((error) => console.log(error)); // catch errors and logs it for debugging purpose
}


export default connect_database;