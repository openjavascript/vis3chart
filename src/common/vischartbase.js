
export default class VisChartBase {
    constructor( box, width, height, camera ){
        this.box = box;
        camera && ( this.camera = camera );

        this.name = 'VisChartBase_' + Date.now();

        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];

        this._setSize( width, height );
    }

    _setSize( width, height ){

        this.destroyList = [];

        width = width  || this.box.offsetWidth
        height = height || this.box.offsetHeight;

        this.width = width  || this.box.offsetWidth;
        this.height = height || this.box.offsetHeight;

        this.customWidth = width ||  this.width;
        this.customHeight = height || this.height;

        //console.log( this.width, this.height );

        this.max = this.maxSize = Math.max( this.width, this.height );
        this.min = this.minSize =  Math.min( this.width, this.height );

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
        this.countAngle = 0;

        this.images = [];

        this.rateWidth = 330;
        this.rateHeight = 330;

        this.rotationBg = [];

        this.rotationBgCount = 0;
        this.rotationBgStep = 1;

        this.sizeRate = 1;

        this.standSize = 330;

        if( this.min < this.standSize ){
            this.sizeRate = this.min / this.standSize;
        }
    }

    update( data, allData ){
        //console.log( 'update', this.name, Date.now(), this.width, this.height );

        this.data = data;
        this.allData = allData;

        this.loadImage();

        return this;
    }

    opacity( num ){
    }

    setLegend( legend ){
        this.legend = legend;
    }

    animation(){
    }

    animationBg(){
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;
    
        //logic

        window.requestAnimationFrame( ()=>{ this.animationBg() } );
    }

    getPrecision( item ){
        let r = 0;

        if( this.allData && 'precision' in this.allData ){
            r = this.allData.precision;
        }

        if( this.data && 'precision' in this.data ){
            r = this.data.precision;
        }

        if( item && 'precision' in item ){
            r = item.precision;
        }

        r = Math.pow( 10, r );

        return r;
    }

    addImage( imgUrl, width, height, offsetX = 0, offsetY = 0, rotation = 0, isbase64 = false, opt = {} ){
        let rateW = this.min / this.rateWidth
            , rateH = this.min / this.rateHeight
            ;
        this.images.push( {
            url: imgUrl
            , width: width * rateW
            , height: height * rateH
            , offsetX: offsetX
            , offsetY: offsetY
            , rotation: rotation
            , isbase64: isbase64
            , opt: opt
        });

        return this;
    }

/*
    "background": [
        { 
            "url": "./img/dount-in.png"
            , "width": 120
            , "height": 120
            , "offsetX": 0
            , "offsetY": 1
        }
        , { 
            "url": "./img/dount-big.png"
            , "width": 250
            , "height": 248
            , "offsetX": 0
            , "offsetY": 1
        }
    ],
*/
    loadImage(){
        return this;
    }


    hasLegend(){
        let r;

        if( this.data 
            && this.data.legend 
            && this.data.legend.data
            && this.data.legend.data.length
        ){
            r = true;
        }

        return r;
    }

    fixCx(){
        let r = this.cx;
        return r;
    }

    fixCy(){
        let r = this.cy;

        if( this.legend ){
            switch( this.legend.direction() ){
                case 'bottom': {
                    r = ( this.height - this.legend.outerHeight() / 2 ) / 2 - 5;
                    break;
                }
            }
        }

        return r;
    }

    fixWidth(){
        let r = this.width;
        return r;
    }

    fixHeight(){
        let r = this.height;
        return r;
    }


    init() {
        return this;
    }

    setOptions( options ){

        for( let key in options ){
            this[ key ] = options[key];
        }

        this.options = options;
    }

    calcLayoutPosition() {
        return this;
    }

    calcDataPosition() {
        return this;
    }

    initDataLayout(){
        return this;
    }

    draw() {
        return this;
    }

    reset(){
    }

    getData(){
        return this.data || {};
    }

    layer(){
        return this.layer;
    }

    isAnimation(){
        let r = true;

        if( this.allData && 'animation' in this.allData ){
            r = this.allData.animation;
        }

        if( this.data && 'animation' in this.data ){
            r = this.data.animation;
        }

        return r;
    }

    isSeriesAnimation(){
        let r = true;

        if( this.data && 'seriesAnimation' in this.data ){
            r = this.data.seriesAnimation;
        }

        return r;
    }



    setLayer( layer ){
        this.layer = layer;
        return this;
    }

    setStage( stage ){
        this.stage = stage;
    }

    resize( width, height, data = null, allData = null ){

        this.customWidth = width || this.width;
        this.customHeight = height || this.height;

        this.data = data || this.data;
        this.allData = allData || this.allData;

        this.width = width      || this.box.offsetWidth     || this.width;
        this.height = height    || this.box.offsetHeight    || this.height;

        this._setSize( this.width, this.height );
    }

    remove() {
        return this;
    }

    setDestroy(){
        this.isDestroy = 1;
        return this;
    }

    destroy(){
        this.setDestroy();

        this.destroyList.map( item => {
            if( item ){
                //console.log( 'item', item );
                item.remove();
                item.destroy();
            }
        });
        return this;
    }

    addDestroy( ...item ){
        item && item.length && item.map( val => {
            this.destroyList.push( val );
        });
        return this;
    }

    dispose(){
        this.destroy();
        return this;
    }
}

