
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

        this.name = 'Legend_' + Date.now();

        this.textColor = 0x24a3ea;

        this.iconSpace = 5;

        this.text = [];
        this.icon = [];
        this.group = [];

        this.destroyList = [];
    }

    setStage( stage ){
        super.setStage( stage );
    }

    resize( width, height, data = null, allData = null ){
        super.resize( width, height, data, allData );

        geometry3d.screenWidth = this.width;
        geometry3d.screenHeight = this.height;
    }

    init(){
        geometry3d.screenWidth = this.width;
        geometry3d.screenHeight = this.height;
        geometry3d.camera = this.camera;

        //console.log( 'text size', geometry3d.to3d( 20 ) );

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

            y += 4;

            let label = item.name || key + '';

            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( item, 'textStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = item.textStyle.color;
            }

            color = this.parseColor( color );
            let pos = geometry3d.pos2dto3d( 
                x, y
            );

            if( !this.inited ){

                //console.log( 'x', x, 'y', y, 'pos.x', pos.x, 'pos.y', pos.y );

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
                this.addDestroy( bgPlane );

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
                this.addDestroy( rectPlane );

                let fontSize = geometry3d.to3d( 22 );

                let textTexture = new TextTexture({
                  text: label,
                  fontFamily: 'MicrosoftYaHei',
                  fontSize: fontSize * 2,
                  fontStyle: 'normal',
                  transparent: true
                });
                let textMaterial = new THREE.SpriteMaterial({map: textTexture, color: this.parseColor( this.textColor ) });
                let textSprite = new THREE.Sprite(textMaterial);
                textSprite.scale.setX(textTexture.imageAspect).multiplyScalar(fontSize);

                textSprite.position.x = pos.x + this.itemWidth() + geometry3d.to3d( this.iconSpace ) + textSprite.scale.x / 2 - 3;
                textSprite.position.y = pos.y;

                group.add( textSprite );
                this.addDestroy( textSprite );

                this.scene.add( group );
                this.addDestroy( group );

                let data = {
                    ele: group
                    , item: item
                    , disabled: false
                    , rect: rectPlane
                    , bg: bgPlane
                    , text: textSprite
                    , imageAspect: textTexture.imageAspect
                };
                this.group.push( data );
                this.domEvents.bind( group, 'click', ()=>{
                    data.disabled = !data.disabled;
                    if( data.disabled ){
                        //group.opacity( .6 );
                        data.rect.material.opacity = .6;
                        data.text.material.opacity = .6;
                    }else{
                        data.rect.material.opacity = 1;
                        data.text.material.opacity = 1;
                    }
                    this.onChange && this.onChange( data );
                });
            }else{
                let item = this.group[ key ];

                let bgPlane = item.bg
                    , rectPlane = item.rect
                    , group = item.ele
                    , textSprite = item.text
                    ;


                bgPlane.position.x = pos.x + geometry3d.to3d( this.columnWidth() ) / 2;
                bgPlane.position.y = pos.y;

                var rectGeometry = new THREE.PlaneBufferGeometry( 
                    geometry3d.to3d( this.itemWidth() )
                    , geometry3d.to3d( this.itemHeight() )
                    , 32 );
                rectPlane.geometry = rectGeometry;
                rectPlane.needsUpdate = true;

                rectPlane.position.x = pos.x;
                rectPlane.position.y = pos.y;


                item.text.parent.remove( item.text );
                let fontSize = geometry3d.to3d( 22 );
                let textTexture = new TextTexture({
                  text: label,
                  fontFamily: 'MicrosoftYaHei',
                  fontSize: fontSize * 5,
                  fontStyle: 'normal',
                  transparent: true
                });
                let textMaterial = new THREE.SpriteMaterial({map: textTexture, color: this.parseColor( this.textColor ) });
                textSprite = new THREE.Sprite(textMaterial);
                item.text = textSprite;
                textSprite.scale.setX(textTexture.imageAspect).multiplyScalar(fontSize);
                textSprite.position.x = pos.x + this.itemWidth() + geometry3d.to3d( this.iconSpace ) + textSprite.scale.x / 2 - 3;
                textSprite.position.y = pos.y;

                if( item.disabled ){
                    //group.opacity( .6 );
                    textMaterial.opacity = .6;
                }else{
                    textMaterial.opacity = 1;
                }

                group.add( textSprite );
                this.addDestroy( textSprite );

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
        //console.log( this.name, 'destroy', this.group.length );

        this.group 
            && this.group.length 
            && this.group.map( item => {
                //if( !item.ele ) return;
                //item.ele.off( 'click' );
                //item.ele.removeEventListener('click');
                this.domEvents.unbind( item.ele, 'click' );
                //console.log( 'remove event', Date.now() );
            });
    }

}
