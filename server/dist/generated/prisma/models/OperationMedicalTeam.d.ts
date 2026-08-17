import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model OperationMedicalTeam
 *
 */
export type OperationMedicalTeamModel = runtime.Types.Result.DefaultSelection<Prisma.$OperationMedicalTeamPayload>;
export type AggregateOperationMedicalTeam = {
    _count: OperationMedicalTeamCountAggregateOutputType | null;
    _min: OperationMedicalTeamMinAggregateOutputType | null;
    _max: OperationMedicalTeamMaxAggregateOutputType | null;
};
export type OperationMedicalTeamMinAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    primarySurgeonId: string | null;
    assistantSurgeonId: string | null;
    anesthesiologistId: string | null;
    assistantAnesthesiaId: string | null;
    nurse: string | null;
    notes: string | null;
    createdAt: Date | null;
};
export type OperationMedicalTeamMaxAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    primarySurgeonId: string | null;
    assistantSurgeonId: string | null;
    anesthesiologistId: string | null;
    assistantAnesthesiaId: string | null;
    nurse: string | null;
    notes: string | null;
    createdAt: Date | null;
};
export type OperationMedicalTeamCountAggregateOutputType = {
    id: number;
    operationId: number;
    primarySurgeonId: number;
    assistantSurgeonId: number;
    anesthesiologistId: number;
    assistantAnesthesiaId: number;
    nurse: number;
    notes: number;
    createdAt: number;
    _all: number;
};
export type OperationMedicalTeamMinAggregateInputType = {
    id?: true;
    operationId?: true;
    primarySurgeonId?: true;
    assistantSurgeonId?: true;
    anesthesiologistId?: true;
    assistantAnesthesiaId?: true;
    nurse?: true;
    notes?: true;
    createdAt?: true;
};
export type OperationMedicalTeamMaxAggregateInputType = {
    id?: true;
    operationId?: true;
    primarySurgeonId?: true;
    assistantSurgeonId?: true;
    anesthesiologistId?: true;
    assistantAnesthesiaId?: true;
    nurse?: true;
    notes?: true;
    createdAt?: true;
};
export type OperationMedicalTeamCountAggregateInputType = {
    id?: true;
    operationId?: true;
    primarySurgeonId?: true;
    assistantSurgeonId?: true;
    anesthesiologistId?: true;
    assistantAnesthesiaId?: true;
    nurse?: true;
    notes?: true;
    createdAt?: true;
    _all?: true;
};
export type OperationMedicalTeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationMedicalTeam to aggregate.
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationMedicalTeams to fetch.
     */
    orderBy?: Prisma.OperationMedicalTeamOrderByWithRelationInput | Prisma.OperationMedicalTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OperationMedicalTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationMedicalTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationMedicalTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OperationMedicalTeams
    **/
    _count?: true | OperationMedicalTeamCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OperationMedicalTeamMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OperationMedicalTeamMaxAggregateInputType;
};
export type GetOperationMedicalTeamAggregateType<T extends OperationMedicalTeamAggregateArgs> = {
    [P in keyof T & keyof AggregateOperationMedicalTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOperationMedicalTeam[P]> : Prisma.GetScalarType<T[P], AggregateOperationMedicalTeam[P]>;
};
export type OperationMedicalTeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OperationMedicalTeamWhereInput;
    orderBy?: Prisma.OperationMedicalTeamOrderByWithAggregationInput | Prisma.OperationMedicalTeamOrderByWithAggregationInput[];
    by: Prisma.OperationMedicalTeamScalarFieldEnum[] | Prisma.OperationMedicalTeamScalarFieldEnum;
    having?: Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OperationMedicalTeamCountAggregateInputType | true;
    _min?: OperationMedicalTeamMinAggregateInputType;
    _max?: OperationMedicalTeamMaxAggregateInputType;
};
export type OperationMedicalTeamGroupByOutputType = {
    id: string;
    operationId: string;
    primarySurgeonId: string | null;
    assistantSurgeonId: string | null;
    anesthesiologistId: string | null;
    assistantAnesthesiaId: string | null;
    nurse: string | null;
    notes: string | null;
    createdAt: Date;
    _count: OperationMedicalTeamCountAggregateOutputType | null;
    _min: OperationMedicalTeamMinAggregateOutputType | null;
    _max: OperationMedicalTeamMaxAggregateOutputType | null;
};
export type GetOperationMedicalTeamGroupByPayload<T extends OperationMedicalTeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OperationMedicalTeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OperationMedicalTeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OperationMedicalTeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OperationMedicalTeamGroupByOutputType[P]>;
}>>;
export type OperationMedicalTeamWhereInput = {
    AND?: Prisma.OperationMedicalTeamWhereInput | Prisma.OperationMedicalTeamWhereInput[];
    OR?: Prisma.OperationMedicalTeamWhereInput[];
    NOT?: Prisma.OperationMedicalTeamWhereInput | Prisma.OperationMedicalTeamWhereInput[];
    id?: Prisma.StringFilter<"OperationMedicalTeam"> | string;
    operationId?: Prisma.StringFilter<"OperationMedicalTeam"> | string;
    primarySurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantSurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    anesthesiologistId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantAnesthesiaId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    nurse?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    notes?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"OperationMedicalTeam"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    primarySurgeon?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    assistantSurgeon?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    anesthesiologist?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    assistantAnesthesia?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
};
export type OperationMedicalTeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    primarySurgeonId?: Prisma.SortOrderInput | Prisma.SortOrder;
    assistantSurgeonId?: Prisma.SortOrderInput | Prisma.SortOrder;
    anesthesiologistId?: Prisma.SortOrderInput | Prisma.SortOrder;
    assistantAnesthesiaId?: Prisma.SortOrderInput | Prisma.SortOrder;
    nurse?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    operation?: Prisma.OperationOrderByWithRelationInput;
    primarySurgeon?: Prisma.DoctorOrderByWithRelationInput;
    assistantSurgeon?: Prisma.DoctorOrderByWithRelationInput;
    anesthesiologist?: Prisma.DoctorOrderByWithRelationInput;
    assistantAnesthesia?: Prisma.DoctorOrderByWithRelationInput;
};
export type OperationMedicalTeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OperationMedicalTeamWhereInput | Prisma.OperationMedicalTeamWhereInput[];
    OR?: Prisma.OperationMedicalTeamWhereInput[];
    NOT?: Prisma.OperationMedicalTeamWhereInput | Prisma.OperationMedicalTeamWhereInput[];
    operationId?: Prisma.StringFilter<"OperationMedicalTeam"> | string;
    primarySurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantSurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    anesthesiologistId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantAnesthesiaId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    nurse?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    notes?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"OperationMedicalTeam"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    primarySurgeon?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    assistantSurgeon?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    anesthesiologist?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
    assistantAnesthesia?: Prisma.XOR<Prisma.DoctorNullableScalarRelationFilter, Prisma.DoctorWhereInput> | null;
}, "id">;
export type OperationMedicalTeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    primarySurgeonId?: Prisma.SortOrderInput | Prisma.SortOrder;
    assistantSurgeonId?: Prisma.SortOrderInput | Prisma.SortOrder;
    anesthesiologistId?: Prisma.SortOrderInput | Prisma.SortOrder;
    assistantAnesthesiaId?: Prisma.SortOrderInput | Prisma.SortOrder;
    nurse?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OperationMedicalTeamCountOrderByAggregateInput;
    _max?: Prisma.OperationMedicalTeamMaxOrderByAggregateInput;
    _min?: Prisma.OperationMedicalTeamMinOrderByAggregateInput;
};
export type OperationMedicalTeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput | Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput | Prisma.OperationMedicalTeamScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OperationMedicalTeam"> | string;
    operationId?: Prisma.StringWithAggregatesFilter<"OperationMedicalTeam"> | string;
    primarySurgeonId?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    assistantSurgeonId?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    anesthesiologistId?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    assistantAnesthesiaId?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    nurse?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"OperationMedicalTeam"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OperationMedicalTeam"> | Date | string;
};
export type OperationMedicalTeamCreateInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutMedicalTeamInput;
    primarySurgeon?: Prisma.DoctorCreateNestedOneWithoutPrimarySurgeonInput;
    assistantSurgeon?: Prisma.DoctorCreateNestedOneWithoutAssistantInput;
    anesthesiologist?: Prisma.DoctorCreateNestedOneWithoutAnesthesiologistInput;
    assistantAnesthesia?: Prisma.DoctorCreateNestedOneWithoutAssistantAnesthesiaInput;
};
export type OperationMedicalTeamUncheckedCreateInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutMedicalTeamNestedInput;
    primarySurgeon?: Prisma.DoctorUpdateOneWithoutPrimarySurgeonNestedInput;
    assistantSurgeon?: Prisma.DoctorUpdateOneWithoutAssistantNestedInput;
    anesthesiologist?: Prisma.DoctorUpdateOneWithoutAnesthesiologistNestedInput;
    assistantAnesthesia?: Prisma.DoctorUpdateOneWithoutAssistantAnesthesiaNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamCreateManyInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamListRelationFilter = {
    every?: Prisma.OperationMedicalTeamWhereInput;
    some?: Prisma.OperationMedicalTeamWhereInput;
    none?: Prisma.OperationMedicalTeamWhereInput;
};
export type OperationMedicalTeamOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OperationMedicalTeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    primarySurgeonId?: Prisma.SortOrder;
    assistantSurgeonId?: Prisma.SortOrder;
    anesthesiologistId?: Prisma.SortOrder;
    assistantAnesthesiaId?: Prisma.SortOrder;
    nurse?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationMedicalTeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    primarySurgeonId?: Prisma.SortOrder;
    assistantSurgeonId?: Prisma.SortOrder;
    anesthesiologistId?: Prisma.SortOrder;
    assistantAnesthesiaId?: Prisma.SortOrder;
    nurse?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationMedicalTeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    primarySurgeonId?: Prisma.SortOrder;
    assistantSurgeonId?: Prisma.SortOrder;
    anesthesiologistId?: Prisma.SortOrder;
    assistantAnesthesiaId?: Prisma.SortOrder;
    nurse?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationMedicalTeamCreateNestedManyWithoutPrimarySurgeonInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamCreateNestedManyWithoutAssistantSurgeonInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamCreateNestedManyWithoutAnesthesiologistInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput> | Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAnesthesiologistInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamCreateNestedManyWithoutAssistantAnesthesiaInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUncheckedCreateNestedManyWithoutPrimarySurgeonInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUncheckedCreateNestedManyWithoutAssistantSurgeonInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUncheckedCreateNestedManyWithoutAnesthesiologistInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput> | Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAnesthesiologistInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUncheckedCreateNestedManyWithoutAssistantAnesthesiaInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUpdateManyWithoutPrimarySurgeonNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutPrimarySurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutPrimarySurgeonInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutPrimarySurgeonInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUpdateManyWithoutAssistantSurgeonNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantSurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantSurgeonInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantSurgeonInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUpdateManyWithoutAnesthesiologistNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput> | Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAnesthesiologistInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAnesthesiologistInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAnesthesiologistInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAnesthesiologistInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUpdateManyWithoutAssistantAnesthesiaNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantAnesthesiaInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantAnesthesiaInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantAnesthesiaInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutPrimarySurgeonNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutPrimarySurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutPrimarySurgeonInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutPrimarySurgeonInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutPrimarySurgeonInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAssistantSurgeonNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantSurgeonInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantSurgeonInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantSurgeonInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantSurgeonInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAnesthesiologistNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput> | Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAnesthesiologistInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAnesthesiologistInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAnesthesiologistInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAnesthesiologistInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAnesthesiologistInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAssistantAnesthesiaNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput> | Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantAnesthesiaInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantAnesthesiaInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantAnesthesiaInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutAssistantAnesthesiaInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput> | Prisma.OperationMedicalTeamCreateWithoutOperationInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUncheckedCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput> | Prisma.OperationMedicalTeamCreateWithoutOperationInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
};
export type OperationMedicalTeamUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput> | Prisma.OperationMedicalTeamCreateWithoutOperationInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyOperationInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutOperationInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput> | Prisma.OperationMedicalTeamCreateWithoutOperationInput[] | Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput | Prisma.OperationMedicalTeamCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationMedicalTeamUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationMedicalTeamCreateManyOperationInputEnvelope;
    set?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    disconnect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    delete?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    connect?: Prisma.OperationMedicalTeamWhereUniqueInput | Prisma.OperationMedicalTeamWhereUniqueInput[];
    update?: Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationMedicalTeamUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutOperationInput | Prisma.OperationMedicalTeamUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
};
export type OperationMedicalTeamCreateWithoutPrimarySurgeonInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutMedicalTeamInput;
    assistantSurgeon?: Prisma.DoctorCreateNestedOneWithoutAssistantInput;
    anesthesiologist?: Prisma.DoctorCreateNestedOneWithoutAnesthesiologistInput;
    assistantAnesthesia?: Prisma.DoctorCreateNestedOneWithoutAssistantAnesthesiaInput;
};
export type OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput = {
    id?: string;
    operationId: string;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateOrConnectWithoutPrimarySurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput>;
};
export type OperationMedicalTeamCreateManyPrimarySurgeonInputEnvelope = {
    data: Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInput | Prisma.OperationMedicalTeamCreateManyPrimarySurgeonInput[];
    skipDuplicates?: boolean;
};
export type OperationMedicalTeamCreateWithoutAssistantSurgeonInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutMedicalTeamInput;
    primarySurgeon?: Prisma.DoctorCreateNestedOneWithoutPrimarySurgeonInput;
    anesthesiologist?: Prisma.DoctorCreateNestedOneWithoutAnesthesiologistInput;
    assistantAnesthesia?: Prisma.DoctorCreateNestedOneWithoutAssistantAnesthesiaInput;
};
export type OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateOrConnectWithoutAssistantSurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput>;
};
export type OperationMedicalTeamCreateManyAssistantSurgeonInputEnvelope = {
    data: Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInput | Prisma.OperationMedicalTeamCreateManyAssistantSurgeonInput[];
    skipDuplicates?: boolean;
};
export type OperationMedicalTeamCreateWithoutAnesthesiologistInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutMedicalTeamInput;
    primarySurgeon?: Prisma.DoctorCreateNestedOneWithoutPrimarySurgeonInput;
    assistantSurgeon?: Prisma.DoctorCreateNestedOneWithoutAssistantInput;
    assistantAnesthesia?: Prisma.DoctorCreateNestedOneWithoutAssistantAnesthesiaInput;
};
export type OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateOrConnectWithoutAnesthesiologistInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput>;
};
export type OperationMedicalTeamCreateManyAnesthesiologistInputEnvelope = {
    data: Prisma.OperationMedicalTeamCreateManyAnesthesiologistInput | Prisma.OperationMedicalTeamCreateManyAnesthesiologistInput[];
    skipDuplicates?: boolean;
};
export type OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutMedicalTeamInput;
    primarySurgeon?: Prisma.DoctorCreateNestedOneWithoutPrimarySurgeonInput;
    assistantSurgeon?: Prisma.DoctorCreateNestedOneWithoutAssistantInput;
    anesthesiologist?: Prisma.DoctorCreateNestedOneWithoutAnesthesiologistInput;
};
export type OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateOrConnectWithoutAssistantAnesthesiaInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput>;
};
export type OperationMedicalTeamCreateManyAssistantAnesthesiaInputEnvelope = {
    data: Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInput | Prisma.OperationMedicalTeamCreateManyAssistantAnesthesiaInput[];
    skipDuplicates?: boolean;
};
export type OperationMedicalTeamUpsertWithWhereUniqueWithoutPrimarySurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutPrimarySurgeonInput>;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutPrimarySurgeonInput>;
};
export type OperationMedicalTeamUpdateWithWhereUniqueWithoutPrimarySurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutPrimarySurgeonInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutPrimarySurgeonInput>;
};
export type OperationMedicalTeamUpdateManyWithWhereWithoutPrimarySurgeonInput = {
    where: Prisma.OperationMedicalTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyWithoutPrimarySurgeonInput>;
};
export type OperationMedicalTeamScalarWhereInput = {
    AND?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
    OR?: Prisma.OperationMedicalTeamScalarWhereInput[];
    NOT?: Prisma.OperationMedicalTeamScalarWhereInput | Prisma.OperationMedicalTeamScalarWhereInput[];
    id?: Prisma.StringFilter<"OperationMedicalTeam"> | string;
    operationId?: Prisma.StringFilter<"OperationMedicalTeam"> | string;
    primarySurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantSurgeonId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    anesthesiologistId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    assistantAnesthesiaId?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    nurse?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    notes?: Prisma.StringNullableFilter<"OperationMedicalTeam"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"OperationMedicalTeam"> | Date | string;
};
export type OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantSurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAssistantSurgeonInput>;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantSurgeonInput>;
};
export type OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantSurgeonInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAssistantSurgeonInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAssistantSurgeonInput>;
};
export type OperationMedicalTeamUpdateManyWithWhereWithoutAssistantSurgeonInput = {
    where: Prisma.OperationMedicalTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyWithoutAssistantSurgeonInput>;
};
export type OperationMedicalTeamUpsertWithWhereUniqueWithoutAnesthesiologistInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAnesthesiologistInput>;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAnesthesiologistInput>;
};
export type OperationMedicalTeamUpdateWithWhereUniqueWithoutAnesthesiologistInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAnesthesiologistInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAnesthesiologistInput>;
};
export type OperationMedicalTeamUpdateManyWithWhereWithoutAnesthesiologistInput = {
    where: Prisma.OperationMedicalTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyWithoutAnesthesiologistInput>;
};
export type OperationMedicalTeamUpsertWithWhereUniqueWithoutAssistantAnesthesiaInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAssistantAnesthesiaInput>;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutAssistantAnesthesiaInput>;
};
export type OperationMedicalTeamUpdateWithWhereUniqueWithoutAssistantAnesthesiaInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutAssistantAnesthesiaInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutAssistantAnesthesiaInput>;
};
export type OperationMedicalTeamUpdateManyWithWhereWithoutAssistantAnesthesiaInput = {
    where: Prisma.OperationMedicalTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyWithoutAssistantAnesthesiaInput>;
};
export type OperationMedicalTeamCreateWithoutOperationInput = {
    id?: string;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    primarySurgeon?: Prisma.DoctorCreateNestedOneWithoutPrimarySurgeonInput;
    assistantSurgeon?: Prisma.DoctorCreateNestedOneWithoutAssistantInput;
    anesthesiologist?: Prisma.DoctorCreateNestedOneWithoutAnesthesiologistInput;
    assistantAnesthesia?: Prisma.DoctorCreateNestedOneWithoutAssistantAnesthesiaInput;
};
export type OperationMedicalTeamUncheckedCreateWithoutOperationInput = {
    id?: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateOrConnectWithoutOperationInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput>;
};
export type OperationMedicalTeamCreateManyOperationInputEnvelope = {
    data: Prisma.OperationMedicalTeamCreateManyOperationInput | Prisma.OperationMedicalTeamCreateManyOperationInput[];
    skipDuplicates?: boolean;
};
export type OperationMedicalTeamUpsertWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutOperationInput>;
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedCreateWithoutOperationInput>;
};
export type OperationMedicalTeamUpdateWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateWithoutOperationInput, Prisma.OperationMedicalTeamUncheckedUpdateWithoutOperationInput>;
};
export type OperationMedicalTeamUpdateManyWithWhereWithoutOperationInput = {
    where: Prisma.OperationMedicalTeamScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyWithoutOperationInput>;
};
export type OperationMedicalTeamCreateManyPrimarySurgeonInput = {
    id?: string;
    operationId: string;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateManyAssistantSurgeonInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateManyAnesthesiologistInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamCreateManyAssistantAnesthesiaInput = {
    id?: string;
    operationId: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamUpdateWithoutPrimarySurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutMedicalTeamNestedInput;
    assistantSurgeon?: Prisma.DoctorUpdateOneWithoutAssistantNestedInput;
    anesthesiologist?: Prisma.DoctorUpdateOneWithoutAnesthesiologistNestedInput;
    assistantAnesthesia?: Prisma.DoctorUpdateOneWithoutAssistantAnesthesiaNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateWithoutPrimarySurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutPrimarySurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUpdateWithoutAssistantSurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutMedicalTeamNestedInput;
    primarySurgeon?: Prisma.DoctorUpdateOneWithoutPrimarySurgeonNestedInput;
    anesthesiologist?: Prisma.DoctorUpdateOneWithoutAnesthesiologistNestedInput;
    assistantAnesthesia?: Prisma.DoctorUpdateOneWithoutAssistantAnesthesiaNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateWithoutAssistantSurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAssistantSurgeonInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUpdateWithoutAnesthesiologistInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutMedicalTeamNestedInput;
    primarySurgeon?: Prisma.DoctorUpdateOneWithoutPrimarySurgeonNestedInput;
    assistantSurgeon?: Prisma.DoctorUpdateOneWithoutAssistantNestedInput;
    assistantAnesthesia?: Prisma.DoctorUpdateOneWithoutAssistantAnesthesiaNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateWithoutAnesthesiologistInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAnesthesiologistInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUpdateWithoutAssistantAnesthesiaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutMedicalTeamNestedInput;
    primarySurgeon?: Prisma.DoctorUpdateOneWithoutPrimarySurgeonNestedInput;
    assistantSurgeon?: Prisma.DoctorUpdateOneWithoutAssistantNestedInput;
    anesthesiologist?: Prisma.DoctorUpdateOneWithoutAnesthesiologistNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateWithoutAssistantAnesthesiaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutAssistantAnesthesiaInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamCreateManyOperationInput = {
    id?: string;
    primarySurgeonId?: string | null;
    assistantSurgeonId?: string | null;
    anesthesiologistId?: string | null;
    assistantAnesthesiaId?: string | null;
    nurse?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
};
export type OperationMedicalTeamUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    primarySurgeon?: Prisma.DoctorUpdateOneWithoutPrimarySurgeonNestedInput;
    assistantSurgeon?: Prisma.DoctorUpdateOneWithoutAssistantNestedInput;
    anesthesiologist?: Prisma.DoctorUpdateOneWithoutAnesthesiologistNestedInput;
    assistantAnesthesia?: Prisma.DoctorUpdateOneWithoutAssistantAnesthesiaNestedInput;
};
export type OperationMedicalTeamUncheckedUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamUncheckedUpdateManyWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    primarySurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantSurgeonId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anesthesiologistId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assistantAnesthesiaId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nurse?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationMedicalTeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    primarySurgeonId?: boolean;
    assistantSurgeonId?: boolean;
    anesthesiologistId?: boolean;
    assistantAnesthesiaId?: boolean;
    nurse?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
}, ExtArgs["result"]["operationMedicalTeam"]>;
export type OperationMedicalTeamSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    primarySurgeonId?: boolean;
    assistantSurgeonId?: boolean;
    anesthesiologistId?: boolean;
    assistantAnesthesiaId?: boolean;
    nurse?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
}, ExtArgs["result"]["operationMedicalTeam"]>;
export type OperationMedicalTeamSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    primarySurgeonId?: boolean;
    assistantSurgeonId?: boolean;
    anesthesiologistId?: boolean;
    assistantAnesthesiaId?: boolean;
    nurse?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
}, ExtArgs["result"]["operationMedicalTeam"]>;
export type OperationMedicalTeamSelectScalar = {
    id?: boolean;
    operationId?: boolean;
    primarySurgeonId?: boolean;
    assistantSurgeonId?: boolean;
    anesthesiologistId?: boolean;
    assistantAnesthesiaId?: boolean;
    nurse?: boolean;
    notes?: boolean;
    createdAt?: boolean;
};
export type OperationMedicalTeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "operationId" | "primarySurgeonId" | "assistantSurgeonId" | "anesthesiologistId" | "assistantAnesthesiaId" | "nurse" | "notes" | "createdAt", ExtArgs["result"]["operationMedicalTeam"]>;
export type OperationMedicalTeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
};
export type OperationMedicalTeamIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
};
export type OperationMedicalTeamIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    primarySurgeon?: boolean | Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>;
    assistantSurgeon?: boolean | Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>;
    anesthesiologist?: boolean | Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>;
    assistantAnesthesia?: boolean | Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>;
};
export type $OperationMedicalTeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OperationMedicalTeam";
    objects: {
        operation: Prisma.$OperationPayload<ExtArgs>;
        primarySurgeon: Prisma.$DoctorPayload<ExtArgs> | null;
        assistantSurgeon: Prisma.$DoctorPayload<ExtArgs> | null;
        anesthesiologist: Prisma.$DoctorPayload<ExtArgs> | null;
        assistantAnesthesia: Prisma.$DoctorPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        operationId: string;
        primarySurgeonId: string | null;
        assistantSurgeonId: string | null;
        anesthesiologistId: string | null;
        assistantAnesthesiaId: string | null;
        nurse: string | null;
        notes: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["operationMedicalTeam"]>;
    composites: {};
};
export type OperationMedicalTeamGetPayload<S extends boolean | null | undefined | OperationMedicalTeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload, S>;
export type OperationMedicalTeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OperationMedicalTeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OperationMedicalTeamCountAggregateInputType | true;
};
export interface OperationMedicalTeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OperationMedicalTeam'];
        meta: {
            name: 'OperationMedicalTeam';
        };
    };
    /**
     * Find zero or one OperationMedicalTeam that matches the filter.
     * @param {OperationMedicalTeamFindUniqueArgs} args - Arguments to find a OperationMedicalTeam
     * @example
     * // Get one OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperationMedicalTeamFindUniqueArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OperationMedicalTeam that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperationMedicalTeamFindUniqueOrThrowArgs} args - Arguments to find a OperationMedicalTeam
     * @example
     * // Get one OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperationMedicalTeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationMedicalTeam that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamFindFirstArgs} args - Arguments to find a OperationMedicalTeam
     * @example
     * // Get one OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperationMedicalTeamFindFirstArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationMedicalTeam that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamFindFirstOrThrowArgs} args - Arguments to find a OperationMedicalTeam
     * @example
     * // Get one OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperationMedicalTeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OperationMedicalTeams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperationMedicalTeams
     * const operationMedicalTeams = await prisma.operationMedicalTeam.findMany()
     *
     * // Get first 10 OperationMedicalTeams
     * const operationMedicalTeams = await prisma.operationMedicalTeam.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const operationMedicalTeamWithIdOnly = await prisma.operationMedicalTeam.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OperationMedicalTeamFindManyArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OperationMedicalTeam.
     * @param {OperationMedicalTeamCreateArgs} args - Arguments to create a OperationMedicalTeam.
     * @example
     * // Create one OperationMedicalTeam
     * const OperationMedicalTeam = await prisma.operationMedicalTeam.create({
     *   data: {
     *     // ... data to create a OperationMedicalTeam
     *   }
     * })
     *
     */
    create<T extends OperationMedicalTeamCreateArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamCreateArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OperationMedicalTeams.
     * @param {OperationMedicalTeamCreateManyArgs} args - Arguments to create many OperationMedicalTeams.
     * @example
     * // Create many OperationMedicalTeams
     * const operationMedicalTeam = await prisma.operationMedicalTeam.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OperationMedicalTeamCreateManyArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OperationMedicalTeams and returns the data saved in the database.
     * @param {OperationMedicalTeamCreateManyAndReturnArgs} args - Arguments to create many OperationMedicalTeams.
     * @example
     * // Create many OperationMedicalTeams
     * const operationMedicalTeam = await prisma.operationMedicalTeam.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OperationMedicalTeams and only return the `id`
     * const operationMedicalTeamWithIdOnly = await prisma.operationMedicalTeam.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OperationMedicalTeamCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OperationMedicalTeam.
     * @param {OperationMedicalTeamDeleteArgs} args - Arguments to delete one OperationMedicalTeam.
     * @example
     * // Delete one OperationMedicalTeam
     * const OperationMedicalTeam = await prisma.operationMedicalTeam.delete({
     *   where: {
     *     // ... filter to delete one OperationMedicalTeam
     *   }
     * })
     *
     */
    delete<T extends OperationMedicalTeamDeleteArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamDeleteArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OperationMedicalTeam.
     * @param {OperationMedicalTeamUpdateArgs} args - Arguments to update one OperationMedicalTeam.
     * @example
     * // Update one OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OperationMedicalTeamUpdateArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamUpdateArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OperationMedicalTeams.
     * @param {OperationMedicalTeamDeleteManyArgs} args - Arguments to filter OperationMedicalTeams to delete.
     * @example
     * // Delete a few OperationMedicalTeams
     * const { count } = await prisma.operationMedicalTeam.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OperationMedicalTeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, OperationMedicalTeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationMedicalTeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperationMedicalTeams
     * const operationMedicalTeam = await prisma.operationMedicalTeam.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OperationMedicalTeamUpdateManyArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationMedicalTeams and returns the data updated in the database.
     * @param {OperationMedicalTeamUpdateManyAndReturnArgs} args - Arguments to update many OperationMedicalTeams.
     * @example
     * // Update many OperationMedicalTeams
     * const operationMedicalTeam = await prisma.operationMedicalTeam.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OperationMedicalTeams and only return the `id`
     * const operationMedicalTeamWithIdOnly = await prisma.operationMedicalTeam.updateManyAndReturn({
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
    updateManyAndReturn<T extends OperationMedicalTeamUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OperationMedicalTeam.
     * @param {OperationMedicalTeamUpsertArgs} args - Arguments to update or create a OperationMedicalTeam.
     * @example
     * // Update or create a OperationMedicalTeam
     * const operationMedicalTeam = await prisma.operationMedicalTeam.upsert({
     *   create: {
     *     // ... data to create a OperationMedicalTeam
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperationMedicalTeam we want to update
     *   }
     * })
     */
    upsert<T extends OperationMedicalTeamUpsertArgs>(args: Prisma.SelectSubset<T, OperationMedicalTeamUpsertArgs<ExtArgs>>): Prisma.Prisma__OperationMedicalTeamClient<runtime.Types.Result.GetResult<Prisma.$OperationMedicalTeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OperationMedicalTeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamCountArgs} args - Arguments to filter OperationMedicalTeams to count.
     * @example
     * // Count the number of OperationMedicalTeams
     * const count = await prisma.operationMedicalTeam.count({
     *   where: {
     *     // ... the filter for the OperationMedicalTeams we want to count
     *   }
     * })
    **/
    count<T extends OperationMedicalTeamCountArgs>(args?: Prisma.Subset<T, OperationMedicalTeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OperationMedicalTeamCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OperationMedicalTeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OperationMedicalTeamAggregateArgs>(args: Prisma.Subset<T, OperationMedicalTeamAggregateArgs>): Prisma.PrismaPromise<GetOperationMedicalTeamAggregateType<T>>;
    /**
     * Group by OperationMedicalTeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationMedicalTeamGroupByArgs} args - Group by arguments.
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
    groupBy<T extends OperationMedicalTeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OperationMedicalTeamGroupByArgs['orderBy'];
    } : {
        orderBy?: OperationMedicalTeamGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OperationMedicalTeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationMedicalTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OperationMedicalTeam model
     */
    readonly fields: OperationMedicalTeamFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OperationMedicalTeam.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OperationMedicalTeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    operation<T extends Prisma.OperationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationDefaultArgs<ExtArgs>>): Prisma.Prisma__OperationClient<runtime.Types.Result.GetResult<Prisma.$OperationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    primarySurgeon<T extends Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationMedicalTeam$primarySurgeonArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    assistantSurgeon<T extends Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationMedicalTeam$assistantSurgeonArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    anesthesiologist<T extends Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationMedicalTeam$anesthesiologistArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    assistantAnesthesia<T extends Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs>>): Prisma.Prisma__DoctorClient<runtime.Types.Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the OperationMedicalTeam model
 */
