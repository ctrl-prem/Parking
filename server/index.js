import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import authRouter from "./routes/Auth.js";
import noteRouter from './routes/NoteApi.js';
import connectToMongoDB from "./db/Db.js";

dotenv.config();
const app = express();



app.use(cors());



app.use(express.json()); // converting coming json data to normal, parses and make data available in req.body
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running at PORT : ${PORT}`);
});
