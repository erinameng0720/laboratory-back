import { Schema, type HydratedDocument, Types } from 'mongoose';
export type UserRole = 'user' | 'admin';
export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export type UserDocument = HydratedDocument<IUser>;
declare const _default: import("mongoose").Model<IUser, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IUser, import("mongoose").Model<IUser, any, any, any, any, any, IUser>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IUser, import("mongoose").Document<unknown, {}, IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    username?: import("mongoose").SchemaDefinitionProperty<string, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    email?: import("mongoose").SchemaDefinitionProperty<string, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    password?: import("mongoose").SchemaDefinitionProperty<string, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    role?: import("mongoose").SchemaDefinitionProperty<UserRole, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IUser, import("mongoose").Document<unknown, {}, IUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IUser>, IUser>;
export default _default;
//# sourceMappingURL=user.d.ts.map