export interface OperationMedicalTeamFieldRefs {
    readonly id: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly operationId: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly primarySurgeonId: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly assistantSurgeonId: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly anesthesiologistId: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly assistantAnesthesiaId: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly nurse: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly notes: Prisma.FieldRef<"OperationMedicalTeam", 'String'>;
    readonly createdAt: Prisma.FieldRef<"OperationMedicalTeam", 'DateTime'>;
}
/**
 * OperationMedicalTeam findUnique
 */
export type OperationMedicalTeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter, which OperationMedicalTeam to fetch.
     */
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
};
/**
 * OperationMedicalTeam findUniqueOrThrow
 */
export type OperationMedicalTeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter, which OperationMedicalTeam to fetch.
     */
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
};
/**
 * OperationMedicalTeam findFirst
 */
export type OperationMedicalTeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter, which OperationMedicalTeam to fetch.
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationMedicalTeams to fetch.
     */
    orderBy?: Prisma.OperationMedicalTeamOrderByWithRelationInput | Prisma.OperationMedicalTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationMedicalTeams.
     */
    cursor?: Prisma.OperationMedicalTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationMedicalTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationMedicalTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationMedicalTeams.
     */
    distinct?: Prisma.OperationMedicalTeamScalarFieldEnum | Prisma.OperationMedicalTeamScalarFieldEnum[];
};
/**
 * OperationMedicalTeam findFirstOrThrow
 */
