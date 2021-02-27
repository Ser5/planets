import {TComponents} from './tcomponents';



export abstract class System {
	abstract run ()



	initComponents (components: TComponents): TComponents {
		return components;
	}
}
