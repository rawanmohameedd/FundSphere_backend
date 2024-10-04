require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const userRouter = require('./Routes/users');

const app = express();

app.use(cors());
app.use(fileUpload()); // Initialize file upload middleware
app.use(express.json());

app.use(userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
