import {IComponent}  from './icomponent';
import {TComponents} from './tcomponents';


export class Entity {
	public parent:   Entity   = null;
	public children: Entity[] = [];

	private _components: TComponents = {};

	constructor () {
	}



	addChild (child: Entity) {
		this.children.push(child);
	}



	setComponents (components: TComponents) { this._components = components; }



	c (name: string): IComponent {
		return this._components[name] ?? null;
	}
}
