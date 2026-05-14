import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceRepository from "./invoice.repository";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemsModel } from "./invoice-items.model";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const item1 = new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
    });

    const item2 = new InvoiceItems({
      id: new Id("2"),
      name: "Item 2",
      price: 200,
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address(
        "Street 1",
        "123",
        "Complement",
        "City",
        "State",
        "12345-678"
      ),
      items: [item1, item2],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } });
    const itemsDb = await InvoiceItemsModel.findAll({ where: { invoiceId: "1" } });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe("1");
    expect(invoiceDb.name).toBe("Invoice 1");
    expect(invoiceDb.document).toBe("123456789");
    expect(invoiceDb.total).toBe(300);
    expect(itemsDb).toHaveLength(2);
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();

    // Create via model for test
    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "12345-678",
      total: 300,
      createdAt: new Date(),
    });

    await InvoiceItemsModel.create({
      id: "1",
      invoiceId: "1",
      name: "Item 1",
      price: 100,
    });

    await InvoiceItemsModel.create({
      id: "2",
      invoiceId: "1",
      name: "Item 2",
      price: 200,
    });

    const invoice = await repository.find("1");

    expect(invoice).toBeDefined();
    expect(invoice.id.id).toBe("1");
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.total).toBe(300);
    expect(invoice.items).toHaveLength(2);
  });
});