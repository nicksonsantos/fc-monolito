import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import ClientAdmFacadeFactory from './modules/client-adm/factory/client-adm.facade.factory';
import ProductAdmFacadeFactory from './modules/product-adm/factory/facade.factory';
import PaymentFacadeFactory from './modules/payment/factory/payment.facade.factory';
import StoreCatalogFacadeFactory from './modules/store-catalog/factory/facade.factory';
import InvoiceFacadeFactory from './modules/invoice/factory/invoice.facade.factory';
import { clientRoute } from './modules/client-adm/api/client.route';
import { productRoute } from './modules/product-adm/api/product.route';
import { checkoutRoute } from './api/checkout.route';
import { invoiceRoute } from './modules/invoice/api/invoice.route';
import { ClientModel } from './modules/client-adm/repository/client.model';
import { ProductModel } from './modules/product-adm/repository/product.model';
import TransactionModel from './modules/payment/repository/transaction.model';
import { InvoiceModel } from './modules/invoice/repository/invoice.model';
import { InvoiceItemsModel } from './modules/invoice/repository/invoice-items.model';

export function createApp(sequelize: Sequelize) {
  const app = express();
  app.use(express.json());

  // Facades
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();
  const storeCatalogFacade = StoreCatalogFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  // Routes
  app.use('/clients', clientRoute(clientFacade));
  app.use('/products', productRoute(productFacade));
  app.use('/checkout', checkoutRoute({ clientFacade, productFacade, paymentFacade, storeCatalogFacade, invoiceFacade }));
  app.use('/invoice', invoiceRoute(invoiceFacade));

  return app;
}

async function main() {
  // Database setup (in-memory for simplicity)
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  sequelize.addModels([ClientModel, ProductModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
  await sequelize.sync();

  const app = createApp(sequelize);
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

if (require.main === module) {
  main();
}