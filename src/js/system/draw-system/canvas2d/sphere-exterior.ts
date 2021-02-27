import {pi2}    from 'utils';
import {Entity} from 'ecs/import';
import {IPositionComponent, ISphereComponent} from 'component/import';

import {Exterior} from './exterior';



export class SphereExterior extends Exterior {
	draw (so: Entity) {
		//console.trace();
		let sphere = so.c('sphere') as ISphereComponent;
		let draw   = so.c('draw')   as IPositionComponent;
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
		//console.log(`${sphere.color}: [${draw.x};${draw.y}]`);
	}
}
