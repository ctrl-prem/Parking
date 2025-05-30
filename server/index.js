import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import authRouter from "./routes/Auth.js";
import noteRouter from './routes/NoteApi.js';
import connectToMongoDB from "./db/Db.js";

dotenv.config();
const app = express();



const allowedOrigins = [
  'https://note-app-six-nu.vercel.app',   // your frontend domain
  // add more if needed, or use '*' carefully
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // if you use cookies or auth
}));



app.use(express.json()); // converting coming json data to normal, parses and make data available in req.body
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running at PORT : ${PORT}`);
});
