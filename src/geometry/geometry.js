
/**
 * 判断一个点是否在矩形里面
 * @method  pointRectangleIntersection
 * @param   {point} _p
 * @param   {rect}  _r
 * @return  Boolean
 * @static
 */
export function pointRectangleIntersection
    (p, r) {
        return p.x >= r.x && p.x <= r.x2 && p.y >= r.y && p.y <= r.y2;
    }
/**
 * 计算两个坐标点之间的距离
 * @method pointDistance
 * @param   {point} _p1
 * @param   {point} _p2
 * @return  Boolean
 * @static
 */
export function pointDistance( _p1, _p2 ){
    var _dx = _p2.x - _p1.x
        , _dy = _p2.y - _p1.y
        , _dist = Math.sqrt( _dx * _dx + _dy * _dy );
        ;
    return _dist;
}
/**
 * 计算两个坐标点之间的角度
 * @method pointAngle
 * @param   {point} _p1
 * @param   {point} _p2
 * @return  Boolean
 * @static
 */
export function pointAngle( _p1, _p2 ){
    var angle = Math.atan2( _p2.y - _p1.y, _p2.x - _p1.x ) * 180 / Math.PI
        ;
    if( angle < 0 ){
        angle = 360 + angle;
    }

    return angle;
}

/**
 * 从长度和角度求坐标点
 * @method  distanceAngleToPoint
 * @param  {Number} _distance
 * @param  {Number} _angle
 * @return Point
 * @static
 */
export function distanceAngleToPoint( _distance, _angle){
    var _radian = _angle * Math.PI / 180;                   
    return {
        x: ( Math.cos( _radian  ) * _distance )
        , y: ( Math.sin( _radian ) * _distance )
    }
}
/**
 * 从角度获取弧度
 * @method  radians
 * @param   {Number} _angle
 * @return  {Number}
 * @static
 */
export function radians( _angle ){ return _angle * Math.PI / 180; }
/**
 * 从弧度获取角度
 * @method  degree
 * @param   {Number} _radians
 * @return  {Number}
 * @static
 */
export function degree( _radians ){ return _radians / Math.PI * 180; }
/**
 * 判断两个矩形是否有交集
 * @method intersectRect
 * @param   {rect_Object}   r1
 * @param   {rect_Object}   r2
 * @return  {Boolean}
 */
export function intersectRect
    ( r1, r2 ) {
        return !(
                    r2.x > ( r1.x + r1.width ) || 
                    ( r2.x + r2.width ) < r1.x || 
                    r2.y > ( r1.y + r1.height ) ||
                    ( r2.y + r2.height ) < r1.y
                );
    }

export function fixEndAngle( startAngle, endAngle ){
    if( endAngle < startAngle ){
        endAngle += 360;
    }
    return endAngle;
}

export function pointPlus( p1, p2 ){
    return {
        x: p1.x + p2.x
        , y: p1.y + p2.y
    }
}
