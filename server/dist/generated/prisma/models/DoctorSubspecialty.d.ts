import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model DoctorSubspecialty
 *
 */
export type DoctorSubspecialtyModel = runtime.Types.Result.DefaultSelection<Prisma.$DoctorSubspecialtyPayload>;
export type AggregateDoctorSubspecialty = {
    _count: DoctorSubspecialtyCountAggregateOutputType | null;
    _min: DoctorSubspecialtyMinAggregateOutputType | null;
    _max: DoctorSubspecialtyMaxAggregateOutputType | null;
};
export type DoctorSubspecialtyMinAggregateOutputType = {
    id: string | null;
    doctorId: string | null;
    specialtyId: string | null;
    createdAt: Date | null;
};
export type DoctorSubspecialtyMaxAggregateOutputType = {
    id: string | null;
    doctorId: string | null;
    specialtyId: string | null;
    createdAt: Date | null;
};
export type DoctorSubspecialtyCountAggregateOutputType = {
    id: number;
    doctorId: number;
    specialtyId: number;
    createdAt: number;
    _all: number;
};
export type DoctorSubspecialtyMinAggregateInputType = {
    id?: true;
    doctorId?: true;
    specialtyId?: true;
    createdAt?: true;
};
export type DoctorSubspecialtyMaxAggregateInputType = {
    id?: true;
    doctorId?: true;
    specialtyId?: true;
    createdAt?: true;
};
export type DoctorSubspecialtyCountAggregateInputType = {
    id?: true;
    doctorId?: true;
    specialtyId?: true;
    createdAt?: true;
    _all?: true;
};
export type DoctorSubspecialtyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DoctorSubspecialty to aggregate.
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DoctorSubspecialties to fetch.
     */
    orderBy?: Prisma.DoctorSubspecialtyOrderByWithRelationInput | Prisma.DoctorSubspecialtyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.DoctorSubspecialtyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DoctorSubspecialties from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DoctorSubspecialties.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned DoctorSubspecialties
    **/
    _count?: true | DoctorSubspecialtyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: DoctorSubspecialtyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: DoctorSubspecialtyMaxAggregateInputType;
};
export type GetDoctorSubspecialtyAggregateType<T extends DoctorSubspecialtyAggregateArgs> = {
    [P in keyof T & keyof AggregateDoctorSubspecialty]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDoctorSubspecialty[P]> : Prisma.GetScalarType<T[P], AggregateDoctorSubspecialty[P]>;
};
export type DoctorSubspecialtyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DoctorSubspecialtyWhereInput;
    orderBy?: Prisma.DoctorSubspecialtyOrderByWithAggregationInput | Prisma.DoctorSubspecialtyOrderByWithAggregationInput[];
    by: Prisma.DoctorSubspecialtyScalarFieldEnum[] | Prisma.DoctorSubspecialtyScalarFieldEnum;
    having?: Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DoctorSubspecialtyCountAggregateInputType | true;
    _min?: DoctorSubspecialtyMinAggregateInputType;
    _max?: DoctorSubspecialtyMaxAggregateInputType;
};
export type DoctorSubspecialtyGroupByOutputType = {
    id: string;
    doctorId: string;
    specialtyId: string;
    createdAt: Date;
    _count: DoctorSubspecialtyCountAggregateOutputType | null;
    _min: DoctorSubspecialtyMinAggregateOutputType | null;
    _max: DoctorSubspecialtyMaxAggregateOutputType | null;
};
export type GetDoctorSubspecialtyGroupByPayload<T extends DoctorSubspecialtyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DoctorSubspecialtyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DoctorSubspecialtyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DoctorSubspecialtyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DoctorSubspecialtyGroupByOutputType[P]>;
}>>;
export type DoctorSubspecialtyWhereInput = {
    AND?: Prisma.DoctorSubspecialtyWhereInput | Prisma.DoctorSubspecialtyWhereInput[];
    OR?: Prisma.DoctorSubspecialtyWhereInput[];
    NOT?: Prisma.DoctorSubspecialtyWhereInput | Prisma.DoctorSubspecialtyWhereInput[];
    id?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    doctorId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    specialtyId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    createdAt?: Prisma.DateTimeFilter<"DoctorSubspecialty"> | Date | string;
    doctor?: Prisma.XOR<Prisma.DoctorScalarRelationFilter, Prisma.DoctorWhereInput>;
    specialty?: Prisma.XOR<Prisma.SpecialtyScalarRelationFilter, Prisma.SpecialtyWhereInput>;
};
export type DoctorSubspecialtyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    doctor?: Prisma.DoctorOrderByWithRelationInput;
    specialty?: Prisma.SpecialtyOrderByWithRelationInput;
};
export type DoctorSubspecialtyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    doctorId_specialtyId?: Prisma.DoctorSubspecialtyDoctorIdSpecialtyIdCompoundUniqueInput;
    AND?: Prisma.DoctorSubspecialtyWhereInput | Prisma.DoctorSubspecialtyWhereInput[];
    OR?: Prisma.DoctorSubspecialtyWhereInput[];
    NOT?: Prisma.DoctorSubspecialtyWhereInput | Prisma.DoctorSubspecialtyWhereInput[];
    doctorId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    specialtyId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    createdAt?: Prisma.DateTimeFilter<"DoctorSubspecialty"> | Date | string;
    doctor?: Prisma.XOR<Prisma.DoctorScalarRelationFilter, Prisma.DoctorWhereInput>;
    specialty?: Prisma.XOR<Prisma.SpecialtyScalarRelationFilter, Prisma.SpecialtyWhereInput>;
}, "id" | "doctorId_specialtyId">;
export type DoctorSubspecialtyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DoctorSubspecialtyCountOrderByAggregateInput;
    _max?: Prisma.DoctorSubspecialtyMaxOrderByAggregateInput;
    _min?: Prisma.DoctorSubspecialtyMinOrderByAggregateInput;
};
export type DoctorSubspecialtyScalarWhereWithAggregatesInput = {
    AND?: Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput | Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput[];
    OR?: Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput | Prisma.DoctorSubspecialtyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DoctorSubspecialty"> | string;
    doctorId?: Prisma.StringWithAggregatesFilter<"DoctorSubspecialty"> | string;
    specialtyId?: Prisma.StringWithAggregatesFilter<"DoctorSubspecialty"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DoctorSubspecialty"> | Date | string;
};
export type DoctorSubspecialtyCreateInput = {
    id?: string;
    createdAt?: Date | string;
    doctor: Prisma.DoctorCreateNestedOneWithoutSubspecialtiesInput;
    specialty: Prisma.SpecialtyCreateNestedOneWithoutDoctorSubspecialtiesInput;
};
export type DoctorSubspecialtyUncheckedCreateInput = {
    id?: string;
    doctorId: string;
    specialtyId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctor?: Prisma.DoctorUpdateOneRequiredWithoutSubspecialtiesNestedInput;
    specialty?: Prisma.SpecialtyUpdateOneRequiredWithoutDoctorSubspecialtiesNestedInput;
};
export type DoctorSubspecialtyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    specialtyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyCreateManyInput = {
    id?: string;
    doctorId: string;
    specialtyId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    specialtyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyListRelationFilter = {
    every?: Prisma.DoctorSubspecialtyWhereInput;
    some?: Prisma.DoctorSubspecialtyWhereInput;
    none?: Prisma.DoctorSubspecialtyWhereInput;
};
export type DoctorSubspecialtyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DoctorSubspecialtyDoctorIdSpecialtyIdCompoundUniqueInput = {
    doctorId: string;
    specialtyId: string;
};
export type DoctorSubspecialtyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DoctorSubspecialtyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DoctorSubspecialtyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DoctorSubspecialtyCreateNestedManyWithoutSpecialtyInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput> | Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManySpecialtyInputEnvelope;
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
};
export type DoctorSubspecialtyUncheckedCreateNestedManyWithoutSpecialtyInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput> | Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManySpecialtyInputEnvelope;
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
};
export type DoctorSubspecialtyUpdateManyWithoutSpecialtyNestedInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput> | Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput[];
    upsert?: Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutSpecialtyInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManySpecialtyInputEnvelope;
    set?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    disconnect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    delete?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    update?: Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutSpecialtyInput[];
    updateMany?: Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutSpecialtyInput[];
    deleteMany?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
};
export type DoctorSubspecialtyUncheckedUpdateManyWithoutSpecialtyNestedInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput> | Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput[];
    upsert?: Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutSpecialtyInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManySpecialtyInputEnvelope;
    set?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    disconnect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    delete?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    update?: Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutSpecialtyInput[];
    updateMany?: Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutSpecialtyInput | Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutSpecialtyInput[];
    deleteMany?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
};
export type DoctorSubspecialtyCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput> | Prisma.DoctorSubspecialtyCreateWithoutDoctorInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManyDoctorInputEnvelope;
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
};
export type DoctorSubspecialtyUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput> | Prisma.DoctorSubspecialtyCreateWithoutDoctorInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManyDoctorInputEnvelope;
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
};
export type DoctorSubspecialtyUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput> | Prisma.DoctorSubspecialtyCreateWithoutDoctorInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutDoctorInput | Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManyDoctorInputEnvelope;
    set?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    disconnect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    delete?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    update?: Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutDoctorInput | Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutDoctorInput | Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
};
export type DoctorSubspecialtyUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput> | Prisma.DoctorSubspecialtyCreateWithoutDoctorInput[] | Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput | Prisma.DoctorSubspecialtyCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutDoctorInput | Prisma.DoctorSubspecialtyUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.DoctorSubspecialtyCreateManyDoctorInputEnvelope;
    set?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    disconnect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    delete?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    connect?: Prisma.DoctorSubspecialtyWhereUniqueInput | Prisma.DoctorSubspecialtyWhereUniqueInput[];
    update?: Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutDoctorInput | Prisma.DoctorSubspecialtyUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutDoctorInput | Prisma.DoctorSubspecialtyUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
};
export type DoctorSubspecialtyCreateWithoutSpecialtyInput = {
    id?: string;
    createdAt?: Date | string;
    doctor: Prisma.DoctorCreateNestedOneWithoutSubspecialtiesInput;
};
export type DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput = {
    id?: string;
    doctorId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyCreateOrConnectWithoutSpecialtyInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    create: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput>;
};
export type DoctorSubspecialtyCreateManySpecialtyInputEnvelope = {
    data: Prisma.DoctorSubspecialtyCreateManySpecialtyInput | Prisma.DoctorSubspecialtyCreateManySpecialtyInput[];
    skipDuplicates?: boolean;
};
export type DoctorSubspecialtyUpsertWithWhereUniqueWithoutSpecialtyInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    update: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedUpdateWithoutSpecialtyInput>;
    create: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutSpecialtyInput>;
};
export type DoctorSubspecialtyUpdateWithWhereUniqueWithoutSpecialtyInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateWithoutSpecialtyInput, Prisma.DoctorSubspecialtyUncheckedUpdateWithoutSpecialtyInput>;
};
export type DoctorSubspecialtyUpdateManyWithWhereWithoutSpecialtyInput = {
    where: Prisma.DoctorSubspecialtyScalarWhereInput;
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateManyMutationInput, Prisma.DoctorSubspecialtyUncheckedUpdateManyWithoutSpecialtyInput>;
};
export type DoctorSubspecialtyScalarWhereInput = {
    AND?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
    OR?: Prisma.DoctorSubspecialtyScalarWhereInput[];
    NOT?: Prisma.DoctorSubspecialtyScalarWhereInput | Prisma.DoctorSubspecialtyScalarWhereInput[];
    id?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    doctorId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    specialtyId?: Prisma.StringFilter<"DoctorSubspecialty"> | string;
    createdAt?: Prisma.DateTimeFilter<"DoctorSubspecialty"> | Date | string;
};
export type DoctorSubspecialtyCreateWithoutDoctorInput = {
    id?: string;
    createdAt?: Date | string;
    specialty: Prisma.SpecialtyCreateNestedOneWithoutDoctorSubspecialtiesInput;
};
export type DoctorSubspecialtyUncheckedCreateWithoutDoctorInput = {
    id?: string;
    specialtyId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyCreateOrConnectWithoutDoctorInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    create: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput>;
};
export type DoctorSubspecialtyCreateManyDoctorInputEnvelope = {
    data: Prisma.DoctorSubspecialtyCreateManyDoctorInput | Prisma.DoctorSubspecialtyCreateManyDoctorInput[];
    skipDuplicates?: boolean;
};
export type DoctorSubspecialtyUpsertWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    update: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedUpdateWithoutDoctorInput>;
    create: Prisma.XOR<Prisma.DoctorSubspecialtyCreateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedCreateWithoutDoctorInput>;
};
export type DoctorSubspecialtyUpdateWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateWithoutDoctorInput, Prisma.DoctorSubspecialtyUncheckedUpdateWithoutDoctorInput>;
};
export type DoctorSubspecialtyUpdateManyWithWhereWithoutDoctorInput = {
    where: Prisma.DoctorSubspecialtyScalarWhereInput;
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateManyMutationInput, Prisma.DoctorSubspecialtyUncheckedUpdateManyWithoutDoctorInput>;
};
export type DoctorSubspecialtyCreateManySpecialtyInput = {
    id?: string;
    doctorId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyUpdateWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctor?: Prisma.DoctorUpdateOneRequiredWithoutSubspecialtiesNestedInput;
};
export type DoctorSubspecialtyUncheckedUpdateWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyUncheckedUpdateManyWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyCreateManyDoctorInput = {
    id?: string;
    specialtyId: string;
    createdAt?: Date | string;
};
export type DoctorSubspecialtyUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    specialty?: Prisma.SpecialtyUpdateOneRequiredWithoutDoctorSubspecialtiesNestedInput;
};
export type DoctorSubspecialtyUncheckedUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    specialtyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtyUncheckedUpdateManyWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    specialtyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DoctorSubspecialtySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    doctorId?: boolean;
    specialtyId?: boolean;
    createdAt?: boolean;
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doctorSubspecialty"]>;
export type DoctorSubspecialtySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    doctorId?: boolean;
    specialtyId?: boolean;
    createdAt?: boolean;
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doctorSubspecialty"]>;
export type DoctorSubspecialtySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    doctorId?: boolean;
    specialtyId?: boolean;
    createdAt?: boolean;
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doctorSubspecialty"]>;
export type DoctorSubspecialtySelectScalar = {
    id?: boolean;
    doctorId?: boolean;
    specialtyId?: boolean;
    createdAt?: boolean;
};
export type DoctorSubspecialtyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "doctorId" | "specialtyId" | "createdAt", ExtArgs["result"]["doctorSubspecialty"]>;
export type DoctorSubspecialtyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
};
export type DoctorSubspecialtyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
};
export type DoctorSubspecialtyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doctor?: boolean | Prisma.DoctorDefaultArgs<ExtArgs>;
    specialty?: boolean | Prisma.SpecialtyDefaultArgs<ExtArgs>;
};
export type $DoctorSubspecialtyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DoctorSubspecialty";
    objects: {
        doctor: Prisma.$DoctorPayload<ExtArgs>;
        specialty: Prisma.$SpecialtyPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        doctorId: string;
        specialtyId: string;
        createdAt: Date;
    }, ExtArgs["result"]["doctorSubspecialty"]>;
    composites: {};
};
export type DoctorSubspecialtyGetPayload<S extends boolean | null | undefined | DoctorSubspecialtyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload, S>;
export type DoctorSubspecialtyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DoctorSubspecialtyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DoctorSubspecialtyCountAggregateInputType | true;
};
export interface DoctorSubspecialtyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DoctorSubspecialty'];
        meta: {
            name: 'DoctorSubspecialty';
        };
    };
    /**
     * Find zero or one DoctorSubspecialty that matches the filter.
     * @param {DoctorSubspecialtyFindUniqueArgs} args - Arguments to find a DoctorSubspecialty
     * @example
     * // Get one DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DoctorSubspecialtyFindUniqueArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one DoctorSubspecialty that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DoctorSubspecialtyFindUniqueOrThrowArgs} args - Arguments to find a DoctorSubspecialty
     * @example
     * // Get one DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DoctorSubspecialtyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DoctorSubspecialty that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyFindFirstArgs} args - Arguments to find a DoctorSubspecialty
     * @example
     * // Get one DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DoctorSubspecialtyFindFirstArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyFindFirstArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DoctorSubspecialty that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyFindFirstOrThrowArgs} args - Arguments to find a DoctorSubspecialty
     * @example
     * // Get one DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DoctorSubspecialtyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more DoctorSubspecialties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DoctorSubspecialties
     * const doctorSubspecialties = await prisma.doctorSubspecialty.findMany()
     *
     * // Get first 10 DoctorSubspecialties
     * const doctorSubspecialties = await prisma.doctorSubspecialty.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const doctorSubspecialtyWithIdOnly = await prisma.doctorSubspecialty.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DoctorSubspecialtyFindManyArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a DoctorSubspecialty.
     * @param {DoctorSubspecialtyCreateArgs} args - Arguments to create a DoctorSubspecialty.
     * @example
     * // Create one DoctorSubspecialty
     * const DoctorSubspecialty = await prisma.doctorSubspecialty.create({
     *   data: {
     *     // ... data to create a DoctorSubspecialty
     *   }
     * })
     *
     */
    create<T extends DoctorSubspecialtyCreateArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyCreateArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many DoctorSubspecialties.
     * @param {DoctorSubspecialtyCreateManyArgs} args - Arguments to create many DoctorSubspecialties.
     * @example
     * // Create many DoctorSubspecialties
     * const doctorSubspecialty = await prisma.doctorSubspecialty.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DoctorSubspecialtyCreateManyArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many DoctorSubspecialties and returns the data saved in the database.
     * @param {DoctorSubspecialtyCreateManyAndReturnArgs} args - Arguments to create many DoctorSubspecialties.
     * @example
     * // Create many DoctorSubspecialties
     * const doctorSubspecialty = await prisma.doctorSubspecialty.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many DoctorSubspecialties and only return the `id`
     * const doctorSubspecialtyWithIdOnly = await prisma.doctorSubspecialty.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends DoctorSubspecialtyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a DoctorSubspecialty.
     * @param {DoctorSubspecialtyDeleteArgs} args - Arguments to delete one DoctorSubspecialty.
     * @example
     * // Delete one DoctorSubspecialty
     * const DoctorSubspecialty = await prisma.doctorSubspecialty.delete({
     *   where: {
     *     // ... filter to delete one DoctorSubspecialty
     *   }
     * })
     *
     */
    delete<T extends DoctorSubspecialtyDeleteArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyDeleteArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one DoctorSubspecialty.
     * @param {DoctorSubspecialtyUpdateArgs} args - Arguments to update one DoctorSubspecialty.
     * @example
     * // Update one DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DoctorSubspecialtyUpdateArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyUpdateArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more DoctorSubspecialties.
     * @param {DoctorSubspecialtyDeleteManyArgs} args - Arguments to filter DoctorSubspecialties to delete.
     * @example
     * // Delete a few DoctorSubspecialties
     * const { count } = await prisma.doctorSubspecialty.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DoctorSubspecialtyDeleteManyArgs>(args?: Prisma.SelectSubset<T, DoctorSubspecialtyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more DoctorSubspecialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DoctorSubspecialties
     * const doctorSubspecialty = await prisma.doctorSubspecialty.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DoctorSubspecialtyUpdateManyArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more DoctorSubspecialties and returns the data updated in the database.
     * @param {DoctorSubspecialtyUpdateManyAndReturnArgs} args - Arguments to update many DoctorSubspecialties.
     * @example
     * // Update many DoctorSubspecialties
     * const doctorSubspecialty = await prisma.doctorSubspecialty.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more DoctorSubspecialties and only return the `id`
     * const doctorSubspecialtyWithIdOnly = await prisma.doctorSubspecialty.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends DoctorSubspecialtyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one DoctorSubspecialty.
     * @param {DoctorSubspecialtyUpsertArgs} args - Arguments to update or create a DoctorSubspecialty.
     * @example
     * // Update or create a DoctorSubspecialty
     * const doctorSubspecialty = await prisma.doctorSubspecialty.upsert({
     *   create: {
     *     // ... data to create a DoctorSubspecialty
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DoctorSubspecialty we want to update
     *   }
     * })
     */
    upsert<T extends DoctorSubspecialtyUpsertArgs>(args: Prisma.SelectSubset<T, DoctorSubspecialtyUpsertArgs<ExtArgs>>): Prisma.Prisma__DoctorSubspecialtyClient<runtime.Types.Result.GetResult<Prisma.$DoctorSubspecialtyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of DoctorSubspecialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyCountArgs} args - Arguments to filter DoctorSubspecialties to count.
     * @example
     * // Count the number of DoctorSubspecialties
     * const count = await prisma.doctorSubspecialty.count({
     *   where: {
     *     // ... the filter for the DoctorSubspecialties we want to count
     *   }
     * })
    **/
    count<T extends DoctorSubspecialtyCountArgs>(args?: Prisma.Subset<T, DoctorSubspecialtyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DoctorSubspecialtyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a DoctorSubspecialty.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DoctorSubspecialtyAggregateArgs>(args: Prisma.Subset<T, DoctorSubspecialtyAggregateArgs>): Prisma.PrismaPromise<GetDoctorSubspecialtyAggregateType<T>>;
    /**
     * Group by DoctorSubspecialty.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorSubspecialtyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends DoctorSubspecialtyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DoctorSubspecialtyGroupByArgs['orderBy'];
    } : {
        orderBy?: DoctorSubspecialtyGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DoctorSubspecialtyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDoctorSubspecialtyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the DoctorSubspecialty model
     */
    readonly fields: DoctorSubspecialtyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for DoctorSubspecialty.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__DoctorSubspecialtyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    doctor<T extends Prisma.DoctorDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DoctorDefaultArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    specialty<T extends Prisma.SpecialtyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SpecialtyDefaultArgs<ExtArgs>>): Prisma.Prisma__SpecialtyClient<runtime.Types.Result.GetResult<Prisma.$SpecialtyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the DoctorSubspecialty model
 */
