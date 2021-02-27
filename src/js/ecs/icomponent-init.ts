import {IComponent}       from 'ecs/import';
import {TComponentParams} from './tcomponent-params';



export interface IComponentInit {
	componentName: string;
	initComponent (component: TComponentParams): IComponent;
}
