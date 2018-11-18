
import VisChartBase from '../common/base.js';
import * as geometry from '../../geometry/geometry.js';
import * as geometry3d from '../../geometry/geometry3d.js';

import ju from 'json-utilsx';
import * as utils from '../../common/utils.js';

const THREE = require( 'three' );

import TextTexture from 'three.texttexture';
import TextSprite from 'three.textsprite';

import {MeshLine, MeshLineMaterial} from 'three.meshline'

export default class RoundStateText extends VisChartBase  {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );

        this.name = 'RoundStateText ' + Date.now();

        this.radius = 30;

        this.textOffsetX = -2;
        this.textOffsetY = -1;

        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.curColor = 0xdeaf5c;
    }


    animationCircleLine(){
        if( this.isDestroy ) return;
        if( !this.circleLine ) return;

        if( !this.isAnimation() ){
            return;
        }
        
        this.circleLineRotation += this.circleLineRotationStep; 

        //this.circleLine.rotation( this.circleLineRotation );
        this.circleLine.rotation.z -= .03;

        window.requestAnimationFrame( ()=>{ this.animationCircleLine() } );
    }

    setOptions( json ){
        super.setOptions( json );

        this.stageBackup = this.stage;
        this.stage = new THREE.Object3D();
        this.stageBackup.add( this.stage );
        this.addDestroy( this.stage );

        this.stage.position.x = this.point.x;
        this.stage.position.y = this.point.y;
    }

    init(){
        //console.log( 'RoundStateText init', this );
        this.circleRadius = geometry3d.to3d( this.radius - 5 );
        this.circleRadius *= this.sizeRate;

        //this.lineColor = this.curColor;

        this.initDataLayout();

        console.log( this.point.x, this.point.y );

        this.animationCircleLine();

        return this;
    }

    update( rate ){
        this.rate = rate;

        let color = this.lineColor;


        if( rate >= this.min && rate < this.max ){
            color = this.curColor;
        }

        /*
        this.text.fill( color );
        this.circle.stroke( color );
        this.circleLine.stroke( color );

        this.stage.add( this.layer );
        */

        //console.log( 'rate', rate );

        return this;
    }

    initDataLayout(){
        this.drawText();
        this.drawCircle()
        this.drawCircleLine()
    }
    drawText(){
        /*this.text = new Konva.Text( {
            x: this.point.x
            , y: this.point.y
            , text: this.text
            , fontSize: 32 * this.sizeRate
            , fontFamily: 'HuXiaoBoKuHei'
            , fill: this.lineColor
            , fontStyle: 'italic'
        });
        this.addDestroy( this.text );

        this.text.x( this.point.x - this.text.textWidth / 2 + this.textOffsetX );
        this.text.y( this.point.y - this.text.textHeight / 2 + this.textOffsetY );


        this.layer.add( this.text );*/

        let fontSize = geometry3d.to3d( 32 );
        let texture = new TextTexture({
          text: this.text,
          fontFamily: 'HuXiaoBoKuHei, "Times New Roman", Times, serif',
          fontSize: fontSize * 2,
          fill: this.lineColor,
          fontStyle: 'italic'
        });
        let material = new THREE.SpriteMaterial({map: texture, color: 0xffffff });
        let sprite =new THREE.Sprite(material);
        sprite.scale.setX(texture.imageAspect).multiplyScalar(fontSize);
        this.text = sprite;

        this.stage.add( this.text  );
        this.addDestroy( this.text );
    }

    drawCircle(){

        var line = new MeshLine();

        var curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            this.circleRadius,
            this.circleRadius,
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        var points = curve.getPoints( 200 );
        var geometryy = new THREE.Geometry().setFromPoints( points );

        curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
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

        this.stage.add( circle );
        this.addDestroy( circle );

    }

    drawCircleLine(){
        this.circleLineRadius = geometry3d.to3d( this.radius - 1 );
        this.circleLineRadius *= this.sizeRate;

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


    reset(){
    }

    calcDataPosition() {
    }

    animationLine(){
    }

    calcLayoutPosition() {
    }
}
