import {IComponent, Entity} from 'ecs/import';
import {View}   from 'view';



export abstract class DrawSystemExterior {
	protected view: View;

	constructor (
		{view}:
		{view: View}
	) {
		this.view = view;
	}



	init (data: any): IComponent|null {
		return null;
	}



	abstract draw (so: Entity);



	getInitComponentNamesList (): string[] {
		return [];
	}
}
