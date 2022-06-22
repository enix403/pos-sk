export function CreateEnttRef(entt, other={}) {
    return {
        reference: "m:1",
        entity: entt,
        wrappedReference: true,
        nullable: false,
        ...other
    };
}
