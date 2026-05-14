import InvoiceFacade from "./invoice.facade";

const MockUsecase = () => {
  return {
    execute: jest.fn(),
  };
};

describe("Invoice Facade test", () => {
  it("should generate an invoice", async () => {
    const generateUsecase = MockUsecase();
    const findUsecase = MockUsecase();
    const facade = new InvoiceFacade({
      generateUsecase,
      findUsecase,
    });

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "12345-678",
      items: [{ id: "1", name: "Item 1", price: 100 }],
    };

    await facade.generate(input);

    expect(generateUsecase.execute).toHaveBeenCalledWith(input);
  });

  it("should find an invoice", async () => {
    const generateUsecase = MockUsecase();
    const findUsecase = MockUsecase();
    const facade = new InvoiceFacade({
      generateUsecase,
      findUsecase,
    });

    const input = { id: "1" };
    const output = { id: "1", name: "Invoice 1", total: 100 };

    findUsecase.execute.mockReturnValue(output);

    const result = await facade.find(input);

    expect(findUsecase.execute).toHaveBeenCalledWith(input);
    expect(result).toBe(output);
  });
});