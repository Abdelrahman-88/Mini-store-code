import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
    search = async(search:any, value:any, limit:any, skip:any, model:any, fields:any, populate:any, select:any, mainSelect:any,term:number) => {
        let data:any, total:any, totalPages:any
        Object.keys(value).forEach(key => {
            if (value[key] === '' || value[key] === undefined || value[key] === null) {
                delete value[key];
            }
        });

        if (search) {
            const queries = fields.map((i:any) => {
                return {
                    [i]: { $regex: search }
                };
            });
            data = await model.find({
                ...value,
                $or: queries
            }).select(mainSelect).populate(populate).select(select).sort({createdAt:term}).skip(skip).limit(parseInt(limit))
            total = await model.find({
                ...value,
                $or: queries
            }).select(mainSelect).populate(populate).select(select).sort({createdAt:term}).count()
            totalPages = Math.ceil(total / limit)
        } else {
            data = await model.find({
                ...value
            }).select(mainSelect).populate(populate, select).sort({createdAt:term}).skip(skip).limit(parseInt(limit))
            total = await model.find({
                ...value
            }).select(mainSelect).populate(populate, select).sort({createdAt:term}).count()
            totalPages = Math.ceil(total / limit)
        }
        return { data, total, totalPages }
    }
}
