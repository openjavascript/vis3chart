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

var _roundstatetext = require('../icon/roundstatetext.js');

var _roundstatetext2 = _interopRequireDefault(_roundstatetext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var THREE = require('three');

var Gauge = function (_VisChartBase) {
    _inherits(Gauge, _VisChartBase);

    function Gauge(box, width, height, camera) {
        _classCallCheck(this, Gauge);

        var _this = _possibleConstructorReturn(this, (Gauge.__proto__ || Object.getPrototypeOf(Gauge)).call(this, box, width, height, camera));

        _this.cx = 0;
        _this.cy = 0;
        _this.cpoint = { x: 0, y: 0 };

        _this.name = 'Gauge' + Date.now();

        _this.clearTextList = [];
        return _this;
    }

    _createClass(Gauge, [{
        key: '_setSize',
        value: function _setSize(width, height) {
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), '_setSize', this).call(this, width, height);

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
            this.partAngle = this.arcAngle / this.part;
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

            this.textRoundRadius = this.width * this.textRoundPercent * this.sizeRate;

            this.roundRadius = this.width * this.roundRadiusPercent * this.sizeRate;

            this.arcInRadius = geometry3d.to3d(this.width * this.arcInPercent * this.sizeRate);
            this.arcOutRadius = geometry3d.to3d(this.width * this.arcOutPercent * this.sizeRate);

            this.arcLineRaidus = geometry3d.to3d(Math.ceil(this.arcLinePercent * this.max) * this.sizeRate);
            this.arcTextLength = geometry3d.to3d(this.arcTextLength);

            this.textWidth = this.textRectWidthPercent * this.width;
            this.textHeight = 38 * this.sizeRate;
            this.textX = this.cx - this.textWidth / 2;
            this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;

            this.textRoundAngle.map(function (val, key) {
                var point = geometry.distanceAngleToPoint(geometry3d.to3d(_this3.textRoundRadius), -val.angle);
                val.point = point;
            });

            this.arcPartLineAr = [];
            this.arcOutlinePartAr = [];
            this.textAr = [];

            for (var i = 0; i <= this.part; i++) {
                var start = void 0,
                    end = void 0,
                    angle = void 0;
                angle = (this.part - i) * this.partAngle + this.arcOffset;

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
                    if (i) {
                        angleOffset = 0;
                    }

                    if (i >= 19) {
                        //angleOffset = 14;
                        rotationOffset = -2;
                        angleOffset = -2;
                    }
                    if (i >= 21) {
                        //angleOffset = 18;
                        angleOffset = -5;
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
        }
    }, {
        key: 'initRoundText',
        value: function initRoundText() {
            var _this4 = this;

            this.textRoundAngle.map(function (val) {

                if (!val.ins) {
                    val.ins = new _roundstatetext2.default(_this4.box, _this4.width, _this4.height, _this4.camera);
                    val.ins.setOptions(Object.assign(val, {
                        stage: _this4.stage,
                        scene: _this4.scene,
                        data: _this4.data,
                        allData: _this4.allData,
                        lineColor: _this4.lineColor
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
        key: 'setOptions',
        value: function setOptions(json) {
            if (json.stage) {
                var group = new THREE.Group();
                json.stage.add(group);
                this.addDestroy(group);

                json.stage = group;

                json.stage.position.y += -geometry3d.to3d(20);
            }
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'setOptions', this).call(this, json);
        }
    }, {
        key: 'clearText',
        value: function clearText() {
            var _this5 = this;

            //console.log( 'clearText', this.clearTextList );

            this.clearTextList.map(function (item, key) {
                _this5.dispose(item);
            });

            this.clearTextList = [];
        }
    }, {
        key: 'update',
        value: function update(data, allData) {
            var _this6 = this;

            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'update', this).call(this, data, allData);

            this.clearText();

            if (data && data.data && data.data.length) {
                data.data.map(function (val) {
                    _this6.curRate = val.value;
                    _this6.totalNum = val.total;
                });
            } else {
                this.curRate = 0;
                this.totalNum = 0;
            }

            this.initDataLayout();

            this.angle = this.arcOffset + this.arcOffsetPad;
            this.animationAngle = this.getAttackRateAngle() + this.arcOffsetPad;

            this.updateArrow();

            if (this.curRate) {
                this.rateStep = Math.floor(this.curRate / (this.animationStep * 2));
                this.angleStep = Math.abs(this.animationAngle) / this.animationStep;
            }

            !this.isRunAnimation && this.animation();

            if (parseInt(this.totalNum)) {
                this.totalNumStep = Math.floor(this.totalNum / this.animationStep);
                this.totalNumStep < 1 && (this.totalNumStep = 1);
                this.totalNumCount = 0;
                this.animationText();
            } else {}

            !this.inited && this.animationCircleLine();

            this.inited = 1;
        }
    }, {
        key: 'resize',
        value: function resize(width, height) {
            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var allData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'resize', this).call(this, width, height, data, allData);
        }
    }, {
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this7 = this;

            if (this.isDestroy) return;
            if (!this.circleLine) return;

            if (!this.isAnimation()) {
                return;
            }

            this.circleLine.rotation.z -= .03;

            window.requestAnimationFrame(function () {
                _this7.animationCircleLine();
            });
        }
    }, {
        key: 'animationText',
        value: function animationText() {
            var _this8 = this;

            if (this.isDestroy) return;

            if (this.totalNumCount >= this.totalNum) {
                return;
            }
            this.totalNumCount += this.totalNumStep;

            if (this.totalNumCount >= this.totalNum || !this.isAnimation()) {
                this.totalNumCount = this.totalNum;
            };

            this.totalTextTexture.text = this.totalNumCount + '';
            this.totalTextTexture.redraw();

            window.requestAnimationFrame(function () {
                _this8.animationText();
            });
        }
    }, {
        key: 'drawText',
        value: function drawText() {
            var _this9 = this;

            if (this.totalTextGroup) {
                this.dispose(this.totalTextGroup);
            }

            this.totalTextGroup = new THREE.Group();
            this.stage.add(this.totalTextGroup);
            this.addDestroy(this.totalTextGroup);

            var fontSize = geometry3d.to3d(36);
            var fontSize1 = geometry3d.to3d(36);
            var labelFontSize = geometry3d.to3d(22);
            var params = {
                text: 0 + '',
                fontFamily: '"Agency FB",MicrosoftYaHei',
                fontSize: fontSize * 2,
                fontStyle: 'italic',
                letterSpacing: 1.5
                //, fontWeight: 'bold'
            },
                colorParams = {
                color: this.textColor
            },
                tmpParams = _jsonUtilsx2.default.clone(params),
                labelParams = _jsonUtilsx2.default.clone(params);

            params.text = this.totalNum + '';
            tmpParams.text = this.totalNum + '';

            labelParams = Object.assign(labelParams, {
                fontSize: labelFontSize,
                fontFamily: 'MicrosoftYaHei',
                text: this.totalPostfix,
                fontWeight: 'normal'
            });

            this.tmpTotalText = this.createText(fontSize, colorParams, tmpParams, function (sprite) {
                sprite.position.x = Math.pow(10, 10);
            }, this.totalTextGroup);
            this.tmpTotalText.matrixWorldNeedsUpdate = true;

            this.render();

            this.totalTextPostfix = this.createText(labelFontSize, colorParams, labelParams, function (sprite) {
                sprite.position.x = _this9.tmpTotalText.scale.x / 2 + sprite.scale.x / 2 - geometry3d.to3d(5);
            }, this.totalTextGroup);

            this.totalText = this.createText(fontSize, colorParams, params, function (sprite, material, texture) {
                sprite.position.x = _this9.totalTextPostfix.position.x - _this9.totalTextPostfix.scale.x / 2 - sprite.scale.x / 2 + geometry3d.to3d(5);
                texture.text = '0';
                _this9.totalTextTexture = texture;
            }, this.totalTextGroup);

            this.totalTextGroup.position.y = -(this.arcOutRadius + geometry3d.to3d(25));
            this.totalTextGroup.position.x = -(this.totalTextPostfix.scale.x / 2);
        }
    }, {
        key: 'drawTextRect',
        value: function drawTextRect() {
            this.dispose(this.textReatGroupIns);

            var textWidth = (this.totalTextPostfix.position.x + this.totalTextPostfix.scale.x / 2) * 2 + 5,
                heightPad = 0,
                rectHeight = geometry3d.to3d(28),
                textX = 0,
                textY = -(this.arcOutRadius + geometry3d.to3d(25));

            if (textWidth < 170) {
                textWidth = 170;
            }

            textWidth = geometry3d.to3d(textWidth);

            var group = new THREE.Group();
            group.transparent = true;

            var bgGeometry = new THREE.PlaneGeometry(textWidth, rectHeight, 32, 32);
            var bgMaterial = new THREE.MeshBasicMaterial({
                color: this.parseColor(this.lineColor),
                side: THREE.DoubleSide,
                opacity: .2,
                transparent: true
            });
            var bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);

            bgPlane.position.y = textY - Math.abs(this.getPosition(this.tmpTotalText.matrixWorld).y);

            group.add(bgPlane);
            this.addDestroy(bgPlane);

            var partpoints = void 0,
                geometryy = void 0,
                line = void 0,
                material = void 0,
                part = void 0,
                indices = void 0,
                count = 0;
            var vertices, positions, geometry, i;

            partpoints = [], indices = [];

            var height = this.getBoxSize(bgPlane).y;
            var top = this.getPosition(bgPlane.matrixWorld).y + 2;
            var arrowLength = geometry3d.to3d(6);

            var points = [{
                start: { x: -textWidth / 2 + arrowLength, y: top + arrowLength * 2 },
                end: { x: -textWidth / 2, y: top + arrowLength * 2 }
            }, {
                start: { x: -textWidth / 2, y: top + arrowLength * 2 },
                end: { x: -textWidth / 2, y: top + arrowLength * 1 }
            }, {
                start: { x: -textWidth / 2 + arrowLength, y: top - height + arrowLength * 2 },
                end: { x: -textWidth / 2, y: top - height + arrowLength * 2 }
            }, {
                start: { x: -textWidth / 2, y: top - height + arrowLength * 2 },
                end: { x: -textWidth / 2, y: top - height + arrowLength * 3 }
            }, {
                start: { x: textWidth / 2 - arrowLength, y: top + arrowLength * 2 },
                end: { x: textWidth / 2, y: top + arrowLength + arrowLength * 1 }
            }, {
                start: { x: textWidth / 2, y: top + arrowLength * 2 },
                end: { x: textWidth / 2, y: top + arrowLength }
            }, {
                start: { x: textWidth / 2 - arrowLength, y: top - height + arrowLength * 2 },
                end: { x: textWidth / 2, y: top - height + arrowLength * 2 }
            }, {
                start: { x: textWidth / 2, y: top - height + arrowLength * 2 },
                end: { x: textWidth / 2, y: top - height + arrowLength * 3 }
            }];

            points.map(function (item, key) {
                partpoints.push(new THREE.Vector3(item.start.x, item.start.y, 1), new THREE.Vector3(item.end.x, item.end.y, 1));
                indices.push(key);
            });

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
            group.add(line);
            this.addDestroy(line);

            this.textReatGroupIns = group;

            this.scene.add(group);
            this.addDestroy(group);
        }
    }, {
        key: 'drawArcText',
        value: function drawArcText() {
            var _this10 = this;

            if (!(this.textAr && this.textAr.length)) return;

            this.textAr.map(function (val, key) {
                var fontSize = geometry3d.to3d(16);
                var text = _this10.createText(fontSize, {
                    color: _this10.lineColor,
                    rotation: geometry.radians(val.angle + 90 + (val.rotationOffset || 0) + 180)
                }, {
                    text: val.text + '',
                    fontFamily: 'MicrosoftYaHei, "Times New Roman", Times, serif',
                    fontSize: fontSize * 2
                }, function (sprite) {
                    sprite.position.x = val.point.x;
                    sprite.position.y = val.point.y;

                    _this10.clearTextList.push(sprite);
                });
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

            this.stage.add(circle);
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

            this.arcPartLineAr.map(function (item, key) {
                partpoints.push(new THREE.Vector3(item.start.x, item.start.y, 1), new THREE.Vector3(item.end.x, item.end.y, 1));
                indices.push(key);
            });
            this.arcOutlinePartAr.map(function (item, key) {
                partpoints.push(new THREE.Vector3(item.start.x, item.start.y, 1), new THREE.Vector3(item.end.x, item.end.y, 1));
                indices.push(key);
            });

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
            this.stage.add(line);
            this.addDestroy(line);
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

            arc.position.y = this.fixCy();

            this.stage.add(arc);
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

            this.drawArcText();
            if (!this.inited) {
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
    }, {
        key: 'drawArrow',
        value: function drawArrow() {

            this.dispose(this.arrowIcon);
            this.preAngle = 0;

            var group = new THREE.Group();

            var geo = void 0,
                mat = void 0,
                tri = void 0,
                width = geometry3d.to3d(5),
                top = geometry3d.to3d(14);

            geo = new THREE.Geometry();
            geo.vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(width, 0, 0), new THREE.Vector3(0, top, 0)];

            geo.faces.push(new THREE.Face3(0, 1, 2));
            geo.faces[0].color.setHex(0x973500);
            geo.center();

            mat = new THREE.MeshBasicMaterial({
                color: 0x973500,
                vertexColors: THREE.FaceColors
                //, wireframe: true
                //, wireframeLinewidth: 1
            });
            mat.depthTest = false;
            tri = new THREE.Mesh(geo, mat);
            tri.renderOrder = -3;
            tri.position.x = width;
            group.add(tri);
            this.addDestroy(tri);

            geo = new THREE.Geometry();
            geo.vertices = [new THREE.Vector3(-width, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, top, 0)];

            geo.faces.push(new THREE.Face3(0, 1, 2));
            geo.faces[0].color.setHex(0xff5a00);
            geo.center();

            mat = new THREE.MeshBasicMaterial({
                color: 0xff5a00,
                vertexColors: THREE.FaceColors
                //, wireframe: true
                //, wireframeLinewidth: 1
            });
            mat.depthTest = false;
            tri = new THREE.Mesh(geo, mat);
            tri.renderOrder = -3;
            group.add(tri);
            this.addDestroy(tri);

            this.arrowIcon = group;

            group.renderOrder = -3;

            this.stage.add(group);
            this.addDestroy(group);
        }
    }, {
        key: 'updateArrow',
        value: function updateArrow() {
            if (isNaN(this.angle)) {
                this.angle = -55;
            }
            var angle = -(-180 + this.angle);

            if (this.preAngle === this.angle) return;
            this.preAngle = this.angle;

            var point = geometry.distanceAngleToPoint(this.innerCircleRadius + geometry3d.to3d(6), angle);

            this.arrowIcon.position.x = point.x;
            this.arrowIcon.position.y = point.y;

            this.arrowIcon.rotation.z = geometry.radians(angle - 90);
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this11 = this;

            if (this.isDestroy) {
                this.isRunAnimation = false;
                return;
            }
            if (this.angle > this.animationAngle) {
                this.isRunAnimation = false;
                return;
            }
            this.isRunAnimation = true;

            this.angle += this.angleStep;

            if (this.angle >= this.animationAngle || !this.isAnimation()) {
                this.angle = this.animationAngle;
            };

            this.updateArrow();

            window.requestAnimationFrame(function () {
                _this11.animation();
            });
        }
    }, {
        key: 'drawInnerText',
        value: function drawInnerText() {
            if (!this.inited) {
                var fontSize = geometry3d.to3d(46);
                this.percentText = this.createText(fontSize, { color: 0xffffff }, {
                    text: this.getAttackText(),
                    fontFamily: 'HuXiaoBoKuHei, "Times New Roman", Times, serif',
                    fontSize: fontSize * 2,
                    fontStyle: 'italic'
                });
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

            this.stage.add(circle);
            this.addDestroy(circle);
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
            this.circleRadius = geometry3d.to3d(Math.ceil(this.circlePercent * this.max / 2) * this.sizeRate);

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

            this.stage.add(circle);
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

            this.stage.add(group);
            this.addDestroy(group);
        }
    }, {
        key: 'fixCx',
        value: function fixCx() {
            return 0;
        }
    }, {
        key: 'fixCy',
        value: function fixCy() {
            return 0;
        }
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