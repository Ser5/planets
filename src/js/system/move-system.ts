import {pi2, angle270} from 'utils';

import {Entity, EntitiesTree, System} from 'ecs/import';

import {IPositionComponent, IOrbitComponent}  from 'component/import';



export class MoveSystem extends System {
	private _entitiesTree: EntitiesTree = null;

	constructor (
		{entitiesTree}:
		{entitiesTree: EntitiesTree}
	) {
		super();
		this._entitiesTree = entitiesTree;
	}



	run () {
		this._entitiesTree.process(['still','orbit'], so => this._move(so));
	}



	private _move (so: Entity) {
		if (so.c('still')) {
			this._standStill(so);
		} else {
			this._orbit(so);
		}
	}



	private _standStill (so: Entity) {
		let pos = so.c('position') as IPositionComponent;

		if (!so.parent) {
			[pos.x, pos.y] = [0, 0];
		} else {
			let parentPos  = so.parent.c('position') as IPositionComponent
			[pos.x, pos.y] = [parentPos.x, parentPos.y];
		}
		//console.log(`${pos.x}:${pos.y}`);
	}



	private _orbit (so: Entity) {
		let parentPos = so.parent.c('position') as IPositionComponent;
		let pos       = so.c('position')        as IPositionComponent;
		let orbit     = so.c('orbit')           as IOrbitComponent;

		//console.log(orbit.moveAngle);
		orbit.angle += orbit.moveAngle;
		if (orbit.angle > pi2) {
			orbit.angle -= pi2;
		}

		let angle = angle270 - orbit.angle;
		let lx    = Math.cos(angle) * orbit.centerDistance;
		let ly    = Math.sin(angle) * orbit.centerDistance;

		pos.x = parentPos.x + lx;
		pos.y = parentPos.y + ly;
	}
}