export interface DoctorSubspecialtyFieldRefs {
    readonly id: Prisma.FieldRef<"DoctorSubspecialty", 'String'>;
    readonly doctorId: Prisma.FieldRef<"DoctorSubspecialty", 'String'>;
    readonly specialtyId: Prisma.FieldRef<"DoctorSubspecialty", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DoctorSubspecialty", 'DateTime'>;
}
/**
 * DoctorSubspecialty findUnique
 */
export type DoctorSubspecialtyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter, which DoctorSubspecialty to fetch.
     */
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
};
/**
 * DoctorSubspecialty findUniqueOrThrow
 */
export type DoctorSubspecialtyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter, which DoctorSubspecialty to fetch.
     */
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
};
/**
 * DoctorSubspecialty findFirst
 */
export type DoctorSubspecialtyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter, which DoctorSubspecialty to fetch.
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DoctorSubspecialties to fetch.
     */
    orderBy?: Prisma.DoctorSubspecialtyOrderByWithRelationInput | Prisma.DoctorSubspecialtyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DoctorSubspecialties.
     */
    cursor?: Prisma.DoctorSubspecialtyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DoctorSubspecialties from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DoctorSubspecialties.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DoctorSubspecialties.
     */
    distinct?: Prisma.DoctorSubspecialtyScalarFieldEnum | Prisma.DoctorSubspecialtyScalarFieldEnum[];
};
/**
 * DoctorSubspecialty findFirstOrThrow
 */
