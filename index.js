import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors'
import router from './Routes/internshipRouter.js';
import OfferRouter from './Routes/offerLetterRoutes.js';
import courseRouter from './Routes/courseRouter.js';
import registerRouter from './Routes/registerRoute.js';
import LoginRouter from './models/Loginrouter.js';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})
);

app.use(express.json())

const PORT = 8003;

//get , post methods...
app.post('/', (req, res) => {
    const student = { name: "Guddo", UIN: "123" };
    return res.status(200).json({ success: true, message: `server is live at PORT: ${PORT}`, student })
});

//routers...
app.use('/api', router);
app.use('/api2', OfferRouter);
app.use('/api3' , courseRouter);
app.use('/api4' , registerRouter);
app.use('/api5' , LoginRouter);

//DB connection..
const connectDB = async () => {
    try {
        const DB = await mongoose.connect(process.env.DBUrl);
        console.log(process.env.DBUrl);
        
        console.log('DB is connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running at PORT: ${PORT}`);
    })
});
