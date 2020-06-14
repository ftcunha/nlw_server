import cors from 'cors';
import path from 'path';
import express from 'express';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/resources', express.static(path.resolve(__dirname, '..', 'resources')));

app.listen(3000);