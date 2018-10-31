'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pos2dto3d = pos2dto3d;
exports.size2dto3d = size2dto3d;
exports.to3d = to3d;
exports.to3dx = to3dx;
exports.to3dy = to3dy;
exports.resizeToBit = resizeToBit;

var THREE = require('three');

function pos2dto3d(x, y, screenWidth, screenHeight, camera) {
    screenWidth = screenWidth || this.screenWidth;
    screenHeight = screenHeight || this.screenHeight;
    camera = camera || this.camera;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(x / screenWidth * 2 - 1, -(y / screenHeight) * 2 + 1, 0.5);

    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return pos;
}

function size2dto3d(x, y, screenWidth, screenHeight, camera) {
    screenWidth = screenWidth || this.screenWidth;
    screenHeight = screenHeight || this.screenHeight;
    camera = camera || this.camera;

    var pos0 = pos2dto3d(0, 0, screenWidth, screenHeight, camera);
    var posx = pos2dto3d(x, y, screenWidth, screenHeight, camera);
    var pos = posx.clone();
    pos.x = Math.abs(pos.x - pos0.x);
    pos.y = Math.abs(pos.y - pos0.y);
    pos.z = Math.abs(pos.z - pos0.z);
    return pos;
}

function to3d(x, screenWidth, screenHeight, camera) {
    screenWidth = screenWidth || this.screenWidth;
    screenHeight = screenHeight || this.screenHeight;
    camera = camera || this.camera;

    var y = 0;
    var pos0 = pos2dto3d(0, 0, screenWidth, screenHeight, camera);
    var posx = pos2dto3d(x, y, screenWidth, screenHeight, camera);
    return Math.abs(posx.x - pos0.x);
}

function to3dx(x, screenWidth, screenHeight, camera) {
    screenWidth = screenWidth || this.screenWidth;
    screenHeight = screenHeight || this.screenHeight;
    camera = camera || this.camera;

    var y = 0;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(x / screenWidth * 2 - 1, -(y / screenHeight) * 2 + 1, 0.5);

    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return pos.x;
}

function to3dy(y, screenWidth, screenHeight, camera) {
    screenWidth = screenWidth || this.screenWidth;
    screenHeight = screenHeight || this.screenHeight;
    camera = camera || this.camera;

    var x = 0;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(x / screenWidth * 2 - 1, -(y / screenHeight) * 2 + 1, 0.5);

    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return pos.x;
}

function resizeToBit(size) {
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

    var r = size;
    var rangeCount = 1;
    for (var i = 0; i < max; i++) {
        var cur = rangeCount,
            next = rangeCount * 2;

        if (size >= cur && size <= next) {
            if (size >= cur + cur / 2) {
                r = next;
            } else {
                r = cur;
            }
            break;
        }

        rangeCount *= 2;
    }

    return r;
}