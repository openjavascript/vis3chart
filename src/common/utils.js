

/**
 * 取小数点的N位
 * <br />JS 解析 浮点数的时候，经常出现各种不可预知情况，这个函数就是为了解决这个问题
 * @method  parseFinance
 * @static
 * @param   {number}    _i
 * @param   {int}       _dot  default = 2
 * @return  number
 */
export function parseFinance( _i, _dot ){
    _i = parseFloat( _i ) || 0;
    typeof _dot == 'undefined' && ( _dot = 2 );
    _i && ( _i = parseFloat( _i.toFixed( _dot ) ) );
    return _i;
}

