import mongoose from "mongoose";

// defining user schema
const userSchema = mongoose.Schema (
    {
        username: {
            type: String,
            required: [true, "Please enter a username"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please enter a password"]
        },
        name: {
            type: String,
            required: [true, "Please enter a name"]
        },
        email: {
          type: String,
        },
        visitorID: {
            type: String,
            required: true
        }
    },
    {
        timestamp: true
    }
);


// creating user schema
const User = mongoose.model("User", userSchema);
export default User;