export type OperationMedicalTeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter, which OperationMedicalTeam to fetch.
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationMedicalTeams to fetch.
     */
    orderBy?: Prisma.OperationMedicalTeamOrderByWithRelationInput | Prisma.OperationMedicalTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationMedicalTeams.
     */
    cursor?: Prisma.OperationMedicalTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationMedicalTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationMedicalTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationMedicalTeams.
     */
    distinct?: Prisma.OperationMedicalTeamScalarFieldEnum | Prisma.OperationMedicalTeamScalarFieldEnum[];
};
/**
 * OperationMedicalTeam findMany
 */
export type OperationMedicalTeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter, which OperationMedicalTeams to fetch.
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationMedicalTeams to fetch.
     */
    orderBy?: Prisma.OperationMedicalTeamOrderByWithRelationInput | Prisma.OperationMedicalTeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OperationMedicalTeams.
     */
    cursor?: Prisma.OperationMedicalTeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationMedicalTeams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationMedicalTeams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationMedicalTeams.
     */
    distinct?: Prisma.OperationMedicalTeamScalarFieldEnum | Prisma.OperationMedicalTeamScalarFieldEnum[];
};
/**
 * OperationMedicalTeam create
 */
export type OperationMedicalTeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * The data needed to create a OperationMedicalTeam.
     */
    data: Prisma.XOR<Prisma.OperationMedicalTeamCreateInput, Prisma.OperationMedicalTeamUncheckedCreateInput>;
};
/**
 * OperationMedicalTeam createMany
 */
