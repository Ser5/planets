import {Entity, EntitiesTree} from 'ecs/import';
import {getDistance}          from 'utils';
import {IPositionComponent}   from 'component/import';
import {IFocusStrategy}       from 'focus/ifocus-strategy';
import {StrategyHelper}       from 'strategy-helper';



export class Focus {
	private _strategyHelper: StrategyHelper<IFocusStrategy>;

	private _canvasesBlock: HTMLElement;
	private _entitiesTree:  EntitiesTree;

	constructor (
		{canvasesBlock,              entitiesTree,               strategies}:
		{canvasesBlock: HTMLElement, entitiesTree: EntitiesTree, strategies: Record<string, IFocusStrategy>}
	) {
		this._strategyHelper = new StrategyHelper<IFocusStrategy>(strategies);
		this._canvasesBlock  = canvasesBlock;
		this._entitiesTree   = entitiesTree;
	}



	getNearestSpaceObject (x: number, y: number): Entity {
		let focusStrategy: IFocusStrategy = this._strategyHelper.activeStrategy;
		let rect:          DOMRect        = this._canvasesBlock.getBoundingClientRect();
		let distance:      number         = 1000000;
		let clickedObject: Entity         = null;

		this._entitiesTree.process('focus', so => {
			let clickedX = x - rect.left;
			let clickedY = y - rect.top;
			let focus    = focusStrategy.getFocusPosition(so);
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



	setStrategy (name: string) {
		this._strategyHelper.setActiveStrategy(name);
	}
}
