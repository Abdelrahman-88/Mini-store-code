import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';
export declare class CurrencyService {
    private configService;
    private readonly currencyModel;
    private authService;
    constructor(configService: ConfigService, currencyModel: Model<Currency>, authService: AuthService);
    create(req: any, createdBy: string, createCurrencyDto: CreateCurrencyDto): Promise<object>;
    findAll(): string;
    findOne(): Promise<object>;
    update(currencyId: string, updateCurrencyDto: UpdateCurrencyDto): Promise<object>;
    remove(id: number): string;
}
