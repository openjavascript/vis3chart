
const THREE = require( 'three' );

import VisChartBase from './base.js';
import * as geometry from '../../geometry/geometry.js';
import * as geometry3d from '../../geometry/geometry3d.js';

import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';

import TextTexture from 'three.texttexture';
import TextSprite from 'three.textsprite';


export default class Legend extends VisChartBase  {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );

        this.name = 'Legend ' + Date.now();

        this.textColor = 0x24a3ea;

        this.iconSpace = 5;

        this.text = [];
        this.icon = [];
        this.group = [];

        this.destroyList = [];
    }

    setStage( stage ){
        super.setStage( stage );

        /*
        this.layer = new Konva.Layer({
        });
        this.addDestroy( this.layer );

        stage.add( this.layer );
        */
    }

    init(){
        geometry3d.screenWidth = this.width;
        geometry3d.screenHeight = this.height;
        geometry3d.camera = this.camera;

        this.data.data.map( ( item, key ) => {
            var x = 0, y = 0
                , count = key + 1
                , curRow = Math.floor( key / this.column() )
                ;

            switch( this.direction() ){
                case 'bottom': {
                    x = this.space() + ( this.space() + this.columnWidth() ) * ( key % this.column() );
                    y = ( this.height ) - ( this.row() - curRow ) * ( this.spaceY() + this.rowHeight() );
                    break;
                }
            }

            let label = item.name || key + '';

            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( item, 'textStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = item.textStyle.color;
            }

            color = this.parseColor( color );

            if( !this.inited ){
                let pos = geometry3d.pos2dto3d( 
                    x, y
                );

                let group = new THREE.Group();
                    group.transparent = true;

                var bgGeometry = new THREE.PlaneBufferGeometry( 
                    geometry3d.to3d( this.columnWidth() )
                    , geometry3d.to3d( this.itemHeight() )
                    , 32 );
                var bgMaterial = new THREE.MeshBasicMaterial( {
                    color: this.parseColor( 0xffffff )
                    , side: THREE.DoubleSide
                    , opacity: 0
                    , transparent: true
                } );
                var bgPlane = new THREE.Mesh( bgGeometry, bgMaterial );
                bgPlane.position.x = pos.x + geometry3d.to3d( this.columnWidth() ) / 2;
                bgPlane.position.y = pos.y;
                group.add( bgPlane );

                var rectGeometry = new THREE.PlaneBufferGeometry( 
                    geometry3d.to3d( this.itemWidth() )
                    , geometry3d.to3d( this.itemHeight() )
                    , 32 );
                var rectMaterial = new THREE.MeshBasicMaterial( {
                    color: color
                    , side: THREE.DoubleSide
                    , transparent: true
                } );
                var rectPlane = new THREE.Mesh( rectGeometry, rectMaterial );
                rectPlane.position.x = pos.x;
                rectPlane.position.y = pos.y;
                group.add( rectPlane );

                let textTexture = new TextTexture({
                  text: label,
                  fontFamily: 'MicrosoftYaHei',
                  fontSize: 42,
                  fontStyle: 'normal',
                  transparent: true
                });
                let textMaterial = new THREE.SpriteMaterial({map: textTexture, color: this.parseColor( this.textColor ) });
                let textSprite = new THREE.Sprite(textMaterial);
                textSprite.scale.setX(textTexture.imageAspect).multiplyScalar(10);

                textSprite.position.x = pos.x + this.itemWidth() + geometry3d.to3d( this.iconSpace ) + textSprite.scale.x / 2 - 3;
                textSprite.position.y = pos.y;

                group.add( textSprite );

                this.scene.add( group );

                let data = {
                    ele: group
                    , item: item
                    , disabled: false
                    , rect: rectPlane
                    , bg: bgPlane
                    , text: textSprite
                };
                this.domEvents.addEventListener( group, 'click', ()=>{
                    data.disabled = !data.disabled;
                    if( data.disabled ){
                        //group.opacity( .6 );
                        rectMaterial.opacity = .6;
                        textMaterial.opacity = .6;
                    }else{
                        rectMaterial.opacity = 1;
                        textMaterial.opacity = 1;
                    }
                    this.onChange && this.onChange( data );
                });
            }else{
                /*
                let curgroup = this.group[key];

                curgroup.rect.x( x );
                curgroup.rect.y( y );
                curgroup.rect.width( this.itemWidth() );
                curgroup.rect.height( this.itemHeight() );

                curgroup.bg.x( x );
                curgroup.bg.y( y );
                curgroup.bg.width( this.itemWidth() );
                curgroup.bg.height( this.itemHeight() );

                curgroup.text.x( x + this.iconSpace + curgroup.rect.width( ) );
                curgroup.text.y( y );
                */
            }
        });
        //this.stage.add( this.layer );
        
        return this;
    }

    update( data ){
        this.data = data || {};
        if( !( this.data && this.data.data && this.data.data.length ) ) return;

        this.init();

        this.inited = 1;
    }

    outerHeight(){
        return this.rowHeight() * this.row() + this.spaceY() * ( this.row() - 1) ;
    }

    total(){
        let r = 0;

        return r;
    }

    itemWidth(){
        return ( this.data.itemWidth || 5 );
    }

    itemHeight(){
        return ( this.data.itemHeight || 5 );
    }

    columnWidth(){
        //return ( this.width - ( this.column() - 1 + 2 ) * this.space() ) / this.column();
        let width = this.width;
        return ( width - ( this.column() - 1 + 2 ) * this.space() ) / this.column();
    }

    column(){
        return this.data.column || 1;
    }

    space(){
        return this.data.space || 15;
    }

    spaceY(){
        return this.data.space || 5;
    }

    rowHeight(){
        return ( this.data.rowHeight || 20 );
    }

    row(){
        return Math.ceil( this.data.data.length /  this.column() );
    }

    direction(){
        let r = 'top';

        if( this.data.bottom ){
            r = 'bottom'
        }else if( this.data.left ){
            r = 'left';
        }else if( this.data.right ) {
            r  = 'right';
        }

        return r;
    }

    destroy(){
        super.destroy();
        //console.log( this.name, 'destroy' );

        this.group 
            && this.group.length 
            && this.group.map( item => {
                //if( !item.ele ) return;
                //item.ele.off( 'click' );
            });
    }

}
