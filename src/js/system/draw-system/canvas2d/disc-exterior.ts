import {pi2}    from 'utils';
import {Entity} from 'ecs/import';
import {IPositionComponent, ISphereComponent, IDiscComponent} from 'component/import';

import {Exterior} from './exterior';



export class DiscExterior extends Exterior {
	draw (so: Entity) {
		let parentSphere = so.parent.c('sphere') as ISphereComponent;
		let disc         = so.c('disc')          as IDiscComponent;
		let draw         = so.c('draw')          as IPositionComponent;
		let ctx          = this.ctx;
		let view         = this.view;

		ctx.beginPath();
		ctx.strokeStyle = disc.color;
		ctx.lineWidth   = disc.size * view.zoom;
		let diameter =
			(parentSphere.radius + disc.distance) * view.zoom +
			disc.size * view.zoom / 2;
		ctx.arc(
			draw.x, draw.y,
			diameter,
			0, pi2
		);
		ctx.stroke();
		//console.log(`(${parentSphere.radius} + ${disc.distance}) * ${view.zoom} + ${disc.size} * view.zoom / 2 = ${diameter}`);
	}
}
