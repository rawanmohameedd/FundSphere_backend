require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path")
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

app.use(express.static(path.join(__dirname, '../../FundSphere_frontend/FundSphere/dist')))
app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../FundSphere_frontend/FundSphere', 'dist','index.html'))
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
