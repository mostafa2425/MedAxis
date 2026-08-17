import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model OperationTeamMember
 *
 */
export type OperationTeamMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$OperationTeamMemberPayload>;
export type AggregateOperationTeamMember = {
    _count: OperationTeamMemberCountAggregateOutputType | null;
    _avg: OperationTeamMemberAvgAggregateOutputType | null;
    _sum: OperationTeamMemberSumAggregateOutputType | null;
    _min: OperationTeamMemberMinAggregateOutputType | null;
    _max: OperationTeamMemberMaxAggregateOutputType | null;
};
export type OperationTeamMemberAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type OperationTeamMemberSumAggregateOutputType = {
    sortOrder: number | null;
};
export type OperationTeamMemberMinAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    doctorId: string | null;
    nurseId: string | null;
    sortOrder: number | null;
    createdAt: Date | null;
};
export type OperationTeamMemberMaxAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    doctorId: string | null;
    nurseId: string | null;
    sortOrder: number | null;
    createdAt: Date | null;
};
export type OperationTeamMemberCountAggregateOutputType = {
    id: number;
    operationId: number;
    doctorId: number;
    nurseId: number;
    sortOrder: number;
    createdAt: number;
    _all: number;
};
export type OperationTeamMemberAvgAggregateInputType = {
    sortOrder?: true;
};
export type OperationTeamMemberSumAggregateInputType = {
    sortOrder?: true;
};
export type OperationTeamMemberMinAggregateInputType = {
    id?: true;
    operationId?: true;
    doctorId?: true;
    nurseId?: true;
    sortOrder?: true;
    createdAt?: true;
};
export type OperationTeamMemberMaxAggregateInputType = {
    id?: true;
    operationId?: true;
    doctorId?: true;
    nurseId?: true;
    sortOrder?: true;
    createdAt?: true;
};
export type OperationTeamMemberCountAggregateInputType = {
    id?: true;
    operationId?: true;
    doctorId?: true;
    nurseId?: true;
    sortOrder?: true;
    createdAt?: true;
    _all?: true;
};
export type OperationTeamMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationTeamMember to aggregate.
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationTeamMembers to fetch.
     */
    orderBy?: Prisma.OperationTeamMemberOrderByWithRelationInput | Prisma.OperationTeamMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OperationTeamMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationTeamMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationTeamMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OperationTeamMembers
    **/
    _count?: true | OperationTeamMemberCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OperationTeamMemberAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OperationTeamMemberSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OperationTeamMemberMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OperationTeamMemberMaxAggregateInputType;
};
export type GetOperationTeamMemberAggregateType<T extends OperationTeamMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateOperationTeamMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOperationTeamMember[P]> : Prisma.GetScalarType<T[P], AggregateOperationTeamMember[P]>;
};
export type OperationTeamMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OperationTeamMemberWhereInput;
    orderBy?: Prisma.OperationTeamMemberOrderByWithAggregationInput | Prisma.OperationTeamMemberOrderByWithAggregationInput[];
    by: Prisma.OperationTeamMemberScalarFieldEnum[] | Prisma.OperationTeamMemberScalarFieldEnum;
    having?: Prisma.OperationTeamMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OperationTeamMemberCountAggregateInputType | true;
    _avg?: OperationTeamMemberAvgAggregateInputType;
    _sum?: OperationTeamMemberSumAggregateInputType;
    _min?: OperationTeamMemberMinAggregateInputType;
    _max?: OperationTeamMemberMaxAggregateInputType;
};
export type OperationTeamMemberGroupByOutputType = {
    id: string;
    operationId: string;
    doctorId: string | null;
    nurseId: string | null;
    sortOrder: number;
    createdAt: Date;
    _count: OperationTeamMemberCountAggregateOutputType | null;
    _avg: OperationTeamMemberAvgAggregateOutputType | null;
    _sum: OperationTeamMemberSumAggregateOutputType | null;
    _min: OperationTeamMemberMinAggregateOutputType | null;
    _max: OperationTeamMemberMaxAggregateOutputType | null;
};
export type GetOperationTeamMemberGroupByPayload<T extends OperationTeamMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OperationTeamMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OperationTeamMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OperationTeamMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OperationTeamMemberGroupByOutputType[P]>;
}>>;
export type OperationTeamMemberWhereInput = {
    AND?: Prisma.OperationTeamMemberWhereInput | Prisma.OperationTeamMemberWhereInput[];
    OR?: Prisma.OperationTeamMemberWhereInput[];
    NOT?: Prisma.OperationTeamMemberWhereInput | Prisma.OperationTeamMemberWhereInput[];
    id?: Prisma.StringFilter<"OperationTeamMember"> | string;
    operationId?: Prisma.StringFilter<"OperationTeamMember"> | string;
    doctorId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    nurseId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationTeamMember"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationTeamMember"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    doctor?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    nurse?: Prisma.XOR<Prisma.NurseNullableScalarRelationFilter, Prisma.NurseWhereInput> | null;
};
export type OperationTeamMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    nurseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    operation?: Prisma.OperationOrderByWithRelationInput;
    doctor?: Prisma.DoctorOrderByWithRelationInput;
    nurse?: Prisma.NurseOrderByWithRelationInput;
};
export type OperationTeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OperationTeamMemberWhereInput | Prisma.OperationTeamMemberWhereInput[];
    OR?: Prisma.OperationTeamMemberWhereInput[];
    NOT?: Prisma.OperationTeamMemberWhereInput | Prisma.OperationTeamMemberWhereInput[];
    operationId?: Prisma.StringFilter<"OperationTeamMember"> | string;
    doctorId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    nurseId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationTeamMember"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationTeamMember"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    doctor?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    nurse?: Prisma.XOR<Prisma.NurseNullableScalarRelationFilter, Prisma.NurseWhereInput> | null;
}, "id">;
export type OperationTeamMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    nurseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OperationTeamMemberCountOrderByAggregateInput;
    _avg?: Prisma.OperationTeamMemberAvgOrderByAggregateInput;
    _max?: Prisma.OperationTeamMemberMaxOrderByAggregateInput;
    _min?: Prisma.OperationTeamMemberMinOrderByAggregateInput;
    _sum?: Prisma.OperationTeamMemberSumOrderByAggregateInput;
};
export type OperationTeamMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.OperationTeamMemberScalarWhereWithAggregatesInput | Prisma.OperationTeamMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.OperationTeamMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OperationTeamMemberScalarWhereWithAggregatesInput | Prisma.OperationTeamMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OperationTeamMember"> | string;
    operationId?: Prisma.StringWithAggregatesFilter<"OperationTeamMember"> | string;
    doctorId?: Prisma.StringNullableWithAggregatesFilter<"OperationTeamMember"> | string | null;
    nurseId?: Prisma.StringNullableWithAggregatesFilter<"OperationTeamMember"> | string | null;
    sortOrder?: Prisma.IntWithAggregatesFilter<"OperationTeamMember"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OperationTeamMember"> | Date | string;
};
export type OperationTeamMemberCreateInput = {
    id?: string;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutTeamMembersInput;
    doctor?: Prisma.DoctorCreateNestedOneWithoutTeamMembersInput;
    nurse?: Prisma.NurseCreateNestedOneWithoutTeamMembersInput;
};
export type OperationTeamMemberUncheckedCreateInput = {
    id?: string;
    operationId: string;
    doctorId?: string | null;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutTeamMembersNestedInput;
    doctor?: Prisma.DoctorUpdateOneWithoutTeamMembersNestedInput;
    nurse?: Prisma.NurseUpdateOneWithoutTeamMembersNestedInput;
};
export type OperationTeamMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberCreateManyInput = {
    id?: string;
    operationId: string;
    doctorId?: string | null;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberListRelationFilter = {
    every?: Prisma.OperationTeamMemberWhereInput;
    some?: Prisma.OperationTeamMemberWhereInput;
    none?: Prisma.OperationTeamMemberWhereInput;
};
export type OperationTeamMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OperationTeamMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    nurseId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationTeamMemberAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type OperationTeamMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    nurseId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationTeamMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    nurseId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationTeamMemberSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type OperationTeamMemberCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput> | Prisma.OperationTeamMemberCreateWithoutDoctorInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput | Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyDoctorInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput> | Prisma.OperationTeamMemberCreateWithoutDoctorInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput | Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyDoctorInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput> | Prisma.OperationTeamMemberCreateWithoutDoctorInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput | Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutDoctorInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyDoctorInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutDoctorInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutDoctorInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput> | Prisma.OperationTeamMemberCreateWithoutDoctorInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput | Prisma.OperationTeamMemberCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutDoctorInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyDoctorInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutDoctorInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutDoctorInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberCreateNestedManyWithoutNurseInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput> | Prisma.OperationTeamMemberCreateWithoutNurseInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput | Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyNurseInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUncheckedCreateNestedManyWithoutNurseInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput> | Prisma.OperationTeamMemberCreateWithoutNurseInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput | Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyNurseInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUpdateManyWithoutNurseNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput> | Prisma.OperationTeamMemberCreateWithoutNurseInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput | Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutNurseInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutNurseInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyNurseInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutNurseInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutNurseInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutNurseInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutNurseInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberUncheckedUpdateManyWithoutNurseNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput> | Prisma.OperationTeamMemberCreateWithoutNurseInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput | Prisma.OperationTeamMemberCreateOrConnectWithoutNurseInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutNurseInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutNurseInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyNurseInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutNurseInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutNurseInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutNurseInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutNurseInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput> | Prisma.OperationTeamMemberCreateWithoutOperationInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput | Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUncheckedCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput> | Prisma.OperationTeamMemberCreateWithoutOperationInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput | Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
};
export type OperationTeamMemberUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput> | Prisma.OperationTeamMemberCreateWithoutOperationInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput | Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyOperationInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutOperationInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberUncheckedUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput> | Prisma.OperationTeamMemberCreateWithoutOperationInput[] | Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput | Prisma.OperationTeamMemberCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationTeamMemberUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationTeamMemberCreateManyOperationInputEnvelope;
    set?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    disconnect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    delete?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    connect?: Prisma.OperationTeamMemberWhereUniqueInput | Prisma.OperationTeamMemberWhereUniqueInput[];
    update?: Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationTeamMemberUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationTeamMemberUpdateManyWithWhereWithoutOperationInput | Prisma.OperationTeamMemberUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
};
export type OperationTeamMemberCreateWithoutDoctorInput = {
    id?: string;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutTeamMembersInput;
    nurse?: Prisma.NurseCreateNestedOneWithoutTeamMembersInput;
};
export type OperationTeamMemberUncheckedCreateWithoutDoctorInput = {
    id?: string;
    operationId: string;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberCreateOrConnectWithoutDoctorInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput>;
};
export type OperationTeamMemberCreateManyDoctorInputEnvelope = {
    data: Prisma.OperationTeamMemberCreateManyDoctorInput | Prisma.OperationTeamMemberCreateManyDoctorInput[];
    skipDuplicates?: boolean;
};
export type OperationTeamMemberUpsertWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutDoctorInput>;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedCreateWithoutDoctorInput>;
};
export type OperationTeamMemberUpdateWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutDoctorInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutDoctorInput>;
};
export type OperationTeamMemberUpdateManyWithWhereWithoutDoctorInput = {
    where: Prisma.OperationTeamMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateManyMutationInput, Prisma.OperationTeamMemberUncheckedUpdateManyWithoutDoctorInput>;
};
export type OperationTeamMemberScalarWhereInput = {
    AND?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
    OR?: Prisma.OperationTeamMemberScalarWhereInput[];
    NOT?: Prisma.OperationTeamMemberScalarWhereInput | Prisma.OperationTeamMemberScalarWhereInput[];
    id?: Prisma.StringFilter<"OperationTeamMember"> | string;
    operationId?: Prisma.StringFilter<"OperationTeamMember"> | string;
    doctorId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    nurseId?: Prisma.StringNullableFilter<"OperationTeamMember"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationTeamMember"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationTeamMember"> | Date | string;
};
export type OperationTeamMemberCreateWithoutNurseInput = {
    id?: string;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutTeamMembersInput;
    doctor?: Prisma.DoctorCreateNestedOneWithoutTeamMembersInput;
};
export type OperationTeamMemberUncheckedCreateWithoutNurseInput = {
    id?: string;
    operationId: string;
    doctorId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberCreateOrConnectWithoutNurseInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput>;
};
export type OperationTeamMemberCreateManyNurseInputEnvelope = {
    data: Prisma.OperationTeamMemberCreateManyNurseInput | Prisma.OperationTeamMemberCreateManyNurseInput[];
    skipDuplicates?: boolean;
};
export type OperationTeamMemberUpsertWithWhereUniqueWithoutNurseInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutNurseInput>;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedCreateWithoutNurseInput>;
};
export type OperationTeamMemberUpdateWithWhereUniqueWithoutNurseInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutNurseInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutNurseInput>;
};
export type OperationTeamMemberUpdateManyWithWhereWithoutNurseInput = {
    where: Prisma.OperationTeamMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateManyMutationInput, Prisma.OperationTeamMemberUncheckedUpdateManyWithoutNurseInput>;
};
export type OperationTeamMemberCreateWithoutOperationInput = {
    id?: string;
    sortOrder?: number;
    createdAt?: Date | string;
    doctor?: Prisma.DoctorCreateNestedOneWithoutTeamMembersInput;
    nurse?: Prisma.NurseCreateNestedOneWithoutTeamMembersInput;
};
export type OperationTeamMemberUncheckedCreateWithoutOperationInput = {
    id?: string;
    doctorId?: string | null;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberCreateOrConnectWithoutOperationInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput>;
};
export type OperationTeamMemberCreateManyOperationInputEnvelope = {
    data: Prisma.OperationTeamMemberCreateManyOperationInput | Prisma.OperationTeamMemberCreateManyOperationInput[];
    skipDuplicates?: boolean;
};
export type OperationTeamMemberUpsertWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutOperationInput>;
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedCreateWithoutOperationInput>;
};
export type OperationTeamMemberUpdateWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateWithoutOperationInput, Prisma.OperationTeamMemberUncheckedUpdateWithoutOperationInput>;
};
export type OperationTeamMemberUpdateManyWithWhereWithoutOperationInput = {
    where: Prisma.OperationTeamMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateManyMutationInput, Prisma.OperationTeamMemberUncheckedUpdateManyWithoutOperationInput>;
};
export type OperationTeamMemberCreateManyDoctorInput = {
    id?: string;
    operationId: string;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutTeamMembersNestedInput;
    nurse?: Prisma.NurseUpdateOneWithoutTeamMembersNestedInput;
};
export type OperationTeamMemberUncheckedUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberUncheckedUpdateManyWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberCreateManyNurseInput = {
    id?: string;
    operationId: string;
    doctorId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberUpdateWithoutNurseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutTeamMembersNestedInput;
    doctor?: Prisma.DoctorUpdateOneWithoutTeamMembersNestedInput;
};
export type OperationTeamMemberUncheckedUpdateWithoutNurseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberUncheckedUpdateManyWithoutNurseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberCreateManyOperationInput = {
    id?: string;
    doctorId?: string | null;
    nurseId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationTeamMemberUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctor?: Prisma.DoctorUpdateOneWithoutTeamMembersNestedInput;
    nurse?: Prisma.NurseUpdateOneWithoutTeamMembersNestedInput;
};
export type OperationTeamMemberUncheckedUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberUncheckedUpdateManyWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationTeamMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    doctorId?: boolean;
    nurseId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
}, ExtArgs["result"]["operationTeamMember"]>;
export type OperationTeamMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    doctorId?: boolean;
    nurseId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
}, ExtArgs["result"]["operationTeamMember"]>;
export type OperationTeamMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    doctorId?: boolean;
    nurseId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
}, ExtArgs["result"]["operationTeamMember"]>;
export type OperationTeamMemberSelectScalar = {
    id?: boolean;
    operationId?: boolean;
    doctorId?: boolean;
    nurseId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
};
export type OperationTeamMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "operationId" | "doctorId" | "nurseId" | "sortOrder" | "createdAt", ExtArgs["result"]["operationTeamMember"]>;
export type OperationTeamMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
};
export type OperationTeamMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
};
export type OperationTeamMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.OperationTeamMember$doctorArgs<ExtArgs>;
    nurse?: boolean | Prisma.OperationTeamMember$nurseArgs<ExtArgs>;
};
export type $OperationTeamMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OperationTeamMember";
    objects: {
        operation: Prisma.$OperationPayload<ExtArgs>;
        doctor: Prisma.$DoctorPayload<ExtArgs> | null;
        nurse: Prisma.$NursePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        operationId: string;
        doctorId: string | null;
        nurseId: string | null;
        sortOrder: number;
        createdAt: Date;
    }, ExtArgs["result"]["operationTeamMember"]>;
    composites: {};
};
export type OperationTeamMemberGetPayload<S extends boolean | null | undefined | OperationTeamMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload, S>;
export type OperationTeamMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OperationTeamMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OperationTeamMemberCountAggregateInputType | true;
};
export interface OperationTeamMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OperationTeamMember'];
        meta: {
            name: 'OperationTeamMember';
        };
    };
    /**
     * Find zero or one OperationTeamMember that matches the filter.
     * @param {OperationTeamMemberFindUniqueArgs} args - Arguments to find a OperationTeamMember
     * @example
     * // Get one OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperationTeamMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OperationTeamMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperationTeamMemberFindUniqueOrThrowArgs} args - Arguments to find a OperationTeamMember
     * @example
     * // Get one OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperationTeamMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationTeamMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberFindFirstArgs} args - Arguments to find a OperationTeamMember
     * @example
     * // Get one OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperationTeamMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationTeamMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberFindFirstOrThrowArgs} args - Arguments to find a OperationTeamMember
     * @example
     * // Get one OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperationTeamMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OperationTeamMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperationTeamMembers
     * const operationTeamMembers = await prisma.operationTeamMember.findMany()
     *
     * // Get first 10 OperationTeamMembers
     * const operationTeamMembers = await prisma.operationTeamMember.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const operationTeamMemberWithIdOnly = await prisma.operationTeamMember.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OperationTeamMemberFindManyArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OperationTeamMember.
     * @param {OperationTeamMemberCreateArgs} args - Arguments to create a OperationTeamMember.
     * @example
     * // Create one OperationTeamMember
     * const OperationTeamMember = await prisma.operationTeamMember.create({
     *   data: {
     *     // ... data to create a OperationTeamMember
     *   }
     * })
     *
     */
    create<T extends OperationTeamMemberCreateArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberCreateArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OperationTeamMembers.
     * @param {OperationTeamMemberCreateManyArgs} args - Arguments to create many OperationTeamMembers.
     * @example
     * // Create many OperationTeamMembers
     * const operationTeamMember = await prisma.operationTeamMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OperationTeamMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OperationTeamMembers and returns the data saved in the database.
     * @param {OperationTeamMemberCreateManyAndReturnArgs} args - Arguments to create many OperationTeamMembers.
     * @example
     * // Create many OperationTeamMembers
     * const operationTeamMember = await prisma.operationTeamMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OperationTeamMembers and only return the `id`
     * const operationTeamMemberWithIdOnly = await prisma.operationTeamMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OperationTeamMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OperationTeamMember.
     * @param {OperationTeamMemberDeleteArgs} args - Arguments to delete one OperationTeamMember.
     * @example
     * // Delete one OperationTeamMember
     * const OperationTeamMember = await prisma.operationTeamMember.delete({
     *   where: {
     *     // ... filter to delete one OperationTeamMember
     *   }
     * })
     *
     */
    delete<T extends OperationTeamMemberDeleteArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OperationTeamMember.
     * @param {OperationTeamMemberUpdateArgs} args - Arguments to update one OperationTeamMember.
     * @example
     * // Update one OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OperationTeamMemberUpdateArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OperationTeamMembers.
     * @param {OperationTeamMemberDeleteManyArgs} args - Arguments to filter OperationTeamMembers to delete.
     * @example
     * // Delete a few OperationTeamMembers
     * const { count } = await prisma.operationTeamMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OperationTeamMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, OperationTeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationTeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperationTeamMembers
     * const operationTeamMember = await prisma.operationTeamMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OperationTeamMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationTeamMembers and returns the data updated in the database.
     * @param {OperationTeamMemberUpdateManyAndReturnArgs} args - Arguments to update many OperationTeamMembers.
     * @example
     * // Update many OperationTeamMembers
     * const operationTeamMember = await prisma.operationTeamMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OperationTeamMembers and only return the `id`
     * const operationTeamMemberWithIdOnly = await prisma.operationTeamMember.updateManyAndReturn({
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
    updateManyAndReturn<T extends OperationTeamMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OperationTeamMember.
     * @param {OperationTeamMemberUpsertArgs} args - Arguments to update or create a OperationTeamMember.
     * @example
     * // Update or create a OperationTeamMember
     * const operationTeamMember = await prisma.operationTeamMember.upsert({
     *   create: {
     *     // ... data to create a OperationTeamMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperationTeamMember we want to update
     *   }
     * })
     */
    upsert<T extends OperationTeamMemberUpsertArgs>(args: Prisma.SelectSubset<T, OperationTeamMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__OperationTeamMemberClient<runtime.Types.Result.GetResult<Prisma.$OperationTeamMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OperationTeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberCountArgs} args - Arguments to filter OperationTeamMembers to count.
     * @example
     * // Count the number of OperationTeamMembers
     * const count = await prisma.operationTeamMember.count({
     *   where: {
     *     // ... the filter for the OperationTeamMembers we want to count
     *   }
     * })
    **/
    count<T extends OperationTeamMemberCountArgs>(args?: Prisma.Subset<T, OperationTeamMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OperationTeamMemberCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OperationTeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OperationTeamMemberAggregateArgs>(args: Prisma.Subset<T, OperationTeamMemberAggregateArgs>): Prisma.PrismaPromise<GetOperationTeamMemberAggregateType<T>>;
    /**
     * Group by OperationTeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationTeamMemberGroupByArgs} args - Group by arguments.
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
    groupBy<T extends OperationTeamMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OperationTeamMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: OperationTeamMemberGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OperationTeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OperationTeamMember model
     */
    readonly fields: OperationTeamMemberFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OperationTeamMember.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OperationTeamMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    operation<T extends Prisma.OperationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationDefaultArgs<ExtArgs>>): Prisma.Prisma__OperationClient<runtime.Types.Result.GetResult<Prisma.$OperationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    doctor<T extends Prisma.OperationTeamMember$doctorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationTeamMember$doctorArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    nurse<T extends Prisma.OperationTeamMember$nurseArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationTeamMember$nurseArgs<ExtArgs>>): Prisma.Prisma__NurseClient<runtime.Types.Result.GetResult<Prisma.$NursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the OperationTeamMember model
 */
export interface OperationTeamMemberFieldRefs {
    readonly id: Prisma.FieldRef<"OperationTeamMember", 'String'>;
    readonly operationId: Prisma.FieldRef<"OperationTeamMember", 'String'>;
    readonly doctorId: Prisma.FieldRef<"OperationTeamMember", 'String'>;
    readonly nurseId: Prisma.FieldRef<"OperationTeamMember", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"OperationTeamMember", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"OperationTeamMember", 'DateTime'>;
}
/**
 * OperationTeamMember findUnique
 */
export type OperationTeamMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter, which OperationTeamMember to fetch.
     */
    where: Prisma.OperationTeamMemberWhereUniqueInput;
};
/**
 * OperationTeamMember findUniqueOrThrow
 */
