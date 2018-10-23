
const THREE = require( 'three' );

export function pos2dto3d( x, y, width, height, camera ){
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set(
        ( x / width ) * 2 - 1,
        - ( y / width ) * 2 + 1,
        0.5 );

    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    return pos;
}

