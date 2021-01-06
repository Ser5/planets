import {ctx, pi2, rootObject, processSpaceObjects} from './init.js';
import view   from './view.js';
import System from './System.js'



let orbitSystem = new class extends System {
	run () {
		processSpaceObjects(rootObject.get(), so => so.orbit && this._move(so));
	}


	_move (so) {
	}
}();



export default rotateSystem;
