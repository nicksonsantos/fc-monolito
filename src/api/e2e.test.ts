import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { createApp } from '../main';
import { ClientModel } from '../modules/client-adm/repository/client.model';
import { ProductModel } from '../modules/product-adm/repository/product.model';
import TransactionModel from '../modules/payment/repository/transaction.model';
import { InvoiceModel } from '../modules/invoice/repository/invoice.model';
import { InvoiceItemsModel } from '../modules/invoice/repository/invoice-items.model';

describe('E2E API Tests', () => {
  let app: any;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './test.db',
      logging: false,
    });

    sequelize.addModels([ClientModel, ProductModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync({ force: true });
    await sequelize.authenticate();

    app = createApp(sequelize);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        id: '1',
        name: 'Client 1',
        email: 'client@test.com',
        document: '123456789',
        address: {
          street: 'Street 1',
          number: '123',
          complement: 'Complement',
          city: 'City',
          state: 'State',
          zipCode: '12345-678',
        },
      });

    expect(response.status).toBe(201);
  });

  it('should create a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        purchasePrice: 100,
        stock: 10,
      });

    expect(response.status).toBe(201);
  });

  it('should checkout and generate invoice', async () => {
    // First create client and product
    await request(app)
      .post('/clients')
      .send({
        id: '1',
        name: 'Client 1',
        email: 'client@test.com',
        document: '123456789',
        address: {
          street: 'Street 1',
          number: '123',
          complement: 'Complement',
          city: 'City',
          state: 'State',
          zipCode: '12345-678',
        },
      });

    await request(app)
      .post('/products')
      .send({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        purchasePrice: 100,
        stock: 10,
      });

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId: '1',
        products: [{ productId: '1', quantity: 1 }],
        payment: { method: 'credit_card' },
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('invoiceId');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('paymentStatus');
  });

  it('should get an invoice', async () => {
    // First create client and product and checkout to generate invoice
    await request(app)
      .post('/clients')
      .send({
        id: '2',
        name: 'Client 2',
        email: 'client2@test.com',
        document: '987654321',
        address: {
          street: 'Street 2',
          number: '456',
          complement: 'Complement 2',
          city: 'City 2',
          state: 'State 2',
          zipCode: '87654-321',
        },
      });

    await request(app)
      .post('/products')
      .send({
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        purchasePrice: 200,
        stock: 20,
      });

    const checkoutResponse = await request(app)
      .post('/checkout')
      .send({
        clientId: '2',
        products: [{ productId: '2', quantity: 1 }],
        payment: { method: 'credit_card' },
      });

    const invoiceId = checkoutResponse.body.invoiceId;

    const response = await request(app)
      .get(`/invoice/${invoiceId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('total');
  });
});