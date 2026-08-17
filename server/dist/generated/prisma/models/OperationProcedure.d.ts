import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model OperationProcedure
 *
 */
export type OperationProcedureModel = runtime.Types.Result.DefaultSelection<Prisma.$OperationProcedurePayload>;
export type AggregateOperationProcedure = {
    _count: OperationProcedureCountAggregateOutputType | null;
    _avg: OperationProcedureAvgAggregateOutputType | null;
    _sum: OperationProcedureSumAggregateOutputType | null;
    _min: OperationProcedureMinAggregateOutputType | null;
    _max: OperationProcedureMaxAggregateOutputType | null;
};
export type OperationProcedureAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type OperationProcedureSumAggregateOutputType = {
    sortOrder: number | null;
};
export type OperationProcedureMinAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    catalogId: string | null;
    name: string | null;
    nameAr: string | null;
    specialtyId: string | null;
    sortOrder: number | null;
    createdAt: Date | null;
};
export type OperationProcedureMaxAggregateOutputType = {
    id: string | null;
    operationId: string | null;
    catalogId: string | null;
    name: string | null;
    nameAr: string | null;
    specialtyId: string | null;
    sortOrder: number | null;
    createdAt: Date | null;
};
export type OperationProcedureCountAggregateOutputType = {
    id: number;
    operationId: number;
    catalogId: number;
    name: number;
    nameAr: number;
    specialtyId: number;
    sortOrder: number;
    createdAt: number;
    _all: number;
};
export type OperationProcedureAvgAggregateInputType = {
    sortOrder?: true;
};
export type OperationProcedureSumAggregateInputType = {
    sortOrder?: true;
};
export type OperationProcedureMinAggregateInputType = {
    id?: true;
    operationId?: true;
    catalogId?: true;
    name?: true;
    nameAr?: true;
    specialtyId?: true;
    sortOrder?: true;
    createdAt?: true;
};
export type OperationProcedureMaxAggregateInputType = {
    id?: true;
    operationId?: true;
    catalogId?: true;
    name?: true;
    nameAr?: true;
    specialtyId?: true;
    sortOrder?: true;
    createdAt?: true;
};
export type OperationProcedureCountAggregateInputType = {
    id?: true;
    operationId?: true;
    catalogId?: true;
    name?: true;
    nameAr?: true;
    specialtyId?: true;
    sortOrder?: true;
    createdAt?: true;
    _all?: true;
};
export type OperationProcedureAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationProcedure to aggregate.
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationProcedures to fetch.
     */
    orderBy?: Prisma.OperationProcedureOrderByWithRelationInput | Prisma.OperationProcedureOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OperationProcedureWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationProcedures from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationProcedures.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OperationProcedures
    **/
    _count?: true | OperationProcedureCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OperationProcedureAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OperationProcedureSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OperationProcedureMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OperationProcedureMaxAggregateInputType;
};
export type GetOperationProcedureAggregateType<T extends OperationProcedureAggregateArgs> = {
    [P in keyof T & keyof AggregateOperationProcedure]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOperationProcedure[P]> : Prisma.GetScalarType<T[P], AggregateOperationProcedure[P]>;
};
export type OperationProcedureGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OperationProcedureWhereInput;
    orderBy?: Prisma.OperationProcedureOrderByWithAggregationInput | Prisma.OperationProcedureOrderByWithAggregationInput[];
    by: Prisma.OperationProcedureScalarFieldEnum[] | Prisma.OperationProcedureScalarFieldEnum;
    having?: Prisma.OperationProcedureScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OperationProcedureCountAggregateInputType | true;
    _avg?: OperationProcedureAvgAggregateInputType;
    _sum?: OperationProcedureSumAggregateInputType;
    _min?: OperationProcedureMinAggregateInputType;
    _max?: OperationProcedureMaxAggregateInputType;
};
export type OperationProcedureGroupByOutputType = {
    id: string;
    operationId: string;
    catalogId: string | null;
    name: string;
    nameAr: string | null;
    specialtyId: string | null;
    sortOrder: number;
    createdAt: Date;
    _count: OperationProcedureCountAggregateOutputType | null;
    _avg: OperationProcedureAvgAggregateOutputType | null;
    _sum: OperationProcedureSumAggregateOutputType | null;
    _min: OperationProcedureMinAggregateOutputType | null;
    _max: OperationProcedureMaxAggregateOutputType | null;
};
export type GetOperationProcedureGroupByPayload<T extends OperationProcedureGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OperationProcedureGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OperationProcedureGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OperationProcedureGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OperationProcedureGroupByOutputType[P]>;
}>>;
export type OperationProcedureWhereInput = {
    AND?: Prisma.OperationProcedureWhereInput | Prisma.OperationProcedureWhereInput[];
    OR?: Prisma.OperationProcedureWhereInput[];
    NOT?: Prisma.OperationProcedureWhereInput | Prisma.OperationProcedureWhereInput[];
    id?: Prisma.StringFilter<"OperationProcedure"> | string;
    operationId?: Prisma.StringFilter<"OperationProcedure"> | string;
    catalogId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    name?: Prisma.StringFilter<"OperationProcedure"> | string;
    nameAr?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    specialtyId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationProcedure"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationProcedure"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    catalog?: Prisma.XOR<Prisma.OperationCatalogNullableScalarRelationFilter, Prisma.OperationCatalogWhereInput> | null;
    specialty?: Prisma.XOR<Prisma.SpecialtyNullableScalarRelationFilter, Prisma.SpecialtyWhereInput> | null;
};
export type OperationProcedureOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    catalogId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameAr?: Prisma.SortOrderInput | Prisma.SortOrder;
    specialtyId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    operation?: Prisma.OperationOrderByWithRelationInput;
    catalog?: Prisma.OperationCatalogOrderByWithRelationInput;
    specialty?: Prisma.SpecialtyOrderByWithRelationInput;
};
export type OperationProcedureWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OperationProcedureWhereInput | Prisma.OperationProcedureWhereInput[];
    OR?: Prisma.OperationProcedureWhereInput[];
    NOT?: Prisma.OperationProcedureWhereInput | Prisma.OperationProcedureWhereInput[];
    operationId?: Prisma.StringFilter<"OperationProcedure"> | string;
    catalogId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    name?: Prisma.StringFilter<"OperationProcedure"> | string;
    nameAr?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    specialtyId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationProcedure"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationProcedure"> | Date | string;
    operation?: Prisma.XOR<Prisma.OperationScalarRelationFilter, Prisma.OperationWhereInput>;
    catalog?: Prisma.XOR<Prisma.OperationCatalogNullableScalarRelationFilter, Prisma.OperationCatalogWhereInput> | null;
    specialty?: Prisma.XOR<Prisma.SpecialtyNullableScalarRelationFilter, Prisma.SpecialtyWhereInput> | null;
}, "id">;
export type OperationProcedureOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    catalogId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameAr?: Prisma.SortOrderInput | Prisma.SortOrder;
    specialtyId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OperationProcedureCountOrderByAggregateInput;
    _avg?: Prisma.OperationProcedureAvgOrderByAggregateInput;
    _max?: Prisma.OperationProcedureMaxOrderByAggregateInput;
    _min?: Prisma.OperationProcedureMinOrderByAggregateInput;
    _sum?: Prisma.OperationProcedureSumOrderByAggregateInput;
};
export type OperationProcedureScalarWhereWithAggregatesInput = {
    AND?: Prisma.OperationProcedureScalarWhereWithAggregatesInput | Prisma.OperationProcedureScalarWhereWithAggregatesInput[];
    OR?: Prisma.OperationProcedureScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OperationProcedureScalarWhereWithAggregatesInput | Prisma.OperationProcedureScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OperationProcedure"> | string;
    operationId?: Prisma.StringWithAggregatesFilter<"OperationProcedure"> | string;
    catalogId?: Prisma.StringNullableWithAggregatesFilter<"OperationProcedure"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"OperationProcedure"> | string;
    nameAr?: Prisma.StringNullableWithAggregatesFilter<"OperationProcedure"> | string | null;
    specialtyId?: Prisma.StringNullableWithAggregatesFilter<"OperationProcedure"> | string | null;
    sortOrder?: Prisma.IntWithAggregatesFilter<"OperationProcedure"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OperationProcedure"> | Date | string;
};
export type OperationProcedureCreateInput = {
    id?: string;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutProceduresInput;
    catalog?: Prisma.OperationCatalogCreateNestedOneWithoutProceduresInput;
    specialty?: Prisma.SpecialtyCreateNestedOneWithoutProceduresInput;
};
export type OperationProcedureUncheckedCreateInput = {
    id?: string;
    operationId: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutProceduresNestedInput;
    catalog?: Prisma.OperationCatalogUpdateOneWithoutProceduresNestedInput;
    specialty?: Prisma.SpecialtyUpdateOneWithoutProceduresNestedInput;
};
export type OperationProcedureUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureCreateManyInput = {
    id?: string;
    operationId: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureListRelationFilter = {
    every?: Prisma.OperationProcedureWhereInput;
    some?: Prisma.OperationProcedureWhereInput;
    none?: Prisma.OperationProcedureWhereInput;
};
export type OperationProcedureOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OperationProcedureCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    catalogId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameAr?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationProcedureAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type OperationProcedureMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    catalogId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameAr?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationProcedureMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    operationId?: Prisma.SortOrder;
    catalogId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameAr?: Prisma.SortOrder;
    specialtyId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OperationProcedureSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type OperationProcedureCreateNestedManyWithoutSpecialtyInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput> | Prisma.OperationProcedureCreateWithoutSpecialtyInput[] | Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput | Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput[];
    createMany?: Prisma.OperationProcedureCreateManySpecialtyInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUncheckedCreateNestedManyWithoutSpecialtyInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput> | Prisma.OperationProcedureCreateWithoutSpecialtyInput[] | Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput | Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput[];
    createMany?: Prisma.OperationProcedureCreateManySpecialtyInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUpdateManyWithoutSpecialtyNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput> | Prisma.OperationProcedureCreateWithoutSpecialtyInput[] | Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput | Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutSpecialtyInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutSpecialtyInput[];
    createMany?: Prisma.OperationProcedureCreateManySpecialtyInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutSpecialtyInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutSpecialtyInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutSpecialtyInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutSpecialtyInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureUncheckedUpdateManyWithoutSpecialtyNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput> | Prisma.OperationProcedureCreateWithoutSpecialtyInput[] | Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput | Prisma.OperationProcedureCreateOrConnectWithoutSpecialtyInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutSpecialtyInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutSpecialtyInput[];
    createMany?: Prisma.OperationProcedureCreateManySpecialtyInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutSpecialtyInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutSpecialtyInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutSpecialtyInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutSpecialtyInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureCreateNestedManyWithoutCatalogInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput> | Prisma.OperationProcedureCreateWithoutCatalogInput[] | Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput | Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput[];
    createMany?: Prisma.OperationProcedureCreateManyCatalogInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUncheckedCreateNestedManyWithoutCatalogInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput> | Prisma.OperationProcedureCreateWithoutCatalogInput[] | Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput | Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput[];
    createMany?: Prisma.OperationProcedureCreateManyCatalogInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUpdateManyWithoutCatalogNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput> | Prisma.OperationProcedureCreateWithoutCatalogInput[] | Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput | Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutCatalogInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutCatalogInput[];
    createMany?: Prisma.OperationProcedureCreateManyCatalogInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutCatalogInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutCatalogInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutCatalogInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutCatalogInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureUncheckedUpdateManyWithoutCatalogNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput> | Prisma.OperationProcedureCreateWithoutCatalogInput[] | Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput | Prisma.OperationProcedureCreateOrConnectWithoutCatalogInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutCatalogInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutCatalogInput[];
    createMany?: Prisma.OperationProcedureCreateManyCatalogInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutCatalogInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutCatalogInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutCatalogInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutCatalogInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput> | Prisma.OperationProcedureCreateWithoutOperationInput[] | Prisma.OperationProcedureUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutOperationInput | Prisma.OperationProcedureCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationProcedureCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUncheckedCreateNestedManyWithoutOperationInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput> | Prisma.OperationProcedureCreateWithoutOperationInput[] | Prisma.OperationProcedureUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutOperationInput | Prisma.OperationProcedureCreateOrConnectWithoutOperationInput[];
    createMany?: Prisma.OperationProcedureCreateManyOperationInputEnvelope;
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
};
export type OperationProcedureUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput> | Prisma.OperationProcedureCreateWithoutOperationInput[] | Prisma.OperationProcedureUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutOperationInput | Prisma.OperationProcedureCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationProcedureCreateManyOperationInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutOperationInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureUncheckedUpdateManyWithoutOperationNestedInput = {
    create?: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput> | Prisma.OperationProcedureCreateWithoutOperationInput[] | Prisma.OperationProcedureUncheckedCreateWithoutOperationInput[];
    connectOrCreate?: Prisma.OperationProcedureCreateOrConnectWithoutOperationInput | Prisma.OperationProcedureCreateOrConnectWithoutOperationInput[];
    upsert?: Prisma.OperationProcedureUpsertWithWhereUniqueWithoutOperationInput | Prisma.OperationProcedureUpsertWithWhereUniqueWithoutOperationInput[];
    createMany?: Prisma.OperationProcedureCreateManyOperationInputEnvelope;
    set?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    disconnect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    delete?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    connect?: Prisma.OperationProcedureWhereUniqueInput | Prisma.OperationProcedureWhereUniqueInput[];
    update?: Prisma.OperationProcedureUpdateWithWhereUniqueWithoutOperationInput | Prisma.OperationProcedureUpdateWithWhereUniqueWithoutOperationInput[];
    updateMany?: Prisma.OperationProcedureUpdateManyWithWhereWithoutOperationInput | Prisma.OperationProcedureUpdateManyWithWhereWithoutOperationInput[];
    deleteMany?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
};
export type OperationProcedureCreateWithoutSpecialtyInput = {
    id?: string;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutProceduresInput;
    catalog?: Prisma.OperationCatalogCreateNestedOneWithoutProceduresInput;
};
export type OperationProcedureUncheckedCreateWithoutSpecialtyInput = {
    id?: string;
    operationId: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureCreateOrConnectWithoutSpecialtyInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput>;
};
export type OperationProcedureCreateManySpecialtyInputEnvelope = {
    data: Prisma.OperationProcedureCreateManySpecialtyInput | Prisma.OperationProcedureCreateManySpecialtyInput[];
    skipDuplicates?: boolean;
};
export type OperationProcedureUpsertWithWhereUniqueWithoutSpecialtyInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedUpdateWithoutSpecialtyInput>;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedCreateWithoutSpecialtyInput>;
};
export type OperationProcedureUpdateWithWhereUniqueWithoutSpecialtyInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutSpecialtyInput, Prisma.OperationProcedureUncheckedUpdateWithoutSpecialtyInput>;
};
export type OperationProcedureUpdateManyWithWhereWithoutSpecialtyInput = {
    where: Prisma.OperationProcedureScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateManyMutationInput, Prisma.OperationProcedureUncheckedUpdateManyWithoutSpecialtyInput>;
};
export type OperationProcedureScalarWhereInput = {
    AND?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
    OR?: Prisma.OperationProcedureScalarWhereInput[];
    NOT?: Prisma.OperationProcedureScalarWhereInput | Prisma.OperationProcedureScalarWhereInput[];
    id?: Prisma.StringFilter<"OperationProcedure"> | string;
    operationId?: Prisma.StringFilter<"OperationProcedure"> | string;
    catalogId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    name?: Prisma.StringFilter<"OperationProcedure"> | string;
    nameAr?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    specialtyId?: Prisma.StringNullableFilter<"OperationProcedure"> | string | null;
    sortOrder?: Prisma.IntFilter<"OperationProcedure"> | number;
    createdAt?: Prisma.DateTimeFilter<"OperationProcedure"> | Date | string;
};
export type OperationProcedureCreateWithoutCatalogInput = {
    id?: string;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
    operation: Prisma.OperationCreateNestedOneWithoutProceduresInput;
    specialty?: Prisma.SpecialtyCreateNestedOneWithoutProceduresInput;
};
export type OperationProcedureUncheckedCreateWithoutCatalogInput = {
    id?: string;
    operationId: string;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureCreateOrConnectWithoutCatalogInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput>;
};
export type OperationProcedureCreateManyCatalogInputEnvelope = {
    data: Prisma.OperationProcedureCreateManyCatalogInput | Prisma.OperationProcedureCreateManyCatalogInput[];
    skipDuplicates?: boolean;
};
export type OperationProcedureUpsertWithWhereUniqueWithoutCatalogInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutCatalogInput, Prisma.OperationProcedureUncheckedUpdateWithoutCatalogInput>;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutCatalogInput, Prisma.OperationProcedureUncheckedCreateWithoutCatalogInput>;
};
export type OperationProcedureUpdateWithWhereUniqueWithoutCatalogInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutCatalogInput, Prisma.OperationProcedureUncheckedUpdateWithoutCatalogInput>;
};
export type OperationProcedureUpdateManyWithWhereWithoutCatalogInput = {
    where: Prisma.OperationProcedureScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateManyMutationInput, Prisma.OperationProcedureUncheckedUpdateManyWithoutCatalogInput>;
};
export type OperationProcedureCreateWithoutOperationInput = {
    id?: string;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
    catalog?: Prisma.OperationCatalogCreateNestedOneWithoutProceduresInput;
    specialty?: Prisma.SpecialtyCreateNestedOneWithoutProceduresInput;
};
export type OperationProcedureUncheckedCreateWithoutOperationInput = {
    id?: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureCreateOrConnectWithoutOperationInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput>;
};
export type OperationProcedureCreateManyOperationInputEnvelope = {
    data: Prisma.OperationProcedureCreateManyOperationInput | Prisma.OperationProcedureCreateManyOperationInput[];
    skipDuplicates?: boolean;
};
export type OperationProcedureUpsertWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    update: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutOperationInput, Prisma.OperationProcedureUncheckedUpdateWithoutOperationInput>;
    create: Prisma.XOR<Prisma.OperationProcedureCreateWithoutOperationInput, Prisma.OperationProcedureUncheckedCreateWithoutOperationInput>;
};
export type OperationProcedureUpdateWithWhereUniqueWithoutOperationInput = {
    where: Prisma.OperationProcedureWhereUniqueInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateWithoutOperationInput, Prisma.OperationProcedureUncheckedUpdateWithoutOperationInput>;
};
export type OperationProcedureUpdateManyWithWhereWithoutOperationInput = {
    where: Prisma.OperationProcedureScalarWhereInput;
    data: Prisma.XOR<Prisma.OperationProcedureUpdateManyMutationInput, Prisma.OperationProcedureUncheckedUpdateManyWithoutOperationInput>;
};
export type OperationProcedureCreateManySpecialtyInput = {
    id?: string;
    operationId: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureUpdateWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutProceduresNestedInput;
    catalog?: Prisma.OperationCatalogUpdateOneWithoutProceduresNestedInput;
};
export type OperationProcedureUncheckedUpdateWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureUncheckedUpdateManyWithoutSpecialtyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureCreateManyCatalogInput = {
    id?: string;
    operationId: string;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureUpdateWithoutCatalogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    operation?: Prisma.OperationUpdateOneRequiredWithoutProceduresNestedInput;
    specialty?: Prisma.SpecialtyUpdateOneWithoutProceduresNestedInput;
};
export type OperationProcedureUncheckedUpdateWithoutCatalogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureUncheckedUpdateManyWithoutCatalogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    operationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureCreateManyOperationInput = {
    id?: string;
    catalogId?: string | null;
    name: string;
    nameAr?: string | null;
    specialtyId?: string | null;
    sortOrder?: number;
    createdAt?: Date | string;
};
export type OperationProcedureUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    catalog?: Prisma.OperationCatalogUpdateOneWithoutProceduresNestedInput;
    specialty?: Prisma.SpecialtyUpdateOneWithoutProceduresNestedInput;
};
export type OperationProcedureUncheckedUpdateWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureUncheckedUpdateManyWithoutOperationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    catalogId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameAr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    specialtyId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OperationProcedureSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    catalogId?: boolean;
    name?: boolean;
    nameAr?: boolean;
    specialtyId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
}, ExtArgs["result"]["operationProcedure"]>;
export type OperationProcedureSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    catalogId?: boolean;
    name?: boolean;
    nameAr?: boolean;
    specialtyId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
}, ExtArgs["result"]["operationProcedure"]>;
export type OperationProcedureSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    operationId?: boolean;
    catalogId?: boolean;
    name?: boolean;
    nameAr?: boolean;
    specialtyId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
}, ExtArgs["result"]["operationProcedure"]>;
export type OperationProcedureSelectScalar = {
    id?: boolean;
    operationId?: boolean;
    catalogId?: boolean;
    name?: boolean;
    nameAr?: boolean;
    specialtyId?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
};
export type OperationProcedureOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "operationId" | "catalogId" | "name" | "nameAr" | "specialtyId" | "sortOrder" | "createdAt", ExtArgs["result"]["operationProcedure"]>;
export type OperationProcedureInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
};
export type OperationProcedureIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
};
export type OperationProcedureIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    operation?: boolean | Prisma.OperationDefaultArgs<ExtArgs>;
    catalog?: boolean | Prisma.OperationProcedure$catalogArgs<ExtArgs>;
    specialty?: boolean | Prisma.OperationProcedure$specialtyArgs<ExtArgs>;
};
export type $OperationProcedurePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OperationProcedure";
    objects: {
        operation: Prisma.$OperationPayload<ExtArgs>;
        catalog: Prisma.$OperationCatalogPayload<ExtArgs> | null;
        specialty: Prisma.$SpecialtyPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        operationId: string;
        catalogId: string | null;
        name: string;
        nameAr: string | null;
        specialtyId: string | null;
        sortOrder: number;
        createdAt: Date;
    }, ExtArgs["result"]["operationProcedure"]>;
    composites: {};
};
export type OperationProcedureGetPayload<S extends boolean | null | undefined | OperationProcedureDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload, S>;
export type OperationProcedureCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OperationProcedureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OperationProcedureCountAggregateInputType | true;
};
export interface OperationProcedureDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OperationProcedure'];
        meta: {
            name: 'OperationProcedure';
        };
    };
    /**
     * Find zero or one OperationProcedure that matches the filter.
     * @param {OperationProcedureFindUniqueArgs} args - Arguments to find a OperationProcedure
     * @example
     * // Get one OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperationProcedureFindUniqueArgs>(args: Prisma.SelectSubset<T, OperationProcedureFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OperationProcedure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperationProcedureFindUniqueOrThrowArgs} args - Arguments to find a OperationProcedure
     * @example
     * // Get one OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperationProcedureFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OperationProcedureFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationProcedure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureFindFirstArgs} args - Arguments to find a OperationProcedure
     * @example
     * // Get one OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperationProcedureFindFirstArgs>(args?: Prisma.SelectSubset<T, OperationProcedureFindFirstArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OperationProcedure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureFindFirstOrThrowArgs} args - Arguments to find a OperationProcedure
     * @example
     * // Get one OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperationProcedureFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OperationProcedureFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OperationProcedures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OperationProcedures
     * const operationProcedures = await prisma.operationProcedure.findMany()
     *
     * // Get first 10 OperationProcedures
     * const operationProcedures = await prisma.operationProcedure.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const operationProcedureWithIdOnly = await prisma.operationProcedure.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OperationProcedureFindManyArgs>(args?: Prisma.SelectSubset<T, OperationProcedureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OperationProcedure.
     * @param {OperationProcedureCreateArgs} args - Arguments to create a OperationProcedure.
     * @example
     * // Create one OperationProcedure
     * const OperationProcedure = await prisma.operationProcedure.create({
     *   data: {
     *     // ... data to create a OperationProcedure
     *   }
     * })
     *
     */
    create<T extends OperationProcedureCreateArgs>(args: Prisma.SelectSubset<T, OperationProcedureCreateArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OperationProcedures.
     * @param {OperationProcedureCreateManyArgs} args - Arguments to create many OperationProcedures.
     * @example
     * // Create many OperationProcedures
     * const operationProcedure = await prisma.operationProcedure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OperationProcedureCreateManyArgs>(args?: Prisma.SelectSubset<T, OperationProcedureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OperationProcedures and returns the data saved in the database.
     * @param {OperationProcedureCreateManyAndReturnArgs} args - Arguments to create many OperationProcedures.
     * @example
     * // Create many OperationProcedures
     * const operationProcedure = await prisma.operationProcedure.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OperationProcedures and only return the `id`
     * const operationProcedureWithIdOnly = await prisma.operationProcedure.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OperationProcedureCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OperationProcedureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OperationProcedure.
     * @param {OperationProcedureDeleteArgs} args - Arguments to delete one OperationProcedure.
     * @example
     * // Delete one OperationProcedure
     * const OperationProcedure = await prisma.operationProcedure.delete({
     *   where: {
     *     // ... filter to delete one OperationProcedure
     *   }
     * })
     *
     */
    delete<T extends OperationProcedureDeleteArgs>(args: Prisma.SelectSubset<T, OperationProcedureDeleteArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OperationProcedure.
     * @param {OperationProcedureUpdateArgs} args - Arguments to update one OperationProcedure.
     * @example
     * // Update one OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OperationProcedureUpdateArgs>(args: Prisma.SelectSubset<T, OperationProcedureUpdateArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OperationProcedures.
     * @param {OperationProcedureDeleteManyArgs} args - Arguments to filter OperationProcedures to delete.
     * @example
     * // Delete a few OperationProcedures
     * const { count } = await prisma.operationProcedure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OperationProcedureDeleteManyArgs>(args?: Prisma.SelectSubset<T, OperationProcedureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationProcedures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OperationProcedures
     * const operationProcedure = await prisma.operationProcedure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OperationProcedureUpdateManyArgs>(args: Prisma.SelectSubset<T, OperationProcedureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OperationProcedures and returns the data updated in the database.
     * @param {OperationProcedureUpdateManyAndReturnArgs} args - Arguments to update many OperationProcedures.
     * @example
     * // Update many OperationProcedures
     * const operationProcedure = await prisma.operationProcedure.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OperationProcedures and only return the `id`
     * const operationProcedureWithIdOnly = await prisma.operationProcedure.updateManyAndReturn({
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
    updateManyAndReturn<T extends OperationProcedureUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OperationProcedureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OperationProcedure.
     * @param {OperationProcedureUpsertArgs} args - Arguments to update or create a OperationProcedure.
     * @example
     * // Update or create a OperationProcedure
     * const operationProcedure = await prisma.operationProcedure.upsert({
     *   create: {
     *     // ... data to create a OperationProcedure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OperationProcedure we want to update
     *   }
     * })
     */
    upsert<T extends OperationProcedureUpsertArgs>(args: Prisma.SelectSubset<T, OperationProcedureUpsertArgs<ExtArgs>>): Prisma.Prisma__OperationProcedureClient<runtime.Types.Result.GetResult<Prisma.$OperationProcedurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OperationProcedures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureCountArgs} args - Arguments to filter OperationProcedures to count.
     * @example
     * // Count the number of OperationProcedures
     * const count = await prisma.operationProcedure.count({
     *   where: {
     *     // ... the filter for the OperationProcedures we want to count
     *   }
     * })
    **/
    count<T extends OperationProcedureCountArgs>(args?: Prisma.Subset<T, OperationProcedureCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OperationProcedureCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OperationProcedure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OperationProcedureAggregateArgs>(args: Prisma.Subset<T, OperationProcedureAggregateArgs>): Prisma.PrismaPromise<GetOperationProcedureAggregateType<T>>;
    /**
     * Group by OperationProcedure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationProcedureGroupByArgs} args - Group by arguments.
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
    groupBy<T extends OperationProcedureGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OperationProcedureGroupByArgs['orderBy'];
    } : {
        orderBy?: OperationProcedureGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OperationProcedureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationProcedureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OperationProcedure model
     */
    readonly fields: OperationProcedureFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OperationProcedure.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OperationProcedureClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    operation<T extends Prisma.OperationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationDefaultArgs<ExtArgs>>): Prisma.Prisma__OperationClient<runtime.Types.Result.GetResult<Prisma.$OperationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    catalog<T extends Prisma.OperationProcedure$catalogArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationProcedure$catalogArgs<ExtArgs>>): Prisma.Prisma__OperationCatalogClient<runtime.Types.Result.GetResult<Prisma.$OperationCatalogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    specialty<T extends Prisma.OperationProcedure$specialtyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OperationProcedure$specialtyArgs<ExtArgs>>): Prisma.Prisma__SpecialtyClient<runtime.Types.Result.GetResult<Prisma.$SpecialtyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the OperationProcedure model
 */
export interface OperationProcedureFieldRefs {
    readonly id: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly operationId: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly catalogId: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly name: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly nameAr: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly specialtyId: Prisma.FieldRef<"OperationProcedure", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"OperationProcedure", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"OperationProcedure", 'DateTime'>;
}
/**
 * OperationProcedure findUnique
 */
export type OperationProcedureFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter, which OperationProcedure to fetch.
     */
    where: Prisma.OperationProcedureWhereUniqueInput;
};
/**
 * OperationProcedure findUniqueOrThrow
 */
export type OperationProcedureFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter, which OperationProcedure to fetch.
     */
    where: Prisma.OperationProcedureWhereUniqueInput;
};
/**
 * OperationProcedure findFirst
 */
export type OperationProcedureFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter, which OperationProcedure to fetch.
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationProcedures to fetch.
     */
    orderBy?: Prisma.OperationProcedureOrderByWithRelationInput | Prisma.OperationProcedureOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationProcedures.
     */
    cursor?: Prisma.OperationProcedureWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationProcedures from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationProcedures.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationProcedures.
     */
    distinct?: Prisma.OperationProcedureScalarFieldEnum | Prisma.OperationProcedureScalarFieldEnum[];
};
/**
 * OperationProcedure findFirstOrThrow
 */
export type OperationProcedureFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter, which OperationProcedure to fetch.
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationProcedures to fetch.
     */
    orderBy?: Prisma.OperationProcedureOrderByWithRelationInput | Prisma.OperationProcedureOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OperationProcedures.
     */
    cursor?: Prisma.OperationProcedureWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationProcedures from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationProcedures.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationProcedures.
     */
    distinct?: Prisma.OperationProcedureScalarFieldEnum | Prisma.OperationProcedureScalarFieldEnum[];
};
/**
 * OperationProcedure findMany
 */
