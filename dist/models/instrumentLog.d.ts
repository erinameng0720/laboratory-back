import { Schema, type HydratedDocument, Types } from 'mongoose';
export declare const instrumentLogActionOptions: readonly ["add", "remove"];
export type InstrumentLogAction = (typeof instrumentLogActionOptions)[number];
export interface IInstrumentLog {
    _id: Types.ObjectId;
    instrument_id: Types.ObjectId;
    user_id: Types.ObjectId;
    action: InstrumentLogAction;
    reason: string;
    createdAt: Date;
}
export type InstrumentLogDocument = HydratedDocument<IInstrumentLog>;
declare const _default: import("mongoose").Model<IInstrumentLog, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IInstrumentLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IInstrumentLog, import("mongoose").Model<IInstrumentLog, any, any, any, any, any, IInstrumentLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    instrument_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    action?: import("mongoose").SchemaDefinitionProperty<"remove" | "add", IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reason?: import("mongoose").SchemaDefinitionProperty<string, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IInstrumentLog, import("mongoose").Document<unknown, {}, IInstrumentLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrumentLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IInstrumentLog>, IInstrumentLog>;
export default _default;
//# sourceMappingURL=instrumentLog.d.ts.map