export type OperationTeamMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter, which OperationTeamMember to fetch.
     */
    where: Prisma.OperationTeamMemberWhereUniqueInput;
};
/**
 * OperationTeamMember findFirst
 */
export type OperationTeamMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter, which OperationTeamMember to fetch.
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationTeamMembers to fetch.
     */
    orderBy?: Prisma.OperationTeamMemberOrderByWithRelationInput | Prisma.OperationTeamMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationTeamMembers.
     */
    cursor?: Prisma.OperationTeamMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationTeamMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationTeamMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationTeamMembers.
     */
    distinct?: Prisma.OperationTeamMemberScalarFieldEnum | Prisma.OperationTeamMemberScalarFieldEnum[];
};
/**
 * OperationTeamMember findFirstOrThrow
 */
export type OperationTeamMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter, which OperationTeamMember to fetch.
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationTeamMembers to fetch.
     */
    orderBy?: Prisma.OperationTeamMemberOrderByWithRelationInput | Prisma.OperationTeamMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationTeamMembers.
     */
    cursor?: Prisma.OperationTeamMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationTeamMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationTeamMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationTeamMembers.
     */
    distinct?: Prisma.OperationTeamMemberScalarFieldEnum | Prisma.OperationTeamMemberScalarFieldEnum[];
};
/**
 * OperationTeamMember findMany
 */
