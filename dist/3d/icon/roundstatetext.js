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

var RoundStateText = function (_VisChartBase) {
    _inherits(RoundStateText, _VisChartBase);

    function RoundStateText(box, width, height, camera) {
        _classCallCheck(this, RoundStateText);

        var _this = _possibleConstructorReturn(this, (RoundStateText.__proto__ || Object.getPrototypeOf(RoundStateText)).call(this, box, width, height, camera));

        _this.name = 'RoundStateText ' + Date.now();

        _this.radius = 30;

        _this.textOffsetX = -2;
        _this.textOffsetY = -1;

        _this.circleLineRotation = 0;
        _this.circleLineRotationStep = 4;

        _this.curColor = 0xdeaf5c;
        return _this;
    }

    _createClass(RoundStateText, [{
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this2 = this;

            if (this.isDestroy) return;
            if (!this.circleLine) return;

            if (!this.isAnimation()) {
                return;
            }

            this.circleLineRotation += this.circleLineRotationStep;

            //this.circleLine.rotation( this.circleLineRotation );
            this.circleLine.rotation.z -= .03;

            window.requestAnimationFrame(function () {
                _this2.animationCircleLine();
            });
        }
    }, {
        key: 'setOptions',
        value: function setOptions(json) {
            _get(RoundStateText.prototype.__proto__ || Object.getPrototypeOf(RoundStateText.prototype), 'setOptions', this).call(this, json);

            this.stageBackup = this.stage;
            this.stage = new THREE.Object3D();
            this.stageBackup.add(this.stage);
            this.addDestroy(this.stage);

            this.stage.position.x = this.point.x;
            this.stage.position.y = this.point.y;
        }
    }, {
        key: 'init',
        value: function init() {
            //console.log( 'RoundStateText init', this );
            this.circleRadius = geometry3d.to3d(this.radius - 5);
            this.circleRadius *= this.sizeRate;

            //this.lineColor = this.curColor;

            this.initDataLayout();

            //console.log( this.point.x, this.point.y );

            this.animationCircleLine();

            return this;
        }
    }, {
        key: 'update',
        value: function update(rate) {
            this.rate = rate;

            var color = this.lineColor;

            if (rate >= this.min && rate < this.max) {
                color = this.curColor;
            }

            this.text.material.color.set(color);
            this.circle.material.uniforms.color.value.set(color);
            this.linePartMaterial1.uniforms.color.value.set(color);
            this.linePartMaterial2.uniforms.color.value.set(color);

            return this;
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            this.drawText();
            this.drawCircle();
            this.drawCircleLine();
        }
    }, {
        key: 'drawText',
        value: function drawText() {
            var fontSize = geometry3d.to3d(32);
            var texture = new _three2.default({
                text: this.text,
                fontFamily: 'HuXiaoBoKuHei, "Times New Roman", Times, serif',
                fontSize: fontSize * 2,
                fill: this.lineColor,
                fontStyle: 'italic'
            });
            var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
            var sprite = new THREE.Sprite(material);
            sprite.scale.setX(texture.imageAspect).multiplyScalar(fontSize);
            this.text = sprite;

            this.stage.add(this.text);
            this.addDestroy(this.text);
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle() {

            var line = new _three5.MeshLine();

            var curve = new THREE.EllipseCurve(0, 0, // ax, aY
            this.circleRadius, this.circleRadius, 0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
            );

            var points = curve.getPoints(200);
            var geometryy = new THREE.Geometry().setFromPoints(points);

            curve = new THREE.EllipseCurve(0, 0, // ax, aY
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

            this.circle = circle;
            this.circleMaterial = material;

            this.stage.add(circle);
            this.addDestroy(circle);
        }
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = geometry3d.to3d(this.radius - 1);
            this.circleLineRadius *= this.sizeRate;

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
            this.linePartMaterial1 = material;

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
            this.linePartMaterial2 = material;
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {}
    }, {
        key: 'animationLine',
        value: function animationLine() {}
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {}
    }]);

    return RoundStateText;
}(_base2.default);

exports.default = RoundStateText;