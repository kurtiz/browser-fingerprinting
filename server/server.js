import express from 'express';
import bcrypt from 'bcrypt';
import connect_database from "./database/db.js"
import User from "./model/userModel.js";
import Fingerprint from "./model/fingerprintModel.js";
import cors from 'cors';

// creating an instance of the express server
const app = express();

const getFormattedDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString();
};

/// enabling the json middleware to be able to accept json data from requests made to the api endpoints
app.use(express.json())
app.use(cors())

// root endpoint
app.get('/', function (req, res) {
    res.send('api server is running');
})

// sign up endpoint
app.post("/signup", async (request, response) => {
    try {
        // retrieving existing users with visitorID (browser fingerprint)
        User.findOne({visitorID: request.body.visitorID,})
            .then(existingUser => {
                // checking if the visitorID exist and prevents new signup
                if (existingUser) {
                    // Data with the same visitor ID already exists
                    console.log("Data with the same visitor ID already exists");
                    // returns http response code alongside error
                    response.status(409).json({message: "This device has already been used to sign up!"});
                } else {
                    // Data with the same visitor ID does not exist,
                    // hashing password of user to
                    bcrypt.hash(request.body.password, 10)
                        .then(async hash => {
                            // Store the 'hash' value in your user model or save it to the database
                            console.log('Hashed password:', hash);
                            const userData = {
                                ...request.body,
                                password: hash
                            }
                            // saving user data to database to create the new user
                            const user = await User.create(userData)
                                .then(savedUser => {
                                    console.log("Data added successfully:", savedUser);
                                    // returning http response code and saved user data
                                    response.status(200).json(savedUser);
                                })
                                .catch(error => {
                                    console.log("Error saving data:", error);
                                    // returning http response code alongside error
                                    response.status(409).json({message: error});
                                });
                        })
                        .catch(error => {
                            // Handle error
                            console.log('Error hashing password:', error);
                        })
                }
            })
            .catch(error => {
                console.log("Error querying data:", error);
                // returning http response code alongside error
                response.status(500).json({message: error.message});
            });

    } catch (error) {
        console.log(error.message);
        // returning http response code alongside error
        response.status(500).json({message: error.message});
    }
})

// login endpoint
app.post("/login", (request, response) => {
    try {
        // retrieving existing users with username
        User.findOne({username: request.body.username})
            .then(existingUser => {
                // checking user exists with username
                if (existingUser) {
                    // Data with the same username exists
                    // compare the password hashes to authenticate user
                    bcrypt.compare(request.body.password, existingUser.password)
                        .then(async isMatch => {
                            if (isMatch) {
                                delete existingUser.password;
                                // Passwords match, proceed with authentication
                                // returning http response code with user info
                                if (request.body.remember_me) {
                                    console.log("remember me")
                                    Fingerprint.findOne({visitorID: request.body.fingerprint.visitorID})
                                        .then(async existingFingerprint => {
                                            // checking if fingerprint exists with visitorID
                                            if (existingFingerprint) {
                                                // update fingerprint with new access data
                                                console.log("existing fingerprint")
                                                if (!existingFingerprint.isLoggedIn) {
                                                    const updatedFingerprint = {
                                                        $set: {
                                                            isLoggedIn: request.body.fingerprint.isLoggedIn,
                                                            lastSeen: request.body.fingerprint.lastSeen
                                                        }
                                                    }
                                                    const finger = await Fingerprint.updateOne(
                                                        {
                                                            _id: existingFingerprint._id
                                                        },
                                                        updatedFingerprint
                                                    );
                                                    console.log("updated fingerprint: ", finger)
                                                    response.status(200).json({user:existingUser, lastSeen: existingFingerprint.lastSeen});
                                                } else {
                                                    const errorMessage = "You have logged into a device already. " +
                                                        "Log out of that device to be able to login to a new device";
                                                    console.log(errorMessage);
                                                    // returning http response code alongside error
                                                    response.status(409).json({message: errorMessage});
                                                }
                                            } else {
                                                // creates new fingerprint access data
                                                console.log("request: ", request.body.fingerprint)
                                                Fingerprint.create(request.body.fingerprint)
                                                    .then(savedFingerprint => {
                                                        // successfully created new fingerprint
                                                        console.log("Data added successfully:", savedFingerprint);
                                                    })
                                                    .catch(error => {
                                                        console.log("Error saving fingerprint data:", error);
                                                        // returning http response code alongside error
                                                        response.status(409).json({message: error});
                                                    });
                                                // returning http response code alongside user data for caching upon login success
                                                response.status(200).json(existingUser);
                                            }
                                        })
                                        .catch(error => {
                                            console.log("Error querying data:", error);
                                            // returning http response code alongside error
                                            response.status(500).json({message: error.message});
                                        });
                                } else {
                                    // returning http response code and user data
                                    response.status(200).json({user: existingUser, lastSeen: getFormattedDate()});
                                }
                            } else {
                                // Passwords don't match
                                // returning http response code alongside error
                                response.status(401).json({message: "Invalid username or password"});
                            }
                        })
                        .catch(error => {
                            // Handle error
                            console.log('Error comparing passwords:', error);
                            // returning http response code alongside error
                            response.status(401).json({message: "Invalid username or password"});
                        });
                } else {
                    // user doesn't exist
                    // returning http response code alongside error
                    response.status(401).json({message: "Invalid username or password"});
                }
            })
            .catch(error => {
                console.log("Error querying data:", error);
                // returning http response code alongside error
                response.status(500).json({message: error.message});
            });

    } catch (error) {
        console.log(error.message);
        // returning http response code alongside error
        response.status(500).json({message: error.message});
    }
});

