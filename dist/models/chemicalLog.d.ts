import { Schema, type HydratedDocument, Types } from 'mongoose';
export declare const chemicalLogActionOptions: readonly ["add", "remove"];
export type ChemicalLogAction = (typeof chemicalLogActionOptions)[number];
export interface IChemicalLog {
    _id: Types.ObjectId;
    chemical_id: Types.ObjectId;
    user_id: Types.ObjectId;
    action: ChemicalLogAction;
    quantity: number;
    before_amount: number;
    after_amount: number;
    reason: string;
    createdAt: Date;
}
export type ChemicalLogDocument = HydratedDocument<IChemicalLog>;
declare const _default: import("mongoose").Model<IChemicalLog, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IChemicalLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IChemicalLog, import("mongoose").Model<IChemicalLog, any, any, any, any, any, IChemicalLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    chemical_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    action?: import("mongoose").SchemaDefinitionProperty<"remove" | "add", IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    before_amount?: import("mongoose").SchemaDefinitionProperty<number, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    after_amount?: import("mongoose").SchemaDefinitionProperty<number, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reason?: import("mongoose").SchemaDefinitionProperty<string, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IChemicalLog, import("mongoose").Document<unknown, {}, IChemicalLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemicalLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IChemicalLog>, IChemicalLog>;
export default _default;
//# sourceMappingURL=chemicalLog.d.ts.map