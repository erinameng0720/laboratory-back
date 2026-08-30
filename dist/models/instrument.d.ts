import { Schema, type HydratedDocument, Types } from 'mongoose';
export declare const instrumentStatusOptions: readonly ["available", "in_use", "maintenance"];
export type InstrumentStatus = (typeof instrumentStatusOptions)[number];
export interface IInstrument {
    _id: Types.ObjectId;
    name: string;
    model: string;
    status: InstrumentStatus;
    image_url?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type InstrumentDocument = HydratedDocument<IInstrument>;
declare const _default: import("mongoose").Model<IInstrument, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IInstrument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IInstrument, import("mongoose").Model<IInstrument, any, any, any, any, any, IInstrument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: import("mongoose").SchemaDefinitionProperty<string, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    model?: import("mongoose").SchemaDefinitionProperty<string, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<"available" | "in_use" | "maintenance", IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    image_url?: import("mongoose").SchemaDefinitionProperty<string | undefined, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IInstrument, import("mongoose").Document<unknown, {}, IInstrument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IInstrument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IInstrument>, IInstrument>;
export default _default;
//# sourceMappingURL=instrument.d.ts.map