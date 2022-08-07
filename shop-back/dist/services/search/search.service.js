"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
let SearchService = class SearchService {
    constructor() {
        this.search = async (search, value, limit, skip, model, fields, populate, select, mainSelect, term) => {
            let data, total, totalPages;
            Object.keys(value).forEach(key => {
                if (value[key] === '' || value[key] === undefined || value[key] === null) {
                    delete value[key];
                }
            });
            if (search) {
                const queries = fields.map((i) => {
                    return {
                        [i]: { $regex: search }
                    };
                });
                data = await model.find(Object.assign(Object.assign({}, value), { $or: queries })).select(mainSelect).populate(populate).select(select).sort({ createdAt: term }).skip(skip).limit(parseInt(limit));
                total = await model.find(Object.assign(Object.assign({}, value), { $or: queries })).select(mainSelect).populate(populate).select(select).sort({ createdAt: term }).count();
                totalPages = Math.ceil(total / limit);
            }
            else {
                data = await model.find(Object.assign({}, value)).select(mainSelect).populate(populate, select).sort({ createdAt: term }).skip(skip).limit(parseInt(limit));
                total = await model.find(Object.assign({}, value)).select(mainSelect).populate(populate, select).sort({ createdAt: term }).count();
                totalPages = Math.ceil(total / limit);
            }
            return { data, total, totalPages };
        };
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)()
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map