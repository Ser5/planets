import {pi2}    from 'utils';
import {Entity} from 'ecs/import';
import {IPositionComponent, ISphereComponent, IDrawComponent} from 'component/import';

import {Exterior} from './exterior';



export class SphereExterior extends Exterior {
	draw (so: Entity) {
		let sphere = so.c('sphere')   as ISphereComponent;
		let draw   = so.c('draw')     as IDrawComponent;
		let ctx    = this.ctx;

		ctx.beginPath();
		ctx.fillStyle = sphere.color;
		ctx.arc(
			draw.x, draw.y,
			sphere.radius * this.view.zoom,
			0,
			pi2
		);
		ctx.fill();
		//console.log(`${draw.x}:${draw.y}`);
	}
}
