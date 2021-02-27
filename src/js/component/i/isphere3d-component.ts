import {ISphereComponent} from './isphere-component';



export interface ISphere3dComponent extends ISphereComponent {
	emissive?: string;
	mesh:      any;
};
