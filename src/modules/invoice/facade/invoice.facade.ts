import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto";

export interface UseCaseProps {
  generateUsecase: UseCaseInterface;
  findUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._generateUsecase = usecaseProps.generateUsecase;
    this._findUsecase = usecaseProps.findUsecase;
  }

  async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateUsecase.execute(input);
  }

  async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return await this._findUsecase.execute(input);
  }
}