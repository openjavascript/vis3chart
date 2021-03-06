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

var Dount = function (_VisChartBase) {
    _inherits(Dount, _VisChartBase);

    function Dount(box, width, height, camera) {
        _classCallCheck(this, Dount);

        var _this = _possibleConstructorReturn(this, (Dount.__proto__ || Object.getPrototypeOf(Dount)).call(this, box, width, height, camera));

        _this.name = 'Dount_' + Date.now();
        return _this;
    }

    _createClass(Dount, [{
        key: '_setSize',
        value: function _setSize(width, height) {
            _get(Dount.prototype.__proto__ || Object.getPrototypeOf(Dount.prototype), '_setSize', this).call(this, width, height);

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
                "1": [],
                "2": [],
                "4": [],
                "8": []
            };

            this.lineWidth = 32;
            this.lineSpace = 10;
            this.lineAngle = 35;
            this.lineHeight = 15;
            this.lineCurveLength = 30;

            this.loopSort = [4, 8, 1, 2];

            this.clearList = [];

            this.outRadius = 73;
            this.inRadius = 53;

            this.lineLength = 25;
            this.lineLengthCount = 1;
            this.lineLengthStep = .5;

            this.lineLeft = this.fixCx() - this.outRadius - this.lineSpace;
            this.lineRight = this.fixCx() + this.outRadius + this.lineSpace;

            this.init();
        }
    }, {
        key: 'init',
        value: function init() {
            geometry3d.screenWidth = this.width;
            geometry3d.screenHeight = this.height;
            geometry3d.camera = this.camera;

            this.calcLayoutPosition();
            return this;
        }
    }, {
        key: 'update',
        value: function update(data, allData) {
            _get(Dount.prototype.__proto__ || Object.getPrototypeOf(Dount.prototype), 'update', this).call(this, data, allData);
            //console.log( THREE );

            this.data = data;
            this.allData = allData;

            this.countAngle = 0;
            this.isDone = 0;
            this.lineLengthCount = 0;

            if (!_jsonUtilsx2.default.jsonInData(this.data, 'data')) return;

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
    }, {
        key: 'reset',
        value: function reset() {
            this.path.map(function (val) {
                val.pathData = [];
            });
        }
    }, {
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this2 = this;

            if (this.isDestroy) return;
            if (!this.circleLine) return;

            if (!this.isAnimation()) {
                return;
            }

            this.circleLine.rotation.z -= .03;

            window.requestAnimationFrame(function () {
                _this2.animationCircleLine();
            });
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this3 = this;

            if (this.isDestroy) return;
            if (this.isDone) return;

            var tmp = void 0,
                tmppoint = void 0,
                step = this.angleStep;

            this.countAngle -= this.animationStep;

            if (!this.isSeriesAnimation()) {
                this.countAngle = this.totalAngle;
            }

            if (this.countAngle <= this.totalAngle || !this.isAnimation()) {
                this.countAngle = this.totalAngle;
                this.isDone = 1;
            }

            this.reset();

            for (var i = this.path.length - 1; i >= 0; i--) {
                //for( let i = 0; i < this.path.length; i++ ){
                //let i = 2;
                var item = this.path[i];

                var tmpAngle = this.countAngle;

                if (tmpAngle <= item.itemData.endAngle) {
                    tmpAngle = item.itemData.endAngle;
                }

                if (tmpAngle > item.itemData.startAngle) continue;

                var geometryx = new THREE.RingGeometry(this.inRadius, this.outRadius, 256, 1, geometry.radians(0), geometry.radians(tmpAngle));

                item.arc.geometry.dispose();
                item.arc.geometry = geometryx;
            }

            window.requestAnimationFrame(function () {
                _this3.animation();
            });

            if (this.isDone) {
                window.requestAnimationFrame(function () {
                    _this3.animationLine();
                });
            }
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
            this.circleRadius = geometry3d.to3d(Math.ceil(this.circlePercent * this.min / 2));
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
                lineWidth: 2
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
            this.circleLineRadius = geometry3d.to3d(Math.ceil(this.circleLinePercent * this.min / 2));

            var material = void 0,
                geometryItem = void 0,
                circle = void 0,
                group = void 0,
                line = void 0;

            group = new THREE.Group();

            line = new _three5.MeshLine();
            material = new _three5.MeshLineMaterial({
                color: new THREE.Color(this.lineColor),
                lineWidth: 2
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
                lineWidth: 2
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
        key: 'initDataLayout',
        value: function initDataLayout() {

            this.drawCircle();
            this.drawCircleLine();

            this.path = [];
            this.line = [];

            for (var ii = this.data.data.length - 1; ii >= 0; ii--) {
                var val = this.data.data[ii],
                    key = ii;
                var pathindex = this.data.data.length - 1 - ii;

                var color = this.colors[key % this.colors.length];

                if (_jsonUtilsx2.default.jsonInData(val, 'itemStyle.color')) {
                    //path.fill( val.itemStyle.color );
                    color = val.itemStyle.color;
                }
                color = this.parseColor(color);

                var line = void 0,
                    material = void 0,
                    geometryx = void 0,
                    mesh = void 0,
                    arc = void 0,
                    tmp = void 0;

                line = new _three5.MeshLine();
                material = new _three5.MeshLineMaterial({
                    color: new THREE.Color(0xffffff),
                    lineWidth: 2
                });
                geometryx = new THREE.Geometry();
                line.setGeometry(geometryx);
                mesh = new THREE.Mesh(line.geometry, material);
                mesh.position.y = this.fixCy();

                this.scene.add(mesh);
                this.addDestroy(mesh);
                this.line.push(mesh);

                geometryx = new THREE.RingGeometry(this.inRadius, this.outRadius, 256, 1, geometry.radians(0), geometry.radians(-0.1));
                material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
                arc = new THREE.Mesh(geometryx, material);
                arc.renderOrder = 1;

                arc.position.y = this.fixCy();

                this.scene.add(arc);
                this.addDestroy(arc);

                tmp = {
                    arc: arc,
                    pathData: [],
                    itemData: val,
                    line: mesh,
                    mline: line,
                    realIndex: ii
                };

                this.path.push(tmp);
            };

            return this;
        }
    }, {
        key: 'animationLine',
        value: function animationLine() {
            var _this4 = this;

            if (this.lineLengthCount >= this.lineLength) {
                return;
            }
            this.lineLengthCount = this.lineLength;

            this.lineLengthCount += this.lineLengthStep;

            if (this.lineLengthCount >= this.lineLength || !this.isAnimation()) {
                this.lineLengthCount = this.lineLength;
            }
            for (var i = 0; i < this.path.length; i++) {
                var path = this.path[i];
                var layer = this.arcLayer;

                var lineEnd = path.itemData.lineEnd;
                var lineExpend = path.itemData.lineExpend;

                var line = this.line[i];

                var meshline = new _three5.MeshLine();
                var geometryx = new THREE.Geometry();
                geometryx.vertices.push(new THREE.Vector3(path.itemData.lineStart.x, path.itemData.lineStart.y, 0), new THREE.Vector3(lineEnd.x, lineEnd.y, 0), new THREE.Vector3(lineExpend.x, lineExpend.y, 0));
                meshline.setGeometry(geometryx);
                line.geometry = meshline.geometry;

                if (this.lineLengthCount >= this.lineLength) {
                    this.addIcon(path, layer, path.realIndex);
                    this.addText(path, layer, path.realIndex);
                } else {
                    window.requestAnimationFrame(function () {
                        _this4.animationLine();
                    });
                }
            }
        }
    }, {
        key: 'addIcon',
        value: function addIcon(path, layer, key) {
            if (!path.lineicon) {
                var geometry = new THREE.CircleGeometry(3, 32);
                var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                var circle = new THREE.Mesh(geometry, material);
                path.lineicon = circle;
                this.scene.add(circle);
                this.addDestroy(circle);
            }

            path.lineicon.position.x = path.itemData.lineExpend.x;
            path.lineicon.position.y = path.itemData.lineExpend.y + this.fixCy();
        }
    }, {
        key: 'addText',
        value: function addText(path, layer, key) {
            if (!path.text) {
                path.text = this.textar[key];
                this.scene.add(path.text);
                this.addDestroy(path.text);
            }

            var text = path.text;

            var textPoint = path.itemData.textPoint,
                angleDirect = path.itemData.pointDirection.autoAngle();

            textPoint = _jsonUtilsx2.default.clone(path.itemData.lineEnd);

            var textX = textPoint.x,
                textY = textPoint.y + this.fixCy(),
                direct = path.itemData.pointDirection.auto();
            text.position.x = textX;
            text.position.y = textY;

            var position = new THREE.Vector3();
            position.setFromMatrixPosition(text.matrixWorld);

            text.position.y = textY + text.scale.y / 2 - geometry3d.to3d(3);

            switch (angleDirect) {
                case 8:
                case 1:
                    {
                        text.position.x = textX - text.scale.x / 2 + 2;
                        break;
                    }
                default:
                    {
                        text.position.x = textX + text.scale.x / 2 - 2;
                        break;
                    }
            }
        }
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {
            this.inRadius = geometry3d.to3d(Math.ceil(this.inPercent * this.min / 2));
            this.outRadius = geometry3d.to3d(Math.ceil(this.outPercent * this.min / 2));

            this.lineHeight = geometry3d.to3d(24);
            this.lineWidth = geometry3d.to3d(50);
            this.lineLength = geometry3d.to3d(22);

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clearItems();
            _get(Dount.prototype.__proto__ || Object.getPrototypeOf(Dount.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'clearItems',
        value: function clearItems() {
            var _this5 = this;

            this.clearList.map(function (item, key) {
                _this5.dispose(item);
            });
            this.clearList = [];
        }
    }, {
        key: 'initText',
        value: function initText() {
            var _this6 = this;

            this.textar = [];

            this.realLineWidth = this.lineWidth;

            this.data.data.map(function (val, key) {
                var fontSize = geometry3d.to3d(25);
                var sprite = _this6.createText(fontSize, { color: _this6.lineColor }, {
                    //text: `${val.percent}%`,
                    text: _this6.getLabel(val),
                    fontFamily: 'MicrosoftYaHei',
                    //fontSize: fontSize * 2,
                    fontSize: fontSize * 2,
                    fontStyle: 'italic'
                }, function (sprite) {
                    sprite.position.x = -10000;
                });
                _this6.clearList.push(sprite);
                _this6.textar.push(sprite);
            });
        }
    }, {
        key: 'calcVal',
        value: function calcVal() {
            var _this7 = this;

            if (!this.data) return;

            var total = 0,
                tmp = 0;

            this.data.data.map(function (val) {
                //console.log( val );
                total += val.value;
            });
            this.total = total;

            this.data.data.map(function (val) {
                val._percent = val.value / total;

                var precision = _this7.getPrecision(val) * 10;
                val.percent = Math.round(Math.floor(val._percent * 100 * precision) / 10) / _this7.getPrecision(val);

                val._percent = val.percent / 100;
                tmp = tmp + val._percent;
                val._totalPercent = tmp;

                val.endAngle = _this7.totalAngle * val._totalPercent;
            });

            //修正浮点数精确度
            if (this.data.data.length) {
                var val = this.data.data[this.data.data.length - 1];
                val._totalPercent = 1;
                val._percent = 1 - (tmp - val._percent);

                var precision = this.getPrecision(val) * 10;
                val.percent = Math.round(Math.floor(val._percent * 100 * precision) / 10) / this.getPrecision(val);
                val.endAngle = this.totalAngle;
            }
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {
            var _this8 = this;

            if (!this.data) return;

            this.lineRange = {
                "1": [],
                "2": [],
                "4": [],
                "8": []
                //计算开始角度, 计算指示线的2端
            };this.data.data.map(function (val, key) {
                if (!key) {
                    val.startAngle = 0;
                } else {
                    val.startAngle = _this8.data.data[key - 1].endAngle;
                }

                //this.lineWidth = geometry3d.to3d( 80 );

                var text = _this8.textar[key];
                var textWidth = _this8.lineWidth;

                if (text.scale.x >= textWidth) {
                    textWidth = text.scale.x;
                }

                val.midAngle = val.startAngle + (val.endAngle - val.startAngle) / 2;

                val.lineStart = geometry.distanceAngleToPoint(_this8.outRadius - 2, val.midAngle);
                val.lineEnd = geometry.distanceAngleToPoint(_this8.outRadius + _this8.lineLength, val.midAngle);

                val.textPoint = geometry.distanceAngleToPoint(_this8.outRadius + _this8.lineLength, val.midAngle);

                val.pointDirection = new _pointat2.default(_this8.fixWidth(), _this8.fixHeight(), geometry.pointPlus(val.textPoint, _this8.cpoint));
                var lineAngle = val.pointDirection.autoAngle();
                val.lineExpend = _jsonUtilsx2.default.clone(val.lineEnd);

                //console.log( 'lineAngle', lineAngle,  val.midAngle );

                switch (lineAngle) {
                    case 1:
                    case 8:
                        {
                            //val.lineEnd.x = this.lineLeft;
                            val.lineEnd.x = -(_this8.outRadius + _this8.lineSpace);

                            var tmp = geometry.pointDistance(val.lineStart, val.lineEnd);
                            if (tmp > _this8.lineCurveLength) {
                                var tmpAngle = geometry.pointAngle(val.lineStart, val.lineEnd),
                                    tmpPoint = geometry.distanceAngleToPoint(_this8.lineCurveLength, tmpAngle);
                                tmpPoint = geometry.pointPlus(tmpPoint, val.lineStart);

                                val.lineEnd.x = tmpPoint.x;
                            }

                            val.lineExpend.x = val.lineEnd.x - textWidth;

                            break;
                        }
                    default:
                        {
                            val.lineEnd.x = _this8.outRadius + _this8.lineSpace;
                            var _tmp = geometry.pointDistance(val.lineStart, val.lineEnd);
                            if (_tmp > _this8.lineCurveLength) {
                                var _tmpAngle = geometry.pointAngle(val.lineStart, val.lineEnd),
                                    _tmpPoint = geometry.distanceAngleToPoint(_this8.lineCurveLength, _tmpAngle);
                                _tmpPoint = geometry.pointPlus(_tmpPoint, val.lineStart);

                                val.lineEnd.x = _tmpPoint.x;
                            }

                            val.lineExpend.x = val.lineEnd.x + textWidth;
                            break;
                        }
                }

                _this8.lineRange[lineAngle].push(val);
            });

            this.loopSort.map(function (key) {
                var item = _this8.lineRange[key];
                if (!(item && item.length && item.length > 1)) return;
                var needFix = void 0;
                for (var i = 1; i < item.length; i++) {
                    var pre = item[i - 1],
                        cur = item[i];
                    if (Math.abs(cur.lineEnd.y - pre.lineEnd.y) < _this8.lineHeight) {
                        needFix = 1;
                        break;
                    }
                }
                switch (key) {
                    case 4:
                        {
                            var tmpY = 0;
                            for (var _i = item.length - 2; _i >= 0; _i--) {
                                var _pre = item[_i + 1],
                                    _cur = item[_i];
                                if (Math.abs(_pre.lineEnd.y - _cur.lineEnd.y) < _this8.lineHeight || _cur.lineEnd.y <= _pre.lineEnd.y) {
                                    tmpY = _pre.lineEnd.y + _this8.lineHeight;
                                    _cur.lineEnd.y = tmpY;
                                    _cur.lineExpend.y = tmpY;
                                }
                            }
                            break;
                        }

                    case 1:
                        {
                            var _tmpY = item[0].lineEnd.y;
                            for (var _i2 = item.length - 2; _i2 >= 0; _i2--) {
                                var _pre2 = item[_i2 + 1],
                                    _cur2 = item[_i2];
                                if (Math.abs(_pre2.lineEnd.y - _cur2.lineEnd.y) < _this8.lineHeight || _cur2.lineEnd.y >= _pre2.lineEnd.y) {
                                    _tmpY = _pre2.lineEnd.y - _this8.lineHeight;
                                    _cur2.lineEnd.y = _tmpY;
                                    _cur2.lineExpend.y = _tmpY;
                                }
                            }
                            break;
                        }
                    case 2:
                        {
                            var _tmpY2 = item[0].lineEnd.y;
                            for (var _i3 = 1; _i3 < item.length; _i3++) {
                                var _pre3 = item[_i3 - 1],
                                    _cur3 = item[_i3],
                                    zero = item[0];

                                if (Math.abs(_pre3.lineEnd.y + _this8.fixCy()) < _this8.lineHeight) {
                                    _pre3.lineExpend.y = _pre3.lineEnd.y = _pre3.lineExpend.y + _this8.lineHeight;
                                }
                                if (Math.abs(_pre3.lineEnd.y - _cur3.lineEnd.y) < _this8.lineHeight || _cur3.lineEnd.y >= _pre3.lineEnd.y) {

                                    _tmpY2 = _pre3.lineEnd.y - _this8.lineHeight;
                                    _cur3.lineEnd.y = _tmpY2;
                                    _cur3.lineExpend.y = _tmpY2;
                                }
                            }

                            break;
                        }

                    case 8:
                        {
                            var _tmpY3 = 0;
                            for (var _i4 = 1; _i4 < item.length; _i4++) {
                                var _pre4 = item[_i4 - 1],
                                    _cur4 = item[_i4];
                                if (Math.abs(_pre4.lineEnd.y - _cur4.lineEnd.y) < _this8.lineHeight || _cur4.lineEnd.y <= _pre4.lineEnd.y) {
                                    _tmpY3 = _pre4.lineEnd.y + _this8.lineHeight;
                                    _cur4.lineEnd.y = _tmpY3;
                                    _cur4.lineExpend.y = _cur4.lineEnd.y;
                                }
                            }

                            break;
                        }
                }
            });
        }
    }]);

    return Dount;
}(_base2.default);

exports.default = Dount;