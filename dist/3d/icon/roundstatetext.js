'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../common/base.js');

var _base2 = _interopRequireDefault(_base);

var _geometry = require('../../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../../common/utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import Konva from 'konva';


var RoundStateText = function (_VisChartBase) {
    _inherits(RoundStateText, _VisChartBase);

    function RoundStateText(box, width, height) {
        _classCallCheck(this, RoundStateText);

        var _this = _possibleConstructorReturn(this, (RoundStateText.__proto__ || Object.getPrototypeOf(RoundStateText)).call(this, box, width, height));

        _this.name = 'RoundStateText ' + Date.now();

        _this.radius = 30;

        _this.textOffsetX = -2;
        _this.textOffsetY = -1;

        _this.circleLineRotation = 0;
        _this.circleLineRotationStep = 4;

        _this.curColor = '#deaf5c';
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

            this.circleLine.rotation(this.circleLineRotation);
            this.stage.add(this.layer);

            window.requestAnimationFrame(function () {
                _this2.animationCircleLine();
            });
        }
    }, {
        key: 'init',
        value: function init() {
            //console.log( 'RoundStateText init', this );
            this.circleRaidus = this.radius - 5;
            this.circleRaidus *= this.sizeRate;

            //this.lineColor = this.curColor;

            this.initDataLayout();

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

            /*
            this.text.fill( color );
            this.circle.stroke( color );
            this.circleLine.stroke( color );
             this.stage.add( this.layer );
            */

            //console.log( 'rate', rate );

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
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
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
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = this.radius - 1;
            this.circleLineRadius *= this.sizeRate;

            var points = [];
            points.push('M');
            for (var i = 90; i <= 180; i++) {
                var tmp = geometry.distanceAngleToPoint(this.circleLineRadius, i + 90);
                points.push([tmp.x, tmp.y].join(',') + ',');
                if (i == 90) {
                    points.push('L');
                }
            }
            points.push('M');
            for (var _i = 270; _i <= 360; _i++) {
                var _tmp = geometry.distanceAngleToPoint(this.circleLineRadius, _i + 90);
                points.push([_tmp.x, _tmp.y].join(',') + ',');
                if (_i == 270) {
                    points.push('L');
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