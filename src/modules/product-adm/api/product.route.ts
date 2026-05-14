import express, { Request, Response } from 'express';
import ProductAdmFacadeInterface from '../facade/product-adm.facade.interface';

export function productRoute(facade: ProductAdmFacadeInterface) {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        purchasePrice: req.body.purchasePrice,
        stock: req.body.stock,
      };

      await facade.addProduct(input);
      res.status(201).send();
    } catch (error: any) {
      res.status(500).send({ error: error.message || error });
    }
  });

  return router;
}