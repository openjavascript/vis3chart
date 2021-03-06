
const THREE = require( 'three' );

import VisChartBase from './3d/common/base.js';
import Legend from './3d/common/legend.js';

import Dount from './3d/dount/index.js';
import Gauge from './3d/gauge/index.js';

import ju from 'json-utilsx';
import * as constant from './common/constant.js';
import THREEx from './common/threex.domevents.js';

import * as geometry from './geometry/geometry.js';

import ld from 'lodash';

export default class VisThree extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.legend = null;
    }

    _setSize( width, height ){

        this.config = this.config || {
            camera: {
                fov: 40
                , near: 1
                , far: 1000
            }

            , cameraPosition: { x: 0, y: 0, z: 350 }
        };

        super._setSize( width, height );

        this.init();

        if( 
            this.legend
            && this.data 
            && this.data.legend 
        ){
            this.legend.resize( this.width, this.height );

            this.legend.update( this.data.legend );
        }

        if( this.data ){
            let tmpredraw = this.redraw;
            this.update( this.data, this.ignoreLegend );
            this.redraw = tmpredraw;
        }
    }

    init(){
        if( !this.box ) return;

        if( !this.stage ){
            this.stage = this.scene = new THREE.Scene();

            //console.log( this, this.config );

            this.camera = new THREE.PerspectiveCamera( 
                this.config.camera.fov
                , this.width / this.height
                , this.config.camera.nera
                , this.config.camera.far
            );
            this.camera.position.set( 
                this.config.cameraPosition.x
                , this.config.cameraPosition.y
                , this.config.cameraPosition.z
            )
            this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            //this.renderer.setClearColor( 0xffffff, .2 );
            this.renderer.sortObjects  = true;
            this.box.innerHTML = '';
            this.box.appendChild( this.renderer.domElement );

            //this.scene.rotation.x = geometry.radians( 45 );
            //this.scene.rotation.y = geometry.radians( 290 );

            this.cameraHelper = new THREE.CameraHelper( this.camera );
            this.cameraHelper.visible = false;
            this.scene.add( this.cameraHelper );

            this.domEvents   = new THREEx.DomEvents(this.camera, this.renderer.domElement);

            //console.log( this.scene, this.camera );
        }else{
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.setSize( this.width, this.height );

        this.customWidth && ( this.box.style.width = this.customWidth + 'px' );
        this.customHeight && ( this.box.style.height = this.customHeight + 'px' );

        this.render();

        return this;
    }

    setThreeConfig( config ){
        config = config || {};

        this.config = ld.merge( this.config, config );

        return this;
    }

    updateThreeConfig( config ){
        this.setThreeConfig( config );

        this.camera.position.x = this.config.cameraPosition.x;
        this.camera.position.y = this.config.cameraPosition.y;
        this.camera.position.z = this.config.cameraPosition.z;

        this.camera.fov     = this.config.camera.fov;
        this.camera.near    = this.config.camera.near;
        this.camera.far     = this.config.camera.far;

        this.camera.updateProjectionMatrix();
        return this;
    }

    update( data, ignoreLegend, redraw = true ){
        this.data = data;
        this.ignoreLegend = ignoreLegend;
        this.redraw = redraw;

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        this.data
        && this.data.legend
        && this.data.legend.data
        && this.data.legend.data.legend
        && this.data.legend.data.map( ( item, key )=> {
            item.realIndex = key;
        });


        this.data
        && this.data.series 
        && this.data.series.length 
        && this.data.series.map( sitem => {
            sitem.data && sitem.data.length 
            && sitem.data.map( ( item, key ) => {
                item.realIndex = key;
            });
        });

        this.clearUpdate();

        if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
            if( this.legend && ignoreLegend ){
                this.emptyblock = 'kao';
            }else{
                this.legend && this.legend.destroy() && (this.legent = null);
                this.legend = new Legend( this.box, this.width, this.height, this.camera );
                this.legend.setOptions( {
                    renderer: this.renderer
                    , scene: this.scene
                    , camera: this.camera
                    , stage: this.stage
                    , config: this.config
                    , domEvents: this.domEvents
                    , onChange: ( group ) => {
                        this.initChart();
                    }
                });
                this.legend.update( this.data.legend );
            }
        }

        /*
        if( this.renderer ){
            this.renderer.setSize( this.width, this.height );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.render();
        }
        */
        this.initChart();
        return this;
    }

    initChart(){
        //console.log( 'initChart', Date.now() );
        this.redraw = 0;

        if( this.ins && this.ins.length &&  !this.redraw  ){
                this.emptyblock = 'kao';
        }else{
            this.ins.map( item => {
                item.destroy();
            });
            this.ins = [];
        }

        this.data.series.map( ( val, key ) => {
            //console.log( val, constant );
            let ins;

            if( this.ins && this.ins.length && this.ins[key] &&  !this.redraw  ){
                ins = this.ins[key];
                ins.width = this.width;
                ins.height = this.height;
            }else{
                switch( val.type ){
                    case constant.CHART_TYPE.dount: {
                        ins = new Dount( this.box, this.width, this.height, this.camera );
                        break;
                    }
                    case constant.CHART_TYPE.gauge: {
                        //console.log( 'gauge 1', Date.now() );
                        ins = new Gauge( this.box, this.width, this.height, this.camera );
                        break;
                    }
                }
                if( ins ){
                    //console.log( 'gauge 2', Date.now() );
                    this.legend && ins.setLegend( this.legend );
                    ins.setOptions( {
                        renderer: this.renderer
                        , scene: this.scene
                        , camera: this.camera
                        , stage: this.stage
                        , config: this.config
                        , domEvents: this.domEvents
                    });
                }
            }

            if( ins ){
                //console.log( 'gauge 3', Date.now() );
                this.options = this.options || {};
                this.options.srcData = val;
                ins.setOptions( this.options );

                let fillData = this.getLegendData( val );
                ins.update( fillData, ju.clone( this.data ) );

                if( !this.ins[key]  ){
                    this.ins[key] = ins;
                }
            }
        });
    }

    getLegendData( data ){
        data = ju.clone( data );

        let tmp = [];

        if( this.legend && this.legend.group && this.legend.group.length ){
            this.legend.group.map( ( item, key ) => {
                //console.log( key, item.disabled, item );
                if( !item.disabled ){
                    tmp.push( data.data[key] );
                }
            });
            data.data = tmp;
        }

        return data;
    }

    destroy(){
        super.destroy();

        //this.clearUpdate();
        this.ins.map( ( item ) => {
            item.destroy();
        });
        //this.legend && this.legend.destroy();

        this.stage && this.stage.destroy();
        this.stage = null;
    }

    clearUpdate(){
        //this.legend && !this.ignoreLegend && this.legend.destroy();
    }
}

