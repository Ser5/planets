import {IComponent} from './icomponent';



export class Entity {
	public parent:   Entity   = null;
	public children: Entity[] = [];

	private _components: Record<string, IComponent> = {};

	constructor () {
	}



	addChild (child: Entity) {
		this.children.push(child);
	}



	setComponent (name: string, component: IComponent) { this._components[name] = component; }



	c (name: string): IComponent {
		return this._components[name] ?? null;
	}
}
