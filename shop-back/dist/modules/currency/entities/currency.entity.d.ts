import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateCDto } from '../dto/create-c.dto';
export declare class Currency extends Document {
    createdBy: User;
    aed: CreateCDto;
    usd: CreateCDto;
    eur: CreateCDto;
    jpy: CreateCDto;
    _doc?: any;
}
export declare const CurrencySchema: mongoose.Schema<Currency, mongoose.Model<Currency, any, any, any>, {}, {}>;
