
import VisChartBase from './3d/common/base.js';

import Dount from './3d/dount/index.js';

import ju from 'json-utilsx';
import * as constant from './common/constant.js';

const THREE = require( 'three' );

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

        //console.log( ju );

        //this.stage.removeChildren();

        //console.log( 'update data', data );

        /*if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
            if( this.legend && ignoreLegend ){
                this.emptyblock = 'kao';
            }else{
                this.legend = new Legend( this.box, this.width, this.height );
                this.legend.setStage( this.stage );
                this.legend.setOptions( {
                    onChange: ( group ) => {
                        //console.log( 'legend onchange', group );
                        this.initChart();
                    }
                });
                this.legend.update( this.data.legend );
            }
        }*/
        this.initChart();
        return this;
    }

    initChart(){

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
                        ins = new Dount( this.box, this.width, this.height );
                        break;
                    }
                    /*case constant.CHART_TYPE.gauge: {
                        ins = new Gauge( this.box, this.width, this.height );
                        break;
                    }*/
                }
                if( ins ){
                    this.legend && ins.setLegend( this.legend );
                    ins.setOptions( {
                        renderer: this.renderer
                        , scene: this.scene
                        , camera: this.camera
                        , stage: this.stage
                        , config: this.config
                    });
                }
            }

            if( ins ){
                this.options && ( ins.setOptions( this.options ) );
                ins.update( this.getLegendData( val ), ju.clone( this.data ) );

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
            //console.log( 'getLegendData', this.legend.group, 111111111 );
            this.legend.group.map( ( item, key ) => {
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
        this.legend && this.legend.destroy();

        this.stage && this.stage.destroy();
        this.stage = null;
    }

    clearUpdate(){
        this.legend && !this.ignoreLegend && this.legend.destroy();
    }


    
    //update( data, ignoreLegend, redraw = true ){

        //this.scene = new THREE.Scene();

        //this.camera = new THREE.PerspectiveCamera( 40, this.width / this.height, 1, 1000 );
        //this.camera.position.set( 0, 0, 20 )


        //let renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        ////let renderer = this.renderer = new THREE.SVGRenderer( );
        ////renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( this.width - 2, this.height - 2 );


        //var loader = new THREE.SVGLoader();

        //var options = {
            //depth: 1
            //, bevelThickness: 1
            //, bevelSize: .5
            //, bevelSegments: 1
            //, bevelEnabled: true
            //, curveSegments: 12
            //, steps: 1
        //};

        ////loader.load( './img/dount-in.svg', ( paths ) => {
        ////loader.load( './img/dount-big-all.svg', ( paths ) => {
        ////loader.load( './img/dount-mid.svg', ( paths ) => {
        ////loader.load( './img/tiger.svg', ( paths ) => {
            //var paths = loader.parse( data.background[0].url );
            //console.log( 'paths', paths );

            //var group = new THREE.Group();
            //group.scale.multiplyScalar( 0.1 );
            //group.scale.y *= -1;
            //for ( var i = 0; i < paths.length; i ++ ) {
                //var path = paths[ i ];
                //var material = new THREE.MeshBasicMaterial( {
                    //color: path.color,
                    //side: THREE.DoubleSide,
                    //depthWrite: false
                //} );
                //var shapes = path.toShapes( true );
                //for ( var j = 0; j < shapes.length; j ++ ) {
                    //var shape = shapes[ j ];
                    //var geometry = new THREE.ShapeBufferGeometry( shape );
                    ////var geometry = new THREE.ExtrudeGeometry( shape, options);
                    //var mesh = new THREE.Mesh( geometry, material );

                    ////viewbox 118, 117 - dount-in.svg
                    //mesh.position.x = -118/2;
                    //mesh.position.y = -117/2;

                    //[>
                    ////viewbox 250 248 - dount-big-all.svg
                    //mesh.position.x = -250/2;
                    //mesh.position.y = -248/2;
                    //*/

                    //[>
                    ////viewbox 107, 106 - dount-mid.svg
                    //mesh.position.x = -107/2;
                    //mesh.position.y = -106/2;
                    //*/

                    //[>
                    ////viewbox tiger.svg
                    //mesh.position.x = -46.5;
                    //mesh.position.y = -( 54.5 + 55 / 2 );
                    //*/

                    //group.add( mesh );
                //}
            //}
            //this.group = group;
            //this.scene.add( group );

            //console.log( 'group', this.group  );

            //this.render();
        ////} );


        //[>
        //var geometry = new THREE.SphereGeometry( 30, 32, 32 );
        //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        //material.wireframe = true;
        //this.sphere = new THREE.Mesh( geometry, material );
        //console.log( this.sphere, material, geometry );
        //this.scene.add( this.sphere );
        //*/

        //this.render();

        //this.box.appendChild( renderer.domElement );

        //this.animate();
    //}

    //animate() {

        //this.group && ( this.group.rotation.y += 0.03 );
        //this.sphere && ( this.sphere.rotation.y += 0.01 );

        //this.render();

        //requestAnimationFrame( ()=>{ this.animate() } );
    //}

    //render() {
        //this.renderer.render( this.scene, this.camera );
    /*}*/
}