export type DoctorSubspecialtyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter, which DoctorSubspecialty to fetch.
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DoctorSubspecialties to fetch.
     */
    orderBy?: Prisma.DoctorSubspecialtyOrderByWithRelationInput | Prisma.DoctorSubspecialtyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DoctorSubspecialties.
     */
    cursor?: Prisma.DoctorSubspecialtyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DoctorSubspecialties from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DoctorSubspecialties.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DoctorSubspecialties.
     */
    distinct?: Prisma.DoctorSubspecialtyScalarFieldEnum | Prisma.DoctorSubspecialtyScalarFieldEnum[];
};
/**
 * DoctorSubspecialty findMany
 */
export type DoctorSubspecialtyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter, which DoctorSubspecialties to fetch.
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DoctorSubspecialties to fetch.
     */
    orderBy?: Prisma.DoctorSubspecialtyOrderByWithRelationInput | Prisma.DoctorSubspecialtyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing DoctorSubspecialties.
     */
    cursor?: Prisma.DoctorSubspecialtyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DoctorSubspecialties from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DoctorSubspecialties.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DoctorSubspecialties.
     */
    distinct?: Prisma.DoctorSubspecialtyScalarFieldEnum | Prisma.DoctorSubspecialtyScalarFieldEnum[];
};
/**
 * DoctorSubspecialty create
 */
