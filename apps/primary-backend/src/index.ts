import express from 'express';
import cors from 'cors';
import { config } from './config';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

import { indexRouter } from './routes';

app.use('/api', indexRouter);


app.listen(config.PORT, () => {
    console.log('Server is running on port 3000');
});