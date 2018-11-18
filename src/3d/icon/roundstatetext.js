
import VisChartBase from '../common/base.js';
import * as geometry from '../../geometry/geometry.js';

//import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';


export default class RoundStateText extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'RoundStateText ' + Date.now();

        this.radius = 30;

        this.textOffsetX = -2;
        this.textOffsetY = -1;

        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.curColor = '#deaf5c';
    }


    animationCircleLine(){
        if( this.isDestroy ) return;
        if( !this.circleLine ) return;

        if( !this.isAnimation() ){
            return;
        }
        
        this.circleLineRotation += this.circleLineRotationStep; 

        this.circleLine.rotation( this.circleLineRotation );
        this.stage.add( this.layer );

        window.requestAnimationFrame( ()=>{ this.animationCircleLine() } );
    }

    init(){
        //console.log( 'RoundStateText init', this );
        this.circleRaidus = this.radius - 5;
        this.circleRaidus *= this.sizeRate;

        //this.lineColor = this.curColor;

        this.initDataLayout();

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
    }

    drawCircle(){
        /*this.circle = new Konva.Circle( {
            x: this.point.x
            , y: this.point.y
            , radius: this.circleRaidus
            , stroke: this.lineColor
            , strokeWidth: 2
            , fill: '#ffffff00'
        });
        this.addDestroy( this.circle );

        this.layer.add( this.circle );*/
    }

    drawCircleLine(){
        this.circleLineRadius = this.radius - 1;
        this.circleLineRadius *= this.sizeRate;

        let points = [];
            points.push( 'M' );
        for( let i = 90; i <= 180; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i + 90 );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 90 ){
                points.push( 'L' );
            }
        }
        points.push( 'M');
        for( let i = 270; i <= 360; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i + 90 );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 270 ){
                points.push( 'L' );
            }
        }
/*
        this.circleLine = new Konva.Path( {
            data: points.join('')
            , x: this.point.x
            , y: this.point.y
            , stroke: this.lineColor
            , strokeWidth: 2
            , fill: '#ffffff00'
        });
        this.addDestroy( this.circleLine );

        this.layer.add( this.circleLine );*/
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
