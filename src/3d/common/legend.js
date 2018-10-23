import VisChartBase from './base.js';
import * as geometry from '../../geometry/geometry.js';

import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';

const THREE = require( 'three' );

export default class Legend extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

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

        this.data.data.map( ( item, key ) => {
            var x = 0, y = 0
                , count = key + 1
                , curRow = Math.floor( key / this.column() )
                ;

            switch( this.direction() ){
                case 'bottom': {
                    x = this.space() + ( this.space() + this.columnWidth() ) * ( key % this.column() ) ;
                    y = this.height - ( this.row() - curRow ) * ( this.spaceY() + this.rowHeight() );
                    //console.log( x, y, key, this.direction(), curRow );
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

            console.log( key, x, y );

            let group = new THREE.Group();

            var geometryx = new THREE.CircleGeometry( 5, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
            var circle = new THREE.Mesh( geometryx, material );
            circle.position.x = x;
            //circle.position.y = y;
            group.add( circle );

/*
                let rect = new Konva.Rect( {
                    x: x
                    , y: y
                    , width: this.itemWidth()
                    , height: this.itemHeight()
                    , fill: color
                });
                this.addDestroy( rect  );

                let bg = new Konva.Rect( {
                    x: x
                    , y: y
                    , width: this.columnWidth()
                    , height: this.rowHeight()
                    , fill: '#ffffff00'
                });
                this.addDestroy( bg );

                let text = new Konva.Text( {
                    text: label
                    , x: x + this.iconSpace + rect.width()
                    , y: y
                    , fill: this.textColor
                    , fontFamily: 'MicrosoftYaHei'
                    , fontSize: 12
                });
                this.addDestroy( text );

                let group  = new Konva.Group();
                this.addDestroy( group );
                group.add( bg );
                group.add( rect );
                group.add( text );

                let data = {
                    ele: group
                    , item: item
                    , disabled: false
                    , rect: rect
                    , bg: bg
                    , text: text
                };

                this.group.push( data );
                group.on( 'click', ()=>{
                    //console.log( 'click', key, data, group, item );
                    data.disabled = !data.disabled;

                    if( data.disabled ){
                        group.opacity( .6 );
                    }else{
                        group.opacity( 1 );
                    }

                    this.stage.add( this.layer );

                    this.onChange && this.onChange( this.group );
                });

                this.layer.add( group );
*/
                this.scene.add( group );

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

        /*
        console.log( 
            this.column()
            , this.row()
            , this.direction() 
            , this.outerHeight()
            , 'columnWidth:', this.columnWidth()
        );
        console.log( this.width, this.width - ( this.column() - 1  + 2 ) * this.space() );
        */

        this.init();

        this.inited = 1;
    }

    outerHeight(){
        return this.rowHeight() * this.row() + this.space();
    }

    total(){
        let r = 0;

        return r;
    }

    itemWidth(){
        return this.data.itemWidth || 5;
    }

    itemHeight(){
        return this.data.itemHeight || 5;
    }

    columnWidth(){
        //return ( this.width - ( this.column() - 1 + 2 ) * this.space() ) / this.column();
        return ( 350 / 2 - ( this.column() - 1 + 2 ) * this.space() ) / this.column();
    }

    column(){
        return this.data.column || 1;
    }

    space(){
        return this.data.space || 15;
    }

    spaceY(){
        return this.data.space || 0;
    }

    rowHeight(){
        return this.data.rowHeight || 22;
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
