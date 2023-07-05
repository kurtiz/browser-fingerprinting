import mongoose from "mongoose";

// defining fingerprint schema
const fingerprintSchema = mongoose.Schema (
    {
        visitorID: {
            type: String,
            required: [true, "visitorID field can't be empty"],
            unique: true
        },
        browser: {
            type: String
        },
        browserVersion: {
            type: String
        },
        country: {
            type: String,
        },
        city: {
            type: String
        },
        os: {
            type: String
        },
        lastSeen: {
          type: String
        },
        isLoggedIn: {
            type: Boolean
        }
    },
    {
        timestamp: true
    }
);


// creating fingerprint schema
const Fingerprint = mongoose.model("fingerprint", fingerprintSchema);
export default Fingerprint;