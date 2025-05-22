import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/books.js';
import pgclient from './db.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.use("/api/books", userRoutes);

app.get("/", (req, res) => {
    res.send("hi")
})

pgclient.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`);

        });
    })