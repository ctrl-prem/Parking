import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import authRouter from "./routes/Auth.js";
import noteRouter from './routes/NoteApi.js';
import connectToMongoDB from "./db/Db.js";

dotenv.config();
const app = express();

const whiteList = ['https://note-app-xi-lilac.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));


app.use(express.json()); // converting coming json data to normal, parses and make data available in req.body
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running at PORT : ${PORT}`);
});