export type OperationProcedureFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter, which OperationProcedures to fetch.
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OperationProcedures to fetch.
     */
    orderBy?: Prisma.OperationProcedureOrderByWithRelationInput | Prisma.OperationProcedureOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OperationProcedures.
     */
    cursor?: Prisma.OperationProcedureWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OperationProcedures from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OperationProcedures.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OperationProcedures.
     */
    distinct?: Prisma.OperationProcedureScalarFieldEnum | Prisma.OperationProcedureScalarFieldEnum[];
};
/**
 * OperationProcedure create
 */
export type OperationProcedureCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * The data needed to create a OperationProcedure.
     */
    data: Prisma.XOR<Prisma.OperationProcedureCreateInput, Prisma.OperationProcedureUncheckedCreateInput>;
};
/**
 * OperationProcedure createMany
 */
export type OperationProcedureCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OperationProcedures.
     */
    data: Prisma.OperationProcedureCreateManyInput | Prisma.OperationProcedureCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OperationProcedure createManyAndReturn
 */
export type OperationProcedureCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * The data used to create many OperationProcedures.
     */
    data: Prisma.OperationProcedureCreateManyInput | Prisma.OperationProcedureCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationProcedure update
 */
export type OperationProcedureUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * The data needed to update a OperationProcedure.
     */
    data: Prisma.XOR<Prisma.OperationProcedureUpdateInput, Prisma.OperationProcedureUncheckedUpdateInput>;
    /**
     * Choose, which OperationProcedure to update.
     */
    where: Prisma.OperationProcedureWhereUniqueInput;
};
/**
 * OperationProcedure updateMany
 */
