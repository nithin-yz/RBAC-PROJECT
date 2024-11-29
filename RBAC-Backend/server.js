require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());


//routefiles
const Authroutes =require('./routes/auth')
const Protectedroute=require('./routes/protected')

// Routes
app.use('/api/auth',Authroutes );
app.use('/api/auth',Protectedroute );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
