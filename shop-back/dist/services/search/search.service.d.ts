export declare class SearchService {
    search: (search: any, value: any, limit: any, skip: any, model: any, fields: any, populate: any, select: any, mainSelect: any, term: number) => Promise<{
        data: any;
        total: any;
        totalPages: any;
    }>;
}
