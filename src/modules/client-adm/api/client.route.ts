import express, { Request, Response } from 'express';
import ClientAdmFacadeInterface from '../facade/client-adm.facade.interface';
import Address from '../../@shared/domain/value-object/address';

export function clientRoute(facade: ClientAdmFacadeInterface) {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        document: req.body.document,
        address: new Address(
          req.body.address.street,
          req.body.address.number,
          req.body.address.complement,
          req.body.address.city,
          req.body.address.state,
          req.body.address.zipCode,
        ),
      };

      await facade.add(input);
      res.status(201).send();
    } catch (error: any) {
      res.status(500).send({ error: error.message || error });
    }
  });

  return router;
}