import {Entity, EntitiesTree} from 'ecs/import';
import {IPositionComponent}   from 'component/import';
import {IFocusStrategy}       from './ifocus-strategy';



export class RealFocusStrategy implements IFocusStrategy {
	getFocusPosition (so: Entity) {
		let drawPos = so.c('draw') as IPositionComponent;
		return {x: drawPos.x, y: drawPos.y};
	}
}
