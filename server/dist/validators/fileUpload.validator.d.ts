import { z } from 'zod';
export declare const createUploadUrlSchema: z.ZodObject<{
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodCoercedNumber<unknown>;
    fileType: z.ZodEnum<{
        AFTER_IMAGE: "AFTER_IMAGE";
        AFTER_OTHER: "AFTER_OTHER";
        AFTER_PDF: "AFTER_PDF";
        AFTER_REPORT: "AFTER_REPORT";
        BEFORE_CT: "BEFORE_CT";
        BEFORE_IMAGE: "BEFORE_IMAGE";
        BEFORE_LAB: "BEFORE_LAB";
        BEFORE_MRI: "BEFORE_MRI";
        BEFORE_PDF: "BEFORE_PDF";
        BEFORE_XRAY: "BEFORE_XRAY";
    }>;
}, z.core.$strip>;
export declare const completeUploadSchema: z.ZodObject<{
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodCoercedNumber<unknown>;
    fileType: z.ZodEnum<{
        AFTER_IMAGE: "AFTER_IMAGE";
        AFTER_OTHER: "AFTER_OTHER";
        AFTER_PDF: "AFTER_PDF";
        AFTER_REPORT: "AFTER_REPORT";
        BEFORE_CT: "BEFORE_CT";
        BEFORE_IMAGE: "BEFORE_IMAGE";
        BEFORE_LAB: "BEFORE_LAB";
        BEFORE_MRI: "BEFORE_MRI";
        BEFORE_PDF: "BEFORE_PDF";
        BEFORE_XRAY: "BEFORE_XRAY";
    }>;
    filePath: z.ZodString;
}, z.core.$strip>;
export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;
//# sourceMappingURL=fileUpload.validator.d.ts.map