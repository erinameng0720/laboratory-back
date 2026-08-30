import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface IRefreshToken {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    refreshToken: string;
    createdAt: Date;
}
export type RefreshTokenDocument = HydratedDocument<IRefreshToken>;
declare const _default: import("mongoose").Model<IRefreshToken, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IRefreshToken, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IRefreshToken, import("mongoose").Model<IRefreshToken, any, any, any, any, any, IRefreshToken>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IRefreshToken, import("mongoose").Document<unknown, {}, IRefreshToken, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IRefreshToken, import("mongoose").Document<unknown, {}, IRefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IRefreshToken, import("mongoose").Document<unknown, {}, IRefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    refreshToken?: import("mongoose").SchemaDefinitionProperty<string, IRefreshToken, import("mongoose").Document<unknown, {}, IRefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IRefreshToken, import("mongoose").Document<unknown, {}, IRefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IRefreshToken>, IRefreshToken>;
export default _default;
//# sourceMappingURL=refreshToken.d.ts.map