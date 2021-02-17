import {IComponent} from 'ecs/icomponent';



export interface IDiscComponent extends IComponent {
	distance: number;
	size:     number;
	color:    string;
};
