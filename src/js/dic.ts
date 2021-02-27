import {ecs} from 'ecs/ecs';

import {Html}              from 'html';
import {Threed}            from 'threed';
import {View}              from 'view';
import {Input}             from 'input';

import {Focus}                from 'focus';
import {RealFocusStrategy}    from 'focus/real-focus-strategy';
import {VirtualFocusStrategy} from 'focus/virtual-focus-strategy';

import {DrawSystem}       from 'system/draw-system';
import {Canvas2d}         from 'system/draw-system/canvas2d';
import {Canvas3d}         from 'system/draw-system/canvas3d';
import {SphereExterior}   from 'system/draw-system/canvas2d/sphere-exterior';
import {Sphere3dExterior} from 'system/draw-system/canvas3d/sphere3d-exterior';
import {DiscExterior}     from 'system/draw-system/canvas2d/disc-exterior';
import {Disc3dExterior}   from 'system/draw-system/canvas3d/disc3d-exterior';

import {MoveSystem} from 'system/move-system';

import {Engine} from 'engine';



export let html   = new Html();
export let threed = new Threed({canvas: html.canvas3d});
export let view   = new View();



export let moveSystem = new MoveSystem({
	entitiesTree: ecs.entitiesTree,
});



export let drawSystem = new DrawSystem({
	html,
	strategies: {
		canvas2d: new Canvas2d({
			canvas:       html.canvas2d,
			ctx:          html.canvas2dContext,
			view:         view,
			entitiesTree: ecs.entitiesTree,
			exteriors: {
				sphere: new SphereExterior({view, ctx: html.canvas2dContext}),
				disc:   new DiscExterior  ({view, ctx: html.canvas2dContext}),
			},
		}),
		canvas3d: new Canvas3d({
			canvas:       html.canvas3d,
			scene:        threed.scene,
			renderer:     threed.renderer,
			view:         view,
			entitiesTree: ecs.entitiesTree,
			exteriors: {
				sphere: new Sphere3dExterior(),
				disc:   new Disc3dExterior  (),
			},
		}),
	},
});



export let focus  = new Focus({
	canvasesBlock: html.canvasesBlock,
	entitiesTree:  ecs.entitiesTree,
	strategies: {
		real:    new RealFocusStrategy(),
		virtual: new VirtualFocusStrategy({canvas: html.canvas3d, view}),
	},
});
export let input  = new Input({canvasesBlock: html.canvasesBlock, view, focus});



export let engine = new Engine({
	drawSystem,
	focus,
	strategies: {
		canvas2d: {drawStrategy: 'canvas2d', 'focusStrategy': 'real'},
		canvas3d: {drawStrategy: 'canvas3d', 'focusStrategy': 'virtual'},
	},
});
