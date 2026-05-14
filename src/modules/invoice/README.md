# Invoice Module

This module implements the Invoice functionality for the monolithic system, including domain entities, use cases, repository, and facade.

## Running Tests

To run the tests for the Invoice module, use the following command from the project root:

```bash
npm test -- --testPathPattern=invoice
```

This will execute all unit tests for the invoice components, including:
- Repository tests (invoice.repository.spec.ts)
- Use case tests (generate-invoice.usecase.spec.ts, find-invoice.usecase.spec.ts)
- Facade tests (invoice.facade.spec.ts)

All tests should pass, validating the functionality of the use cases and integration with the facade.