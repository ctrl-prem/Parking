import express from "express";
import cors from "cors";

import authRouter from "./routes/Auth.js";
import noteRouter from './routes/NoteApi.js';
import connectToMongoDB from "./db/Db.js";

const app = express();
app.use(cors());
app.use(express.json()); // converting coming json data to normal, parses and make data available in req.body
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);


app.listen(import.meta.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server is running at PORT : ${import.meta.env.PORT}`);
});
