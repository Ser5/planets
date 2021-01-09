import IComponent from 'icomponent';



export default interface IOrbit extends IComponent {
	distance:       number;
	speed:          number;
	centerDistance: number;
	angle:          number;
	moveAngle:      number;
};
