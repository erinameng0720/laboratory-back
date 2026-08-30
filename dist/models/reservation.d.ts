import { Schema, type HydratedDocument, Types } from 'mongoose';
export declare const reservationStatusOptions: readonly ["pending", "confirmed", "cancelled"];
export type ReservationStatus = (typeof reservationStatusOptions)[number];
export interface IReservation {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    instrument_id: Types.ObjectId;
    start_time: Date;
    end_time: Date;
    status: ReservationStatus;
    cancel_reason?: string;
    reviewed_by?: Types.ObjectId;
    reviewed_at?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type ReservationDocument = HydratedDocument<IReservation>;
declare const _default: import("mongoose").Model<IReservation, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IReservation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IReservation, import("mongoose").Model<IReservation, any, any, any, any, any, IReservation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    instrument_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    start_time?: import("mongoose").SchemaDefinitionProperty<Date, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    end_time?: import("mongoose").SchemaDefinitionProperty<Date, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<"pending" | "confirmed" | "cancelled", IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    cancel_reason?: import("mongoose").SchemaDefinitionProperty<string | undefined, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reviewed_by?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reviewed_at?: import("mongoose").SchemaDefinitionProperty<Date | undefined, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IReservation, import("mongoose").Document<unknown, {}, IReservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IReservation & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IReservation>, IReservation>;
export default _default;
//# sourceMappingURL=reservation.d.ts.map