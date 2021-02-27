import {TComponents} from './tcomponents';
import {System}      from './system';



export class SystemsManager {
	private _systemsList: System[] = [];

	register (systems: System|System[]|Record<any,System>) {
		let systemsList   = (systems instanceof System) ? [systems] : Object.values(systems);
		this._systemsList = [...this._systemsList, ...systemsList];
	}



	initComponents (components: TComponents): TComponents {
		for (let system of this._systemsList) {
			components = system.initComponents(components);
		}
		return components;
	}
}
