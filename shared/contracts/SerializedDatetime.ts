
export namespace SerializedDatetime {
    export type Raw = Date;
    export type Type = string;
}

export class SerializedDatetime {
    public static serialize(date: SerializedDatetime.Raw): SerializedDatetime.Type {
        return date.toJSON();
    }

    public static load(serialized: SerializedDatetime.Type): SerializedDatetime.Raw {
        return new Date(serialized);
    }
};
