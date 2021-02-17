import {Entity}            from './entity';
import {ComponentsManager} from './components-manager';



export class EntitiesManager {
	private _componentsManager: ComponentsManager;

	constructor ({componentsManager}) {
		this._componentsManager = componentsManager;
	}



	create (
		{parent = null,   components = {}}:
		{parent?: Entity, components?: object}
	): Entity
	{
		let entity = new Entity();

		if (parent) {
			parent.addChild(entity);
			entity.parent = parent;
		}

		for (let [name, data] of Object.entries(components)) {
			let c = this._componentsManager.get(name, {...data, entity});
			entity.setComponent(name, c);
		}

		return entity;
	}
}
