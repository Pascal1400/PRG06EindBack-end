import express from 'express';
import mongoose from 'mongoose';
import records from "./routes/records.js"
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/prg06Eindopdracht');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    next();
});

app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;
    if (req.method !== 'OPTIONS' && req.headers.accept !== 'application/json') {
        return res.status(406).json({error: 'Alleen json wordt geacepteerd'});
    }
    next();
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/records', records)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});