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

const PORT = 3000; 
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running at PORT : ${PORT}`);
});

// K3mV8vcPQ6HJ6Q1M - Password of DB

// prem9810683167 - UserName of DB

// mongodb+srv://prem9810683167:K3mV8vcPQ6HJ6Q1M@cluster0.hqbi7go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//  mongodb+srv://prem9810683167:<db_password>@cluster0.hqbi7go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://prem9810683167:<db_password>@cluster0.hqbi7go.mongodb.net/
