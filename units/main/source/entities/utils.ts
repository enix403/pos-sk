export function CreateEnttRef(entt, other = {}) {
    return {
        reference: "m:1",
        entity: entt,
        wrappedReference: true,
        nullable: false,
        ...other
    };
}


export function CreateInverseManyEnttRef<T>(
    entt: () => { new(..._args): T },
    mappedBy: (entt: T) => any,
    other = {}
) {
    return {
        reference: '1:m',
        entity: entt,
        mappedBy: mappedBy,
        ...other
    }
}