export type OperationMedicalTeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperationMedicalTeams.
     */
    data: Prisma.OperationMedicalTeamCreateManyInput | Prisma.OperationMedicalTeamCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OperationMedicalTeam createManyAndReturn
 */
export type OperationMedicalTeamCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * The data used to create many OperationMedicalTeams.
     */
    data: Prisma.OperationMedicalTeamCreateManyInput | Prisma.OperationMedicalTeamCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationMedicalTeam update
 */
export type OperationMedicalTeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * The data needed to update a OperationMedicalTeam.
     */
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateInput, Prisma.OperationMedicalTeamUncheckedUpdateInput>;
    /**
     * Choose, which OperationMedicalTeam to update.
     */
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
};
/**
 * OperationMedicalTeam updateMany
 */
export type OperationMedicalTeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OperationMedicalTeams.
     */
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyInput>;
    /**
     * Filter which OperationMedicalTeams to update
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * Limit how many OperationMedicalTeams to update.
     */
    limit?: number;
};
/**
 * OperationMedicalTeam updateManyAndReturn
 */
export type OperationMedicalTeamUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * The data used to update OperationMedicalTeams.
     */
    data: Prisma.XOR<Prisma.OperationMedicalTeamUpdateManyMutationInput, Prisma.OperationMedicalTeamUncheckedUpdateManyInput>;
    /**
     * Filter which OperationMedicalTeams to update
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * Limit how many OperationMedicalTeams to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationMedicalTeam upsert
 */