export type OperationProcedureUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OperationProcedures.
     */
    data: Prisma.XOR<Prisma.OperationProcedureUpdateManyMutationInput, Prisma.OperationProcedureUncheckedUpdateManyInput>;
    /**
     * Filter which OperationProcedures to update
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * Limit how many OperationProcedures to update.
     */
    limit?: number;
};
/**
 * OperationProcedure updateManyAndReturn
 */
export type OperationProcedureUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * The data used to update OperationProcedures.
     */
    data: Prisma.XOR<Prisma.OperationProcedureUpdateManyMutationInput, Prisma.OperationProcedureUncheckedUpdateManyInput>;
    /**
     * Filter which OperationProcedures to update
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * Limit how many OperationProcedures to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * OperationProcedure upsert
 */
export type OperationProcedureUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * The filter to search for the OperationProcedure to update in case it exists.
     */
    where: Prisma.OperationProcedureWhereUniqueInput;
    /**
     * In case the OperationProcedure found by the `where` argument doesn't exist, create a new OperationProcedure with this data.
     */
    create: Prisma.XOR<Prisma.OperationProcedureCreateInput, Prisma.OperationProcedureUncheckedCreateInput>;
    /**
     * In case the OperationProcedure was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OperationProcedureUpdateInput, Prisma.OperationProcedureUncheckedUpdateInput>;
};
/**
 * OperationProcedure delete
 */