export type OperationTeamMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter, which OperationTeamMembers to fetch.
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationTeamMembers to fetch.
     */
    orderBy?: Prisma.OperationTeamMemberOrderByWithRelationInput | Prisma.OperationTeamMemberOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OperationTeamMembers.
     */
    cursor?: Prisma.OperationTeamMemberWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationTeamMembers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationTeamMembers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationTeamMembers.
     */
    distinct?: Prisma.OperationTeamMemberScalarFieldEnum | Prisma.OperationTeamMemberScalarFieldEnum[];
};
/**
 * OperationTeamMember create
 */
export type OperationTeamMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * The data needed to create a OperationTeamMember.
     */
    data: Prisma.XOR<Prisma.OperationTeamMemberCreateInput, Prisma.OperationTeamMemberUncheckedCreateInput>;
};
/**
 * OperationTeamMember createMany
 */
export type OperationTeamMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperationTeamMembers.
     */
    data: Prisma.OperationTeamMemberCreateManyInput | Prisma.OperationTeamMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OperationTeamMember createManyAndReturn
 */
export type OperationTeamMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * The data used to create many OperationTeamMembers.
     */
    data: Prisma.OperationTeamMemberCreateManyInput | Prisma.OperationTeamMemberCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationTeamMember update
 */
