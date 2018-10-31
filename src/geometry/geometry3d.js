
const THREE = require( 'three' );

export function pos2dto3d( x, y, screenWidth, screenHeight, camera ){
    screenWidth     = screenWidth   || this.screenWidth;
    screenHeight    = screenHeight  || this.screenHeight;
    camera          = camera        || this.camera;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(
        ( x / screenWidth ) * 2 - 1,
        - ( y / screenHeight ) * 2 + 1,
        0.5 );

    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    var distance = - camera.position.z / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    return pos;
}

export function size2dto3d( x, y, screenWidth, screenHeight, camera ){
    screenWidth     = screenWidth   || this.screenWidth;
    screenHeight    = screenHeight  || this.screenHeight;
    camera          = camera        || this.camera;

    let pos0 = pos2dto3d( 0, 0, screenWidth, screenHeight, camera );
    let posx = pos2dto3d( x, y, screenWidth, screenHeight, camera );
    let pos = posx.clone();
    pos.x = Math.abs( pos.x - pos0.x );
    pos.y = Math.abs( pos.y - pos0.y );
    pos.z = Math.abs( pos.z - pos0.z );
    return pos;
}

export function to3d( x, screenWidth, screenHeight, camera ){
    screenWidth     = screenWidth   || this.screenWidth;
    screenHeight    = screenHeight  || this.screenHeight;
    camera          = camera        || this.camera;

    let y = 0;
    let pos0 = pos2dto3d( 0, 0, screenWidth, screenHeight, camera );
    let posx = pos2dto3d( x, y, screenWidth, screenHeight, camera );
    return Math.abs( posx.x - pos0.x );
}

export function to3dx( x, screenWidth, screenHeight, camera ){
    screenWidth     = screenWidth   || this.screenWidth;
    screenHeight    = screenHeight  || this.screenHeight;
    camera          = camera        || this.camera;

    let y = 0;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(
        ( x / screenWidth ) * 2 - 1,
        - ( y / screenHeight ) * 2 + 1,
        0.5 );

    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    var distance = - camera.position.z / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    return pos.x;
}

export function to3dy( y, screenWidth, screenHeight, camera ){
    screenWidth     = screenWidth   || this.screenWidth;
    screenHeight    = screenHeight  || this.screenHeight;
    camera          = camera        || this.camera;

    let x = 0;

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(
        ( x / screenWidth ) * 2 - 1,
        - ( y / screenHeight ) * 2 + 1,
        0.5 );

    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    var distance = - camera.position.z / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    return pos.x;
}

export function resizeToBit( size, max = 15 ){
    let r = size;
    let rangeCount = 1;
    for( let i = 0; i < max; i++ ){
        let cur = rangeCount, next = rangeCount * 2;

        if( size >= cur && size <= next ){
            if( size >= (cur + cur / 2) ){
                r = next;
            }else{
                r = cur;
            }
            break;
        }

        rangeCount *= 2;
    }

    return r;
}
