const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Server is running');
})

app.listen(3000, () => {
    console.log("Server is running on https://localhost:3000");
})