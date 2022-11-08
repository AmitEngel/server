import express from "express";
import cors from 'cors'
import path from 'path';
import {config} from 'dotenv'
import mongoose from "mongoose";
import authRoute from './routes/auth.mjs';
import shopRoute from './routes/shop.mjs';
config()

const app = express()
const PORT = 4286;
app.use(cors('https://bestshopping.onrender.com'))

mongoose.connect(`mongodb+srv://amit:${process.env.MONGO_ATLAS_PW}@cluster0.kcdgtly.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to database!"))
    .catch((err) => console.log("Connection failed!", err))


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    )
    next()
})

app.use(express.json())
app.use('/images',express.static(path.join('images')))
app.use("/api/auth", authRoute)
app.use("/api/shop", shopRoute)

app.listen(PORT, () => console.log('Server started on port ' + PORT))
