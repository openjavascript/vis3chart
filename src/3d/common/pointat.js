
import ju from 'json-utilsx';
import * as geometry from '../../geometry/geometry.js';

export default class PointAt {
    constructor( width, height, point ){
        this.width = width;
        this.height = height;
        this.point = point;

        this.cx = this.width / 2;
        this.cy = this.height / 2;

        this.cpoint = { x: this.cx, y: this.cy };

        this.offsetX = 20;
        this.offsetY = 20;

        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];


        this.init();
    }

    setDebug( stage ){
        this.stage = stage;


        let i = 0;

        for( let key in this.rects ){
            
            let item = this.rects[ key ];
            let params = ju.clone( item );
            params.fill = this.colors[ i % this.colors.length ];

            
            i++;
        }

        this.stage.add( this.layer );
    }

    init(){
        this.leftTop = {
            x: 0
            , y: 0
            , width: this.cx + this.offsetX
            , height: this.cy + this.offsetY
        };
        this.leftTop.x2 = this.leftTop.x + this.leftTop.width;
        this.leftTop.y2 = this.leftTop.y + this.leftTop.height;

        this.rightTop = {
            x: this.cx - this.offsetX
            , y: 0
            , width: this.cx + this.offsetX
            , height: this.cy + this.offsetY
        };
        this.rightTop.x2 = this.rightTop.x + this.rightTop.width;
        this.rightTop.y2 = this.rightTop.y + this.rightTop.height;

        this.leftBottom = {
            x: 0
            , y: this.cy - this.offsetY
            , width: this.cx + this.offsetX
            , height: this.cy + this.offsetY
        };
        this.leftBottom.x2 = this.leftBottom.x + this.leftBottom.width;
        this.leftBottom.y2 = this.leftBottom.y + this.leftBottom.height;

        this.rightBottom = {
            x: this.cx - this.offsetX
            , y: this.cy - this.offsetY
            , width: this.cx + this.offsetX
            , height: this.cy + this.offsetY
        };
        this.rightBottom.x2 = this.rightBottom.x + this.rightBottom.width;
        this.rightBottom.y2 = this.rightBottom.y + this.rightBottom.height;

        this.rects = {
            leftTop: this.leftTop
            , rightTop: this.rightTop
            , leftBottom: this.leftBottom
            , rightBottom: this.rightBottom
        };

    }

    isLeftTop(){
        return geometry.pointRectangleIntersection( 
            this.point 
            , this.leftTop
        ) ? 1 : 0;
    }

    isRightTop(){
        return geometry.pointRectangleIntersection( 
            this.point 
            , this.rightTop
        ) ? 2 : 0;

    }

    isRightBottom(){
        return geometry.pointRectangleIntersection( 
            this.point 
            , this.rightBottom
        ) ? 4 : 0;
    }

    isLeftBottom(){
        return geometry.pointRectangleIntersection( 
            this.point 
            , this.leftBottom
        ) ? 8 : 0;
    }

    auto() {
        let r = this.isLeftTop() + this.isRightTop() + this.isRightBottom() + this.isLeftBottom();
        return r;
    }

    autoAngle() {
        let angle  = geometry.pointAngle( this.cpoint, this.point ), r = '';


        if( angle >= 0 && angle <= 90 ){
            r = PointAt.DIRE_NAME.rightTop;
        }else if( angle > 90 && angle <= 180 ){
            r = PointAt.DIRE_NAME.leftTop;
        }else if( angle > 180 && angle <= 270 ){
            r = PointAt.DIRE_NAME.leftBottom;
        }else{
            r = PointAt.DIRE_NAME.rightBottom;
        }

        //console.log( 'autoAngle', angle, r );

        return r;
    }

}

PointAt.DIRE_NAME = {
    leftTop: 1
    , rightTop: 2
    , rightBottom: 4
    , leftBottom: 8

    , topCenter: 3
    , rightMid: 6
    , bottomCenter: 12
    , leftMid: 9
};

PointAt.DIRE_NUM = {
    '1': 'leftTop'
    , '2': 'rightTop'
    , '4': 'rightBottom'
    , '8': 'leftBottom'

    , '3': 'topCenter'
    , '6': 'rightMid'
    , '9': 'leftMid'
    , '12': 'bottomCenter'
};
