import express, { request, response } from 'express';
import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = express.Router();
const pointController = new PointController();
const itemController = new ItemController();

routes.get('/point', pointController.index);
routes.get('/point/:id', pointController.show);
routes.post('/point', pointController.create);

routes.get('/item', itemController.read);

export default routes;