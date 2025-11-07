import { GameObject } from "./gameObject";

//реестр объектов, чтобы упростить создание новых объектов и инициализации
export const ObjectRegistry = new class {
    private registeredObjects = new Map<string, new () => GameObject>();
    
    register(name: string, gameObject: new () => GameObject) {
        this.registeredObjects.set(name, gameObject);
    }
    
    getObject(name: string):  (new () => GameObject) | undefined {
        return this.registeredObjects.get(name);
    }
    
    get availableObjects(): string[] {
        return Array.from(this.registeredObjects.keys());
    }
};

//декоратор
export function RegisterObject(name: string) {
    return function<T extends GameObject>(constructor: new () => T) {
        ObjectRegistry.register(name, constructor);
        return constructor;
    }
}