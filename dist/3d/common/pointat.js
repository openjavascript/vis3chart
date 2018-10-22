'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _geometry = require('../../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointAt = function () {
    function PointAt(width, height, point) {
        _classCallCheck(this, PointAt);

        this.width = width;
        this.height = height;
        this.point = point;

        this.cx = this.width / 2;
        this.cy = this.height / 2;

        this.cpoint = { x: this.cx, y: this.cy };

        this.offsetX = 20;
        this.offsetY = 20;

        this.colors = ['#f12575', '#da432e', '#f3a42d', '#19af89', '#24a3ea', '#b56be8'];

        this.init();
    }

    _createClass(PointAt, [{
        key: 'setDebug',
        value: function setDebug(stage) {
            this.stage = stage;

            this.layer = new _konva2.default.Layer();

            var i = 0;

            for (var key in this.rects) {

                var item = this.rects[key];
                var params = _jsonUtilsx2.default.clone(item);
                params.fill = this.colors[i % this.colors.length];

                var rect = new _konva2.default.Rect(params);

                this.layer.add(rect);

                i++;
            }

            this.stage.add(this.layer);
        }
    }, {
        key: 'init',
        value: function init() {
            this.leftTop = {
                x: 0,
                y: 0,
                width: this.cx + this.offsetX,
                height: this.cy + this.offsetY
            };
            this.leftTop.x2 = this.leftTop.x + this.leftTop.width;
            this.leftTop.y2 = this.leftTop.y + this.leftTop.height;

            this.rightTop = {
                x: this.cx - this.offsetX,
                y: 0,
                width: this.cx + this.offsetX,
                height: this.cy + this.offsetY
            };
            this.rightTop.x2 = this.rightTop.x + this.rightTop.width;
            this.rightTop.y2 = this.rightTop.y + this.rightTop.height;

            this.leftBottom = {
                x: 0,
                y: this.cy - this.offsetY,
                width: this.cx + this.offsetX,
                height: this.cy + this.offsetY
            };
            this.leftBottom.x2 = this.leftBottom.x + this.leftBottom.width;
            this.leftBottom.y2 = this.leftBottom.y + this.leftBottom.height;

            this.rightBottom = {
                x: this.cx - this.offsetX,
                y: this.cy - this.offsetY,
                width: this.cx + this.offsetX,
                height: this.cy + this.offsetY
            };
            this.rightBottom.x2 = this.rightBottom.x + this.rightBottom.width;
            this.rightBottom.y2 = this.rightBottom.y + this.rightBottom.height;

            this.rects = {
                leftTop: this.leftTop,
                rightTop: this.rightTop,
                leftBottom: this.leftBottom,
                rightBottom: this.rightBottom
            };
        }
    }, {
        key: 'isLeftTop',
        value: function isLeftTop() {
            return geometry.pointRectangleIntersection(this.point, this.leftTop) ? 1 : 0;
        }
    }, {
        key: 'isRightTop',
        value: function isRightTop() {
            return geometry.pointRectangleIntersection(this.point, this.rightTop) ? 2 : 0;
        }
    }, {
        key: 'isRightBottom',
        value: function isRightBottom() {
            return geometry.pointRectangleIntersection(this.point, this.rightBottom) ? 4 : 0;
        }
    }, {
        key: 'isLeftBottom',
        value: function isLeftBottom() {
            return geometry.pointRectangleIntersection(this.point, this.leftBottom) ? 8 : 0;
        }
    }, {
        key: 'auto',
        value: function auto() {
            var r = this.isLeftTop() + this.isRightTop() + this.isRightBottom() + this.isLeftBottom();
            return r;
        }
    }, {
        key: 'autoAngle',
        value: function autoAngle() {
            var angle = geometry.pointAngle(this.cpoint, this.point),
                r = '';

            if (angle >= 0 && angle <= 90) {
                r = PointAt.DIRE_NAME.rightBottom;
            } else if (angle > 90 && angle <= 180) {
                r = PointAt.DIRE_NAME.leftBottom;
            } else if (angle > 180 && angle <= 270) {
                r = PointAt.DIRE_NAME.leftTop;
            } else {
                r = PointAt.DIRE_NAME.rightTop;
            }

            console.log('autoAngle', angle, r);

            return r;
        }
    }]);

    return PointAt;
}();

exports.default = PointAt;


PointAt.DIRE_NAME = {
    leftTop: 1,
    rightTop: 2,
    rightBottom: 4,
    leftBottom: 8,

    topCenter: 3,
    rightMid: 6,
    bottomCenter: 12,
    leftMid: 9
};

PointAt.DIRE_NUM = {
    '1': 'leftTop',
    '2': 'rightTop',
    '4': 'rightBottom',
    '8': 'leftBottom',

    '3': 'topCenter',
    '6': 'rightMid',
    '9': 'leftMid',
    '12': 'bottomCenter'
};