// logout endpoint
app.post("/logout", (request, response) => {
    try {
        // retrieving existing users with username
        console.log(request.body.username)
        User.findOne({username: request.body.username})
            .then(existingUser => {
                // console.log(existingUser)
                // checking user exists with username
                if (existingUser) {
                    Fingerprint.findOne({visitorID: existingUser.visitorID})
                        .then(async existingFingerprint => {
                            // checking if fingerprint exists with visitorID
                            // console.log(existingFingerprint)
                            if (existingFingerprint && existingUser.visitorID === existingFingerprint.visitorID) {
                                const formattedDate = getFormattedDate();
                                const updatedFingerprint = {
                                    $set: {
                                        isLoggedIn: false,
                                        lastSeen: formattedDate
                                    }
                                }
                                const finger = await Fingerprint.updateOne(
                                    {
                                        _id: existingFingerprint._id
                                    },
                                    updatedFingerprint
                                );
                                // console.log(finger)
                            }
                        })
                }
                // returning http response code alongside error
                console.log("logged out")
                response.status(200).json({message: "logged out successfully"});
            })
    } catch (error) {
        console.log(error.message);
        // returning http response code alongside error
        response.status(500).json({message: error.message});
    }
});

app.post("/authenticate", (request, response) => {
    try {
        // retrieving existing users with username
        console.log(request.body.username)
        User.findOne({username: request.body.username})
            .then(existingUser => {
                // checking user exists with username
                console.log(existingUser)
                if (existingUser) {
                    Fingerprint.findOne({visitorID: existingUser.visitorID})
                        .then(async existingFingerprint => {
                            // checking if fingerprint exists with visitorID
                            console.log(existingFingerprint)
                            if (existingFingerprint) {
                                if (!existingFingerprint.isLoggedIn) {
                                    response.status(401).json({message: "User is not authenticated"});
                                } else {
                                    response.status(200).json({message: "User is authenticated"});
                                }
                            }
                        })
                } else {
                    // returning http response code alongside error
                    response.status(404).json({message: "User not found"});
                }
            })
    } catch (error) {
        console.log(error.message);
        // returning http response code alongside error
        response.status(500).json({message: error.message});
    }
});

/**
 * starts server and listens for endpoint requests
 */
const start_server = () => {
    app.listen(3000, () => {
        console.log("Server is running on https://localhost:3000");
    })
}

// connects to database and takes the parameter which is a function and runs it as a callback function
// when the connection to the database is successful
connect_database(start_server);