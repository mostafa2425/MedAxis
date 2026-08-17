/**
 * OpenAPI 3.0 specification for MedAxis API.
 * Documentation only — mirrors existing routes/validators; does not alter behavior.
 */
export declare const swaggerSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            ApiSuccess: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {};
                    meta: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            ApiError: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                    };
                    data: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            ValidationIssue: {
                type: string;
                properties: {
                    field: {
                        type: string;
                        example: string;
                    };
                    path: {
                        type: string;
                        items: {
                            oneOf: {
                                type: string;
                            }[];
                        };
                        example: string[];
                    };
                    code: {
                        type: string;
                        example: string;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                };
                required: string[];
            };
            PaginationMeta: {
                type: string;
                properties: {
                    page: {
                        type: string;
                        example: number;
                    };
                    limit: {
                        type: string;
                        example: number;
                    };
                    total: {
                        type: string;
                        example: number;
                    };
                    totalPages: {
                        type: string;
                        example: number;
                    };
                };
            };
            Gender: {
                type: string;
                enum: string[];
            };
            OperationStatus: {
                type: string;
                enum: string[];
            };
            PaymentMethod: {
                type: string;
                enum: string[];
            };
            PaymentStatus: {
                type: string;
                enum: string[];
            };
            FileType: {
                type: string;
                description: string;
                enum: string[];
            };
            TimelineAction: {
                type: string;
                enum: string[];
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    phone: {
                        type: string;
                        nullable: boolean;
                    };
                    role: {
                        type: string;
                        example: string;
                    };
                    isActive: {
                        type: string;
                    };
                    doctorId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    specialties: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                name: {
                                    type: string;
                                };
                                nameAr: {
                                    type: string;
                                    nullable: boolean;
                                };
                            };
                        };
                    };
                    subspecialties: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                name: {
                                    type: string;
                                };
                                nameAr: {
                                    type: string;
                                    nullable: boolean;
                                };
                            };
                        };
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            AuthResponse: {
                type: string;
                properties: {
                    token: {
                        type: string;
                    };
                    user: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                            };
                            email: {
                                type: string;
                                format: string;
                            };
                            name: {
                                type: string;
                            };
                            phone: {
                                type: string;
                                nullable: boolean;
                            };
                            role: {
                                type: string;
                            };
                            isActive: {
                                type: string;
                            };
                            doctorId: {
                                type: string;
                                format: string;
                                nullable: boolean;
                            };
                            specialties: {
                                type: string;
                                description: string;
                                items: {
                                    type: string;
                                    properties: {
                                        id: {
                                            type: string;
                                            format: string;
                                        };
                                        name: {
                                            type: string;
                                        };
                                        nameAr: {
                                            type: string;
                                            nullable: boolean;
                                        };
                                    };
                                };
                            };
                            subspecialties: {
                                type: string;
                                description: string;
                                items: {
                                    type: string;
                                    properties: {
                                        id: {
                                            type: string;
                                            format: string;
                                        };
                                        name: {
                                            type: string;
                                        };
                                        nameAr: {
                                            type: string;
                                            nullable: boolean;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            LoginRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                };
            };
            RegisterRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                    name: {
                        type: string;
                        minLength: number;
                    };
                    phone: {
                        type: string;
                    };
                    specialtyIds: {
                        type: string;
                        minItems: number;
                        description: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                    subspecialtyIds: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            UpdateProfileRequest: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    phone: {
                        type: string;
                        nullable: boolean;
                    };
                    specialtyIds: {
                        type: string;
                        minItems: number;
                        description: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                    subspecialtyIds: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            Specialty: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    nameAr: {
                        type: string;
                        nullable: boolean;
                    };
                    icon: {
                        type: string;
                        nullable: boolean;
                    };
                    parentId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        description: string;
                    };
                    isActive: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateSpecialtyRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    nameAr: {
                        type: string;
                    };
                    icon: {
                        type: string;
                    };
                };
            };
            UpdateSpecialtyRequest: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    nameAr: {
                        type: string;
                    };
                    icon: {
                        type: string;
                    };
                };
            };
            Hospital: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    address: {
                        type: string;
                        nullable: boolean;
                    };
                    phone: {
                        type: string;
                        nullable: boolean;
                    };
                    isActive: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateHospitalRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    address: {
                        type: string;
                    };
                    phone: {
                        type: string;
                    };
                };
            };
            UpdateHospitalRequest: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    address: {
                        type: string;
                    };
                    phone: {
                        type: string;
                    };
                };
            };
            Doctor: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    phone: {
                        type: string;
                        nullable: boolean;
                    };
                    email: {
                        type: string;
                        nullable: boolean;
                    };
                    isActive: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                    specialties: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                name: {
                                    type: string;
                                };
                                nameAr: {
                                    type: string;
                                    nullable: boolean;
                                };
                            };
                        };
                    };
                    subspecialties: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                };
                                name: {
                                    type: string;
                                };
                                nameAr: {
                                    type: string;
                                    nullable: boolean;
                                };
                            };
                        };
                    };
                };
            };
            CreateDoctorRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    phone: {
                        type: string;
                    };
                    mobile: {
                        type: string;
                        description: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    specialtyIds: {
                        type: string;
                        minItems: number;
                        description: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                    specialtyId: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    subspecialtyIds: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            UpdateDoctorRequest: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    phone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    specialtyIds: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                    subspecialtyIds: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            Patient: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    fullName: {
                        type: string;
                    };
                    age: {
                        type: string;
                    };
                    gender: {
                        $ref: string;
                    };
                    mobile: {
                        type: string;
                        nullable: boolean;
                    };
                    notes: {
                        type: string;
                        nullable: boolean;
                    };
                    createdBy: {
                        type: string;
                        format: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreatePatientRequest: {
                type: string;
                required: string[];
                properties: {
                    fullName: {
                        type: string;
                        minLength: number;
                    };
                    age: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    gender: {
                        $ref: string;
                        default: string;
                    };
                    mobile: {
                        type: string;
                    };
                    notes: {
                        type: string;
                    };
                };
            };
            UpdatePatientRequest: {
                type: string;
                properties: {
                    fullName: {
                        type: string;
                        minLength: number;
                    };
                    age: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    gender: {
                        $ref: string;
                    };
                    mobile: {
                        type: string;
                    };
                    notes: {
                        type: string;
                    };
                };
            };
            MedicalTeamInput: {
                type: string;
                properties: {
                    primarySurgeonId: {
                        type: string;
                        format: string;
                    };
                    assistantSurgeonId: {
                        type: string;
                        format: string;
                    };
                    anesthesiologistId: {
                        type: string;
                        format: string;
                    };
                    assistantAnesthesiaId: {
                        type: string;
                        format: string;
                    };
                    nurse: {
                        type: string;
                    };
                    notes: {
                        type: string;
                    };
                };
            };
            CostInput: {
                type: string;
                required: string[];
                properties: {
                    totalCost: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    paidAmount: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    remainingAmount: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    paymentMethod: {
                        $ref: string;
                    };
                    paymentStatus: {
                        $ref: string;
                    };
                    paymentNotes: {
                        type: string;
                    };
                };
            };
            OperationCost: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    operationId: {
                        type: string;
                        format: string;
                    };
                    totalCost: {
                        type: string;
                    };
                    paidAmount: {
                        type: string;
                    };
                    remainingAmount: {
                        type: string;
                    };
                    paymentMethod: {
                        $ref: string;
                    };
                    paymentStatus: {
                        $ref: string;
                    };
                    paymentNotes: {
                        type: string;
                        nullable: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            OperationFile: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    operationId: {
                        type: string;
                        format: string;
                    };
                    fileType: {
                        $ref: string;
                    };
                    fileName: {
                        type: string;
                    };
                    filePath: {
                        type: string;
                    };
                    url: {
                        type: string;
                        description: string;
                    };
                    fileUrl: {
                        type: string;
                        description: string;
                    };
                    fileSize: {
                        type: string;
                        nullable: boolean;
                    };
                    mimeType: {
                        type: string;
                        nullable: boolean;
                    };
                    uploadedBy: {
                        type: string;
                        format: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            OperationTimeline: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    operationId: {
                        type: string;
                        format: string;
                    };
                    action: {
                        $ref: string;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                    userId: {
                        type: string;
                        format: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            Operation: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    diagnosis: {
                        type: string;
                        nullable: boolean;
                    };
                    hospitalId: {
                        type: string;
                        format: string;
                    };
                    operationDate: {
                        type: string;
                        format: string;
                    };
                    operationTime: {
                        type: string;
                    };
                    operationRoom: {
                        type: string;
                        nullable: boolean;
                    };
                    duration: {
                        type: string;
                        nullable: boolean;
                    };
                    status: {
                        $ref: string;
                    };
                    notes: {
                        type: string;
                        nullable: boolean;
                    };
                    patientId: {
                        type: string;
                        format: string;
                    };
                    createdBy: {
                        type: string;
                        format: string;
                    };
                    specialtyId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                    patient: {
                        $ref: string;
                    };
                    hospital: {
                        $ref: string;
                    };
                    specialty: {
                        $ref: string;
                    };
                    medicalTeam: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    files: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    cost: {
                        $ref: string;
                    };
                };
            };
            OperationCatalogItem: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    nameAr: {
                        type: string;
                        nullable: boolean;
                    };
                    isCustom: {
                        type: string;
                    };
                    specialty: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                            };
                            name: {
                                type: string;
                            };
                            nameAr: {
                                type: string;
                                nullable: boolean;
                            };
                        };
                    };
                    subspecialty: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                            };
                            name: {
                                type: string;
                            };
                            nameAr: {
                                type: string;
                                nullable: boolean;
                            };
                        };
                    };
                };
            };
            CreateOperationRequest: {
                type: string;
                required: string[];
                properties: {
                    operationId: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    name: {
                        type: string;
                        minLength: number;
                        description: string;
                    };
                    diagnosis: {
                        type: string;
                        nullable: boolean;
                    };
                    hospitalId: {
                        type: string;
                        format: string;
                    };
                    operationDate: {
                        type: string;
                        description: string;
                    };
                    operationTime: {
                        type: string;
                        example: string;
                    };
                    operationRoom: {
                        type: string;
                    };
                    duration: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    status: {
                        $ref: string;
                    };
                    notes: {
                        type: string;
                    };
                    patientId: {
                        type: string;
                        format: string;
                    };
                    specialtyId: {
                        type: string;
                        format: string;
                    };
                    medicalTeam: {
                        $ref: string;
                    };
                    cost: {
                        $ref: string;
                    };
                };
            };
            UpdateOperationRequest: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    diagnosis: {
                        type: string;
                        nullable: boolean;
                    };
                    hospitalId: {
                        type: string;
                        format: string;
                    };
                    operationDate: {
                        type: string;
                    };
                    operationTime: {
                        type: string;
                    };
                    operationRoom: {
                        type: string;
                    };
                    duration: {
                        type: string;
                        minimum: number;
                    };
                    status: {
                        $ref: string;
                    };
                    notes: {
                        type: string;
                    };
                    patientId: {
                        type: string;
                        format: string;
                    };
                    specialtyId: {
                        type: string;
                        format: string;
                    };
                    medicalTeam: {
                        $ref: string;
                    };
                    cost: {
                        $ref: string;
                    };
                };
            };
            UpdateStatusRequest: {
                type: string;
                required: string[];
                properties: {
                    status: {
                        $ref: string;
                    };
                };
            };
            UpdateCostRequest: {
                $ref: string;
            };
        };
        parameters: {
            IdParam: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                    format: string;
                };
            };
            PageQuery: {
                name: string;
                in: string;
                schema: {
                    type: string;
                    minimum: number;
                    default: number;
                };
            };
            LimitQuery: {
                name: string;
                in: string;
                schema: {
                    type: string;
                    minimum: number;
                    maximum: number;
                    default: number;
                };
            };
            SearchQuery: {
                name: string;
                in: string;
                schema: {
                    type: string;
                };
            };
        };
        responses: {
            BadRequest: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            Unauthorized: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            Forbidden: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            NotFound: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            Conflict: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
        };
    };
    paths: {
        '/health': {
            get: {
                tags: string[];
                summary: string;
                security: never[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        status: {
                                            type: string;
                                            example: string;
                                        };
                                        timestamp: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/login': {
            post: {
                tags: string[];
                summary: string;
                security: never[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: undefined;
                                        properties?: undefined;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/auth/register': {
            post: {
                tags: string[];
                summary: string;
                security: never[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '409': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/specialties': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: never[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        minimum?: undefined;
                        maximum?: undefined;
                    };
                    description: string;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        format?: undefined;
                        type: string;
                        minimum?: undefined;
                        maximum?: undefined;
                    };
                    description: string;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        format?: undefined;
                        type: string;
                        minimum?: undefined;
                        maximum?: undefined;
                    };
                    description?: undefined;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        format?: undefined;
                        type: string;
                        minimum: number;
                        maximum?: undefined;
                    };
                    description: string;
                } | {
                    description?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        format?: undefined;
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '403': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/specialties/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '403': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '403': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/hospitals': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                            meta: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/hospitals/active': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/hospitals/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/doctors': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name?: undefined;
                    $ref: string;
                    in?: undefined;
                    schema?: undefined;
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                            meta: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/doctors/active': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/doctors/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/patients': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name?: undefined;
                    in?: undefined;
                    schema?: undefined;
                    $ref: string;
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        $ref: string;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                            meta: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/patients/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operation-catalog': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        minLength: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '409': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name?: undefined;
                    in?: undefined;
                    schema?: undefined;
                    $ref: string;
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        type?: undefined;
                        format?: undefined;
                        $ref: string;
                        enum?: undefined;
                        default?: undefined;
                    };
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        type: string;
                        format: string;
                        enum?: undefined;
                        default?: undefined;
                    };
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        format?: undefined;
                        type: string;
                        enum?: undefined;
                        default?: undefined;
                    };
                } | {
                    $ref?: undefined;
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        format?: undefined;
                        type: string;
                        enum: string[];
                        default: string;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                            meta: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{id}/timeline': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{id}/status': {
            patch: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{id}/cost': {
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                $ref: string;
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{id}/files': {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    $ref: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    file: {
                                        type: string;
                                        format: string;
                                    };
                                    files: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                    fileType: {
                                        type: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        type?: undefined;
                                        properties?: undefined;
                                        $ref: string;
                                    } | {
                                        $ref?: undefined;
                                        type: string;
                                        properties: {
                                            data: {
                                                type: string;
                                                items: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    '400': {
                        $ref: string;
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/operations/{operationId}/files/{fileId}': {
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                    '404': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/dashboard/stats': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/dashboard/recent-operations': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/dashboard/specialty-distribution': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/dashboard/monthly-trends': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/dashboard/revenue': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
        '/api/export/operations': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        format?: undefined;
                        type: string;
                        enum: string[];
                        default: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type?: undefined;
                        format?: undefined;
                        enum?: undefined;
                        default?: undefined;
                        $ref: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        enum?: undefined;
                        default?: undefined;
                        type: string;
                        format: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        $ref?: undefined;
                        format?: undefined;
                        enum?: undefined;
                        default?: undefined;
                        type: string;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {};
                                        meta: {
                                            type: string;
                                            properties: {
                                                totalRecords: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            'text/csv': {
                                schema: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                    '401': {
                        $ref: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=swagger.d.ts.map