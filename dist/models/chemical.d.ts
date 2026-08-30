import { Schema, type HydratedDocument, Types } from 'mongoose';
export declare const categoryOptions: readonly ["acid", "base", "salt", "alcohol", "ketone", "ester", "aromatic_hydrocarbon"];
export type ChemicalCategory = (typeof categoryOptions)[number];
export declare const unitOptions: readonly ["mL", "L", "g", "kg", "bottle"];
export type ChemicalUnit = (typeof unitOptions)[number];
export interface IGhs {
    image_url: string;
    name: string;
    precautions: string;
}
export type MsdsSource = 'admin' | 'external_api';
export interface IMsds {
    source: MsdsSource;
    title: string;
    url?: string;
    content?: string;
    updatedAt: Date;
}
export interface IChemical {
    _id: Types.ObjectId;
    name: string;
    cas_number: string;
    category: ChemicalCategory;
    ghs: IGhs[];
    amount: number;
    total_quantity: number;
    low_stock_threshold: number;
    unit: ChemicalUnit;
    location: string;
    image_url?: string;
    expireDate?: Date;
    msds?: IMsds;
    createdAt: Date;
    updatedAt: Date;
}
export type ChemicalDocument = HydratedDocument<IChemical>;
declare const _default: import("mongoose").Model<IChemical, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IChemical, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IChemical, import("mongoose").Model<IChemical, any, any, any, any, any, IChemical>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: import("mongoose").SchemaDefinitionProperty<string, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    cas_number?: import("mongoose").SchemaDefinitionProperty<string, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    category?: import("mongoose").SchemaDefinitionProperty<"acid" | "base" | "salt" | "alcohol" | "ketone" | "ester" | "aromatic_hydrocarbon", IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    ghs?: import("mongoose").SchemaDefinitionProperty<IGhs[], IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    amount?: import("mongoose").SchemaDefinitionProperty<number, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    total_quantity?: import("mongoose").SchemaDefinitionProperty<number, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    low_stock_threshold?: import("mongoose").SchemaDefinitionProperty<number, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    unit?: import("mongoose").SchemaDefinitionProperty<"mL" | "L" | "g" | "kg" | "bottle", IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    location?: import("mongoose").SchemaDefinitionProperty<string, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    image_url?: import("mongoose").SchemaDefinitionProperty<string | undefined, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    expireDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    msds?: import("mongoose").SchemaDefinitionProperty<IMsds | undefined, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IChemical, import("mongoose").Document<unknown, {}, IChemical, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IChemical & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IChemical>, IChemical>;
export default _default;
//# sourceMappingURL=chemical.d.ts.map