import { GameObject } from "../objects/gameObject";
import { ObjectRegistry } from "../objects/objectRegistry";

export class Factory {
    static createObject(objectType: string): GameObject {
        const Constructor = ObjectRegistry.getObject(objectType);
        if (!Constructor) throw new Error(`Type '${objectType}' not found`);
        return new Constructor(); // ← Конструктор сам создаёт всё необходимое
    }
}