export type OperationMedicalTeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * The filter to search for the OperationMedicalTeam to update in case it exists.
     */
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
    /**
     * In case the OperationMedicalTeam found by the `where` argument doesn't exist, create a new OperationMedicalTeam with this data.
     */
    create: Prisma.XOR<Prisma.OperationMedicalTeamCreateInput, Prisma.OperationMedicalTeamUncheckedCreateInput>;
    /**
     * In case the OperationMedicalTeam was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OperationMedicalTeamUpdateInput, Prisma.OperationMedicalTeamUncheckedUpdateInput>;
};
/**
 * OperationMedicalTeam delete
 */
export type OperationMedicalTeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
    /**
     * Filter which OperationMedicalTeam to delete.
     */
    where: Prisma.OperationMedicalTeamWhereUniqueInput;
};
/**
 * OperationMedicalTeam deleteMany
 */
export type OperationMedicalTeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationMedicalTeams to delete
     */
    where?: Prisma.OperationMedicalTeamWhereInput;
    /**
     * Limit how many OperationMedicalTeams to delete.
     */
    limit?: number;
};
/**
 * OperationMedicalTeam.primarySurgeon
 */
export type OperationMedicalTeam$primarySurgeonArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * OperationMedicalTeam.assistantSurgeon
 */
export type OperationMedicalTeam$assistantSurgeonArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * OperationMedicalTeam.anesthesiologist
 */
export type OperationMedicalTeam$anesthesiologistArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * OperationMedicalTeam.assistantAnesthesia
 */
export type OperationMedicalTeam$assistantAnesthesiaArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * OperationMedicalTeam without action
 */
export type OperationMedicalTeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationMedicalTeam
     */
    select?: Prisma.OperationMedicalTeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationMedicalTeam
     */
    omit?: Prisma.OperationMedicalTeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationMedicalTeamInclude<ExtArgs> | null;
};
//# sourceMappingURL=OperationMedicalTeam.d.ts.map