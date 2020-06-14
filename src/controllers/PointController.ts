import {Request, Response, request} from 'express';
import knex from '../database/conection';

class PointController {

  async create (request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const {
        image,
        name,
        email,
        whatsapp,
        city,
        uf,
        latitude,
        longitude,
        items
      } = request.body;

      const point = {
        image,
        name,
        email,
        whatsapp,
        city,
        uf,
        latitude,
        longitude
      };

      const insertPoint = await trx('point').insert(point)
      
      const pointId = insertPoint[0];
      const pointItems = items.map((item_id: Number) => {
        return {
          point_id: pointId,
          item_id: item_id
        }
      })
    
      await trx('point_item').insert(pointItems);

      await trx.commit();

      return response.json({
        id: pointId,
        ...point
      });

    } catch (error) {
      await trx.rollback();
      console.error(error);
    }
  }

  async index (request: Request, response: Response) {    
    
    const {uf, city, items} = request.query;
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const point = await knex('point')
      .select('point.*')
      .join('point_item', 'point_item.point_id' , '=', 'point.id')
      .whereIn('point_item.item_id', parsedItems)
      // .where('uf', String(uf))
      // .where('city', String(city))
      .distinct();

    return response.json(point); 
  
  }

  async show (request: Request, response: Response) {
    try {
      
      const { id } = request.params;
      const point = await knex('point').first().where('id', id);
      if (!point) return response.status(400).json({message: 'Point not found'});
  
      // select * from item inner join point_item on point_item.item_id = item.id where point_item.point_id = 1'
      const items = await knex('item')
        .join('point_item', 'point_item.item_id' , '=', 'item.id')
        .where('point_item.point_id', id);
  
      return response.json({point, items}); 
    } catch (error) {
      console.error(error);  
    }
  }

}

export default PointController;