export type OperationTeamMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * The data needed to update a OperationTeamMember.
     */
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateInput, Prisma.OperationTeamMemberUncheckedUpdateInput>;
    /**
     * Choose, which OperationTeamMember to update.
     */
    where: Prisma.OperationTeamMemberWhereUniqueInput;
};
/**
 * OperationTeamMember updateMany
 */
export type OperationTeamMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OperationTeamMembers.
     */
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateManyMutationInput, Prisma.OperationTeamMemberUncheckedUpdateManyInput>;
    /**
     * Filter which OperationTeamMembers to update
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * Limit how many OperationTeamMembers to update.
     */
    limit?: number;
};
/**
 * OperationTeamMember updateManyAndReturn
 */
export type OperationTeamMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * The data used to update OperationTeamMembers.
     */
    data: Prisma.XOR<Prisma.OperationTeamMemberUpdateManyMutationInput, Prisma.OperationTeamMemberUncheckedUpdateManyInput>;
    /**
     * Filter which OperationTeamMembers to update
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * Limit how many OperationTeamMembers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationTeamMember upsert
 */
export type OperationTeamMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * The filter to search for the OperationTeamMember to update in case it exists.
     */
    where: Prisma.OperationTeamMemberWhereUniqueInput;
    /**
     * In case the OperationTeamMember found by the `where` argument doesn't exist, create a new OperationTeamMember with this data.
     */
    create: Prisma.XOR<Prisma.OperationTeamMemberCreateInput, Prisma.OperationTeamMemberUncheckedCreateInput>;
    /**
     * In case the OperationTeamMember was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OperationTeamMemberUpdateInput, Prisma.OperationTeamMemberUncheckedUpdateInput>;
};
/**
 * OperationTeamMember delete
 */
