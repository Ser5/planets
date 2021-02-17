import {IComponent} from './icomponent';



export class ComponentsManager {
	private _creators: Record<string, Function> = {};

	register (name: string, creator: Function) {
		this._creators[name] = creator;
	}



	get (name: string, data: Record<string, any>): IComponent {
		return this._creators[name](data);
	}
}
