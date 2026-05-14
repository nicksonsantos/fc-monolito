import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice-items.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(new Invoice({
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
      items: [
        new InvoiceItems({ id: new Id("1"), name: "Item 1", price: 100 }),
        new InvoiceItems({ id: new Id("2"), name: "Item 2", price: 200 }),
      ],
      createdAt: new Date(),
    }))),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = { id: "1" };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.total).toBe(300);
    expect(result.items).toHaveLength(2);
  });
});