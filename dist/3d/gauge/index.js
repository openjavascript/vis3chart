'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('../common/base.js');

var _base2 = _interopRequireDefault(_base);

var _geometry = require('../../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _geometry3d = require('../../geometry/geometry3d.js');

var geometry3d = _interopRequireWildcard(_geometry3d);

var _pointat = require('../common/pointat.js');

var _pointat2 = _interopRequireDefault(_pointat);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../../common/utils.js');

var utils = _interopRequireWildcard(_utils);

var _three = require('three.texttexture');

var _three2 = _interopRequireDefault(_three);

var _three3 = require('three.textsprite');

var _three4 = _interopRequireDefault(_three3);

var _three5 = require('three.meshline');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var THREE = require('three');

//import RoundStateText from '../icon/roundstatetext.js';

var Gauge = function (_VisChartBase) {
    _inherits(Gauge, _VisChartBase);

    function Gauge(box, width, height, camera) {
        _classCallCheck(this, Gauge);

        var _this = _possibleConstructorReturn(this, (Gauge.__proto__ || Object.getPrototypeOf(Gauge)).call(this, box, width, height, camera));

        _this.name = 'Gauge' + Date.now();
        return _this;
    }

    _createClass(Gauge, [{
        key: '_setSize',
        value: function _setSize(width, height) {
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), '_setSize', this).call(this, width, height);

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

            this.arcAngleOffset = -50;
            this.arcAngle = 280;
            this.part = 22;
            this.arcTotal = 1100;

            this.textOffset = 0;

            this.arcOffset = this.arcAngleOffset;
            this.arcOffsetPad = -5;
            this.partLabel = this.part / 2;
            this.partAngle = this.arcAngle / this.part;
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
            this.textRoundAngle = [{
                angle: this.textRoundOffsetAngle,
                text: '低',
                point: {},
                min: 0,
                max: 100,
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }, {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle,
                text: '中',
                point: {},
                min: 101,
                max: 500,
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }, {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle * 2,
                text: '高',
                point: {},
                min: 501,
                max: Math.pow(10, 10),
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }];

            this.init();
        }
    }, {
        key: 'getAttackRateAngle',
        value: function getAttackRateAngle() {
            var r = 0;

            r = this.arcOffset + this.arcAngle * this.getAttackRatePercent();

            return r;
        }
    }, {
        key: 'getAttackRatePercent',
        value: function getAttackRatePercent() {
            var r = 0,
                tmp = void 0;
            if (this.curRate) {
                tmp = this.curRate;
                if (tmp > this.arcTotal) {
                    tmp = this.arcTotal;
                }

                r = tmp / this.arcTotal;
            }
            return r;
        }
    }, {
        key: 'getAttackText',
        value: function getAttackText() {
            var _this2 = this;

            var text = '低';

            if (this.curRate) {
                this.textRoundAngle.map(function (val) {
                    if (_this2.curRate >= val.min && _this2.curRate <= val.max) {
                        text = val.text;
                    }
                });
            }

            return text + '\u9891\n\u653B\u51FB';
        }
    }, {
        key: 'init',
        value: function init() {
            var _this3 = this;

            //console.log( 'init', Date.now() );
            this.textRoundRadius = this.width * this.textRoundPercent * this.sizeRate;

            this.roundRadius = this.width * this.roundRadiusPercent * this.sizeRate;

            this.arcInRadius = geometry3d.to3d(this.width * this.arcInPercent * this.sizeRate);
            this.arcOutRadius = geometry3d.to3d(this.width * this.arcOutPercent * this.sizeRate);

            this.arcLineRaidus = geometry3d.to3d(Math.ceil(this.arcLinePercent * this.max) * this.sizeRate);

            this.textWidth = this.textRectWidthPercent * this.width;
            this.textHeight = 38 * this.sizeRate;
            this.textX = this.cx - this.textWidth / 2;
            this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;

            this.textRoundAngle.map(function (val, key) {
                var point = geometry.distanceAngleToPoint(_this3.textRoundRadius, val.angle);
                val.point = geometry.pointPlus(point, _this3.cpoint);
                val.point.y += _this3.offsetCy;
            });

            this.arcPartLineAr = [];
            this.arcOutlinePartAr = [];
            this.textAr = [];
            for (var i = 0; i <= this.part; i++) {
                var start = void 0,
                    end = void 0,
                    angle = void 0;
                angle = i * this.partAngle + this.arcOffset;

                //if( i && i < this.part ){
                if (true) {
                    start = geometry.distanceAngleToPoint(this.arcInRadius, angle);
                    end = geometry.distanceAngleToPoint(this.arcOutRadius, angle);
                    this.arcPartLineAr.push({ start: start, end: end });
                }

                start = geometry.distanceAngleToPoint(this.arcLineRaidus, angle);
                end = geometry.distanceAngleToPoint(this.arcLineRaidus + this.arcLabelLength, angle);

                this.arcOutlinePartAr.push({ start: start, end: end });

                if (!(i * this.partNum % 100) || i === 0) {
                    var angleOffset = 8,
                        lengthOffset = 0,
                        rotationOffset = 0;

                    if (i === 0) {
                        angleOffset = 1;
                    }

                    if (i >= 19) {
                        angleOffset = 14;
                        rotationOffset = 9;
                    }
                    if (i >= 21) {
                        angleOffset = 18;
                    }
                    var text = {
                        text: i * this.partNum,
                        angle: angle - angleOffset,
                        point: geometry.distanceAngleToPoint(this.arcLineRaidus + this.arcTextLength + lengthOffset, angle - angleOffset),
                        rotationOffset: rotationOffset
                    };
                    text.textPoint = new _pointat2.default(this.width, this.height, geometry.pointPlus(text.point, this.cpoint));

                    this.textAr.push(text);
                }
            }

            //console.log( 'this.arcPartLineAr', this.arcPartLineAr, 'this.arcOutlinePartAr', this.arcOutlinePartAr );
        }
    }, {
        key: 'initRoundText',
        value: function initRoundText() {
            var _this4 = this;

            this.textRoundAngle.map(function (val) {

                if (!val.ins) {
                    val.ins = new RoundStateText(_this4.box, _this4.width, _this4.height);
                    val.ins.setOptions(Object.assign(val, {
                        stage: _this4.stage,
                        layer: _this4.layoutLayer,
                        data: _this4.data,
                        allData: _this4.allData
                    }));
                    val.ins.init();
                }
                val.ins.update(_this4.curRate);
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

    }, {
        key: 'update',
        value: function update(data, allData) {
            var _this5 = this;

            //this.stage.removeChildren();
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'update', this).call(this, data, allData);

            //console.log( 123, data );

            if (data && data.data && data.data.length) {
                data.data.map(function (val) {
                    _this5.curRate = val.value;
                    _this5.totalNum = val.total;
                });
            }

            /*
            this.curRate = 600;
            this.totalNum = 234567;
            */

            this.initDataLayout();

            //console.log( 'gauge update', this.getAttackRateAngle() )
            this.angle = this.arcOffset + this.arcOffsetPad;
            this.animationAngle = this.getAttackRateAngle() + this.arcOffsetPad;
            //console.log( this.angle, this.animationAngle );

            this.updateWedge();

            if (this.curRate) {
                this.rateStep = Math.floor(this.curRate / (this.animationStep * 2));
                !this.inited && this.animation();
            }
            if (parseInt(this.totalNum)) {
                this.totalNumStep = Math.floor(this.totalNum / this.animationStep);
                this.totalNumStep < 1 && (this.totalNumStep = 1);
                this.totalNumCount = 0;
                this.animationText();
            } else {
                /*
                this.totalText.text( this.totalNum + '' );
                this.totalTextPostfix.x( this.totalText.textWidth + 5 );
                this.totalTextGroup.x(  ( this.width - this.totalTextPostfix.textWidth -  this.totalText.textWidth - 5 ) / 2 );
                */
            }

            !this.inited && this.animationCircleLine();

            this.inited = 1;
        }
    }, {
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this6 = this;

            if (this.isDestroy) return;
            if (!this.circleLine) return;

            if (!this.isAnimation()) {
                return;
            }

            this.circleLine.rotation.z -= .03;

            window.requestAnimationFrame(function () {
                _this6.animationCircleLine();
            });
        }
    }, {
        key: 'animationText',
        value: function animationText() {
            var _this7 = this;

            if (this.isDestroy) return;

            if (this.totalNumCount >= this.totalNum) {
                return;
            }
            this.totalNumCount += this.totalNumStep;

            if (this.totalNumCount >= this.totalNum || !this.isAnimation()) {
                this.totalNumCount = this.totalNum;
            };

            /*
            this.totalText.text( this.totalNumCount );
            this.totalTextPostfix.x( this.totalText.textWidth + 5 );
             this.totalTextGroup.x(  ( this.width - this.totalTextPostfix.textWidth -  this.totalText.textWidth - 5 ) / 2 );
             this.layoutLayer.add( this.totalTextGroup );
            */

            window.requestAnimationFrame(function () {
                _this7.animationText();
            });
        }
    }, {
        key: 'drawText',
        value: function drawText() {

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
    }, {
        key: 'drawTextRect',
        value: function drawTextRect() {

            var textWidth = this.tmpTotalText.textWidth + 30 + this.totalTextPostfix.textWidth + 5,
                textX = 0,
                textY = 0;

            if (textWidth < 170) {
                textWidth = 170;
            }
            textX = this.cx - textWidth / 2 + 2;;

            textY = this.textY - (this.textHeight - this.totalText.textHeight) / 2;

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

            var points = [];
            points.push('M', [textX, textY + this.textLineLength].join(','));
            points.push('L', [textX, textY].join(','));
            points.push('L', [textX + this.textLineLength, textY].join(','));

            points.push('M', [textX + textWidth - this.textLineLength, textY].join(','));
            points.push('L', [textX + textWidth, textY].join(','));
            points.push('L', [textX + textWidth, textY + this.textLineLength].join(','));

            points.push('M', [textX + textWidth, textY + this.textHeight - this.textLineLength].join(','));
            points.push('L', [textX + textWidth, textY + this.textHeight].join(','));
            points.push('L', [textX + textWidth - this.textLineLength, textY + this.textHeight].join(','));

            points.push('M', [textX + this.textLineLength, textY + this.textHeight].join(','));
            points.push('L', [textX, textY + this.textHeight].join(','));
            points.push('L', [textX, textY + this.textHeight - this.textLineLength].join(','));

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
    }, {
        key: 'drawArcText',
        value: function drawArcText() {
            if (!(this.textAr && this.textAr.length)) return;

            this.textAr.map(function (val) {
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
    }, {
        key: 'drawArcLine',
        value: function drawArcLine() {

            var line = new _three5.MeshLine(),
                points,
                geometryy,
                material,
                circle,
                curve;

            curve = new THREE.EllipseCurve(0, this.fixCy(), // ax, aY
            this.arcLineRaidus, this.arcLineRaidus, geometry.radians(this.arcAngleOffset), geometry.radians(this.arcAngle + this.arcAngleOffset), false, // aClockwise
            0 // aRotation
            );

            points = curve.getPoints(200);
            geometryy = new THREE.Geometry().setFromPoints(points);

            line.setGeometry(geometryy);

            material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 1
            });

            circle = new THREE.Mesh(line.geometry, material);

            circle.renderOrder = -1;
            circle.material.depthTest = false;

            this.scene.add(circle);
            this.addDestroy(circle);
        }
    }, {
        key: 'drawArcPartLine',
        value: function drawArcPartLine() {

            var partpoints = void 0,
                geometryy = void 0,
                line = void 0,
                material = void 0,
                part = void 0,
                indices = void 0,
                count = 0;
            var vertices, positions, geometry, i;

            partpoints = [], indices = [];
            line = new _three5.MeshLine();

            this.arcPartLineAr.map(function (item, key) {
                partpoints.push(new THREE.Vector3(item.start.x, item.start.y, 1), new THREE.Vector3(item.end.x, item.end.y, 1));
                indices.push(key);
            });
            this.arcOutlinePartAr.map(function (item, key) {
                partpoints.push(new THREE.Vector3(item.start.x, item.start.y, 1), new THREE.Vector3(item.end.x, item.end.y, 1));
                indices.push(key);
            });

            console.log(partpoints);

            material = new THREE.LineBasicMaterial({
                color: this.lineColor
            });

            vertices = partpoints;
            indices = [];
            vertices.map(function (item, key) {
                indices.push(key);
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
            this.scene.add(line);
        }
    }, {
        key: 'drawArc',
        value: function drawArc() {

            var line = void 0,
                material = void 0,
                geometryx = void 0,
                mesh = void 0,
                arc = void 0,
                tmp = void 0,
                color = void 0;

            color = 0xffffff;

            geometryx = new THREE.RingGeometry(this.arcInRadius, this.arcOutRadius, 256, 1, geometry.radians(this.arcAngleOffset), geometry.radians(this.arcAngle));

            var texture = new THREE.Texture(this.generateGradientTexture());
            texture.needsUpdate = true; // important!

            material = new THREE.MeshBasicMaterial({ /*color: color,*/map: texture, side: THREE.DoubleSide, transparent: true });
            arc = new THREE.Mesh(geometryx, material);
            //arc.rotation.z = geometry.radians( -80 );
            //arc.renderOrder = 1;

            arc.position.y = this.fixCy();
            /*
            arc.renderOrder = 1;
            arc.material.depthTest=false;
            */

            this.scene.add(arc);
            this.addDestroy(arc);
        }
    }, {
        key: 'generateGradientTexture',
        value: function generateGradientTexture() {

            var size = geometry3d.resizeToBit(this.width * this.arcOutPercent * this.sizeRate * 2);

            // create canvas
            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            // get context
            var context = canvas.getContext('2d');

            // draw gradient
            context.rect(-size / 2, -size / 2, size + size / 2, size + size / 2);
            var gradient = context.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#5a78ca');
            gradient.addColorStop(0.4, '#64b185');
            gradient.addColorStop(1, '#ff9000');
            context.fillStyle = gradient;
            context.fill();
            return canvas;
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {

            /*
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
             */

            if (!this.inited) {
                /*
                this.angle = this.arcOffset - 2;
                            this.layer.add( this.group );
                this.layer.add( this.roundLine );
                this.layer.add( this.percentText );
                //this.layer.add( this.percentSymbolText );
                 this.drawArcText();
                this.drawText();
                this.drawTextRect();
                */
                this.drawArc();
                this.drawArcLine();
                this.drawInnerCircle();
                this.drawInnerText();
                this.drawCircle();
                this.drawCircleLine();
                this.drawArcPartLine();
            }
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this8 = this;

            //console.log( this.angle, this.animationAngle );
            if (this.isDestroy) return;
            if (this.angle > this.animationAngle) return;

            this.angle += this.rateStep;

            if (this.angle >= this.animationAngle || !this.isAnimation()) {
                this.angle = this.animationAngle;
            };

            this.updateWedge();

            //this.stage.add( this.layer );

            window.requestAnimationFrame(function () {
                _this8.animation();
            });
        }
    }, {
        key: 'updateWedge',
        value: function updateWedge() {
            /*
            let point = geometry.distanceAngleToPoint(  this.roundRadius + 6, this.angle )
            this.group.x( this.cx + point.x );
            this.group.y( this.cy + point.y );
            this.group.rotation( this.angle + 90 );
            this.group.rotation( this.angle + 90 );
            this.stage.add( this.layer );
            */
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {}
    }, {
        key: 'animationLine',
        value: function animationLine() {}
    }, {
        key: 'addIcon',
        value: function addIcon(path, layer) {}
    }, {
        key: 'addText',
        value: function addText(path, layer) {}
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {}
    }, {
        key: 'drawInnerText',
        value: function drawInnerText() {
            if (!this.inited) {
                var fontSize = geometry3d.to3d(50);
                var texture = new _three2.default({
                    text: this.getAttackText(),
                    fontFamily: 'HuXiaoBoKuHei, "Times New Roman", Times, serif',
                    fontSize: fontSize * 2,
                    fontStyle: 'italic'
                });
                var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
                var sprite = new THREE.Sprite(material);
                sprite.scale.setX(texture.imageAspect).multiplyScalar(fontSize);
                this.percentText = sprite;

                this.stage.add(this.percentText);
            }
        }
    }, {
        key: 'drawInnerCircle',
        value: function drawInnerCircle() {
            this.innerCircleRadius = geometry3d.to3d(this.roundRadius);
            var line = new _three5.MeshLine();

            var curve = new THREE.EllipseCurve(0, this.fixCy(), // ax, aY
            this.innerCircleRadius, this.innerCircleRadius, 0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
            );

            var points = curve.getPoints(200);
            var geometryy = new THREE.Geometry().setFromPoints(points);

            curve = new THREE.EllipseCurve(0, this.fixCy(), // ax, aY
            this.innerCircleRadius, this.innerCircleRadius, 0, geometry.radians(10), // aStartAngle, aEndAngle
            false, // aClockwise
            geometry.radians(.5) // aRotation
            );

            points = [].concat(_toConsumableArray(points), _toConsumableArray(curve.getPoints(50)));

            geometryy = new THREE.Geometry().setFromPoints(points);

            line.setGeometry(geometryy);
            var material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 3
            });

            var circle = new THREE.Mesh(line.geometry, material);

            circle.renderOrder = -1;
            circle.material.depthTest = false;

            this.scene.add(circle);
            this.addDestroy(circle);
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
            this.circleRadius = geometry3d.to3d(Math.ceil(this.circlePercent * this.max / 2) * this.sizeRate);
            //console.log( this.circleRadius );

            var line = new _three5.MeshLine();

            var curve = new THREE.EllipseCurve(0, this.fixCy(), // ax, aY
            this.circleRadius, this.circleRadius, 0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
            );

            var points = curve.getPoints(200);
            var geometryy = new THREE.Geometry().setFromPoints(points);

            curve = new THREE.EllipseCurve(0, this.fixCy(), // ax, aY
            this.circleRadius, this.circleRadius, 0, geometry.radians(10), // aStartAngle, aEndAngle
            false, // aClockwise
            geometry.radians(.5) // aRotation
            );

            points = [].concat(_toConsumableArray(points), _toConsumableArray(curve.getPoints(50)));

            geometryy = new THREE.Geometry().setFromPoints(points);

            line.setGeometry(geometryy);
            var material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 1
            });

            var circle = new THREE.Mesh(line.geometry, material);

            circle.renderOrder = -1;
            circle.material.depthTest = false;

            this.scene.add(circle);
            this.addDestroy(circle);
        }
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = geometry3d.to3d(Math.ceil(this.circleLinePercent * this.max / 2));

            var material = void 0,
                geometryItem = void 0,
                circle = void 0,
                group = void 0,
                line = void 0;

            group = new THREE.Group();

            line = new _three5.MeshLine();
            material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 1
            });
            geometryItem = new THREE.CircleGeometry(this.circleLineRadius, 128, geometry.radians(90), geometry.radians(90));
            geometryItem.vertices.shift();
            line.setGeometry(geometryItem);
            circle = new THREE.Line(line.geometry, material);
            circle.renderOrder = -1;
            circle.material.depthTest = false;
            group.add(circle);
            this.addDestroy(circle);

            line = new _three5.MeshLine();
            material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 1
            });
            geometryItem = new THREE.CircleGeometry(this.circleLineRadius, 128, geometry.radians(0), geometry.radians(-90));
            geometryItem.vertices.shift();
            line.setGeometry(geometryItem);
            circle = new THREE.Line(line.geometry, material);
            circle.renderOrder = -1;
            circle.material.depthTest = false;

            group.position.y = this.fixCy();

            group.add(circle);
            this.addDestroy(circle);

            this.circleLine = group;

            this.scene.add(group);
            this.addDestroy(group);
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'destroy', this).call(this);
            this.textRoundAngle.map(function (val) {
                if (val.ins) val.ins.destroy();
            });
        }
    }]);

    return Gauge;
}(_base2.default);

exports.default = Gauge;