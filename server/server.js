import express from 'express';
import bcrypt from 'bcrypt';
import connect_database from "./database/db.js"
import User from "./model/userModel.js";

const app = express();

app.use(express.json())

app.get('/', function (req, res) {
    res.send('api server is running');
})

app.post("/signup", async (request, response) => {
    try {
        User.findOne({visitorID: request.body.visitorID, })
            .then(existingUser => {
                if (existingUser) {
                    // Data with the same visitor ID already exists
                    console.log("Data with the same visitor ID already exists");
                    response.status(409).json({message: "Data with the same visitor ID already exists"});
                } else {
                    // Data with the same visitor ID does not exist, you can add the new data
                    bcrypt.hash(request.body.password, 10)
                        .then(async hash => {
                            // Store the 'hash' value in your user model or save it to the database
                            console.log('Hashed password:', hash)
                            const userData = {
                                ...request.body,
                                password: hash
                            }
                            const user = await User.create(userData)
                                .then(savedUser => {
                                    console.log("Data added successfully:", savedUser);
                                    response.status(200).json(savedUser);
                                })
                                .catch(error => {
                                    console.log("Error saving data:", error);
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
                response.status(500).json({message: error.message});
            });

    } catch (error) {
        console.log(error.message);
        response.status(500).json({message: error.message});
    }
})

app.post("/login", (request, response) => {
    try {
        User.findOne({username: request.body.username})
            .then(existingUser => {
                if (existingUser) {
                    // Data with the same visitor ID already exists
                    bcrypt.compare(request.body.password, existingUser.password)
                        .then(isMatch => {
                            if (isMatch) {
                                // Passwords match, proceed with authentication
                                response.status(200).json(existingUser);
                            } else {
                                // Passwords don't match
                                response.status(401).json({message: "Invalid username or password"});
                            }
                        })
                        .catch(error => {
                            // Handle error
                            console.log('Error comparing passwords:', error);
                            response.status(401).json({message: "Invalid username or password"});
                        });
                } else {
                    // user doesn't exist
                    response.status(401).json({message: "Invalid username or password"});
                }
            })
            .catch(error => {
                console.log("Error querying data:", error);
                response.status(500).json({message: error.message});
            });

    } catch (error) {
        console.log(error.message);
        response.status(500).json({message: error.message});
    }
} )
const start_server = () => {
    app.listen(3000, () => {
        console.log("Server is running on https://localhost:3000");
    })
}

connect_database(start_server);