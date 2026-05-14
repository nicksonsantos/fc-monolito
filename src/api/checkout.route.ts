import express, { Request, Response } from 'express';
import ClientAdmFacadeInterface from '../modules/client-adm/facade/client-adm.facade.interface';
import ProductAdmFacadeInterface from '../modules/product-adm/facade/product-adm.facade.interface';
import PaymentFacadeInterface from '../modules/payment/facade/facade.interface';
import StoreCatalogFacadeInterface from '../modules/store-catalog/facade/store-catalog.facade.interface';
import InvoiceFacadeInterface from '../modules/invoice/facade/invoice.facade.interface';

interface Facades {
  clientFacade: ClientAdmFacadeInterface;
  productFacade: ProductAdmFacadeInterface;
  paymentFacade: PaymentFacadeInterface;
  storeCatalogFacade: StoreCatalogFacadeInterface;
  invoiceFacade: InvoiceFacadeInterface;
}

export function checkoutRoute(facades: Facades) {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { clientId, products } = req.body;

      // Find client
      const client = await facades.clientFacade.find({ id: clientId });

      // Find products and calculate total
      let total = 0;
      const invoiceItems = [];
      for (const item of products) {
        const stock = await facades.productFacade.checkStock({ productId: item.productId });
        if (stock.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
        const product = await facades.storeCatalogFacade.find({ id: item.productId });
        invoiceItems.push({
          id: item.productId,
          name: product.name,
          price: product.salesPrice * item.quantity,
        });
        total += product.salesPrice * item.quantity;
      }

      // Process payment
      const paymentInput = {
        orderId: `order-${Date.now()}`,
        amount: total,
        method: req.body.payment?.method || 'credit_card',
      };
      const paymentOutput = await facades.paymentFacade.process(paymentInput);

      const invoiceInput = {
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: invoiceItems,
      };
      const invoiceOutput = await facades.invoiceFacade.generate(invoiceInput);

      res.status(200).send({
        invoiceId: invoiceOutput.id,
        total: invoiceOutput.total,
        paymentStatus: paymentOutput.status,
      });
    } catch (error: any) {
      res.status(500).send({ error: error.message || error });
    }
  });

  return router;
}