export type OperationTeamMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
    /**
     * Filter which OperationTeamMember to delete.
     */
    where: Prisma.OperationTeamMemberWhereUniqueInput;
};
/**
 * OperationTeamMember deleteMany
 */
export type OperationTeamMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationTeamMembers to delete
     */
    where?: Prisma.OperationTeamMemberWhereInput;
    /**
     * Limit how many OperationTeamMembers to delete.
     */
    limit?: number;
};
/**
 * OperationTeamMember.doctor
 */
export type OperationTeamMember$doctorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: Prisma.DoctorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Doctor
     */
    omit?: Prisma.DoctorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DoctorInclude<ExtArgs> | null;
    where?: Prisma.DoctorWhereInput;
};
/**
 * OperationTeamMember.nurse
 */
export type OperationTeamMember$nurseArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nurse
     */
    select?: Prisma.NurseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Nurse
     */
    omit?: Prisma.NurseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.NurseInclude<ExtArgs> | null;
    where?: Prisma.NurseWhereInput;
};
/**
 * OperationTeamMember without action
 */
export type OperationTeamMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationTeamMember
     */
    select?: Prisma.OperationTeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationTeamMember
     */
    omit?: Prisma.OperationTeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationTeamMemberInclude<ExtArgs> | null;
};
//# sourceMappingURL=OperationTeamMember.d.ts.map