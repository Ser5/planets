import {Entity} from 'ecs/import';
import {View}   from 'view';

import {IDrawSystemExterior} from '../idraw-system-exterior';



export abstract class Exterior implements IDrawSystemExterior {
	protected view: View;
	protected ctx:  CanvasRenderingContext2D;

	constructor (
		{view,       ctx}:
		{view: View, ctx: CanvasRenderingContext2D}
	) {
		this.view = view;
		this.ctx  = ctx;
	}



	abstract draw (so: Entity);
}
