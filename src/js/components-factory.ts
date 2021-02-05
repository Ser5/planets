import System         from 'system';
import positionSystem from 'system/position-system';
import stillSystem    from 'system/move/still-system';
import orbitSystem    from 'system/move/orbit-system';
import sphereSystem   from 'system/exterior/sphere-system';
import discSystem     from 'system/exterior/disc-system';
import draw2DSystem   from 'system/draw/draw-2d-system';
import draw3DSystem   from 'system/draw/draw-3d-system';
import drawSystem     from 'system/draw/draw-system';
import focusSystem    from 'system/focus-system';



let componentsFactory = new class {
	private position: System;
	private still:    System;
	private orbit:    System;
	private sphere:   System;
	private disc:     System;
	private draw2d:   System;
	private draw3d:   System;
	private draw:     System;
	private focus:    System;

	constructor () {
		this.position = positionSystem;
		this.still    = stillSystem;
		this.orbit    = orbitSystem;
		this.sphere   = sphereSystem;
		this.disc     = discSystem;
		this.draw2d   = draw2DSystem;
		this.draw3d   = draw3DSystem;
		this.draw     = drawSystem;
		this.focus    = focusSystem;
	}



	get (name: string, data: object) {
		return this[name].getComponent(data);
	}
}();



export default componentsFactory;
