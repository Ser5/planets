import objectsTree  from 'objects-tree';
import view         from 'view';
import SpaceObject  from 'space-object';
import System       from 'system';
import IDraw        from 'system/draw/i/idraw';



export default abstract class DrawSystemBase extends System {
	protected centerX:  number = 0;
	protected centerY:  number = 0;
	public    vertical: number = 0;

	abstract onViewResize (width: number, height: number);



	draw () {
		objectsTree.process(false, so => this.updateCoords(so));
		this.clear();
		objectsTree.process('sphere', so => this.drawSphere(so));
		objectsTree.process('disc',   so => this.drawDisc(so));
	}



	protected updateCoords (so: SpaceObject) {
		let v     = this.vertical;
		let pos   = so.position;
		let draw  = this.getSpaceObjectDrawComponent(so);
		draw.x    = this.centerX - (view.x * view.zoom)     + (pos.x * view.zoom);
		draw.y    = this.centerY - (view.y * view.zoom * v) + (pos.y * view.zoom * v);
		so.draw.x = draw.x;
		so.draw.y = draw.y;
		//console.log(`${this.centerY} + (${view.y} * ${view.zoom}) + (${pos.y} * ${view.zoom} * ${v}) = ${draw.y}`);
		//console.log(`${draw.x}:${draw.y}`);
	}



	protected abstract clear ();
	protected abstract drawSphere (so: SpaceObject);
	protected abstract drawDisc (so: SpaceObject);
	protected abstract getSpaceObjectDrawComponent (so: SpaceObject): IDraw;

	abstract updateFocusCoords ();
}
