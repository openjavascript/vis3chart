
import VisChartBase from '../common/base.js';
import * as geometry from '../../geometry/geometry.js';

import PointAt from '../common/pointat.js';

import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';

//import RoundStateText from '../icon/roundstatetext.js';

export default class Gauge extends VisChartBase  {
    constructor( box, width, height, camera ){
        super( box, width, height, camera );

        this.name = 'Gauge' + Date.now();

        this._setSize( width, height );
    }

    _setSize( width, height ){
        super._setSize( width, height );

        this.totalPostfix = '次/时';

        this.offsetCy = 15;

        this.cy += this.offsetCy;

        this.curRate = 0;
        this.totalNum = 0;
        this.totalNumStep = 5;

        this.animationStep = 40 * 1;

        this.roundRadiusPercent = .085;

        this.lineColor = '#596ea7';

        this.circleLinePercent = .26;
        this.circlePercent = .28;

        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.arcLinePercent = .39 / 2;

        this.arcOutPercent = .38 / 2;
        this.arcInPercent = .305 / 2;

        this.arcLabelLength = 6;
        this.arcTextLength = 20;

        this.arcAngle = 280;
        this.part = 22;
        this.arcTotal = 1100;

        this.textOffset = 0;

        this.arcOffset = 90 + ( 360 - this.arcAngle ) / 2;
        this.arcOffsetPad = -5;
        this.partLabel = this.part / 2;
        this.partAngle = ( this.arcAngle ) / this.part;
        this.partNum = this.arcTotal / this.part;

        this.textOffsetX = -1;
        this.textOffsetY = -8;
        this.textLineLength = 6;

        this.textRectWidthPercent = .5;
        this.textRectHeightPercent = .11;

        this.textRoundPercent = .38;
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

        this.arcInRadius = this.width * this.arcInPercent * this.sizeRate;
        this.arcOutRadius = this.width * this.arcOutPercent * this.sizeRate;

        this.arcLineRaidus = Math.ceil( this.arcLinePercent * this.max ) * this.sizeRate

        this.textWidth = this.textRectWidthPercent * this.width ;
        this.textHeight = 38 * this.sizeRate;
        this.textX = this.cx - this.textWidth / 2; 
        this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;

        this.textRoundAngle.map( ( val, key ) => {
            let point = geometry.distanceAngleToPoint( this.textRoundRadius, val.angle )
            val.point = geometry.pointPlus( point, this.cpoint );
            val.point.y += this.offsetCy;
        });

        this.arcPartLineAr = [];
        this.arcOutlinePartAr = [];
        this.textAr = [];
        for( let i = 0; i <= this.part; i++ ){
            let start, end, angle;
            angle = i * this.partAngle + this.arcOffset;

            if( i && i < this.part ){
                start = geometry.distanceAngleToPoint( this.arcInRadius, angle );
                end = geometry.distanceAngleToPoint( this.arcOutRadius, angle );

                this.arcPartLineAr.push( 'M' );
                this.arcPartLineAr.push( [ start.x, start.y ].join(',') );
                this.arcPartLineAr.push( 'L' );
                this.arcPartLineAr.push( [ end.x, end.y ].join(',') );
            }

            start = geometry.distanceAngleToPoint( this.arcLineRaidus, angle );
            end = geometry.distanceAngleToPoint( this.arcLineRaidus + this.arcLabelLength, angle );

            this.arcOutlinePartAr.push( 'M' );
            this.arcOutlinePartAr.push( [ start.x, start.y ].join(',') );
            this.arcOutlinePartAr.push( 'L' );
            this.arcOutlinePartAr.push( [ end.x, end.y ].join(',') );
            
            if( !(i * this.partNum % 100) || i === 0 ){
                let angleOffset = 8, lengthOffset = 0, rotationOffset = 0;

                if( i === 0 ){
                    angleOffset = 1;
                }

                if( i >= 19 ){
                    angleOffset = 14;
                    rotationOffset = 9;
                }
                if( i >= 21 ){
                    angleOffset = 18;
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
                val.ins = new RoundStateText( this.box, this.width, this.height );
                val.ins.setOptions( Object.assign( val, {
                    stage: this.stage
                    , layer: this.layoutLayer
                    , data: this.data
                    , allData: this.allData
                }) );
                val.ins.init( );
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
    update( data, allData ){
        //this.stage.removeChildren();
        super.update( data, allData );


        //console.log( 123, data );

        if( (data && data.data && data.data.length) ){
            data.data.map( val => {
                this.curRate = val.value;
                this.totalNum = val.total
            });
        }

        /*
        this.curRate = 600;
        this.totalNum = 234567;
        */

        this.initDataLayout();

        //console.log( 'gauge update', this.getAttackRateAngle() )
        this.angle = this.arcOffset + this.arcOffsetPad;
        this.animationAngle =  this.getAttackRateAngle() + this.arcOffsetPad;
        //console.log( this.angle, this.animationAngle );

        this.updateWedge();

        if( this.curRate ){
            this.rateStep = Math.floor( this.curRate / ( this.animationStep * 2 ) )
            !this.inited && this.animation();
        }
        if( parseInt( this.totalNum ) ){
            this.totalNumStep = Math.floor( this.totalNum / this.animationStep );
            this.totalNumStep < 1 && ( this.totalNumStep = 1 );
            this.totalNumCount = 0;
            this.animationText();
        }else{
            /*
            this.totalText.text( this.totalNum + '' );
            this.totalTextPostfix.x( this.totalText.textWidth + 5 );
            this.totalTextGroup.x(  ( this.width - this.totalTextPostfix.textWidth -  this.totalText.textWidth - 5 ) / 2 );
            */
        }

        !this.inited && this.animationCircleLine();

        this.inited = 1;
    }

    animationCircleLine(){
        //console.log( 'animationCircleLine' );
        if( this.isDestroy ) return;
        if( !this.circleLine ) return;

        if( !this.isAnimation() ){
            return;
        }
        
        this.circleLineRotation += this.circleLineRotationStep; 

        this.circleLine.rotation( this.circleLineRotation );
        this.stage.add( this.layoutLayer );

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

        /*
        this.totalText.text( this.totalNumCount );
        this.totalTextPostfix.x( this.totalText.textWidth + 5 );

        this.totalTextGroup.x(  ( this.width - this.totalTextPostfix.textWidth -  this.totalText.textWidth - 5 ) / 2 );

        this.layoutLayer.add( this.totalTextGroup );
        */

        window.requestAnimationFrame( ()=>{ this.animationText() } );
    }

    drawText(){

        /*
        this.totalTextGroup = new Konva.Group();
        this.addDestroy( this.totalTextGroup );

        let params = {
            text: 0 + ''
            , fontSize: 30 * this.sizeRate
            , fontFamily: 'Agency FB'
            , fill: '#ffffff'
            , fontStyle: 'italic'
            , letterSpacing: 1.5
        }, tmp = ju.clone( params );
        tmp.text = this.totalNum;

        this.totalText = new Konva.Text( params );
        this.addDestroy( this.totalText );

        let params1 = {
            text: this.totalPostfix
            , x: this.totalText.textWidth + 5
            , fontSize: 12 * this.sizeRate
            , fontFamily: 'MicrosoftYaHei'
            , fill: '#ffffff'
            , fontStyle: 'italic'
            , letterSpacing: 1.5
        };

        this.totalTextPostfix = new Konva.Text( params1 );
        this.totalTextPostfix.y( this.totalText.textHeight - this.totalTextPostfix.textHeight - 4 );
        this.addDestroy( this.totalTextPostfix );

        this.totalTextGroup.add( this.totalText );
        this.totalTextGroup.add( this.totalTextPostfix );

        //console.log( this.totalTextGroup, this.totalTextGroup.getClipWidth(), this.totalTextGroup.width(), this.totalTextGroup.size()  );

        //this.totalTextGroup.x( this.cx - this.totalTextGroup.width / 2 );
        this.totalTextGroup.y( this.textY);
        this.totalTextGroup.x(  ( this.width - this.totalTextPostfix.textWidth -  this.totalText.textWidth - 5 ) / 2 );

        this.tmpTotalText = new Konva.Text( tmp );
        this.addDestroy( this.tmpTotalText );
        */

    }
    drawTextRect(){

        let textWidth =  this.tmpTotalText.textWidth + 30 + this.totalTextPostfix.textWidth + 5
            , textX = 0
            , textY = 0
            ;

        if( textWidth < 170 ){
            textWidth = 170;
        }
        textX = this.cx - textWidth / 2 + 2;;

        textY = this.textY - ( this.textHeight - this.totalText.textHeight ) / 2;

        /*
        this.textRect = new Konva.Rect( {
            fill: '#596ea7'
            , stroke: '#ffffff00'
            , strokeWidth: 0
            , opacity: .3
            , width: textWidth
            , height: this.textHeight
            , x: textX
            , y: textY
        });
        this.addDestroy( this.textRect );
        */

        let points = [];
        points.push( 'M', [ textX, textY + this.textLineLength ].join(',') );
        points.push( 'L', [ textX, textY ].join(',') );
        points.push( 'L', [ textX + this.textLineLength, textY ].join(',') );

        points.push( 'M', [ textX + textWidth - this.textLineLength, textY ].join(',') );
        points.push( 'L', [ textX + textWidth, textY ].join(',') );
        points.push( 'L', [ textX + textWidth, textY + this.textLineLength ].join(',') );

        points.push( 'M', [ textX + textWidth, textY + this.textHeight - this.textLineLength ].join(',') );
        points.push( 'L', [ textX + textWidth, textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX + textWidth - this.textLineLength, textY + this.textHeight ].join(',') );

        points.push( 'M', [ textX + this.textLineLength, textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX, textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX, textY + this.textHeight - this.textLineLength ].join(',') );

        /*
        this.textLinePath = new Konva.Path( {
            data: points.join('')
            , stroke: this.lineColor
            , strokeWidth: 1
        });
        this.addDestroy( this.textLinePath );

        this.layoutLayer.add( this.textLinePath );
        this.layoutLayer.add( this.textRect );
        //this.layoutLayer.add( this.totalText );
        this.layoutLayer.add( this.totalTextGroup );
        */
    }

    drawArcText() {
        if( !( this.textAr && this.textAr.length ) ) return;

        this.textAr.map( ( val ) => {
            /*
            let text = new Konva.Text( {
                x: val.point.x + this.cx
                , y: val.point.y + this.cy
                , text: val.text + ''
                , fontSize: 11 * this.sizeRate
                //, rotation: val.angle
                , fontFamily: 'MicrosoftYaHei'
                , fill: this.lineColor
            });
            this.addDestroy( text );

            text.rotation( val.angle + 90 + ( val.rotationOffset || 0 ) );

            this.layoutLayer.add( text );
            */
        });
    }

    drawArcLine(){

        let points = [];
            points.push( 'M' );
        for( let i = this.arcOffset; i <= ( this.arcOffset + this.arcAngle ); i+=0.5 ){
            let tmp = geometry.distanceAngleToPoint( this.arcLineRaidus, i );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 90 ){
                points.push( 'L' );
            }
        }

        /*
        this.arcLine = new Konva.Path( {
            data: points.join('')
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });
        this.addDestroy( this.arcLine );

        this.arcPartLine = new Konva.Path( {
            data: this.arcPartLineAr.join('')
            , x: this.cx
            , y: this.cy
            , stroke: '#00000088'
            , strokeWidth: 1
            , fill: '#ffffff00'
        });
        this.addDestroy( this.arcPartLine );

        this.arcOutlinePart = new Konva.Path( {
            data: this.arcOutlinePartAr.join('')
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });
        this.addDestroy( this.arcOutlinePart );

        this.layoutLayer.add( this.arcLine );
        this.layoutLayer.add( this.arcPartLine );
        this.layoutLayer.add( this.arcOutlinePart );
        */
    }

    drawArc(){

        let params = {
            x: this.cx
            , y: this.cy
            , innerRadius: this.arcInRadius
            , outerRadius: this.arcOutRadius
            , angle: this.arcAngle
            //, fill: 'red'
            , stroke: '#ffffff00'
            , strokeWidth: 0
            , rotation: this.arcOffset
            , fillLinearGradientStartPoint: { x : -50, y : -50}
            , fillLinearGradientEndPoint: { x : 50, y : 50}
            , fillLinearGradientColorStops: 
            [ 
                0, '#ff9000'
                , .5, '#64b185'
                , 1, '#5a78ca'
            ]
        };
        /*
        this.arc = new Konva.Arc( params );
        this.addDestroy( this.arc );

        this.layoutLayer.add( this.arc );
        */
    }

    initDataLayout(){

        /*
        if( !this.inited ){
            
            this.layer = new Konva.Layer();
            this.addDestroy(this.layer );
            
            this.layoutLayer = new Konva.Layer();
            this.addDestroy( this.layoutLayer );

            this.roundLine = new Konva.Circle( {
                x: this.cx
                , y: this.cy
                , radius: this.roundRadius
                , stroke: this.lineColor
                , strokeWidth: 2.5
                , fill: 'rgba( 0, 0, 0, .5 )'
            });
            this.addDestroy( this.roundLine );
        }

        if( !this.inited ){
            this.percentText = new Konva.Text( {
                x: this.cx
                , y: this.cy
                , text: this.getAttackText()
                , fontSize: 18 * this.sizeRate
                , fontFamily: 'HuXiaoBoKuHei'
                , fill: '#ffffff'
                , fontStyle: 'italic'
            });
            this.addDestroy( this.percentText );
        }
        this.percentText.text( this.getAttackText() );
        this.percentText.x( this.cx - this.percentText.textWidth / 2 + this.textOffsetX );
        this.percentText.y( this.cy - this.percentText.textHeight / 2 + this.textOffsetY );

       if( !this.inited ){
           let wedge = new Konva.Wedge({
              x: 0,
              y: -3,
              radius: 10,
              angle: 20,
              fill: '#ff5a00',
              stroke: '#ff5a00',
              strokeWidth: 1,
              rotation: 90
            });
            this.addDestroy( wedge );

           let wedge1 = new Konva.Wedge({
              x: 0,
              y: -3,
              radius: 10,
              angle: 20,
              fill: '#973500',
              stroke: '#973500',
              strokeWidth: 1,
              rotation: 65
            });
            this.addDestroy( wedge1 );

            let group = new Konva.Group({
                x: this.cx
                , y: this.cy
            });
            this.addDestroy( group );

            group.add( wedge1 );
            group.add( wedge );

            this.group = group;
        }


        this.initRoundText();

        if( !this.inited ){
            this.angle = this.arcOffset - 2;
           
            this.layer.add( this.group );
            this.layer.add( this.roundLine );
            this.layer.add( this.percentText );
            //this.layer.add( this.percentSymbolText );


            this.drawCircle();
            this.drawCircleLine();
            this.drawArc();
            this.drawArcLine();
            this.drawArcText();
            this.drawText();
            this.drawTextRect();
        }


        this.stage.add( this.layer );
        this.stage.add( this.layoutLayer );
        */

    }
    animation(){
        //console.log( this.angle, this.animationAngle );
        if( this.isDestroy ) return;
        if( this.angle > this.animationAngle ) return;

        this.angle += this.rateStep;

        if( this.angle >= this.animationAngle || !this.isAnimation() ) {
            this.angle = this.animationAngle;
        };

        this.updateWedge();

        //this.stage.add( this.layer );

        window.requestAnimationFrame( ()=>{ this.animation() } );
    }

    updateWedge(){
        /*
        let point = geometry.distanceAngleToPoint(  this.roundRadius + 6, this.angle )
        this.group.x( this.cx + point.x );
        this.group.y( this.cy + point.y );
        this.group.rotation( this.angle + 90 );
        this.group.rotation( this.angle + 90 );
        this.stage.add( this.layer );
        */
    }

    calcDataPosition() {
    }

    animationLine(){
    }

    addIcon( path, layer ){
    }

    addText( path, layer ){

    }

    calcLayoutPosition() {
    }
    drawCircle(){
        this.circleRadius = Math.ceil( this.circlePercent * this.max / 2 ) * this.sizeRate;

        /*
        this.circle = new Konva.Circle( {
            x: this.cx
            , y: this.cy
            , radius: this.circleRadius
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });
        this.addDestroy( this.circle );
        this.layoutLayer.add( this.circle );
        */
    }

    drawCircleLine(){
        this.circleLineRadius = Math.ceil( this.circleLinePercent * this.max / 2 ) * this.sizeRate;

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
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1.5
            , fill: '#ffffff00'
        });
        this.addDestroy( this.circleLine );

        this.layoutLayer.add( this.circleLine );
        */
    }

    reset(){
    }

    destroy(){
        super.destroy();
        this.textRoundAngle.map( ( val ) => {
            if( val.ins ) val.ins.destroy();
        });

    }

}
