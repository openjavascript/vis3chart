'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('./3d/common/base.js');

var _base2 = _interopRequireDefault(_base);

var _index = require('./3d/dount/index.js');

var _index2 = _interopRequireDefault(_index);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _constant = require('./common/constant.js');

var constant = _interopRequireWildcard(_constant);

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
                //this.renderer.setClearColor( 0xffffff, .2 );
                this.renderer.sortObjects = true;
                this.box.innerHTML = '';
                this.box.appendChild(this.renderer.domElement);
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

            //console.log( ju );

            //this.stage.removeChildren();

            //console.log( 'update data', data );

            /*if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
                if( this.legend && ignoreLegend ){
                    this.emptyblock = 'kao';
                }else{
                    this.legend = new Legend( this.box, this.width, this.height );
                    this.legend.setStage( this.stage );
                    this.legend.setOptions( {
                        onChange: ( group ) => {
                            //console.log( 'legend onchange', group );
                            this.initChart();
                        }
                    });
                    this.legend.update( this.data.legend );
                }
            }*/
            this.initChart();
            return this;
        }
    }, {
        key: 'initChart',
        value: function initChart() {
            var _this2 = this;

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

                if (_this2.ins && _this2.ins.length && _this2.ins[key] && !_this2.redraw) {
                    ins = _this2.ins[key];
                    ins.width = _this2.width;
                    ins.height = _this2.height;
                } else {
                    switch (val.type) {
                        case constant.CHART_TYPE.dount:
                            {
                                ins = new _index2.default(_this2.box, _this2.width, _this2.height);
                                break;
                            }
                        /*case constant.CHART_TYPE.gauge: {
                            ins = new Gauge( this.box, this.width, this.height );
                            break;
                        }*/
                    }
                    if (ins) {
                        _this2.legend && ins.setLegend(_this2.legend);
                        ins.setOptions({
                            renderer: _this2.renderer,
                            scene: _this2.scene,
                            camera: _this2.camera,
                            stage: _this2.stage,
                            config: _this2.config
                        });
                    }
                }

                if (ins) {
                    _this2.options && ins.setOptions(_this2.options);
                    ins.update(_this2.getLegendData(val), _jsonUtilsx2.default.clone(_this2.data));

                    if (!_this2.ins[key]) {
                        _this2.ins[key] = ins;
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
                //console.log( 'getLegendData', this.legend.group, 111111111 );
                this.legend.group.map(function (item, key) {
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
            this.legend && this.legend.destroy();

            this.stage && this.stage.destroy();
            this.stage = null;
        }
    }, {
        key: 'clearUpdate',
        value: function clearUpdate() {
            this.legend && !this.ignoreLegend && this.legend.destroy();
        }

        //update( data, ignoreLegend, redraw = true ){

        //this.scene = new THREE.Scene();

        //this.camera = new THREE.PerspectiveCamera( 40, this.width / this.height, 1, 1000 );
        //this.camera.position.set( 0, 0, 20 )


        //let renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        ////let renderer = this.renderer = new THREE.SVGRenderer( );
        ////renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( this.width - 2, this.height - 2 );


        //var loader = new THREE.SVGLoader();

        //var options = {
        //depth: 1
        //, bevelThickness: 1
        //, bevelSize: .5
        //, bevelSegments: 1
        //, bevelEnabled: true
        //, curveSegments: 12
        //, steps: 1
        //};

        ////loader.load( './img/dount-in.svg', ( paths ) => {
        ////loader.load( './img/dount-big-all.svg', ( paths ) => {
        ////loader.load( './img/dount-mid.svg', ( paths ) => {
        ////loader.load( './img/tiger.svg', ( paths ) => {
        //var paths = loader.parse( data.background[0].url );
        //console.log( 'paths', paths );

        //var group = new THREE.Group();
        //group.scale.multiplyScalar( 0.1 );
        //group.scale.y *= -1;
        //for ( var i = 0; i < paths.length; i ++ ) {
        //var path = paths[ i ];
        //var material = new THREE.MeshBasicMaterial( {
        //color: path.color,
        //side: THREE.DoubleSide,
        //depthWrite: false
        //} );
        //var shapes = path.toShapes( true );
        //for ( var j = 0; j < shapes.length; j ++ ) {
        //var shape = shapes[ j ];
        //var geometry = new THREE.ShapeBufferGeometry( shape );
        ////var geometry = new THREE.ExtrudeGeometry( shape, options);
        //var mesh = new THREE.Mesh( geometry, material );

        ////viewbox 118, 117 - dount-in.svg
        //mesh.position.x = -118/2;
        //mesh.position.y = -117/2;

        //[>
        ////viewbox 250 248 - dount-big-all.svg
        //mesh.position.x = -250/2;
        //mesh.position.y = -248/2;
        //*/

        //[>
        ////viewbox 107, 106 - dount-mid.svg
        //mesh.position.x = -107/2;
        //mesh.position.y = -106/2;
        //*/

        //[>
        ////viewbox tiger.svg
        //mesh.position.x = -46.5;
        //mesh.position.y = -( 54.5 + 55 / 2 );
        //*/

        //group.add( mesh );
        //}
        //}
        //this.group = group;
        //this.scene.add( group );

        //console.log( 'group', this.group  );

        //this.render();
        ////} );


        //[>
        //var geometry = new THREE.SphereGeometry( 30, 32, 32 );
        //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        //material.wireframe = true;
        //this.sphere = new THREE.Mesh( geometry, material );
        //console.log( this.sphere, material, geometry );
        //this.scene.add( this.sphere );
        //*/

        //this.render();

        //this.box.appendChild( renderer.domElement );

        //this.animate();
        //}

        //animate() {

        //this.group && ( this.group.rotation.y += 0.03 );
        //this.sphere && ( this.sphere.rotation.y += 0.01 );

        //this.render();

        //requestAnimationFrame( ()=>{ this.animate() } );
        //}

        //render() {
        //this.renderer.render( this.scene, this.camera );
        /*}*/

    }]);

    return VisThree;
}(_base2.default);

exports.default = VisThree;