export type OperationProcedureDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
    /**
     * Filter which OperationProcedure to delete.
     */
    where: Prisma.OperationProcedureWhereUniqueInput;
};
/**
 * OperationProcedure deleteMany
 */
export type OperationProcedureDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OperationProcedures to delete
     */
    where?: Prisma.OperationProcedureWhereInput;
    /**
     * Limit how many OperationProcedures to delete.
     */
    limit?: number;
};
/**
 * OperationProcedure.catalog
 */
export type OperationProcedure$catalogArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationCatalog
     */
    select?: Prisma.OperationCatalogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationCatalog
     */
    omit?: Prisma.OperationCatalogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationCatalogInclude<ExtArgs> | null;
    where?: Prisma.OperationCatalogWhereInput;
};
/**
 * OperationProcedure.specialty
 */
export type OperationProcedure$specialtyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Specialty
     */
    select?: Prisma.SpecialtySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Specialty
     */
    omit?: Prisma.SpecialtyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SpecialtyInclude<ExtArgs> | null;
    where?: Prisma.SpecialtyWhereInput;
};
/**
 * OperationProcedure without action
 */
export type OperationProcedureDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperationProcedure
     */
    select?: Prisma.OperationProcedureSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OperationProcedure
     */
    omit?: Prisma.OperationProcedureOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OperationProcedureInclude<ExtArgs> | null;
};
//# sourceMappingURL=OperationProcedure.d.ts.map