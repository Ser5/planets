import {IComponent}       from './icomponent';
import {IComponentInit}   from './icomponent-init';
import {TComponentParams} from './tcomponent-params';
import {TComponents}      from './tcomponents';


export class ComponentsManager {
	private _initializers: Record<string, IComponentInit> = {};

	registerInitializersList (initializers: IComponentInit[]) {
		for (let initer of initializers) {
			this._initializers[initer.componentName] = initer;
		}
	}



	/*get (name: string, params: TComponentParams): IComponent {
		if (this._initializers[name]) {
			return this._initializers[name].initComponent(params);
		} else {
			throw `No component initializer for [${name}]`;
		}
	}*/



	initComponents (components: TComponents): TComponents {
		let initedComponents: TComponents = {};
		for (let [name, c] of Object.entries(components)) {
			//console.log(name);
			if (this._initializers[name]) {
				//console.log(this._initializers[name]);
				c = this._initializers[name].initComponent(c);
			}
			initedComponents[name] = c;
		}
		//console.log(initedComponents);
		return initedComponents;
	}
}
