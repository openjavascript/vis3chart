'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('./3d/common/base.js');

var _base2 = _interopRequireDefault(_base);

var _legend = require('./3d/common/legend.js');

var _legend2 = _interopRequireDefault(_legend);

var _index = require('./3d/dount/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./3d/gauge/index.js');

var _index4 = _interopRequireDefault(_index3);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _constant = require('./common/constant.js');

var constant = _interopRequireWildcard(_constant);

var _threexDomevents = require('./common/threex.domevents.js');

var _threexDomevents2 = _interopRequireDefault(_threexDomevents);

var _geometry = require('./geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var THREE = require('three');

var VisThree = function (_VisChartBase) {
    _inherits(VisThree, _VisChartBase);

    function VisThree(box, width, height) {
        _classCallCheck(this, VisThree);

        var _this = _possibleConstructorReturn(this, (VisThree.__proto__ || Object.getPrototypeOf(VisThree)).call(this, box, width, height));

        _this.ins = [];
        _this.legend = null;
        return _this;
    }

    _createClass(VisThree, [{
        key: '_setSize',
        value: function _setSize(width, height) {

            this.config = this.config || {
                camera: {
                    fov: 40,
                    near: 1,
                    far: 1000
                },

                cameraPosition: { x: 0, y: 0, z: 350 }
            };

            _get(VisThree.prototype.__proto__ || Object.getPrototypeOf(VisThree.prototype), '_setSize', this).call(this, width, height);

            this.init();

            if (this.legend && this.data && this.data.legend) {
                this.legend.resize(this.width, this.height);

                this.legend.update(this.data.legend);
            }

            if (this.data) {
                var tmpredraw = this.redraw;
                this.update(this.data, this.ignoreLegend);
                this.redraw = tmpredraw;
            }
        }
    }, {
        key: 'init',
        value: function init() {
            if (!this.box) return;

            if (!this.stage) {
                this.stage = this.scene = new THREE.Scene();

                //console.log( this, this.config );

                this.camera = new THREE.PerspectiveCamera(this.config.camera.fov, this.width / this.height, this.config.camera.nera, this.config.camera.far);
                this.camera.position.set(this.config.cameraPosition.x, this.config.cameraPosition.y, this.config.cameraPosition.z);
                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setClearColor(0xffffff, .2);
                this.renderer.sortObjects = true;
                this.box.innerHTML = '';
                this.box.appendChild(this.renderer.domElement);

                //this.scene.rotation.x = geometry.radians( 45 );
                //this.scene.rotation.y = geometry.radians( 290 );

                this.cameraHelper = new THREE.CameraHelper(this.camera);
                this.cameraHelper.visible = false;
                this.scene.add(this.cameraHelper);

                this.domEvents = new _threexDomevents2.default.DomEvents(this.camera, this.renderer.domElement);

                //console.log( this.scene, this.camera );
            } else {
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
            }
            this.renderer.setSize(this.width, this.height);

            this.customWidth && (this.box.style.width = this.customWidth + 'px');
            this.customHeight && (this.box.style.height = this.customHeight + 'px');

            this.render();

            return this;
        }
    }, {
        key: 'setThreeConfig',
        value: function setThreeConfig(config) {
            config = config || {};

            this.config = _lodash2.default.merge(this.config, config);

            return this;
        }
    }, {
        key: 'updateThreeConfig',
        value: function updateThreeConfig(config) {
            this.setThreeConfig(config);

            this.camera.position.x = this.config.cameraPosition.x;
            this.camera.position.y = this.config.cameraPosition.y;
            this.camera.position.z = this.config.cameraPosition.z;

            this.camera.fov = this.config.camera.fov;
            this.camera.near = this.config.camera.near;
            this.camera.far = this.config.camera.far;

            this.camera.updateProjectionMatrix();
            return this;
        }
    }, {
        key: 'update',
        value: function update(data, ignoreLegend) {
            var _this2 = this;

            var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            this.data = data;
            this.ignoreLegend = ignoreLegend;
            this.redraw = redraw;

            if (!_jsonUtilsx2.default.jsonInData(this.data, 'series')) return;

            this.data && this.data.legend && this.data.legend.data && this.data.legend.data.legend && this.data.legend.data.map(function (item, key) {
                item.realIndex = key;
            });

            this.data && this.data.series && this.data.series.length && this.data.series.map(function (sitem) {
                sitem.data && sitem.data.length && sitem.data.map(function (item, key) {
                    item.realIndex = key;
                });
            });

            this.clearUpdate();

            if (_jsonUtilsx2.default.jsonInData(this.data, 'legend.data') && this.data.legend.data.length) {
                if (this.legend && ignoreLegend) {
                    this.emptyblock = 'kao';
                } else {
                    this.legend && this.legend.destroy() && (this.legent = null);
                    this.legend = new _legend2.default(this.box, this.width, this.height, this.camera);
                    this.legend.setOptions({
                        renderer: this.renderer,
                        scene: this.scene,
                        camera: this.camera,
                        stage: this.stage,
                        config: this.config,
                        domEvents: this.domEvents,
                        onChange: function onChange(group) {
                            _this2.initChart();
                        }
                    });
                    this.legend.update(this.data.legend);
                }
            }
            this.initChart();
            return this;
        }
    }, {
        key: 'initChart',
        value: function initChart() {
            var _this3 = this;

            if (this.ins && this.ins.length && !this.redraw) {
                this.emptyblock = 'kao';
            } else {
                this.ins.map(function (item) {
                    item.destroy();
                });
                this.ins = [];
            }

            this.data.series.map(function (val, key) {
                //console.log( val, constant );
                var ins = void 0;

                if (_this3.ins && _this3.ins.length && _this3.ins[key] && !_this3.redraw) {
                    ins = _this3.ins[key];
                    ins.width = _this3.width;
                    ins.height = _this3.height;
                } else {
                    switch (val.type) {
                        case constant.CHART_TYPE.dount:
                            {
                                ins = new _index2.default(_this3.box, _this3.width, _this3.height, _this3.camera);
                                break;
                            }
                        case constant.CHART_TYPE.gauge:
                            {
                                //console.log( 'gauge 1', Date.now() );
                                ins = new _index4.default(_this3.box, _this3.width, _this3.height, _this3.camera);
                                break;
                            }
                    }
                    if (ins) {
                        //console.log( 'gauge 2', Date.now() );
                        _this3.legend && ins.setLegend(_this3.legend);
                        ins.setOptions({
                            renderer: _this3.renderer,
                            scene: _this3.scene,
                            camera: _this3.camera,
                            stage: _this3.stage,
                            config: _this3.config,
                            domEvents: _this3.domEvents
                        });
                    }
                }

                if (ins) {
                    //console.log( 'gauge 3', Date.now() );
                    _this3.options && ins.setOptions(_this3.options);

                    var fillData = _this3.getLegendData(val);
                    ins.update(fillData, _jsonUtilsx2.default.clone(_this3.data));

                    if (!_this3.ins[key]) {
                        _this3.ins[key] = ins;
                    }
                }
            });
        }
    }, {
        key: 'getLegendData',
        value: function getLegendData(data) {
            data = _jsonUtilsx2.default.clone(data);

            var tmp = [];

            if (this.legend && this.legend.group && this.legend.group.length) {
                this.legend.group.map(function (item, key) {
                    //console.log( key, item.disabled, item );
                    if (!item.disabled) {
                        tmp.push(data.data[key]);
                    }
                });
                data.data = tmp;
            }

            return data;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(VisThree.prototype.__proto__ || Object.getPrototypeOf(VisThree.prototype), 'destroy', this).call(this);

            //this.clearUpdate();
            this.ins.map(function (item) {
                item.destroy();
            });
            //this.legend && this.legend.destroy();

            this.stage && this.stage.destroy();
            this.stage = null;
        }
    }, {
        key: 'clearUpdate',
        value: function clearUpdate() {
            //this.legend && !this.ignoreLegend && this.legend.destroy();
        }
    }]);

    return VisThree;
}(_base2.default);

exports.default = VisThree;