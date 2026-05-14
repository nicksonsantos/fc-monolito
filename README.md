# FC Monolito

Este é um sistema monolítico desenvolvido em TypeScript, seguindo princípios de arquitetura modular. O projeto implementa funcionalidades de e-commerce, incluindo gestão de clientes, pagamentos, produtos, catálogo de loja e faturamento (invoices).

## Estrutura do Projeto

O sistema é organizado em módulos independentes dentro de `src/modules/`:

- **@shared**: Componentes compartilhados (entidades base, value objects, interfaces)
- **client-adm**: Administração de clientes
- **payment**: Processamento de pagamentos
- **product-adm**: Administração de produtos
- **store-catalog**: Catálogo da loja
- **invoice**: Módulo de faturamento (novo)

Cada módulo segue a arquitetura com:
- Domain (entidades e regras de negócio)
- Use Cases (casos de uso)
- Repository (persistência)
- Facade (interface pública)
- Factory (criação da facade)

## Tecnologias

- **Linguagem**: TypeScript
- **Framework**: Node.js
- **Banco de dados**: SQLite (para testes) / Sequelize ORM
- **Testes**: Jest
- **Build**: TypeScript Compiler

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/devfullcycle/fc-monolito.git
cd fc-monolito
```

2. Instale as dependências:
```bash
npm install
```

## Executando Testes

Para executar todos os testes:
```bash
npm test
```

Para executar testes de um módulo específico (exemplo: invoice):
```bash
npm test -- --testPathPattern=invoice
```

## Compilação

Para verificar a compilação TypeScript sem gerar arquivos:
```bash
npm run tsc
```

## Módulos

### Invoice Module
Implementa a funcionalidade de faturamento com:
- Geração de notas fiscais
- Busca de notas fiscais
- Validação de dados
- Persistência com relacionamentos

Para mais detalhes sobre o módulo Invoice, consulte [src/modules/invoice/README.md](src/modules/invoice/README.md).

## Contribuição

1. Crie uma branch para sua feature
2. Implemente seguindo a arquitetura dos módulos existentes
3. Adicione testes automatizados
4. Execute `npm test` para validar
5. Faça commit e push
6. Abra um Pull Request