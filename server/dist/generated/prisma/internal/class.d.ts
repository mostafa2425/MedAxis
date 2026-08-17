import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.PrismaClientConstructorArgs<Options>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Patients
      * const patients = await prisma.patient.findMany()
      * ```
      */
    get patient(): Prisma.PatientDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.specialty`: Exposes CRUD operations for the **Specialty** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Specialties
      * const specialties = await prisma.specialty.findMany()
      * ```
      */
    get specialty(): Prisma.SpecialtyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.doctor`: Exposes CRUD operations for the **Doctor** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Doctors
      * const doctors = await prisma.doctor.findMany()
      * ```
      */
    get doctor(): Prisma.DoctorDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.doctorSpecialty`: Exposes CRUD operations for the **DoctorSpecialty** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DoctorSpecialties
      * const doctorSpecialties = await prisma.doctorSpecialty.findMany()
      * ```
      */
    get doctorSpecialty(): Prisma.DoctorSpecialtyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.doctorSubspecialty`: Exposes CRUD operations for the **DoctorSubspecialty** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DoctorSubspecialties
      * const doctorSubspecialties = await prisma.doctorSubspecialty.findMany()
      * ```
      */
    get doctorSubspecialty(): Prisma.DoctorSubspecialtyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationCatalog`: Exposes CRUD operations for the **OperationCatalog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationCatalogs
      * const operationCatalogs = await prisma.operationCatalog.findMany()
      * ```
      */
    get operationCatalog(): Prisma.OperationCatalogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.hospital`: Exposes CRUD operations for the **Hospital** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Hospitals
      * const hospitals = await prisma.hospital.findMany()
      * ```
      */
    get hospital(): Prisma.HospitalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.nurse`: Exposes CRUD operations for the **Nurse** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Nurses
      * const nurses = await prisma.nurse.findMany()
      * ```
      */
    get nurse(): Prisma.NurseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operation`: Exposes CRUD operations for the **Operation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Operations
      * const operations = await prisma.operation.findMany()
      * ```
      */
    get operation(): Prisma.OperationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationMedicalTeam`: Exposes CRUD operations for the **OperationMedicalTeam** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationMedicalTeams
      * const operationMedicalTeams = await prisma.operationMedicalTeam.findMany()
      * ```
      */
    get operationMedicalTeam(): Prisma.OperationMedicalTeamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationProcedure`: Exposes CRUD operations for the **OperationProcedure** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationProcedures
      * const operationProcedures = await prisma.operationProcedure.findMany()
      * ```
      */
    get operationProcedure(): Prisma.OperationProcedureDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationTeamMember`: Exposes CRUD operations for the **OperationTeamMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationTeamMembers
      * const operationTeamMembers = await prisma.operationTeamMember.findMany()
      * ```
      */
    get operationTeamMember(): Prisma.OperationTeamMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationCost`: Exposes CRUD operations for the **OperationCost** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationCosts
      * const operationCosts = await prisma.operationCost.findMany()
      * ```
      */
    get operationCost(): Prisma.OperationCostDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationFile`: Exposes CRUD operations for the **OperationFile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationFiles
      * const operationFiles = await prisma.operationFile.findMany()
      * ```
      */
    get operationFile(): Prisma.OperationFileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationTimeline`: Exposes CRUD operations for the **OperationTimeline** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationTimelines
      * const operationTimelines = await prisma.operationTimeline.findMany()
      * ```
      */
    get operationTimeline(): Prisma.OperationTimelineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map