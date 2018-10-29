
import VisChartBase from '../common/base.js';
import * as geometry from '../../geometry/geometry.js';
import * as geometry3d from '../../geometry/geometry3d.js';

import PointAt from '../common/pointat.js';

import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';

const THREE = require( 'three' );

import TextTexture from 'three.texttexture';
import TextSprite from 'three.textsprite';

import {MeshLine, MeshLineMaterial} from 'three.meshline'


export default class Dount extends VisChartBase  {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );
        this.name = 'Dount_' + Date.now();

        this._setSize( width, height );
    }

    _setSize( width, height ){
        super._setSize( width, height );

        this.outPercent = .53;
        this.inPercent = .37;

        this.circleLinePercent = .34;
        this.circlePercent = .31;
        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.animationStep = 8;
        this.angleStep = 5;

        this.textHeight = 26;
        this.lineOffset = 50;

        this.path = [];
        this.line = [];

        this.textOffset = 4;

        this.lineColor = 0x24a3ea;

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
        };

        this.lineWidth = 32;
        this.lineSpace = 10;
        this.lineAngle = 35;
        this.lineHeight = 15;
        this.lineCurveLength = 30;

        this.loopSort = [ 4, 8, 1, 2 ];

        this.clearList = [];

        this.outRadius = 73
        this.inRadius = 53;

        this.lineLength = 25;
        this.lineLengthCount = 1;
        this.lineLengthStep = .5;

        this.lineLeft = this.fixCx() - this.outRadius - this.lineSpace;
        this.lineRight = this.fixCx() + this.outRadius + this.lineSpace;

        this.init();
    }

    init(){
        geometry3d.screenWidth = this.width;
        geometry3d.screenHeight = this.height;
        geometry3d.camera = this.camera;

        this.calcLayoutPosition();
        return this;
    }

    update( data, allData ){
        super.update( data, allData );
        //console.log( THREE );

        this.data = data;
        this.allData = allData;

        this.countAngle = 0;
        this.isDone = 0;
        this.lineLengthCount = 0;

        if( !ju.jsonInData( this.data, 'data' ) ) return;

        this.clearItems();
        this.calcVal();
        this.initText();
        this.calcDataPosition();
        this.initDataLayout();

        //console.log( 'dount update', this.data, this, utils );

        this.animation();
        !this.inited && this.animationCircleLine();

        this.inited = 1;

        return this;
    }

    reset(){
        this.path.map( ( val ) => {
            val.pathData = [];
        });
    }

    animationCircleLine(){
        if( this.isDestroy ) return;
        if( !this.circleLine ) return;

        if( !this.isAnimation() ){
            return;
        }

        this.circleLine.rotation.z -= .03;

        window.requestAnimationFrame( ()=>{ this.animationCircleLine() } );
    }

    animation(){

        if( this.isDestroy ) return;
        if( this.isDone ) return;

        let tmp, tmppoint, step = this.angleStep;

        this.countAngle -= this.animationStep;

        if( !this.isSeriesAnimation() ){
            this.countAngle = this.totalAngle;
        }

        if( this.countAngle <= this.totalAngle || !this.isAnimation() ){
            this.countAngle = this.totalAngle;
            this.isDone = 1;
        }

        this.reset();

        for( let i = this.path.length - 1; i >= 0; i-- ){
        //for( let i = 0; i < this.path.length; i++ ){
            //let i = 2;
            let item = this.path[ i ];

            let tmpAngle = this.countAngle;

            if( tmpAngle <= item.itemData.endAngle ){
                tmpAngle = item.itemData.endAngle;
            }

            if( tmpAngle > item.itemData.startAngle ) continue;

            let geometryx = new THREE.RingGeometry( 
                this.inRadius
                , this.outRadius
                , 256 
                , 1
                , geometry.radians( 0 )
                , geometry.radians( tmpAngle )
            );

            item.arc.geometry.dispose();
            item.arc.geometry = geometryx;
        }

        window.requestAnimationFrame( ()=>{ this.animation() } );

        if( this.isDone ){
            window.requestAnimationFrame( ()=>{ this.animationLine() } );
        }
    }

    drawCircle(){
        this.circleRadius = geometry3d.to3d( Math.ceil( this.circlePercent * this.min / 2 ) );
        //console.log( this.circleRadius );

        var line = new MeshLine();

        var curve = new THREE.EllipseCurve(
            0,  this.fixCy(),            // ax, aY
            this.circleRadius,
            this.circleRadius,
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        var points = curve.getPoints( 200 );
        var geometryy = new THREE.Geometry().setFromPoints( points );

        curve = new THREE.EllipseCurve(
            0,  this.fixCy(),            // ax, aY
            this.circleRadius,
            this.circleRadius,
            0,  geometry.radians( 10 ),  // aStartAngle, aEndAngle
            false,            // aClockwise
            geometry.radians( .5 )                 // aRotation
        );

        points = [ ...points, ...curve.getPoints(  50 ) ] ;

        geometryy = new THREE.Geometry().setFromPoints( points );

        line.setGeometry( geometryy );
        var material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 2
        } );

        var circle = new THREE.Mesh( line.geometry, material );

        circle.renderOrder = -1;
        circle.material.depthTest=false;

        this.scene.add( circle );
        this.addDestroy( circle );

    }

    drawCircleLine(){
        this.circleLineRadius = geometry3d.to3d( Math.ceil( this.circleLinePercent * this.min / 2 ) ); 

        let material,  geometryItem, circle, group, line;

        group = new THREE.Group();

        line = new MeshLine();
        material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 2
        } );
        geometryItem = new THREE.CircleGeometry(  
            this.circleLineRadius
            , 128
            , geometry.radians( 90 )
            , geometry.radians( 90 )
        );
        geometryItem.vertices.shift();
        line.setGeometry( geometryItem );
        circle = new THREE.Line( line.geometry, material );
        circle.renderOrder = -1;
        circle.material.depthTest=false;
        group.add( circle );

        line = new MeshLine();
        material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 2
        } );
        geometryItem = new THREE.CircleGeometry(  
            this.circleLineRadius
            , 128
            , geometry.radians( 0 )
            , geometry.radians( -90  )
        );
        geometryItem.vertices.shift();
        line.setGeometry( geometryItem );
        circle = new THREE.Line( line.geometry, material );
        circle.renderOrder = -1;
        circle.material.depthTest=false;

        group.position.y = this.fixCy();

        group.add( circle );

        this.circleLine = group;

        this.scene.add( group );
        this.addDestroy( group );
    }

    initDataLayout(){

        this.drawCircle();
        this.drawCircleLine();

        this.path = [];
        this.line = [];

        for( let ii = this.data.data.length - 1; ii >= 0; ii-- ){
            let val = this.data.data[ii], key = ii;
            let pathindex = this.data.data.length - 1 - ii;

            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( val, 'itemStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = val.itemStyle.color;
            }
            color = this.parseColor( color );

            let line, material, geometryx, mesh, arc, tmp; 

            line = new MeshLine();
            material = new MeshLineMaterial({
                color: new THREE.Color( 0xffffff )
                , lineWidth: 2
            });
            geometryx = new THREE.Geometry();
            line.setGeometry( geometryx );
            mesh = new THREE.Mesh( line.geometry, material );
            mesh.position.y = this.fixCy();

            this.scene.add( mesh );
            this.line.push( mesh );
            this.addDestroy( mesh );

            geometryx = new THREE.RingGeometry( 
                this.inRadius
                , this.outRadius
                , 256 
                , 1
                , geometry.radians( 0 )
                , geometry.radians( -0.1 )
            );
            material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
            arc = new THREE.Mesh( geometryx, material );
            arc.renderOrder = 1;

            arc.position.y = this.fixCy();

            this.scene.add( arc );
            this.addDestroy( arc );

            tmp = { 
                arc: arc 
                , pathData: [] 
                , itemData: val
                , line: mesh
                , mline: line
                , realIndex: ii
            };

            this.path.push( tmp );
        };

        return this;
    }
    animationLine(){

        if( this.lineLengthCount >= this.lineLength ){
            return;
        }
        this.lineLengthCount = this.lineLength;

        this.lineLengthCount += this.lineLengthStep;

        if( this.lineLengthCount >= this.lineLength || !this.isAnimation()  ){
            this.lineLengthCount = this.lineLength;
        }
        for( let i = 0; i < this.path.length; i++ ){
            let path = this.path[i];
            let layer = this.arcLayer;

            let lineEnd = path.itemData.lineEnd;
            let lineExpend = path.itemData.lineExpend;

            let line = this.line[ i ];

            var meshline = new MeshLine();
            let geometryx = new THREE.Geometry();
                geometryx.vertices.push( 
                    new THREE.Vector3( path.itemData.lineStart.x, path.itemData.lineStart.y, 0)
                    , new THREE.Vector3( lineEnd.x, lineEnd.y, 0)
                    , new THREE.Vector3( lineExpend.x,lineExpend.y, 0)
                );
                meshline.setGeometry( geometryx );
                line.geometry = meshline.geometry;

            if( this.lineLengthCount >= this.lineLength ){
                this.addIcon( path, layer, path.realIndex );
                this.addText( path, layer, path.realIndex );
            }else{
                window.requestAnimationFrame( ()=>{ this.animationLine() } );
            }
        }
    }

    addIcon( path, layer, key ){
        if( !path.lineicon ){
            var geometry = new THREE.CircleGeometry( 3, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            var circle = new THREE.Mesh( geometry, material );
            path.lineicon = circle;
            this.scene.add( circle );
            this.addDestroy( circle );
        }

        path.lineicon.position.x = path.itemData.lineExpend.x;
        path.lineicon.position.y = path.itemData.lineExpend.y + this.fixCy();
    }

    addText( path, layer, key ){
        if( !path.text ){
            path.text = this.textar[ key ];
            this.scene.add(path.text);
            this.addDestroy( path.text  );
        }

        let text = path.text;

        let textPoint = path.itemData.textPoint
            , angleDirect = path.itemData.pointDirection.autoAngle()
            ;

        textPoint = ju.clone( path.itemData.lineEnd );

        let textX =  textPoint.x
            , textY =  textPoint.y + this.fixCy()
            , direct = path.itemData.pointDirection.auto()
            ;
        text.position.x = textX;
        text.position.y = textY;


        var position = new THREE.Vector3();
        position.setFromMatrixPosition( text.matrixWorld );

        text.position.y = textY + text.scale.y / 2 - geometry3d.to3d( 3 );

        switch( angleDirect ){
            case 8:
            case 1: {
                text.position.x = textX - text.scale.x / 2 + 2;
                break;
            }
            default: {
                text.position.x = textX + text.scale.x / 2 - 2;
                break;
            }
        }
    }

    calcLayoutPosition() {
        this.inRadius = geometry3d.to3d( Math.ceil( this.inPercent * this.min / 2 ) );
        this.outRadius =  geometry3d.to3d( Math.ceil( this.outPercent * this.min / 2 ) );

        this.lineHeight = geometry3d.to3d( 24 );
        this.lineWidth = geometry3d.to3d( 50 );
        this.lineLength = geometry3d.to3d( 22 );

        return this;
    }

    destroy(){
        this.clearItems();
        super.destroy();
    }

    clearItems(){
        this.clearList.map( ( item, key ) => {
            this.dispose( item );
        });
        this.clearList = [];
    }

    initText(){
        this.textar = [];

        this.realLineWidth = this.lineWidth;

        this.data.data.map( ( val, key ) => {

            let fontSize = geometry3d.to3d( 25 );
            let texture = new TextTexture({
              text: `${val.percent}%`,
              fontFamily: 'MicrosoftYaHei',
              //fontSize: fontSize * 2,
              fontSize: fontSize * 2,
              fontStyle: 'italic',
            });
            let material = new THREE.SpriteMaterial({map: texture, color: this.lineColor });
            let sprite =new THREE.Sprite(material);
            sprite.scale.setX(texture.imageAspect).multiplyScalar(fontSize);
            this.clearList.push( sprite );
            this.textar.push( sprite );
        });
    }

    calcVal(){
        if( !this.data ) return;

        let total = 0, tmp = 0;

        this.data.data.map( ( val ) => {
            //console.log( val );
            total += val.value;
        });
        this.total = total;

        this.data.data.map( ( val ) => {
            val._percent =  utils.parseFinance( val.value / total, 8 );
            tmp = utils.parseFinance( tmp + val._percent );
            val._totalPercent = tmp;

            val.percent = parseInt( val._percent * 100 * this.getPrecision( val ) ) / this.getPrecision( val );

            val.endAngle = this.totalAngle * val._totalPercent;
        });

        //修正浮点数精确度
        if( this.data.data.length ){
            let item = this.data.data[ this.data.data.length - 1];
            tmp = tmp - item._percent;

            item._percent = 1 - tmp;
            item.percent = parseInt( item._percent * 100 * this.getPrecision( item ) ) / this.getPrecision( item );
            item._totalPercent = 1;
            item.endAngle = this.totalAngle;
        }

    }


    calcDataPosition() {
        if( !this.data ) return;

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
        }
        //计算开始角度, 计算指示线的2端
        this.data.data.map( ( val, key ) => {
            if( !key ) {
                val.startAngle = 0;
            }else{
                val.startAngle = this.data.data[ key - 1].endAngle;
            }

            //this.lineWidth = geometry3d.to3d( 80 );

            let text = this.textar[ key ];
            let textWidth = this.lineWidth;

            if( text.scale.x >= textWidth ){
                textWidth = text.scale.x;
            }

            val.midAngle = val.startAngle + ( val.endAngle - val.startAngle ) / 2;

            val.lineStart = geometry.distanceAngleToPoint( this.outRadius - 2, val.midAngle );
            val.lineEnd = geometry.distanceAngleToPoint( this.outRadius + this.lineLength, val.midAngle );

            val.textPoint = geometry.distanceAngleToPoint( this.outRadius + this.lineLength, val.midAngle );

            val.pointDirection = new PointAt( this.fixWidth(), this.fixHeight(), geometry.pointPlus( val.textPoint, this.cpoint) );
            let lineAngle = val.pointDirection.autoAngle();
            val.lineExpend = ju.clone( val.lineEnd )

            //console.log( 'lineAngle', lineAngle,  val.midAngle );

            switch( lineAngle ){
                case 1:
                case 8: {
                    //val.lineEnd.x = this.lineLeft;
                    val.lineEnd.x = -( this.outRadius + this.lineSpace );

                    let tmp = geometry.pointDistance( val.lineStart, val.lineEnd );
                    if( tmp > this.lineCurveLength ){
                        let tmpAngle = geometry.pointAngle( val.lineStart, val.lineEnd )
                            , tmpPoint = geometry.distanceAngleToPoint( this.lineCurveLength, tmpAngle )
                            ;
                            tmpPoint = geometry.pointPlus( tmpPoint, val.lineStart );

                        val.lineEnd.x = tmpPoint.x;
                    }

                    val.lineExpend.x = val.lineEnd.x - textWidth;

                    break;
                }
                default: {
                    val.lineEnd.x = this.outRadius + this.lineSpace;
                    let tmp = geometry.pointDistance( val.lineStart, val.lineEnd );
                    if( tmp > this.lineCurveLength ){
                        let tmpAngle = geometry.pointAngle( val.lineStart, val.lineEnd )
                            , tmpPoint = geometry.distanceAngleToPoint( this.lineCurveLength, tmpAngle )
                            ;
                            tmpPoint = geometry.pointPlus( tmpPoint, val.lineStart );

                        val.lineEnd.x = tmpPoint.x;
                    }

                    val.lineExpend.x = val.lineEnd.x + textWidth;
                    break;
                }
            }

            this.lineRange[ lineAngle ].push( val );
        })

        this.loopSort.map( key => {
            let item = this.lineRange[ key ];
            if( !( item && item.length && item.length > 1 ) ) return;
            let needFix;
            for( let i = 1; i < item.length; i++ ){
                let pre = item[ i - 1], cur = item[ i ];
                if( Math.abs( cur.lineEnd.y - pre.lineEnd.y ) < this.lineHeight ){
                    needFix = 1;
                    break;
                }
            }
            switch( key ){
                case 4: {
                    let tmpY = 0;
                    for( let i = item.length - 2; i >= 0 ; i-- ){
                        let pre = item[ i + 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight || cur.lineEnd.y <= pre.lineEnd.y ){
                            tmpY = pre.lineEnd.y + this.lineHeight;
                            cur.lineEnd.y = tmpY;
                            cur.lineExpend.y = tmpY;
                        }
                    }
                    break;
                }

                case 1: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = item.length - 2; i >= 0; i-- ){
                        let pre = item[ i + 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight || cur.lineEnd.y >= pre.lineEnd.y ){
                            tmpY = pre.lineEnd.y - this.lineHeight;
                            cur.lineEnd.y = tmpY;
                            cur.lineExpend.y = tmpY;
                        }
                    }
                    break;
                }
                case 2: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = 1; i < item.length; i++ ){
                        let pre = item[ i - 1], cur = item[ i ], zero = item[0];

                        if( Math.abs( pre.lineEnd.y + this.fixCy() ) < this.lineHeight ){
                            pre.lineExpend.y = pre.lineEnd.y =  pre.lineExpend.y + this.lineHeight;
                        }
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight   || cur.lineEnd.y >= pre.lineEnd.y  ){

                            tmpY = pre.lineEnd.y - this.lineHeight;
                            cur.lineEnd.y = tmpY;
                            cur.lineExpend.y = tmpY;
                        }
                    }

                    break;
                }

                case 8: {
                    let tmpY = 0;
                    for( let i = 1; i < item.length ; i++ ){
                        let pre = item[ i - 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight  || cur.lineEnd.y <= pre.lineEnd.y ){
                            tmpY = pre.lineEnd.y + this.lineHeight;
                            cur.lineEnd.y = tmpY;
                            cur.lineExpend.y = cur.lineEnd.y;
                        }
                    }

                    break;
                }
            }
        });
    }


}
