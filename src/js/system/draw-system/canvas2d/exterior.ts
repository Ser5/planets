import {IComponent, Entity} from 'ecs/import';
import {View}   from 'view';

//import {IDrawSystemExterior} from '../idraw-system-exterior';
import {DrawSystemExterior}  from '../draw-system-exterior';



export abstract class Exterior extends DrawSystemExterior {
	protected ctx:  CanvasRenderingContext2D;

	constructor (
		{view,       ctx}:
		{view: View, ctx: CanvasRenderingContext2D}
	) {
		super({view});
		this.ctx = ctx;
	}
}
