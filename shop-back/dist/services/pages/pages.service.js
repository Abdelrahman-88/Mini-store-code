"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
let PagesService = class PagesService {
    constructor() {
        this.getPages = (page, size) => {
            if (!page || page <= 0) {
                page = 1;
            }
            if (!size || size <= 0 || size > 100) {
                size = 10;
            }
            const skip = (page - 1) * size;
            return { skip, limit: +size, currentPage: +page };
        };
    }
};
PagesService = __decorate([
    (0, common_1.Injectable)()
], PagesService);
exports.PagesService = PagesService;
//# sourceMappingURL=pages.service.js.map