require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const userRouter = require('./Routes/users');
const campaignRouter = require('./Routes/campaigns')
const donationRouter = require('./Routes/donations')
const app = express();

app.use(cors());
app.use(fileUpload()); 
app.use(express.json());

app.use(userRouter);
app.use(campaignRouter)
app.use(donationRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