export type DoctorSubspecialtyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * The data needed to create a DoctorSubspecialty.
     */
    data: Prisma.XOR<Prisma.DoctorSubspecialtyCreateInput, Prisma.DoctorSubspecialtyUncheckedCreateInput>;
};
/**
 * DoctorSubspecialty createMany
 */
export type DoctorSubspecialtyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many DoctorSubspecialties.
     */
    data: Prisma.DoctorSubspecialtyCreateManyInput | Prisma.DoctorSubspecialtyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * DoctorSubspecialty createManyAndReturn
 */
export type DoctorSubspecialtyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * The data used to create many DoctorSubspecialties.
     */
    data: Prisma.DoctorSubspecialtyCreateManyInput | Prisma.DoctorSubspecialtyCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * DoctorSubspecialty update
 */
export type DoctorSubspecialtyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * The data needed to update a DoctorSubspecialty.
     */
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateInput, Prisma.DoctorSubspecialtyUncheckedUpdateInput>;
    /**
     * Choose, which DoctorSubspecialty to update.
     */
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
};
/**
 * DoctorSubspecialty updateMany
 */
export type DoctorSubspecialtyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update DoctorSubspecialties.
     */
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateManyMutationInput, Prisma.DoctorSubspecialtyUncheckedUpdateManyInput>;
    /**
     * Filter which DoctorSubspecialties to update
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * Limit how many DoctorSubspecialties to update.
     */
    limit?: number;
};
/**
 * DoctorSubspecialty updateManyAndReturn
 */
