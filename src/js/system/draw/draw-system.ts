import {canvas2d, canvas3d} from 'init';
import objectsTree    from 'objects-tree';
import SpaceObject    from 'space-object';
import System         from 'system';
import DrawSystemBase from './draw-system-base';
import draw2DSystem   from './draw-2d-system';
import draw3DSystem   from './draw-3d-system';
import IDraw          from './i/idraw';



let drawSystem = new class extends System {
	private _engines:      {[name: string]: DrawSystemBase};
	private _activeEngine: DrawSystemBase;

	constructor () {
		super();
		this._engines              = {};
		this._engines.draw2DSystem = draw2DSystem;
		this._engines.draw3DSystem = draw3DSystem;
		this._activeEngine         = this._engines.draw2DSystem;
	}



	getComponent (
		{spaceObject}:
		{spaceObject: SpaceObject}
	): IDraw {
		return {spaceObject, x:0, y:0};
	}



	set2D () {
		canvas2d.style.display = 'block';
		canvas3d.style.display = 'none';
		this._activeEngine = this._engines.draw2DSystem;
	}

	set3D () {
		canvas2d.style.display = 'none';
		canvas3d.style.display = 'block';
		this._activeEngine = this._engines.draw3DSystem;
	}



	get vertical (): number { return this._activeEngine.vertical }

	onViewResize (width: number, height: number) {
		this._activeEngine.onViewResize(width, height);
	}

	draw () {
		this._activeEngine.draw();
	}



	updateFocusCoords () {
		this._activeEngine.updateFocusCoords();
	}
}();



export default drawSystem;
