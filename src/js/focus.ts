import {Entity, EntitiesTree} from 'ecs/import';
import {getDistance}          from 'utils';
import {IPositionComponent}   from 'component/import';



export class Focus {
	private _canvasesBlock: HTMLElement;
	private _entitiesTree:  EntitiesTree;

	constructor (
		{canvasesBlock,              entitiesTree}:
		{canvasesBlock: HTMLElement, entitiesTree: EntitiesTree}
	) {
		this._canvasesBlock = canvasesBlock;
		this._entitiesTree  = entitiesTree;
	}



	getNearestSpaceObject (x: number, y: number): Entity {
		let rect:          DOMRect = this._canvasesBlock.getBoundingClientRect();
		let distance:      number  = 1000000;
		let clickedObject: Entity  = null;
		this._updateFocusPositions();
		this._entitiesTree.process('focus', so => {
			let clickedX = x - rect.left;
			let clickedY = y - rect.top;
			let focus    = so.c('focus') as IPositionComponent;
			let d        = getDistance(clickedX, clickedY, focus.x, focus.y);
			//console.log(`${clickedX}:${clickedY} <> ${(<any>so.c('sphere')).color} ${focus.x}:${focus.y} = ${d}`);
			if (d < distance) {
				distance      = d;
				clickedObject = so;
			}
		});
		//console.log(clickedObject);
		return clickedObject;
	}



	private _updateFocusPositions () {
		this._entitiesTree.process('focus', so => {
			let drawPos = so.c('draw')  as IPositionComponent;
			let focus   = so.c('focus') as IPositionComponent;
			focus.x     = drawPos.x;
			focus.y     = drawPos.y;
		});
		//drawSystem.updateFocusCoords();
	}
}
