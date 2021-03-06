
import VisChartBase from 'vischartbase';
import * as geometry3d from '../../geometry/geometry3d.js';

const THREE = require( 'three' );

require( '../../common/SVGLoader.js' );

import ju from 'json-utilsx';

import TextTexture from 'three.texttexture';
import TextSprite from 'three.textsprite';

import {MeshLine, MeshLineMaterial} from 'three.meshline'

export default class ThreeBase extends VisChartBase {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );
        camera && ( this.camera = camera );

        this.textColor = 0xffffff;
        //this.lineColor = 0x596ea7;

        geometry3d.screenWidth = this.width;
        geometry3d.screenHeight = this.height;
        geometry3d.camera = this.camera;
    }
    /*
        let fontSize = geometry3d.to3d( 16 );
        this.createText(
            fontSize
            , {
                color: this.lineColor 
                , rotation: geometry.radians( 
                    val.angle + 90 + ( val.rotationOffset || 0 ) + 180
                )
            }
            , {
              text: val.text + '',
              fontFamily: 'MicrosoftYaHei, "Times New Roman", Times, serif',
              fontSize: fontSize * 2,
            }
            , ( sprite ) => {
                sprite.position.x = val.point.x
                sprite.position.y = val.point.y
            }
        );
    */
    createText( size = 44, textureParams = {}, params = {}, callback, parent ){
        let texture = new TextTexture( params );
        textureParams.map = texture;
        let material = new THREE.SpriteMaterial(
            textureParams
        );
        let sprite =new THREE.Sprite(material);
        sprite.scale.setX(texture.imageAspect).multiplyScalar(size);

        callback && callback( sprite, material, texture, textureParams, params );

        parent = parent || this.stage;

        parent.add( sprite  );
        this.addDestroy( sprite );

        return sprite;
    }

    setRedraw( val ){
        this.redraw = val;
        return this;
    }

    getBox( mesh ){
        let box = new THREE.Box3().setFromObject( mesh );
        /*
        let size = box.getSize( new THREE.Vector3 );
        return size;
        */
        return box;
    }

    getBoxSize( mesh ){
        return this.getBox( mesh ).getSize( new THREE.Vector3() );
    }

    getPosition( matrixWorld ){
        var position = new THREE.Vector3();
        return position.setFromMatrixPosition( matrixWorld );
    }


    _setSize( width, height ){
        super._setSize( width, height );

        this.totalAngle = -360;
        this.deep = 0;

        this.sizeRate = 1;
    }

    render() {
        this.renderer 
        && this.scene
        && this.camera
        && this.renderer.render( this.scene, this.camera );

        return this;
    }

    getWidth(){
        let r = this.width; 

        if( ju.jsonInData( this, 'config.cameraPosition.z' ) ){
            r = this.config.cameraPosition.z;
        }

        return r;
    }

    getHeight(){
        let r = this.height; 

        if( ju.jsonInData( this, 'config.cameraPosition.z' ) ){
            r = this.config.cameraPosition.z;
        }

        return r;
    }

    getDeepWidth(){
        let r = this.deep; 
        if( ju.jsonInData( this, 'config.cameraPosition.z' ) ){
            r = this.config.cameraPosition.z / this.width * this.config.cameraPosition.z;
        }
        return r;
    }


    loadImage(){
        if( this.images.length ) return;

        if( this.iconLayer ) this.iconLayer.remove();

        this.images = [];
        this._images = [];
        this.rotationBg = [];

        if( this.data && this.data.background && this.data.background.length ){

            this.data.background.map( ( val ) => {
                this.addImage( 
                    val.url
                    , val.width
                    , val.height
                    , val.offsetX || 0
                    , val.offsetY || 0 
                    , val.rotation || 0
                    , val.isbase64
                    , val
                );
            });
        }

        this.images.map( ( item, key ) => {
            item.opt = item.opt || {};
            if( item.opt.issvgstring ){
                if( !this.svgLoader() ) return;
                this.initSVGBackground( 
                    this.svgLoader().parse( item.url )
                    , item
                    , key 
                );
                return;
            }
        });
          
        return this;
    }

    svgLoader(){
        if( !this._svgloader && THREE.SVGLoader ){
            this._svgloader = new THREE.SVGLoader();
        }
        
        return this._svgloader;
    }

    initSVGBackground( paths, item, key ){
        if( !( paths && paths.length ) ) return;

        let group = new THREE.Group();
        group.scale.y *= -1;
        for ( let i = 0; i < paths.length; i ++ ) {
            let path = paths[ i ];
            let material = new THREE.MeshBasicMaterial( {
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false
            } );
            let shapes = path.toShapes( true );
            for ( let j = 0; j < shapes.length; j ++ ) {
                let shape = shapes[ j ];
                let geometry = new THREE.ShapeBufferGeometry( shape );
                let mesh = new THREE.Mesh( geometry, material );
                group.add( mesh );
                this.addDestroy( mesh );
            }
        }

        let box = new THREE.Box3().setFromObject( group );
        let size = box.getSize( new THREE.Vector3 );

        let x = -box.max.x / 2 - box.min.x / 2
            , y = -box.max.y / 2 - box.min.y / 2
            ;

        group.position.x = x;
        group.position.y = y;

        let pivot = new THREE.Object3D();
        pivot.add( group );
        this.addDestroy( group );

        var scale =  geometry3d.to3d( Math.max( item.width, item.height ) ) / Math.max( box.max.x, size.x );
        if( item.opt.scaleOffset ){
            scale += item.opt.scaleOffset;
        }

        pivot.scale.set( scale, scale, scale );

        pivot.position.y = this.fixCy();

        this.stage.add( pivot );
        this.addDestroy( pivot );

        let data = { ele: pivot, item: item  };

        this._images.push( data );

        item.rotation && this.rotationBg.push( data );

        this.render();
        this.animationBg();
    }

    animate() {
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;

        requestAnimationFrame( ()=>{ this.animate() } );
    }

    animationBg(){
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;
        //return;
        if( this._images && this._images.length ){
            this._images.map( ( item ) => {
                item.ele.rotation[ 
                    this.getRotationAttr( item ) 
                ] += this.getRotationStep( item );
            });
            this.render();
        };

        window.requestAnimationFrame( ()=>{ this.animationBg() } );
    }

    getRotationAttr( item ){
        let r = 'y';
        if( ju.jsonInData( item, 'item.opt.rotationAttr' ) ){
            r = item.item.opt.rotationAttr;
        }
        return r;
    }

    getRotationStep( item ){
        let r = 0.03;
        if( ju.jsonInData( item, 'item.opt.rotationStep' ) ){
            r = item.item.opt.rotationStep;
        }
        return r;
    }

    destroy(){
        this.setDestroy();

        this.destroyList.map( item => {
            this.dispose( item );
        });
    }

    parseColor( color ){
        if( color.toString().indexOf( '#' ) > -1 ){
            color = parseInt( color.replace( '#', ''), 16 );
        }

        return color;
    }
    fixCx(){
        let r = this.cx;
        return r;
    }

    fixCy(){
        let r = this.cy;

        if( this.legend ){
            switch( this.legend.direction() ){
                case 'bottom': {
                    r = ( this.height - this.legend.outerHeight() / 2 ) / 2 - 5;
                    break;
                }
            }
        }

        return geometry3d.to3d( this.cy - r );
    }

    fixWidth(){
        let r = this.width;
        return r;
    }

    fixHeight(){
        let r = this.height;
        return r;
    }

    dispose( item ){

        if( !item ) return this;

        if( item.children && item.children.length ){
            item.children.map( sitem => {
                this.dispose( sitem );
            });
        }

        try{ 
            item.geometry 
                && item.parent
                && item.geometry.dispose
                && item.geometry.dispose();

            item.material 
                && item.parent
                && item.material.dispose
                && item.material.dispose();

            item.texture 
                && item.parent
                && item.texture.dispose
                && item.texture.dispose();
        }catch( ex ){};

        item.parent 
            && item.parent.remove
            && item.parent.remove( item );

        return this;
    }

}