export type DoctorSubspecialtyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * The data used to update DoctorSubspecialties.
     */
    data: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateManyMutationInput, Prisma.DoctorSubspecialtyUncheckedUpdateManyInput>;
    /**
     * Filter which DoctorSubspecialties to update
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * Limit how many DoctorSubspecialties to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * DoctorSubspecialty upsert
 */
export type DoctorSubspecialtyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * The filter to search for the DoctorSubspecialty to update in case it exists.
     */
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
    /**
     * In case the DoctorSubspecialty found by the `where` argument doesn't exist, create a new DoctorSubspecialty with this data.
     */
    create: Prisma.XOR<Prisma.DoctorSubspecialtyCreateInput, Prisma.DoctorSubspecialtyUncheckedCreateInput>;
    /**
     * In case the DoctorSubspecialty was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.DoctorSubspecialtyUpdateInput, Prisma.DoctorSubspecialtyUncheckedUpdateInput>;
};
/**
 * DoctorSubspecialty delete
 */
export type DoctorSubspecialtyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
    /**
     * Filter which DoctorSubspecialty to delete.
     */
    where: Prisma.DoctorSubspecialtyWhereUniqueInput;
};
/**
 * DoctorSubspecialty deleteMany
 */
export type DoctorSubspecialtyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DoctorSubspecialties to delete
     */
    where?: Prisma.DoctorSubspecialtyWhereInput;
    /**
     * Limit how many DoctorSubspecialties to delete.
     */
    limit?: number;
};
/**
 * DoctorSubspecialty without action
 */
export type DoctorSubspecialtyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorSubspecialty
     */
    select?: Prisma.DoctorSubspecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DoctorSubspecialty
     */
    omit?: Prisma.DoctorSubspecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorSubspecialtyInclude<ExtArgs> | null;
};
//# sourceMappingURL=DoctorSubspecialty.d.ts.map