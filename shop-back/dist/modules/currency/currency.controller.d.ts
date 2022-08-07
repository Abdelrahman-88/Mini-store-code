import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CreatedByDto } from './dto/createdBy.dto';
import { idDto } from './dto/id.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    create(adminId: CreatedByDto, req: any, createCurrencyDto: CreateCurrencyDto): Promise<object>;
    findAll(): string;
    findOne(): Promise<object>;
    update(currencyId: idDto, updateCurrencyDto: UpdateCurrencyDto): Promise<object>;
    remove(id: string): string;
}
