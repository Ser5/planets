import SpaceObject from 'space-object';

export default interface IDrawEngine {
	clear();
	drawSphere(so: SpaceObject);
	drawDisc(so: SpaceObject);
}
