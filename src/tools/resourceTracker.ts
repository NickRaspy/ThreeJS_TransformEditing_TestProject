//скопипастил с three js manual https://threejs.org/manual/#en/cleanup

import { IDisposable } from "../dispose";

class ResourceTracker implements IDisposable{
    private resources : Set<any> = new Set();
    track(resource: any) {
        if (resource.dispose) {
            this.resources.add(resource);
        }
        return resource;
    }
    untrack(resource: any) {
        this.resources.delete(resource);
    }
    dispose() {
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}

export const resourceTracker = new ResourceTracker();