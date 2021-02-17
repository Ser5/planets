import {Entity} from './entity';


type Filter = false|string|string[];

interface ICallback {
	(so: Entity);
};



export class EntitiesTree {
	public root: Entity = null;



	process (componentFilter: Filter, callback: ICallback) {
		//console.log(this.root);
		this._process(this.root, componentFilter, callback);
	}



	private _process (entity: Entity, componentFilter: Filter, callback: ICallback) {
		if (!componentFilter || this._isAnyComponentExists(entity, componentFilter)) {
			callback(entity);
		}
		if (entity.children.length) {
			for (let so of entity.children) {
				this._process(so, componentFilter, callback);
			}
		}
	}



	private _isAnyComponentExists (entity: Entity, componentFilter: string|string[]) {
		let r = false;
		if (typeof componentFilter === 'string') {
			r = (entity.c(componentFilter) !== null);
		} else {
			for (let f of componentFilter) {
				if (entity.c(f) !== null) {
					r = true;
					break;
				}
			}
		}
		return r;
	}
}
