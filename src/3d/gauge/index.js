
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


import RoundStateText from '../icon/roundstatetext.js';

export default class Gauge extends VisChartBase  {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );

        this.cx = 0;
        this.cy = 0;
        this.cpoint = { x: 0, y: 0 };

        this.name = 'Gauge' + Date.now();

        this.clearTextList = [];
    }

    _setSize( width, height ){
        super._setSize( width, height );

        this.totalPostfix = '次/时';

        this.offsetCy = 35;

        this.curRate = 0;
        this.totalNum = 0;
        this.totalNumStep = 5;

        this.animationStep = 30 * 1;

        this.roundRadiusPercent = .070;

        this.lineColor = 0x596ea7;

        this.circleLinePercent = .22;
        this.circlePercent = .24;

        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.arcLinePercent = .34 / 2;

        this.arcOutPercent = .33 / 2;
        this.arcInPercent = .255 / 2;

        this.arcLabelLength = 6;
        this.arcTextLength = 15;

        this.arcAngleOffset = -50;
        this.arcAngle = 280;
        this.part = 22;
        this.arcTotal = 1100;

        this.textOffset = 0;

        this.arcOffset = this.arcAngleOffset;
        this.arcOffsetPad = -5;
        this.partLabel = this.part / 2;
        this.partAngle = ( this.arcAngle ) / this.part;
        this.partNum = this.arcTotal / this.part;

        this.startAngle = this.arcAngle + this.arcAngleOffset + this.arcOffsetPad;

        this.textOffsetX = -1;
        this.textOffsetY = -8;
        this.textLineLength = 6;

        this.textRectWidthPercent = .5;
        this.textRectHeightPercent = .11;

        this.textRoundPercent = .33;
        this.textRoundOffsetAngle = 160;
        this.textRoundPlusAngle = 110;
        this.textRoundMaxAngle = this.textRoundOffsetAngle + this.textRoundPlusAngle * 2;
        this.roundStatusRaidus = 30;
        this.textRoundAngle = [ 
            {
                angle: this.textRoundOffsetAngle
                , text: '低'
                , point: {}
                , min: 0
                , max: 100
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            } 
            ,{ 
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle
                , text: '中'
                , point: {}
                , min: 101
                , max: 500
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            }
            , {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle * 2
                , text: '高'
                , point: {}
                , min: 501
                , max: Math.pow( 10, 10 )
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            }
        ];

        this.init();
    }

    getAttackRateAngle(){
        let r = 0;

        r = this.arcOffset + ( this.arcAngle ) * this.getAttackRatePercent();

        return r;
    }

    getAttackRatePercent(){
        let r = 0, tmp;
        if( this.curRate ){
            tmp = this.curRate;
            if( tmp > this.arcTotal ){
                tmp = this.arcTotal;
            }
            
            r = tmp / this.arcTotal;
        }
        return r;
    }

    getAttackText(){
        let text = '低';

        if( this.curRate ){
            this.textRoundAngle.map( ( val ) => {
                if( this.curRate >= val.min && this.curRate <= val.max ){
                    text = val.text;
                }
            });
        }

        return `${text}频\n攻击`;
    }

    init(){
        this.textRoundRadius = this.width * this.textRoundPercent * this.sizeRate;

        this.roundRadius = this.width * this.roundRadiusPercent * this.sizeRate;

        this.arcInRadius = geometry3d.to3d( this.width * this.arcInPercent * this.sizeRate );
        this.arcOutRadius = geometry3d.to3d( this.width * this.arcOutPercent * this.sizeRate );

        this.arcLineRaidus = geometry3d.to3d( Math.ceil( this.arcLinePercent * this.max ) * this.sizeRate );
        this.arcTextLength = geometry3d.to3d( this.arcTextLength );

        this.textWidth = this.textRectWidthPercent * this.width ;
        this.textHeight = 38 * this.sizeRate;
        this.textX = this.cx - this.textWidth / 2; 
        this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;


        this.textRoundAngle.map( ( val, key ) => {
            let point = geometry.distanceAngleToPoint( geometry3d.to3d( this.textRoundRadius ), -val.angle )
            val.point = point;
        });

        this.arcPartLineAr = [];
        this.arcOutlinePartAr = [];
        this.textAr = [];

        for( let i = 0; i <= this.part; i++ ){
            let start, end, angle;
            angle = (this.part - i) * this.partAngle + this.arcOffset;

            if( true ){
                start = geometry.distanceAngleToPoint( this.arcInRadius, angle );
                end = geometry.distanceAngleToPoint( this.arcOutRadius, angle );
                this.arcPartLineAr.push( {start: start, end: end } );
            }

            start = geometry.distanceAngleToPoint( this.arcLineRaidus, angle );
            end = geometry.distanceAngleToPoint( this.arcLineRaidus + this.arcLabelLength, angle );

            this.arcOutlinePartAr.push( { start: start, end: end } );
            
            if( !(i * this.partNum % 100) || i === 0 ){
                let angleOffset = 8, lengthOffset = 0, rotationOffset = 0;

                if( i === 0 ){
                    angleOffset = 1;
                }
                if( i ){
                    angleOffset = 0;
                }

                if( i >= 19 ){
                    //angleOffset = 14;
                    rotationOffset = -2;
                    angleOffset = -2;
                }
                if( i >= 21 ){
                    //angleOffset = 18;
                    angleOffset = -5;
                }
                let text = {
                    text: i * this.partNum
                    , angle: angle - angleOffset
                    , point: geometry.distanceAngleToPoint( this.arcLineRaidus + this.arcTextLength + lengthOffset, angle - angleOffset )
                    , rotationOffset: rotationOffset
                };
                text.textPoint = new PointAt( this.width, this.height, geometry.pointPlus( text.point, this.cpoint) );

                this.textAr.push( text );
            }

        }
    }

    initRoundText(){
        this.textRoundAngle.map( ( val ) => {

            if( !val.ins ){
                val.ins = new RoundStateText( this.box, this.width, this.height, this.camera );
                val.ins.setOptions( Object.assign( val, {
                    stage: this.stage
                    , scene: this.scene
                    , data: this.data
                    , allData: this.allData
                    , lineColor: this.lineColor
                }) );
                val.ins.init();
            }
            val.ins.update( this.curRate );

        });
    }
    /*
{
    "series": [
        {
            "type": "gauge",
            "data": [
                {
                    "value": 200,
                    "total": 134567,
                    "name": "完成率"
                }
            ]
        }
    ]
}
    */
    setOptions( json ){
        if( json.stage ){
            let group = new THREE.Group();
            json.stage.add( group );
            this.addDestroy( group );

            json.stage = group;

            json.stage.position.y += -geometry3d.to3d( 20 );
        }
        super.setOptions( json );

    }

    clearText() {
        //console.log( 'clearText', this.clearTextList );

        this.clearTextList.map( ( item, key ) => {
            this.dispose( item );
        });

        this.clearTextList = [];
    }
    
    update( data, allData ){
        super.update( data, allData );

        this.clearText();

        if( (data && data.data && data.data.length) ){
            data.data.map( val => {
                this.curRate = val.value;
                this.totalNum = val.total
            });
        }else{
            this.curRate = 0;
            this.totalNum = 0;
        }

        this.initDataLayout();

        this.angle = this.arcOffset + this.arcOffsetPad;
        this.animationAngle =  this.getAttackRateAngle() + this.arcOffsetPad;

        this.updateArrow();

        if( this.curRate ){
            this.rateStep = Math.floor( this.curRate / ( this.animationStep * 2 ) )
            this.angleStep = Math.abs( this.animationAngle ) /  this.animationStep;
        }

        !this.isRunAnimation && this.animation(); 

        if( parseInt( this.totalNum ) ){
            this.totalNumStep = Math.floor( this.totalNum / this.animationStep );
            this.totalNumStep < 1 && ( this.totalNumStep = 1 );
            this.totalNumCount = 0;
            this.animationText();
        }else{
        }

        !this.inited && this.animationCircleLine();

        this.inited = 1;
    }
    resize( width, height, data = null, allData = null ){
        super.resize( width, height, data, allData );
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

    animationText(){
        if( this.isDestroy ) return;

        if( this.totalNumCount >= this.totalNum ) {
            return;
        }
        this.totalNumCount += this.totalNumStep;

        if( this.totalNumCount >= this.totalNum || !this.isAnimation() ) {
            this.totalNumCount = this.totalNum;
        };

        this.totalTextTexture.text = this.totalNumCount + '';
        this.totalTextTexture.redraw();

        window.requestAnimationFrame( ()=>{ this.animationText() } );
    }

    drawText(){

        if( this.totalTextGroup ){
            this.dispose( this.totalTextGroup );
        }

        this.totalTextGroup = new THREE.Group();
        this.stage.add( this.totalTextGroup );
        this.addDestroy( this.totalTextGroup );

        let fontSize = geometry3d.to3d( 36 );
        let fontSize1 = geometry3d.to3d( 36 );
        let labelFontSize = geometry3d.to3d( 22 );
        let params = {
                text: 0 + ''
                , fontFamily: '"Agency FB",MicrosoftYaHei'
                , fontSize: fontSize * 2
                , fontStyle: 'italic'
                , letterSpacing: 1.5
                //, fontWeight: 'bold'
            }
            , colorParams = { 
                color: this.textColor
            }
            , tmpParams = ju.clone( params )
            , labelParams = ju.clone( params )
            ;

        params.text = this.totalNum + '';
        tmpParams.text = this.totalNum + '';

        labelParams = Object.assign( labelParams, {
            fontSize: labelFontSize
            , fontFamily: 'MicrosoftYaHei'
            , text: this.totalPostfix
            , fontWeight: 'normal'
        });

        this.tmpTotalText = this.createText(
            fontSize
            , colorParams
            , tmpParams
            , ( sprite ) => {
                sprite.position.x = Math.pow( 10, 10 );
            }
            , this.totalTextGroup
        );
        this.tmpTotalText.matrixWorldNeedsUpdate = true;

        this.render();

        this.totalTextPostfix = this.createText(
            labelFontSize
            , colorParams
            , labelParams
            , ( sprite ) => {
                sprite.position.x = this.tmpTotalText.scale.x / 2 + sprite.scale.x / 2 - geometry3d.to3d( 5 );
            }
            , this.totalTextGroup
        );

        this.totalText = this.createText(
            fontSize
            , colorParams
            , params
            , ( sprite, material, texture ) => {
                sprite.position.x = this.totalTextPostfix.position.x 
                                    - this.totalTextPostfix.scale.x / 2 
                                    - sprite.scale.x / 2 
                                    + geometry3d.to3d( 5 )
                                    ;
                texture.text = '0';
                this.totalTextTexture = texture;
            }
            , this.totalTextGroup
        );

        this.totalTextGroup.position.y = -( this.arcOutRadius + geometry3d.to3d( 25 ) );
        this.totalTextGroup.position.x = -( this.totalTextPostfix.scale.x / 2 ) ;
    }
    drawTextRect(){
        this.dispose( this.textReatGroupIns );

        let textWidth =  ( ( this.totalTextPostfix.position.x ) + this.totalTextPostfix.scale.x / 2 ) * 2 + 5
            , heightPad = 0
            , rectHeight = geometry3d.to3d( 28 )
            , textX = 0
            , textY = -( this.arcOutRadius + geometry3d.to3d( 25 ) )
            ;

        if( textWidth < 170 ){
            textWidth = 170;
        }

        textWidth = geometry3d.to3d( textWidth );

        let group = new THREE.Group();
            group.transparent = true;

        var bgGeometry = new THREE.PlaneGeometry( 
            ( textWidth )
            , ( rectHeight  )
            , 32, 32 );
        var bgMaterial = new THREE.MeshBasicMaterial( {
            color: this.parseColor( this.lineColor )
            , side: THREE.DoubleSide
            , opacity: .2
            , transparent: true
        } );
        var bgPlane = new THREE.Mesh( bgGeometry, bgMaterial );

        bgPlane.position.y = textY - Math.abs( this.getPosition( this.tmpTotalText.matrixWorld ).y );

        group.add( bgPlane );
        this.addDestroy( bgPlane );

        let partpoints, geometryy, line, material, part, indices, count = 0 ;
        var vertices, positions, geometry, i;

        partpoints = [], indices = [];

        let height = this.getBoxSize( bgPlane ).y;
        let top = this.getPosition( bgPlane.matrixWorld ).y + 2;
        let arrowLength = geometry3d.to3d( 6 );

        let points = [ 
            {
                start: { x: -textWidth / 2 + arrowLength, y: top + arrowLength * 2 }
                , end: { x: -textWidth / 2, y: top + arrowLength * 2 }
            }
            , {
                start: { x: -textWidth / 2, y: top + arrowLength * 2 }
                , end: { x: -textWidth / 2, y: top + arrowLength * 1  }
            }
            , {
                start: { x: -textWidth / 2 + arrowLength, y: top - height +  arrowLength * 2 }
                , end: { x: -textWidth / 2, y: top - height +  arrowLength * 2 }
            }
            , {
                start: { x: -textWidth / 2  , y: top - height +  arrowLength * 2 }
                , end: { x: -textWidth / 2, y: top - height + arrowLength * 3 }
            }
            , {
                start: { x: textWidth / 2 - arrowLength, y: top + arrowLength * 2 }
                , end: { x: textWidth / 2, y: top + arrowLength + arrowLength * 1 }
            }
            , {
                start: { x: textWidth / 2, y: top + arrowLength * 2 }
                , end: { x: textWidth / 2, y: top + arrowLength }
            }
            , {
                start: { x: textWidth / 2 - arrowLength, y: top - height + arrowLength * 2 }
                , end: { x: textWidth / 2, y: top - height + arrowLength * 2 }
            }
            , {
                start: { x: textWidth / 2, y: top - height + arrowLength * 2 }
                , end: { x: textWidth / 2, y: top - height + arrowLength * 3 }
            }
        ];

        points.map( ( item, key ) => {
            partpoints.push( 
                new THREE.Vector3( item.start.x, item.start.y, 1 )
                , new THREE.Vector3( item.end.x, item.end.y, 1 )
            );
            indices.push( key );
        });

        material = new THREE.LineBasicMaterial({
            color: this.lineColor
        });

        vertices = partpoints;
        indices = [];
        vertices.map( ( item, key ) => {
            indices.push( key );
        });

        positions = new Float32Array(vertices.length * 3);

        for (i = 0; i < vertices.length; i++) {
            positions[i * 3] = vertices[i].x;
            positions[i * 3 + 1] = vertices[i].y;
            positions[i * 3 + 2] = vertices[i].z;
        }

        geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

        line = new THREE.LineSegments(geometry, material);
        group.add(line);
        this.addDestroy( line );

        this.textReatGroupIns = group;

        this.scene.add( group );
        this.addDestroy( group );
    }

    drawArcText() {
        if( !( this.textAr && this.textAr.length ) ) return;

        this.textAr.map( ( val, key ) => {
            let fontSize = geometry3d.to3d( 16 );
            let text = this.createText(
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

                    this.clearTextList.push( sprite );
                }
            );
        });
    }

    drawArcLine(){

        var line = new MeshLine(), points, geometryy, material, circle, curve;

        curve = new THREE.EllipseCurve(
            0,  this.fixCy(),            // ax, aY
            this.arcLineRaidus,
            this.arcLineRaidus,
            geometry.radians( this.arcAngleOffset ),
            geometry.radians( this.arcAngle + this.arcAngleOffset ),  
            false,            // aClockwise
            0                 // aRotation
        );

        points = curve.getPoints( 200 );
        geometryy = new THREE.Geometry().setFromPoints( points );

        line.setGeometry( geometryy );

        material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 1
        } );

        circle = new THREE.Mesh( line.geometry, material );

        circle.renderOrder = -1;
        circle.material.depthTest=false;

        this.stage.add( circle );
        this.addDestroy( circle );
     }

    drawArcPartLine(){

        let partpoints, geometryy, line, material, part, indices, count = 0 ;
        var vertices, positions, geometry, i;

        partpoints = [], indices = [];

        this.arcPartLineAr.map( ( item, key ) => {
            partpoints.push( 
                new THREE.Vector3( item.start.x, item.start.y, 1 )
                , new THREE.Vector3( item.end.x, item.end.y, 1 )
            );
            indices.push( key );
        });
        this.arcOutlinePartAr.map( ( item, key ) => {
            partpoints.push( 
                new THREE.Vector3( item.start.x, item.start.y, 1 )
                , new THREE.Vector3( item.end.x, item.end.y, 1 )
            );
            indices.push( key );
        });

        material = new THREE.LineBasicMaterial({
            color: this.lineColor
        });

        vertices = partpoints;
        indices = [];
        vertices.map( ( item, key ) => {
            indices.push( key );
        });

        positions = new Float32Array(vertices.length * 3);

        for (i = 0; i < vertices.length; i++) {
            positions[i * 3] = vertices[i].x;
            positions[i * 3 + 1] = vertices[i].y;
            positions[i * 3 + 2] = vertices[i].z;
        }

        geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

        line = new THREE.LineSegments(geometry, material);
        this.stage.add(line);
        this.addDestroy( line );
    }

    drawArc(){

        let line, material, geometryx, mesh, arc, tmp, color; 

            color = 0xffffff;

            geometryx = new THREE.RingGeometry( 
                this.arcInRadius
                , this.arcOutRadius
                , 256 
                , 1
                , geometry.radians( this.arcAngleOffset )
                , geometry.radians( this.arcAngle )
            );

        var texture = new THREE.Texture( this.generateGradientTexture() );
            texture.needsUpdate = true; // important!

            material = new THREE.MeshBasicMaterial( { /*color: color,*/ map: texture, side: THREE.DoubleSide, transparent: true } );
            arc = new THREE.Mesh( geometryx, material );

            arc.position.y = this.fixCy();

            this.stage.add( arc );
            this.addDestroy( arc );
    }

    generateGradientTexture() {

        var size = geometry3d.resizeToBit( this.width * this.arcOutPercent * this.sizeRate * 2 );

        // create canvas
        var canvas = document.createElement( 'canvas' );
        canvas.width = size;
        canvas.height = size;

        // get context
        var context = canvas.getContext( '2d' );

        // draw gradient
        context.rect( -size / 2,  - size / 2, size + size / 2, size + size / 2 );
        var gradient = context.createLinearGradient( 0, 0, size, size );
        gradient.addColorStop(0, '#5a78ca'); 
        gradient.addColorStop(0.4, '#64b185');
        gradient.addColorStop(1, '#ff9000'); 
        context.fillStyle = gradient;
        context.fill();
        return canvas;
    }

    initDataLayout(){

        this.drawArcText();
        if( !this.inited ){
            this.drawInnerText();
            this.drawInnerCircle();
            this.drawArc();
            this.drawArcLine();
            this.drawCircle();
            this.drawCircleLine();
            this.drawArcPartLine();
            this.initRoundText();
        }
        this.drawText();
        this.drawTextRect();
        this.drawArrow();
        this.updateArrow();
    }
    drawArrow(){

        this.dispose( this.arrowIcon );
        this.preAngle = 0;

        let group = new THREE.Group();

        let geo, mat, tri
            , width = geometry3d.to3d( 5 )
            , top = geometry3d.to3d( 14 )
            ;

        geo = new THREE.Geometry();
        geo.vertices = [
            new THREE.Vector3( 0, 0, 0 )
            , new THREE.Vector3( width, 0, 0 )
            , new THREE.Vector3( 0, top, 0 )
        ];

        geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geo.faces[0].color.setHex( 0x973500 );
        geo.center();

        mat = new THREE.MeshBasicMaterial( {
            color: 0x973500
            , vertexColors: THREE.FaceColors
            //, wireframe: true
            //, wireframeLinewidth: 1
        });
        mat.depthTest = false;
        tri = new THREE.Mesh( geo, mat );
        tri.renderOrder = -3;
        tri.position.x = width;
        group.add( tri );
        this.addDestroy( tri );

        geo = new THREE.Geometry();
        geo.vertices = [
            new THREE.Vector3( -width, 0, 0 )
            , new THREE.Vector3( 0, 0, 0 )
            , new THREE.Vector3( 0, top, 0 )
        ];

        geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geo.faces[0].color.setHex( 0xff5a00 );
        geo.center();

        mat = new THREE.MeshBasicMaterial( {
            color: 0xff5a00
            , vertexColors: THREE.FaceColors
            //, wireframe: true
            //, wireframeLinewidth: 1
        });
        mat.depthTest = false;
        tri = new THREE.Mesh( geo, mat );
        tri.renderOrder = -3;
        group.add( tri );
        this.addDestroy( tri );

        this.arrowIcon = group;

        group.renderOrder = -3;

        this.stage.add( group );
        this.addDestroy( group );
    }

    updateArrow(){
        if( isNaN( this.angle ) ){
            this.angle = -55;
        }
        let angle = -(-180 + this.angle);

        if( this.preAngle === this.angle ) return;
        this.preAngle = this.angle;

        let point = geometry.distanceAngleToPoint(  this.innerCircleRadius + geometry3d.to3d( 6 ), angle )

        this.arrowIcon.position.x = point.x;
        this.arrowIcon.position.y = point.y;

        this.arrowIcon.rotation.z = geometry.radians( angle - 90 );
    }

    animation(){
        if( this.isDestroy ) {
            this.isRunAnimation = false;
            return;
        }
        if( this.angle > this.animationAngle ) {
            this.isRunAnimation = false;
            return;
        }
        this.isRunAnimation = true;

        this.angle += this.angleStep;

        if( this.angle >= this.animationAngle || !this.isAnimation() ) {
            this.angle = this.animationAngle;
        };

        this.updateArrow();

        window.requestAnimationFrame( ()=>{ this.animation() } );
    }

    drawInnerText(){
        if( !this.inited ){
            let fontSize = geometry3d.to3d( 46 );
            this.percentText = this.createText( 
                fontSize
                , { color: 0xffffff }
                , {
                  text: this.getAttackText(),
                  fontFamily: 'HuXiaoBoKuHei, "Times New Roman", Times, serif',
                  fontSize: fontSize * 2,
                  fontStyle: 'italic'
                }
            );
        }

    }

    drawInnerCircle(){
        this.innerCircleRadius = geometry3d.to3d( this.roundRadius );
        var line = new MeshLine();

        var curve = new THREE.EllipseCurve(
            0,  this.fixCy(),            // ax, aY
            this.innerCircleRadius,
            this.innerCircleRadius,
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        var points = curve.getPoints( 200 );
        var geometryy = new THREE.Geometry().setFromPoints( points );

        curve = new THREE.EllipseCurve(
            0,  this.fixCy(),            // ax, aY
            this.innerCircleRadius,
            this.innerCircleRadius,
            0,  geometry.radians( 10 ),  // aStartAngle, aEndAngle
            false,            // aClockwise
            geometry.radians( .5 )                 // aRotation
        );

        points = [ ...points, ...curve.getPoints(  50 ) ] ;

        geometryy = new THREE.Geometry().setFromPoints( points );

        line.setGeometry( geometryy );
        var material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 3
        } );

        var circle = new THREE.Mesh( line.geometry, material );

        circle.renderOrder = -1;
        circle.material.depthTest=false;

        this.stage.add( circle );
        this.addDestroy( circle );
    }

    drawCircle(){
        this.circleRadius = geometry3d.to3d( Math.ceil( this.circlePercent * this.max / 2 ) * this.sizeRate );

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
            , lineWidth: 1
        } );

        var circle = new THREE.Mesh( line.geometry, material );

        circle.renderOrder = -1;
        circle.material.depthTest=false;

        this.stage.add( circle );
        this.addDestroy( circle );

    }

    drawCircleLine(){
        this.circleLineRadius = geometry3d.to3d( Math.ceil( this.circleLinePercent * this.max / 2 ) ); 

        let material,  geometryItem, circle, group, line;

        group = new THREE.Group();

        line = new MeshLine();
        material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 1
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
        this.addDestroy( circle );

        line = new MeshLine();
        material = new MeshLineMaterial( { 
            color: new THREE.Color( this.lineColor )  
            , lineWidth: 1
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
        this.addDestroy( circle );

        this.circleLine = group;

        this.stage.add( group );
        this.addDestroy( group );
    }
    fixCx(){
        return 0;
    }

    fixCy(){
        return 0;
    }
    destroy(){
        super.destroy();
        this.textRoundAngle.map( ( val ) => {
            if( val.ins ) val.ins.destroy();
        });

    }

}
