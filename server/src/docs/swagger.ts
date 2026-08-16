/**
 * OpenAPI 3.0 specification for MedAxis API.
 * Documentation only — mirrors existing routes/validators; does not alter behavior.
 */

const bearerAuth = [{ BearerAuth: [] }];

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MedAxis API',
    version: '1.0.0',
    description:
      'MedAxis Medical Management API. Authenticated endpoints require a JWT Bearer token obtained from `/api/auth/login` or `/api/auth/register`. Specialty create/update/delete require the `admin` role.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Health', description: 'Server health check' },
    { name: 'Authentication', description: 'Login, register, and current user' },
    { name: 'Specialties', description: 'Medical specialties' },
    { name: 'Hospitals', description: 'Hospital management' },
    { name: 'Doctors', description: 'Doctor management' },
    { name: 'Patients', description: 'Patient management' },
    { name: 'Operations', description: 'Surgeries / operations, costs, files, timeline' },
    { name: 'Operation Catalog', description: 'Selectable operation types filtered by doctor specialties' },
    { name: 'Dashboard', description: 'Dashboard statistics and charts' },
    { name: 'Export', description: 'Data export' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token. Use the `token` value returned by login or register.',
      },
    },
    schemas: {
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: {},
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
        required: ['success', 'message'],
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/ValidationIssue' },
          },
        },
        required: ['success', 'message'],
      },
      ValidationIssue: {
        type: 'object',
        properties: {
          field: { type: 'string', example: 'name' },
          path: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
            example: ['name'],
          },
          code: { type: 'string', example: 'invalid_type' },
          message: { type: 'string', example: 'Invalid input: expected string, received undefined' },
        },
        required: ['field', 'path', 'code', 'message'],
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
      Gender: {
        type: 'string',
        enum: ['MALE', 'FEMALE'],
      },
      OperationStatus: {
        type: 'string',
        enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      },
      PaymentMethod: {
        type: 'string',
        enum: ['CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER'],
      },
      PaymentStatus: {
        type: 'string',
        enum: ['PAID', 'UNPAID', 'PARTIAL'],
      },
      FileType: {
        type: 'string',
        description:
          'Stored enum values. Upload aliases: `BEFORE_OPERATION` → `BEFORE_IMAGE`, `AFTER_OPERATION` → `AFTER_IMAGE`.',
        enum: [
          'BEFORE_IMAGE',
          'BEFORE_XRAY',
          'BEFORE_MRI',
          'BEFORE_CT',
          'BEFORE_LAB',
          'BEFORE_PDF',
          'AFTER_IMAGE',
          'AFTER_REPORT',
          'AFTER_PDF',
          'AFTER_OTHER',
        ],
      },
      TimelineAction: {
        type: 'string',
        enum: [
          'OPERATION_CREATED',
          'OPERATION_UPDATED',
          'OPERATION_DELETED',
          'STATUS_CHANGED',
          'FILES_UPLOADED',
          'COST_UPDATED',
          'NOTES_UPDATED',
          'TEAM_UPDATED',
        ],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          phone: { type: 'string', nullable: true },
          role: { type: 'string', example: 'doctor' },
          isActive: { type: 'boolean' },
          doctorId: { type: 'string', format: 'uuid', nullable: true },
          specialties: {
            type: 'array',
            description: 'Top-level specialties only (e.g. Orthopedics)',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                nameAr: { type: 'string', nullable: true },
              },
            },
          },
          subspecialties: {
            type: 'array',
            description: 'Areas of expertise (e.g. Knee, Spine)',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                nameAr: { type: 'string', nullable: true },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              phone: { type: 'string', nullable: true },
              role: { type: 'string' },
              isActive: { type: 'boolean' },
              doctorId: { type: 'string', format: 'uuid', nullable: true },
              specialties: {
                type: 'array',
                description: 'Top-level specialties only (e.g. Orthopedics)',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    nameAr: { type: 'string', nullable: true },
                  },
                },
              },
              subspecialties: {
                type: 'array',
                description: 'Areas of expertise (e.g. Knee, Spine)',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    nameAr: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name', 'specialtyIds'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
          phone: { type: 'string' },
          specialtyIds: {
            type: 'array',
            minItems: 1,
            description: 'Top-level specialty IDs. Do not send Knee/Spine here.',
            items: { type: 'string', format: 'uuid' },
          },
          subspecialtyIds: {
            type: 'array',
            description: 'Optional area-of-expertise IDs belonging to the selected specialties',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          phone: { type: 'string', nullable: true },
          specialtyIds: {
            type: 'array',
            minItems: 1,
            description: 'Top-level specialty IDs',
            items: { type: 'string', format: 'uuid' },
          },
          subspecialtyIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      Specialty: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          nameAr: { type: 'string', nullable: true },
          icon: { type: 'string', nullable: true },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Null for top-level specialties. Set for areas of expertise.',
          },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateSpecialtyRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1 },
          nameAr: { type: 'string' },
          icon: { type: 'string' },
        },
      },
      UpdateSpecialtyRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          nameAr: { type: 'string' },
          icon: { type: 'string' },
        },
      },
      Hospital: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          address: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateHospitalRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1 },
          address: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      UpdateHospitalRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          address: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      Doctor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          phone: { type: 'string', nullable: true },
          email: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          specialties: {
            type: 'array',
            description: 'Top-level specialties',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                nameAr: { type: 'string', nullable: true },
              },
            },
          },
          subspecialties: {
            type: 'array',
            description: 'Areas of expertise',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                nameAr: { type: 'string', nullable: true },
              },
            },
          },
        },
      },
      CreateDoctorRequest: {
        type: 'object',
        required: ['name', 'specialtyIds'],
        properties: {
          name: { type: 'string', minLength: 1 },
          phone: { type: 'string' },
          mobile: { type: 'string', description: 'Alias for phone' },
          email: { type: 'string', format: 'email' },
          specialtyIds: {
            type: 'array',
            minItems: 1,
            description: 'Top-level specialty IDs',
            items: { type: 'string', format: 'uuid' },
          },
          specialtyId: { type: 'string', format: 'uuid', description: 'Alias for a single specialtyIds item' },
          subspecialtyIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      UpdateDoctorRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          specialtyIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
          subspecialtyIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      Patient: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string' },
          age: { type: 'integer' },
          gender: { $ref: '#/components/schemas/Gender' },
          mobile: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePatientRequest: {
        type: 'object',
        required: ['fullName', 'age'],
        properties: {
          fullName: { type: 'string', minLength: 1 },
          age: { type: 'integer', minimum: 1, maximum: 150 },
          gender: { $ref: '#/components/schemas/Gender', default: 'MALE' },
          mobile: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      UpdatePatientRequest: {
        type: 'object',
        properties: {
          fullName: { type: 'string', minLength: 1 },
          age: { type: 'integer', minimum: 1, maximum: 150 },
          gender: { $ref: '#/components/schemas/Gender' },
          mobile: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      MedicalTeamInput: {
        type: 'object',
        properties: {
          primarySurgeonId: { type: 'string', format: 'uuid' },
          assistantSurgeonId: { type: 'string', format: 'uuid' },
          anesthesiologistId: { type: 'string', format: 'uuid' },
          assistantAnesthesiaId: { type: 'string', format: 'uuid' },
          nurse: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      CostInput: {
        type: 'object',
        required: ['totalCost'],
        properties: {
          totalCost: { type: 'number', minimum: 0, description: 'Amount in EGP' },
          paidAmount: {
            type: 'number',
            minimum: 0,
            description: 'Must be <= totalCost. Forced to totalCost when PAID and 0 when UNPAID.',
          },
          remainingAmount: {
            type: 'number',
            minimum: 0,
            description: 'Computed as totalCost - paidAmount. Currency is EGP.',
          },
          paymentMethod: { $ref: '#/components/schemas/PaymentMethod' },
          paymentStatus: { $ref: '#/components/schemas/PaymentStatus' },
          paymentNotes: { type: 'string' },
        },
      },
      OperationCost: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          operationId: { type: 'string', format: 'uuid' },
          totalCost: { type: 'number' },
          paidAmount: { type: 'number' },
          remainingAmount: { type: 'number' },
          paymentMethod: { $ref: '#/components/schemas/PaymentMethod' },
          paymentStatus: { $ref: '#/components/schemas/PaymentStatus' },
          paymentNotes: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      OperationFile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          operationId: { type: 'string', format: 'uuid' },
          fileType: { $ref: '#/components/schemas/FileType' },
          fileName: { type: 'string' },
          filePath: { type: 'string' },
          url: { type: 'string', description: 'Public path such as /uploads/filename.pdf' },
          fileUrl: { type: 'string', description: 'Alias of url' },
          fileSize: { type: 'integer', nullable: true },
          mimeType: { type: 'string', nullable: true },
          uploadedBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      OperationTimeline: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          operationId: { type: 'string', format: 'uuid' },
          action: { $ref: '#/components/schemas/TimelineAction' },
          description: { type: 'string', nullable: true },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Operation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          diagnosis: { type: 'string', nullable: true },
          hospitalId: { type: 'string', format: 'uuid' },
          operationDate: { type: 'string', format: 'date-time' },
          operationTime: { type: 'string' },
          operationRoom: { type: 'string', nullable: true },
          duration: { type: 'integer', nullable: true },
          status: { $ref: '#/components/schemas/OperationStatus' },
          notes: { type: 'string', nullable: true },
          patientId: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
          specialtyId: { type: 'string', format: 'uuid', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          patient: { $ref: '#/components/schemas/Patient' },
          hospital: { $ref: '#/components/schemas/Hospital' },
          specialty: { $ref: '#/components/schemas/Specialty' },
          medicalTeam: { type: 'array', items: { type: 'object' } },
          files: { type: 'array', items: { $ref: '#/components/schemas/OperationFile' } },
          cost: { $ref: '#/components/schemas/OperationCost' },
        },
      },
      OperationCatalogItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          nameAr: { type: 'string', nullable: true },
          isCustom: { type: 'boolean' },
          specialty: {
            type: 'object',
            nullable: true,
            description: 'Top-level specialty (e.g. Orthopedics)',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              nameAr: { type: 'string', nullable: true },
            },
          },
          subspecialty: {
            type: 'object',
            nullable: true,
            description: 'Area of expertise (e.g. Knee)',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              nameAr: { type: 'string', nullable: true },
            },
          },
        },
      },
      CreateOperationRequest: {
        type: 'object',
        required: ['operationId', 'hospitalId', 'operationDate', 'operationTime', 'patientId'],
        properties: {
          operationId: { type: 'string', format: 'uuid', description: 'Catalog operation ID' },
          name: { type: 'string', minLength: 1, description: 'Derived from catalog when operationId is provided' },
          diagnosis: { type: 'string', nullable: true },
          hospitalId: { type: 'string', format: 'uuid' },
          operationDate: { type: 'string', description: 'ISO date or date-time string' },
          operationTime: { type: 'string', example: '09:30' },
          operationRoom: { type: 'string' },
          duration: { type: 'integer', minimum: 1, description: 'Duration in minutes' },
          status: { $ref: '#/components/schemas/OperationStatus' },
          notes: { type: 'string' },
          patientId: { type: 'string', format: 'uuid' },
          specialtyId: { type: 'string', format: 'uuid' },
          medicalTeam: { $ref: '#/components/schemas/MedicalTeamInput' },
          cost: { $ref: '#/components/schemas/CostInput' },
        },
      },
      UpdateOperationRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          diagnosis: { type: 'string', nullable: true },
          hospitalId: { type: 'string', format: 'uuid' },
          operationDate: { type: 'string' },
          operationTime: { type: 'string' },
          operationRoom: { type: 'string' },
          duration: { type: 'integer', minimum: 1 },
          status: { $ref: '#/components/schemas/OperationStatus' },
          notes: { type: 'string' },
          patientId: { type: 'string', format: 'uuid' },
          specialtyId: { type: 'string', format: 'uuid' },
          medicalTeam: { $ref: '#/components/schemas/MedicalTeamInput' },
          cost: { $ref: '#/components/schemas/CostInput' },
        },
      },
      UpdateStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { $ref: '#/components/schemas/OperationStatus' },
        },
      },
      UpdateCostRequest: {
        $ref: '#/components/schemas/CostInput',
      },
    },
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
      PageQuery: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
      },
      LimitQuery: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
      SearchQuery: {
        name: 'search',
        in: 'query',
        schema: { type: 'string' },
      },
    },
    responses: {
      BadRequest: {
        description: 'Validation or bad request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
          },
        },
      },
      Unauthorized: {
        description: 'Missing or invalid JWT',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
          },
        },
      },
      Forbidden: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
          },
        },
      },
      Conflict: {
        description: 'Resource already exists',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        security: [],
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registration successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Current user profile',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      put: {
        tags: ['Authentication'],
        summary: 'Update current doctor profile',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated profile',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    '/api/specialties': {
      get: {
        tags: ['Specialties'],
        summary: 'List specialties',
        description:
          'Global specialty catalog. Omit filters to return all active specialties (top-level and areas). Use `parentId`/`parentIds` to return children of selected specialties. Use `mine=true` (authenticated) to return only areas belonging to the current doctor\'s selected specialties.',
        security: [],
        parameters: [
          {
            name: 'parentId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Return areas of expertise whose parent is this specialty',
          },
          {
            name: 'parentIds',
            in: 'query',
            schema: { type: 'string' },
            description: 'Comma-separated parent specialty IDs. Combined with parentId when both are sent.',
          },
          {
            name: 'mine',
            in: 'query',
            schema: { type: 'boolean' },
            description:
              'When true, requires a Bearer token and restricts parent IDs to the current doctor\'s selected specialties.',
          },
          {
            name: 'rootsOnly',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'When true and no parent filter is applied, return only top-level specialties.',
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
            description: 'When sent with limit, results are paginated (`meta`).',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 200 },
          },
        ],
        responses: {
          '200': {
            description: 'Specialty list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Specialty' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Specialties'],
        summary: 'Create specialty',
        description: 'Requires `admin` role.',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSpecialtyRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Specialty created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Specialty' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/api/specialties/{id}': {
      get: {
        tags: ['Specialties'],
        summary: 'Get specialty by ID',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Specialty details',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Specialty' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Specialties'],
        summary: 'Update specialty',
        description: 'Requires `admin` role.',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSpecialtyRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Specialty updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Specialty' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Specialties'],
        summary: 'Delete specialty',
        description: 'Requires `admin` role.',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Specialty deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/api/hospitals': {
      get: {
        tags: ['Hospitals'],
        summary: 'List hospitals (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/PageQuery' },
          { $ref: '#/components/parameters/LimitQuery' },
          { $ref: '#/components/parameters/SearchQuery' },
        ],
        responses: {
          '200': {
            description: 'Paginated hospital list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Hospital' },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Hospitals'],
        summary: 'Create hospital',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateHospitalRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Hospital created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Hospital' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/hospitals/active': {
      get: {
        tags: ['Hospitals'],
        summary: 'List active hospitals',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Active hospitals',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Hospital' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/hospitals/{id}': {
      get: {
        tags: ['Hospitals'],
        summary: 'Get hospital by ID',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Hospital details',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Hospital' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Hospitals'],
        summary: 'Update hospital',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateHospitalRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Hospital updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Hospital' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Hospitals'],
        summary: 'Delete hospital',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Hospital deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/api/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List doctors (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/PageQuery' },
          { $ref: '#/components/parameters/LimitQuery' },
          { $ref: '#/components/parameters/SearchQuery' },
          {
            name: 'specialtyId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated doctor list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Doctor' },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Doctors'],
        summary: 'Create doctor',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDoctorRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Doctor created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Doctor' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/doctors/active': {
      get: {
        tags: ['Doctors'],
        summary: 'List active doctors',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Active doctors',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Doctor' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get doctor by ID',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Doctor details',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Doctor' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Doctors'],
        summary: 'Update doctor',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateDoctorRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Doctor updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Doctor' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Doctors'],
        summary: 'Delete doctor',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Doctor deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/api/patients': {
      get: {
        tags: ['Patients'],
        summary: 'List patients (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/PageQuery' },
          { $ref: '#/components/parameters/LimitQuery' },
          { $ref: '#/components/parameters/SearchQuery' },
          {
            name: 'gender',
            in: 'query',
            schema: { $ref: '#/components/schemas/Gender' },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated patient list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Patient' },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Patients'],
        summary: 'Create patient',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePatientRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Patient created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get patient by ID',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Patient details',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Patients'],
        summary: 'Update patient',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePatientRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Patient updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Patients'],
        summary: 'Delete patient',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Patient deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/api/operation-catalog': {
      get: {
        tags: ['Operation Catalog'],
        summary: 'List operations available to the authenticated doctor',
        description:
          'Returns common catalog operations for the doctor\'s top-level specialties (prioritizing selected areas of expertise) plus that doctor\'s custom operations. Unrelated specialties are excluded.',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Filtered operation catalog',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/OperationCatalogItem' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Operation Catalog'],
        summary: 'Add a doctor-specific custom operation',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Custom operation created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OperationCatalogItem' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
    },

    '/api/operations': {
      get: {
        tags: ['Operations'],
        summary: 'List operations (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/PageQuery' },
          { $ref: '#/components/parameters/LimitQuery' },
          { $ref: '#/components/parameters/SearchQuery' },
          {
            name: 'status',
            in: 'query',
            schema: { $ref: '#/components/schemas/OperationStatus' },
          },
          {
            name: 'specialtyId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'hospitalId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'dateFrom',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'dateTo',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['operationDate', 'createdAt', 'name', 'duration'],
              default: 'operationDate',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated operation list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Operation' },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Operations'],
        summary: 'Create operation',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOperationRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Operation created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Operation' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/operations/{id}': {
      get: {
        tags: ['Operations'],
        summary: 'Get operation by ID',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Operation details',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Operation' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Operations'],
        summary: 'Update operation',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOperationRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Operation updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Operation' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Operations'],
        summary: 'Delete operation',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Operation deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/operations/{id}/timeline': {
      get: {
        tags: ['Operations'],
        summary: 'Get operation timeline',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          '200': {
            description: 'Timeline entries',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/OperationTimeline' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/operations/{id}/status': {
      patch: {
        tags: ['Operations'],
        summary: 'Update operation status',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStatusRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Status updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Operation' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/operations/{id}/cost': {
      put: {
        tags: ['Operations'],
        summary: 'Update operation cost',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCostRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cost updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OperationCost' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/operations/{id}/files': {
      post: {
        tags: ['Operations'],
        summary: 'Upload operation files',
        description:
          'Multipart upload. Send `file` and/or `files` (up to 20). `fileType` is required for the intended slot; aliases `BEFORE_OPERATION` and `AFTER_OPERATION` map to `BEFORE_IMAGE` / `AFTER_IMAGE`. Max file size 50MB. Storage is the local `uploads` directory (or `UPLOAD_DIR`).',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                  files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                  },
                  fileType: {
                    type: 'string',
                    description:
                      'Prisma FileType or alias BEFORE_OPERATION / AFTER_OPERATION',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Files uploaded',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/OperationFile' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/operations/{operationId}/files/{fileId}': {
      delete: {
        tags: ['Operations'],
        summary: 'Delete an operation file',
        security: bearerAuth,
        parameters: [
          {
            name: 'operationId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'fileId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'File deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/api/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard stats',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Dashboard statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/dashboard/recent-operations': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get recent operations',
        security: bearerAuth,
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Recent operations',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/dashboard/specialty-distribution': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get specialty distribution',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Specialty distribution data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/dashboard/monthly-trends': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get monthly trends',
        security: bearerAuth,
        parameters: [
          {
            name: 'months',
            in: 'query',
            schema: { type: 'integer', default: 12 },
          },
        ],
        responses: {
          '200': {
            description: 'Monthly trend data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/dashboard/revenue': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get revenue summary',
        security: bearerAuth,
        responses: {
          '200': {
            description: 'Revenue data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    '/api/export/operations': {
      get: {
        tags: ['Export'],
        summary: 'Export operations',
        description:
          'Returns JSON by default. Set `format=csv` to download a CSV attachment.',
        security: bearerAuth,
        parameters: [
          {
            name: 'format',
            in: 'query',
            schema: { type: 'string', enum: ['json', 'csv'], default: 'json' },
          },
          {
            name: 'status',
            in: 'query',
            schema: { $ref: '#/components/schemas/OperationStatus' },
          },
          {
            name: 'specialtyId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'hospitalId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'dateFrom',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'dateTo',
            in: 'query',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Export payload (JSON) or CSV file download',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {},
                    meta: {
                      type: 'object',
                      properties: {
                        totalRecords: { type: 'integer' },
                      },
                    },
                  },
                },
              },
              'text/csv': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
  },
};
