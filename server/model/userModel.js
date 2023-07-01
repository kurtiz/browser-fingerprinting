import mongoose from "mongoose";

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
        visitorID: {
            type: String,
            required: true
        }
    },
    {
        timestamp: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;