import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesService {
    getPages = (page:number, size:number) => {
        if (!page || page <= 0) {
            page = 1
        }
        if (!size || size <= 0 || size > 100) {
            size = 10
        }
        const skip = (page - 1) * size
        return { skip, limit: +size, currentPage: +page }
    }
}
