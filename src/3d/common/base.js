
import VisChartBase from '../../common/vischartbase.js';

const THREE = require( 'three' );

import ju from 'json-utilsx';

export default class ThreeBase extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

    }

    _setSize( width, height ){
        super._setSize( width, height );
        this.totalAngle = -360;
    }

    render() {
        this.renderer 
        && this.scene
        && this.camera
        && this.renderer.render( this.scene, this.camera );

        return this;
    }


    loadImage(){
        if( this.images.length ) return;

        if( this.iconLayer ) this.iconLayer.remove();
        this.iconLayer = new Konva.Layer();
        this.addDestroy( this.iconLayer );
        

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

        var scale = item.opt.scale || 1;

        pivot.scale.set( scale, scale, scale );


        this.addDestroy( pivot );

        this.scene.add( pivot );

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
            if( item ){
                /*
                item.remove();
                item.destroy();
                */
            }
        });
    }

    parseColor( color ){
        if( color.toString().indexOf( '#' ) > -1 ){
            color = parseInt( color.replace( '#', ''), 16 );
        }

        return color;
    }

}
