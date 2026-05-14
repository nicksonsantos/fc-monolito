import express, { Request, Response } from 'express';
import InvoiceFacadeInterface from '../facade/invoice.facade.interface';

export function invoiceRoute(facade: InvoiceFacadeInterface) {
  const router = express.Router();

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const input = { id: req.params.id };
      const output = await facade.find(input);
      res.status(200).send(output);
    } catch (error: any) {
      res.status(500).send({ error: error.message || error });
    }
  });

  return router;
}