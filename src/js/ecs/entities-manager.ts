import {TComponents}       from './tcomponents';
import {Entity}            from './entity';
import {ComponentsManager} from './components-manager';



export class EntitiesManager {
	private _componentsManager: ComponentsManager;

	constructor ({componentsManager}) {
		this._componentsManager = componentsManager;
	}



	create (
		{parent = null,   components = {}}:
		{parent?: Entity, components?: TComponents}
	): Entity
	{
		let entity = new Entity();

		if (parent) {
			parent.addChild(entity);
			entity.parent = parent;
		}

		for (let c of Object.values(components)) {
			c.entity = entity;
		}

		components = this._componentsManager.initComponents(components);
		entity.setComponents(components);
		//console.log(entity);

		return entity;
	}
}
