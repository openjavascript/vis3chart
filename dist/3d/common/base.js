'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _vischartbase = require('vischartbase');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _geometry3d = require('../../geometry/geometry3d.js');

var geometry3d = _interopRequireWildcard(_geometry3d);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _three = require('three.texttexture');

var _three2 = _interopRequireDefault(_three);

var _three3 = require('three.textsprite');

var _three4 = _interopRequireDefault(_three3);

var _three5 = require('three.meshline');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var THREE = require('three');

require('../../common/SVGLoader.js');

var ThreeBase = function (_VisChartBase) {
    _inherits(ThreeBase, _VisChartBase);

    function ThreeBase(box, width, height, camera) {
        _classCallCheck(this, ThreeBase);

        var _this = _possibleConstructorReturn(this, (ThreeBase.__proto__ || Object.getPrototypeOf(ThreeBase)).call(this, box, width, height, camera));

        camera && (_this.camera = camera);

        _this.textColor = 0xffffff;
        //this.lineColor = 0x596ea7;

        geometry3d.screenWidth = _this.width;
        geometry3d.screenHeight = _this.height;
        geometry3d.camera = _this.camera;
        return _this;
    }
    /*
        let fontSize = geometry3d.to3d( 16 );
        this.createText(
            fontSize
            , {
                color: this.lineColor 
                , rotation: geometry.radians( 
                    val.angle + 90 + ( val.rotationOffset || 0 ) + 180
                )
            }
            , {
              text: val.text + '',
              fontFamily: 'MicrosoftYaHei, "Times New Roman", Times, serif',
              fontSize: fontSize * 2,
            }
            , ( sprite ) => {
                sprite.position.x = val.point.x
                sprite.position.y = val.point.y
            }
        );
    */


    _createClass(ThreeBase, [{
        key: 'createText',
        value: function createText() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 44;
            var textureParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var callback = arguments[3];
            var parent = arguments[4];

            var texture = new _three2.default(params);
            textureParams.map = texture;
            var material = new THREE.SpriteMaterial(textureParams);
            var sprite = new THREE.Sprite(material);
            sprite.scale.setX(texture.imageAspect).multiplyScalar(size);

            callback && callback(sprite, material, texture, textureParams, params);

            parent = parent || this.stage;

            parent.add(sprite);
            this.addDestroy(sprite);

            return sprite;
        }
    }, {
        key: 'setRedraw',
        value: function setRedraw(val) {
            this.redraw = val;
            return this;
        }
    }, {
        key: 'getBox',
        value: function getBox(mesh) {
            var box = new THREE.Box3().setFromObject(mesh);
            /*
            let size = box.getSize( new THREE.Vector3 );
            return size;
            */
            return box;
        }
    }, {
        key: 'getBoxSize',
        value: function getBoxSize(mesh) {
            return this.getBox(mesh).getSize(new THREE.Vector3());
        }
    }, {
        key: 'getPosition',
        value: function getPosition(matrixWorld) {
            var position = new THREE.Vector3();
            return position.setFromMatrixPosition(matrixWorld);
        }
    }, {
        key: '_setSize',
        value: function _setSize(width, height) {
            _get(ThreeBase.prototype.__proto__ || Object.getPrototypeOf(ThreeBase.prototype), '_setSize', this).call(this, width, height);

            this.totalAngle = -360;
            this.deep = 0;

            this.sizeRate = 1;
        }
    }, {
        key: 'render',
        value: function render() {
            this.renderer && this.scene && this.camera && this.renderer.render(this.scene, this.camera);

            return this;
        }
    }, {
        key: 'getWidth',
        value: function getWidth() {
            var r = this.width;

            if (_jsonUtilsx2.default.jsonInData(this, 'config.cameraPosition.z')) {
                r = this.config.cameraPosition.z;
            }

            return r;
        }
    }, {
        key: 'getHeight',
        value: function getHeight() {
            var r = this.height;

            if (_jsonUtilsx2.default.jsonInData(this, 'config.cameraPosition.z')) {
                r = this.config.cameraPosition.z;
            }

            return r;
        }
    }, {
        key: 'getDeepWidth',
        value: function getDeepWidth() {
            var r = this.deep;
            if (_jsonUtilsx2.default.jsonInData(this, 'config.cameraPosition.z')) {
                r = this.config.cameraPosition.z / this.width * this.config.cameraPosition.z;
            }
            return r;
        }
    }, {
        key: 'loadImage',
        value: function loadImage() {
            var _this2 = this;

            if (this.images.length) return;

            if (this.iconLayer) this.iconLayer.remove();

            this.images = [];
            this._images = [];
            this.rotationBg = [];

            if (this.data && this.data.background && this.data.background.length) {

                this.data.background.map(function (val) {
                    _this2.addImage(val.url, val.width, val.height, val.offsetX || 0, val.offsetY || 0, val.rotation || 0, val.isbase64, val);
                });
            }

            this.images.map(function (item, key) {
                item.opt = item.opt || {};
                if (item.opt.issvgstring) {
                    if (!_this2.svgLoader()) return;
                    _this2.initSVGBackground(_this2.svgLoader().parse(item.url), item, key);
                    return;
                }
            });

            return this;
        }
    }, {
        key: 'svgLoader',
        value: function svgLoader() {
            if (!this._svgloader && THREE.SVGLoader) {
                this._svgloader = new THREE.SVGLoader();
            }

            return this._svgloader;
        }
    }, {
        key: 'initSVGBackground',
        value: function initSVGBackground(paths, item, key) {
            if (!(paths && paths.length)) return;

            var group = new THREE.Group();
            group.scale.y *= -1;
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var material = new THREE.MeshBasicMaterial({
                    color: path.color,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                var shapes = path.toShapes(true);
                for (var j = 0; j < shapes.length; j++) {
                    var shape = shapes[j];
                    var geometry = new THREE.ShapeBufferGeometry(shape);
                    var mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                    this.addDestroy(mesh);
                }
            }

            var box = new THREE.Box3().setFromObject(group);
            var size = box.getSize(new THREE.Vector3());

            var x = -box.max.x / 2 - box.min.x / 2,
                y = -box.max.y / 2 - box.min.y / 2;

            group.position.x = x;
            group.position.y = y;

            var pivot = new THREE.Object3D();
            pivot.add(group);
            this.addDestroy(group);

            var scale = geometry3d.to3d(Math.max(item.width, item.height)) / Math.max(box.max.x, size.x);
            if (item.opt.scaleOffset) {
                scale += item.opt.scaleOffset;
            }

            pivot.scale.set(scale, scale, scale);

            pivot.position.y = this.fixCy();

            this.stage.add(pivot);
            this.addDestroy(pivot);

            var data = { ele: pivot, item: item };

            this._images.push(data);

            item.rotation && this.rotationBg.push(data);

            this.render();
            this.animationBg();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            if (this.isDestroy) return;
            if (!this.rotationBg.length) return;
            if (!this.isAnimation()) return;

            requestAnimationFrame(function () {
                _this3.animate();
            });
        }
    }, {
        key: 'animationBg',
        value: function animationBg() {
            var _this4 = this;

            if (this.isDestroy) return;
            if (!this.rotationBg.length) return;
            if (!this.isAnimation()) return;
            //return;
            if (this._images && this._images.length) {
                this._images.map(function (item) {
                    item.ele.rotation[_this4.getRotationAttr(item)] += _this4.getRotationStep(item);
                });
                this.render();
            };

            window.requestAnimationFrame(function () {
                _this4.animationBg();
            });
        }
    }, {
        key: 'getRotationAttr',
        value: function getRotationAttr(item) {
            var r = 'y';
            if (_jsonUtilsx2.default.jsonInData(item, 'item.opt.rotationAttr')) {
                r = item.item.opt.rotationAttr;
            }
            return r;
        }
    }, {
        key: 'getRotationStep',
        value: function getRotationStep(item) {
            var r = 0.03;
            if (_jsonUtilsx2.default.jsonInData(item, 'item.opt.rotationStep')) {
                r = item.item.opt.rotationStep;
            }
            return r;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this5 = this;

            this.setDestroy();

            this.destroyList.map(function (item) {
                _this5.dispose(item);
            });
        }
    }, {
        key: 'parseColor',
        value: function parseColor(color) {
            if (color.toString().indexOf('#') > -1) {
                color = parseInt(color.replace('#', ''), 16);
            }

            return color;
        }
    }, {
        key: 'fixCx',
        value: function fixCx() {
            var r = this.cx;
            return r;
        }
    }, {
        key: 'fixCy',
        value: function fixCy() {
            var r = this.cy;

            if (this.legend) {
                switch (this.legend.direction()) {
                    case 'bottom':
                        {
                            r = (this.height - this.legend.outerHeight() / 2) / 2 - 5;
                            break;
                        }
                }
            }

            return geometry3d.to3d(this.cy - r);
        }
    }, {
        key: 'fixWidth',
        value: function fixWidth() {
            var r = this.width;
            return r;
        }
    }, {
        key: 'fixHeight',
        value: function fixHeight() {
            var r = this.height;
            return r;
        }
    }, {
        key: 'dispose',
        value: function dispose(item) {
            var _this6 = this;

            if (!item) return this;

            if (item.children && item.children.length) {
                item.children.map(function (sitem) {
                    _this6.dispose(sitem);
                });
            }

            try {
                item.geometry && item.parent && item.geometry.dispose && item.geometry.dispose();

                item.material && item.parent && item.material.dispose && item.material.dispose();

                item.texture && item.parent && item.texture.dispose && item.texture.dispose();
            } catch (ex) {};

            item.parent && item.parent.remove && item.parent.remove(item);

            return this;
        }
    }]);

    return ThreeBase;
}(_vischartbase2.default);

exports.default = ThreeBase;