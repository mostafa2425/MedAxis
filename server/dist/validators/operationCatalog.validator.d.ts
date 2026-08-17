import { z } from 'zod';
export declare const createCatalogItemSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreateCatalogItemInput = z.infer<typeof createCatalogItemSchema>;
//# sourceMappingURL=operationCatalog.validator.d.ts.map