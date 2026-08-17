import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.9.1
 * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * Resolved type of the argument passed to the `PrismaClient` constructor.
 *
 * When called without a narrower options type (the common case), this resolves
 * to `PrismaClientOptions` directly, which produces a clear TypeScript error
 * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
 * the argument is missing or incomplete. When the user supplies a narrower
 * options type (e.g. via a literal), it falls back to `Subset` to keep
 * filtering out unknown properties.
 */
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | ({
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O) : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: 'User';
    readonly Patient: 'Patient';
    readonly Specialty: 'Specialty';
    readonly Doctor: 'Doctor';
    readonly DoctorSpecialty: 'DoctorSpecialty';
    readonly DoctorSubspecialty: 'DoctorSubspecialty';
    readonly OperationCatalog: 'OperationCatalog';
    readonly Hospital: 'Hospital';
    readonly Nurse: 'Nurse';
    readonly Operation: 'Operation';
    readonly OperationMedicalTeam: 'OperationMedicalTeam';
    readonly OperationProcedure: 'OperationProcedure';
    readonly OperationTeamMember: 'OperationTeamMember';
    readonly OperationCost: 'OperationCost';
    readonly OperationFile: 'OperationFile';
    readonly OperationTimeline: 'OperationTimeline';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "patient" | "specialty" | "doctor" | "doctorSpecialty" | "doctorSubspecialty" | "operationCatalog" | "hospital" | "nurse" | "operation" | "operationMedicalTeam" | "operationProcedure" | "operationTeamMember" | "operationCost" | "operationFile" | "operationTimeline";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Patient: {
            payload: Prisma.$PatientPayload<ExtArgs>;
            fields: Prisma.PatientFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PatientFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                findFirst: {
                    args: Prisma.PatientFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                findMany: {
                    args: Prisma.PatientFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>[];
                };
                create: {
                    args: Prisma.PatientCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                createMany: {
                    args: Prisma.PatientCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>[];
                };
                delete: {
                    args: Prisma.PatientDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                update: {
                    args: Prisma.PatientUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                deleteMany: {
                    args: Prisma.PatientDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PatientUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>[];
                };
                upsert: {
                    args: Prisma.PatientUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientPayload>;
                };
                aggregate: {
                    args: Prisma.PatientAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePatient>;
                };
                groupBy: {
                    args: Prisma.PatientGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PatientGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PatientCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PatientCountAggregateOutputType> | number;
                };
            };
        };
        Specialty: {
            payload: Prisma.$SpecialtyPayload<ExtArgs>;
            fields: Prisma.SpecialtyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SpecialtyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SpecialtyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                findFirst: {
                    args: Prisma.SpecialtyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SpecialtyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                findMany: {
                    args: Prisma.SpecialtyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>[];
                };
                create: {
                    args: Prisma.SpecialtyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                createMany: {
                    args: Prisma.SpecialtyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SpecialtyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>[];
                };
                delete: {
                    args: Prisma.SpecialtyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                update: {
                    args: Prisma.SpecialtyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                deleteMany: {
                    args: Prisma.SpecialtyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SpecialtyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SpecialtyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>[];
                };
                upsert: {
                    args: Prisma.SpecialtyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SpecialtyPayload>;
                };
                aggregate: {
                    args: Prisma.SpecialtyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSpecialty>;
                };
                groupBy: {
                    args: Prisma.SpecialtyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SpecialtyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SpecialtyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SpecialtyCountAggregateOutputType> | number;
                };
            };
        };
        Doctor: {
            payload: Prisma.$DoctorPayload<ExtArgs>;
            fields: Prisma.DoctorFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DoctorFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DoctorFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                findFirst: {
                    args: Prisma.DoctorFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DoctorFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                findMany: {
                    args: Prisma.DoctorFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>[];
                };
                create: {
                    args: Prisma.DoctorCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                createMany: {
                    args: Prisma.DoctorCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DoctorCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>[];
                };
                delete: {
                    args: Prisma.DoctorDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                update: {
                    args: Prisma.DoctorUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                deleteMany: {
                    args: Prisma.DoctorDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DoctorUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DoctorUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>[];
                };
                upsert: {
                    args: Prisma.DoctorUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorPayload>;
                };
                aggregate: {
                    args: Prisma.DoctorAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDoctor>;
                };
                groupBy: {
                    args: Prisma.DoctorGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DoctorCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorCountAggregateOutputType> | number;
                };
            };
        };
        DoctorSpecialty: {
            payload: Prisma.$DoctorSpecialtyPayload<ExtArgs>;
            fields: Prisma.DoctorSpecialtyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DoctorSpecialtyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DoctorSpecialtyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                findFirst: {
                    args: Prisma.DoctorSpecialtyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DoctorSpecialtyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                findMany: {
                    args: Prisma.DoctorSpecialtyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>[];
                };
                create: {
                    args: Prisma.DoctorSpecialtyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                createMany: {
                    args: Prisma.DoctorSpecialtyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DoctorSpecialtyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>[];
                };
                delete: {
                    args: Prisma.DoctorSpecialtyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                update: {
                    args: Prisma.DoctorSpecialtyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                deleteMany: {
                    args: Prisma.DoctorSpecialtyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DoctorSpecialtyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DoctorSpecialtyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>[];
                };
                upsert: {
                    args: Prisma.DoctorSpecialtyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSpecialtyPayload>;
                };
                aggregate: {
                    args: Prisma.DoctorSpecialtyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDoctorSpecialty>;
                };
                groupBy: {
                    args: Prisma.DoctorSpecialtyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorSpecialtyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DoctorSpecialtyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorSpecialtyCountAggregateOutputType> | number;
                };
            };
        };
        DoctorSubspecialty: {
            payload: Prisma.$DoctorSubspecialtyPayload<ExtArgs>;
            fields: Prisma.DoctorSubspecialtyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DoctorSubspecialtyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DoctorSubspecialtyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                findFirst: {
                    args: Prisma.DoctorSubspecialtyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DoctorSubspecialtyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                findMany: {
                    args: Prisma.DoctorSubspecialtyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>[];
                };
                create: {
                    args: Prisma.DoctorSubspecialtyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                createMany: {
                    args: Prisma.DoctorSubspecialtyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DoctorSubspecialtyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>[];
                };
                delete: {
                    args: Prisma.DoctorSubspecialtyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                update: {
                    args: Prisma.DoctorSubspecialtyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                deleteMany: {
                    args: Prisma.DoctorSubspecialtyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DoctorSubspecialtyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DoctorSubspecialtyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>[];
                };
                upsert: {
                    args: Prisma.DoctorSubspecialtyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DoctorSubspecialtyPayload>;
                };
                aggregate: {
                    args: Prisma.DoctorSubspecialtyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDoctorSubspecialty>;
                };
                groupBy: {
                    args: Prisma.DoctorSubspecialtyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorSubspecialtyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DoctorSubspecialtyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DoctorSubspecialtyCountAggregateOutputType> | number;
                };
            };
        };
        OperationCatalog: {
            payload: Prisma.$OperationCatalogPayload<ExtArgs>;
            fields: Prisma.OperationCatalogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationCatalogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationCatalogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                findFirst: {
                    args: Prisma.OperationCatalogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationCatalogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                findMany: {
                    args: Prisma.OperationCatalogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>[];
                };
                create: {
                    args: Prisma.OperationCatalogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                createMany: {
                    args: Prisma.OperationCatalogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationCatalogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>[];
                };
                delete: {
                    args: Prisma.OperationCatalogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                update: {
                    args: Prisma.OperationCatalogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                deleteMany: {
                    args: Prisma.OperationCatalogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationCatalogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationCatalogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>[];
                };
                upsert: {
                    args: Prisma.OperationCatalogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCatalogPayload>;
                };
                aggregate: {
                    args: Prisma.OperationCatalogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationCatalog>;
                };
                groupBy: {
                    args: Prisma.OperationCatalogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationCatalogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationCatalogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationCatalogCountAggregateOutputType> | number;
                };
            };
        };
        Hospital: {
            payload: Prisma.$HospitalPayload<ExtArgs>;
            fields: Prisma.HospitalFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HospitalFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HospitalFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                findFirst: {
                    args: Prisma.HospitalFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HospitalFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                findMany: {
                    args: Prisma.HospitalFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>[];
                };
                create: {
                    args: Prisma.HospitalCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                createMany: {
                    args: Prisma.HospitalCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HospitalCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>[];
                };
                delete: {
                    args: Prisma.HospitalDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                update: {
                    args: Prisma.HospitalUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                deleteMany: {
                    args: Prisma.HospitalDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HospitalUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HospitalUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>[];
                };
                upsert: {
                    args: Prisma.HospitalUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HospitalPayload>;
                };
                aggregate: {
                    args: Prisma.HospitalAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHospital>;
                };
                groupBy: {
                    args: Prisma.HospitalGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HospitalGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HospitalCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HospitalCountAggregateOutputType> | number;
                };
            };
        };
        Nurse: {
            payload: Prisma.$NursePayload<ExtArgs>;
            fields: Prisma.NurseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NurseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NurseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                findFirst: {
                    args: Prisma.NurseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NurseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                findMany: {
                    args: Prisma.NurseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>[];
                };
                create: {
                    args: Prisma.NurseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                createMany: {
                    args: Prisma.NurseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NurseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>[];
                };
                delete: {
                    args: Prisma.NurseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                update: {
                    args: Prisma.NurseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                deleteMany: {
                    args: Prisma.NurseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NurseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NurseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>[];
                };
                upsert: {
                    args: Prisma.NurseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NursePayload>;
                };
                aggregate: {
                    args: Prisma.NurseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNurse>;
                };
                groupBy: {
                    args: Prisma.NurseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NurseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NurseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NurseCountAggregateOutputType> | number;
                };
            };
        };
        Operation: {
            payload: Prisma.$OperationPayload<ExtArgs>;
            fields: Prisma.OperationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                findFirst: {
                    args: Prisma.OperationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                findMany: {
                    args: Prisma.OperationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>[];
                };
                create: {
                    args: Prisma.OperationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                createMany: {
                    args: Prisma.OperationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>[];
                };
                delete: {
                    args: Prisma.OperationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                update: {
                    args: Prisma.OperationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                deleteMany: {
                    args: Prisma.OperationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>[];
                };
                upsert: {
                    args: Prisma.OperationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationPayload>;
                };
                aggregate: {
                    args: Prisma.OperationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperation>;
                };
                groupBy: {
                    args: Prisma.OperationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationCountAggregateOutputType> | number;
                };
            };
        };
        OperationMedicalTeam: {
            payload: Prisma.$OperationMedicalTeamPayload<ExtArgs>;
            fields: Prisma.OperationMedicalTeamFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationMedicalTeamFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationMedicalTeamFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                findFirst: {
                    args: Prisma.OperationMedicalTeamFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationMedicalTeamFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                findMany: {
                    args: Prisma.OperationMedicalTeamFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>[];
                };
                create: {
                    args: Prisma.OperationMedicalTeamCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                createMany: {
                    args: Prisma.OperationMedicalTeamCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationMedicalTeamCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>[];
                };
                delete: {
                    args: Prisma.OperationMedicalTeamDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                update: {
                    args: Prisma.OperationMedicalTeamUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                deleteMany: {
                    args: Prisma.OperationMedicalTeamDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationMedicalTeamUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationMedicalTeamUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>[];
                };
                upsert: {
                    args: Prisma.OperationMedicalTeamUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationMedicalTeamPayload>;
                };
                aggregate: {
                    args: Prisma.OperationMedicalTeamAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationMedicalTeam>;
                };
                groupBy: {
                    args: Prisma.OperationMedicalTeamGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationMedicalTeamGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationMedicalTeamCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationMedicalTeamCountAggregateOutputType> | number;
                };
            };
        };
        OperationProcedure: {
            payload: Prisma.$OperationProcedurePayload<ExtArgs>;
            fields: Prisma.OperationProcedureFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationProcedureFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationProcedureFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                findFirst: {
                    args: Prisma.OperationProcedureFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationProcedureFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                findMany: {
                    args: Prisma.OperationProcedureFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>[];
                };
                create: {
                    args: Prisma.OperationProcedureCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                createMany: {
                    args: Prisma.OperationProcedureCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationProcedureCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>[];
                };
                delete: {
                    args: Prisma.OperationProcedureDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                update: {
                    args: Prisma.OperationProcedureUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                deleteMany: {
                    args: Prisma.OperationProcedureDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationProcedureUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationProcedureUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>[];
                };
                upsert: {
                    args: Prisma.OperationProcedureUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationProcedurePayload>;
                };
                aggregate: {
                    args: Prisma.OperationProcedureAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationProcedure>;
                };
                groupBy: {
                    args: Prisma.OperationProcedureGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationProcedureGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationProcedureCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationProcedureCountAggregateOutputType> | number;
                };
            };
        };
        OperationTeamMember: {
            payload: Prisma.$OperationTeamMemberPayload<ExtArgs>;
            fields: Prisma.OperationTeamMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationTeamMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationTeamMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                findFirst: {
                    args: Prisma.OperationTeamMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationTeamMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                findMany: {
                    args: Prisma.OperationTeamMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>[];
                };
                create: {
                    args: Prisma.OperationTeamMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                createMany: {
                    args: Prisma.OperationTeamMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationTeamMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>[];
                };
                delete: {
                    args: Prisma.OperationTeamMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                update: {
                    args: Prisma.OperationTeamMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.OperationTeamMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationTeamMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationTeamMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>[];
                };
                upsert: {
                    args: Prisma.OperationTeamMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTeamMemberPayload>;
                };
                aggregate: {
                    args: Prisma.OperationTeamMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationTeamMember>;
                };
                groupBy: {
                    args: Prisma.OperationTeamMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationTeamMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationTeamMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationTeamMemberCountAggregateOutputType> | number;
                };
            };
        };
        OperationCost: {
            payload: Prisma.$OperationCostPayload<ExtArgs>;
            fields: Prisma.OperationCostFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationCostFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationCostFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                findFirst: {
                    args: Prisma.OperationCostFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationCostFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                findMany: {
                    args: Prisma.OperationCostFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>[];
                };
                create: {
                    args: Prisma.OperationCostCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                createMany: {
                    args: Prisma.OperationCostCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationCostCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>[];
                };
                delete: {
                    args: Prisma.OperationCostDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                update: {
                    args: Prisma.OperationCostUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                deleteMany: {
                    args: Prisma.OperationCostDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationCostUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationCostUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>[];
                };
                upsert: {
                    args: Prisma.OperationCostUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationCostPayload>;
                };
                aggregate: {
                    args: Prisma.OperationCostAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationCost>;
                };
                groupBy: {
                    args: Prisma.OperationCostGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationCostGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationCostCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationCostCountAggregateOutputType> | number;
                };
            };
        };
        OperationFile: {
            payload: Prisma.$OperationFilePayload<ExtArgs>;
            fields: Prisma.OperationFileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationFileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationFileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                findFirst: {
                    args: Prisma.OperationFileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationFileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                findMany: {
                    args: Prisma.OperationFileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>[];
                };
                create: {
                    args: Prisma.OperationFileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                createMany: {
                    args: Prisma.OperationFileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationFileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>[];
                };
                delete: {
                    args: Prisma.OperationFileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                update: {
                    args: Prisma.OperationFileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                deleteMany: {
                    args: Prisma.OperationFileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationFileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationFileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>[];
                };
                upsert: {
                    args: Prisma.OperationFileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationFilePayload>;
                };
                aggregate: {
                    args: Prisma.OperationFileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationFile>;
                };
                groupBy: {
                    args: Prisma.OperationFileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationFileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationFileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationFileCountAggregateOutputType> | number;
                };
            };
        };
        OperationTimeline: {
            payload: Prisma.$OperationTimelinePayload<ExtArgs>;
            fields: Prisma.OperationTimelineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OperationTimelineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OperationTimelineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                findFirst: {
                    args: Prisma.OperationTimelineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OperationTimelineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                findMany: {
                    args: Prisma.OperationTimelineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>[];
                };
                create: {
                    args: Prisma.OperationTimelineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                createMany: {
                    args: Prisma.OperationTimelineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OperationTimelineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>[];
                };
                delete: {
                    args: Prisma.OperationTimelineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                update: {
                    args: Prisma.OperationTimelineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                deleteMany: {
                    args: Prisma.OperationTimelineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OperationTimelineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OperationTimelineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>[];
                };
                upsert: {
                    args: Prisma.OperationTimelineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OperationTimelinePayload>;
                };
                aggregate: {
                    args: Prisma.OperationTimelineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOperationTimeline>;
                };
                groupBy: {
                    args: Prisma.OperationTimelineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationTimelineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OperationTimelineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OperationTimelineCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly email: 'email';
    readonly password: 'password';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly role: 'role';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const PatientScalarFieldEnum: {
    readonly id: 'id';
    readonly fullName: 'fullName';
    readonly age: 'age';
    readonly gender: 'gender';
    readonly mobile: 'mobile';
    readonly notes: 'notes';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum];
export declare const SpecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly icon: 'icon';
    readonly parentId: 'parentId';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type SpecialtyScalarFieldEnum = (typeof SpecialtyScalarFieldEnum)[keyof typeof SpecialtyScalarFieldEnum];
export declare const DoctorScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly email: 'email';
    readonly isActive: 'isActive';
    readonly userId: 'userId';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type DoctorScalarFieldEnum = (typeof DoctorScalarFieldEnum)[keyof typeof DoctorScalarFieldEnum];
export declare const DoctorSpecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly doctorId: 'doctorId';
    readonly specialtyId: 'specialtyId';
    readonly createdAt: 'createdAt';
};
export type DoctorSpecialtyScalarFieldEnum = (typeof DoctorSpecialtyScalarFieldEnum)[keyof typeof DoctorSpecialtyScalarFieldEnum];
export declare const DoctorSubspecialtyScalarFieldEnum: {
    readonly id: 'id';
    readonly doctorId: 'doctorId';
    readonly specialtyId: 'specialtyId';
    readonly createdAt: 'createdAt';
};
export type DoctorSubspecialtyScalarFieldEnum = (typeof DoctorSubspecialtyScalarFieldEnum)[keyof typeof DoctorSubspecialtyScalarFieldEnum];
export declare const OperationCatalogScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly specialtyId: 'specialtyId';
    readonly subspecialtyId: 'subspecialtyId';
    readonly isActive: 'isActive';
    readonly isCustom: 'isCustom';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationCatalogScalarFieldEnum = (typeof OperationCatalogScalarFieldEnum)[keyof typeof OperationCatalogScalarFieldEnum];
export declare const HospitalScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly address: 'address';
    readonly phone: 'phone';
    readonly isActive: 'isActive';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type HospitalScalarFieldEnum = (typeof HospitalScalarFieldEnum)[keyof typeof HospitalScalarFieldEnum];
export declare const NurseScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly phone: 'phone';
    readonly email: 'email';
    readonly isActive: 'isActive';
    readonly createdBy: 'createdBy';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type NurseScalarFieldEnum = (typeof NurseScalarFieldEnum)[keyof typeof NurseScalarFieldEnum];
export declare const OperationScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly diagnosis: 'diagnosis';
    readonly hospitalId: 'hospitalId';
    readonly operationDate: 'operationDate';
    readonly operationTime: 'operationTime';
    readonly operationRoom: 'operationRoom';
    readonly duration: 'duration';
    readonly status: 'status';
    readonly notes: 'notes';
    readonly patientId: 'patientId';
    readonly createdBy: 'createdBy';
    readonly specialtyId: 'specialtyId';
    readonly catalogId: 'catalogId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationScalarFieldEnum = (typeof OperationScalarFieldEnum)[keyof typeof OperationScalarFieldEnum];
export declare const OperationMedicalTeamScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly primarySurgeonId: 'primarySurgeonId';
    readonly assistantSurgeonId: 'assistantSurgeonId';
    readonly anesthesiologistId: 'anesthesiologistId';
    readonly assistantAnesthesiaId: 'assistantAnesthesiaId';
    readonly nurse: 'nurse';
    readonly notes: 'notes';
    readonly createdAt: 'createdAt';
};
export type OperationMedicalTeamScalarFieldEnum = (typeof OperationMedicalTeamScalarFieldEnum)[keyof typeof OperationMedicalTeamScalarFieldEnum];
export declare const OperationProcedureScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly catalogId: 'catalogId';
    readonly name: 'name';
    readonly nameAr: 'nameAr';
    readonly specialtyId: 'specialtyId';
    readonly sortOrder: 'sortOrder';
    readonly createdAt: 'createdAt';
};
export type OperationProcedureScalarFieldEnum = (typeof OperationProcedureScalarFieldEnum)[keyof typeof OperationProcedureScalarFieldEnum];
export declare const OperationTeamMemberScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly doctorId: 'doctorId';
    readonly nurseId: 'nurseId';
    readonly sortOrder: 'sortOrder';
    readonly createdAt: 'createdAt';
};
export type OperationTeamMemberScalarFieldEnum = (typeof OperationTeamMemberScalarFieldEnum)[keyof typeof OperationTeamMemberScalarFieldEnum];
export declare const OperationCostScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly totalCost: 'totalCost';
    readonly paidAmount: 'paidAmount';
    readonly remainingAmount: 'remainingAmount';
    readonly paymentMethod: 'paymentMethod';
    readonly paymentStatus: 'paymentStatus';
    readonly paymentNotes: 'paymentNotes';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OperationCostScalarFieldEnum = (typeof OperationCostScalarFieldEnum)[keyof typeof OperationCostScalarFieldEnum];
export declare const OperationFileScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly fileType: 'fileType';
    readonly fileName: 'fileName';
    readonly filePath: 'filePath';
    readonly fileSize: 'fileSize';
    readonly mimeType: 'mimeType';
    readonly uploadedBy: 'uploadedBy';
    readonly createdAt: 'createdAt';
};
export type OperationFileScalarFieldEnum = (typeof OperationFileScalarFieldEnum)[keyof typeof OperationFileScalarFieldEnum];
export declare const OperationTimelineScalarFieldEnum: {
    readonly id: 'id';
    readonly operationId: 'operationId';
    readonly action: 'action';
    readonly description: 'description';
    readonly userId: 'userId';
    readonly createdAt: 'createdAt';
};
export type OperationTimelineScalarFieldEnum = (typeof OperationTimelineScalarFieldEnum)[keyof typeof OperationTimelineScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: 'default';
    readonly insensitive: 'insensitive';
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'Gender'
 */
export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>;
/**
 * Reference to a field of type 'Gender[]'
 */
export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>;
/**
 * Reference to a field of type 'OperationStatus'
 */
export type EnumOperationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OperationStatus'>;
/**
 * Reference to a field of type 'OperationStatus[]'
 */
export type ListEnumOperationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OperationStatus[]'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'Decimal[]'
 */
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
/**
 * Reference to a field of type 'PaymentMethod'
 */
export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>;
/**
 * Reference to a field of type 'PaymentMethod[]'
 */
export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>;
/**
 * Reference to a field of type 'PaymentStatus'
 */
export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>;
/**
 * Reference to a field of type 'PaymentStatus[]'
 */
export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;
/**
 * Reference to a field of type 'FileType'
 */
export type EnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType'>;
/**
 * Reference to a field of type 'FileType[]'
 */
export type ListEnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType[]'>;
/**
 * Reference to a field of type 'TimelineAction'
 */
export type EnumTimelineActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimelineAction'>;
/**
 * Reference to a field of type 'TimelineAction[]'
 */
export type ListEnumTimelineActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimelineAction[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
/**
 * Options common to all variants of `PrismaClientOptions`, regardless of whether you connect to your database through a driver adapter or through Prisma Accelerate.
 */
export interface PrismaClientBaseOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
    /**
     * Optional maximum size for the query plan cache. If not provided, a default size will be used.
     * A value of `0` can be used to disable the cache entirely. A higher cache size can improve
     * performance for applications that execute a large number of unique queries, while a smaller
     * cache size can reduce memory usage.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   queryPlanCacheMaxSize: 100,
     * })
     * ```
     */
    queryPlanCacheMaxSize?: number;
}
/**
 * `PrismaClient` options for connecting to your database through Prisma Accelerate instead of a driver adapter.
 *
 * Learn more: https://pris.ly/d/accelerate
 */
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     *
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl: string;
    adapter?: never;
}
/**
 * `PrismaClient` options for connecting to your database through a driver adapter. This is the common case in Prisma 7.
 *
 * Learn more: https://pris.ly/d/driver-adapters
 */
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     *
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     *
     * Learn more: https://pris.ly/d/driver-adapters
     *
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     *
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
/**
 * Options passed to the `PrismaClient` constructor.
 *
 * A driver adapter (or, alternatively, a Prisma Accelerate URL) is **required**. See {@link PrismaClientOptionsWithAdapter} and {@link PrismaClientOptionsWithAccelerateUrl} for the two variants. All other properties live in {@link PrismaClientBaseOptions} and are optional.
 *
 * Learn more about driver adapters: https://pris.ly/d/driver-adapters
 */
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    patient?: Prisma.PatientOmit;
    specialty?: Prisma.SpecialtyOmit;
    doctor?: Prisma.DoctorOmit;
    doctorSpecialty?: Prisma.DoctorSpecialtyOmit;
    doctorSubspecialty?: Prisma.DoctorSubspecialtyOmit;
    operationCatalog?: Prisma.OperationCatalogOmit;
    hospital?: Prisma.HospitalOmit;
    nurse?: Prisma.NurseOmit;
    operation?: Prisma.OperationOmit;
    operationMedicalTeam?: Prisma.OperationMedicalTeamOmit;
    operationProcedure?: Prisma.OperationProcedureOmit;
    operationTeamMember?: Prisma.OperationTeamMemberOmit;
    operationCost?: Prisma.OperationCostOmit;
    operationFile?: Prisma.OperationFileOmit;
    operationTimeline?: Prisma.OperationTimelineOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map