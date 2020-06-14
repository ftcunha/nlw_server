import {Request, Response} from 'express';
import knex from '../database/conection';

class ItemController {

  async read (request: Request, response: Response) {
    const item = await knex('item').select('*');
    const serializedItem = item.map(item => {
      return {
        id: item.id,
        title: item.title,
        imageUrl: `${request.protocol}://${request.get('host')}/resources/${item.image}`
      };
    });

    return response.json(serializedItem); 
  }
}

export default ItemController;