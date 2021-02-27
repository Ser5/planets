import {IComponent, Entity}  from 'ecs/import';

//import {IComponentInit}     from 'ecs/import';
import {ISphereComponent}   from './i/isphere-component';
import {ISphere3dComponent} from './i/isphere3d-component';
import {SphereInit}         from './sphere-init';

import * as THREE from 'three';



export let exterior3dHelper = new class {
	add3dData (
		{exterior,             scene,      color,         emissive,          meshGeometry}:
		{exterior: IComponent, scene: any, color: string, emissive?: string, meshGeometry: any}
	): unknown {
		let meshColor:    string;
		let meshOpacity:  number;

		//console.log(color);
		if (color.startsWith('#')) {
			let colorHex = color;
			if (color.length == 7) {
				meshColor   = color;
				meshOpacity = 1;
			} else {
				meshColor   = color.substr(0, 7);
				meshOpacity = 1 / 256 * parseInt(color.substr(7), 16);
				//console.log(meshColor, meshOpacity);
			}
		} else {
			meshColor = color;
		}

		let meshMaterial = new THREE.MeshPhysicalMaterial({
			color:             meshColor,
			opacity:           meshOpacity,
			emissive:          (emissive ?? meshColor),
			emissiveIntensity: (emissive ? 1 : 0.2),
			metalness:         0.3,
			roughness:         0.65,
		});
		//console.log((sphere));
		//console.log(meshGeometry, meshMaterial);

		let mesh = new THREE.Mesh(meshGeometry, meshMaterial);
		mesh.castShadow    = true;
		mesh.receiveShadow = true;
		scene.add(mesh);

		let sphere3d = {...exterior, emissive, mesh};

		return sphere3d;
	}
}();

