let storage = {
  //存储
  set(key, value) {
    //localStorage.setItem(key, JSON.stringify(value))
    var oDate = new Date();  //创建日期对象
    oDate.setDate( oDate.getDate() + 1 ); //设置过期时间
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();  //设置cookie的名称，数值，过期时间
  },

  //取值
  get(key) {
    //return JSON.parse(localStorage.getItem(key));
    var arr1 = document.cookie.split('; '); //将cookie按“; ”分割，数组元素为： cookie名=cookie值
    for (var i=0; i<arr1.length; i++) {  //分割数组里的每个元素
        var arr2 = arr1[i].split('='); //按照“=”分割
        let arr3 = ''
        if ( arr2[0] == key ) { //如果数组的第一个元素等于给定的cookie名称
          if(arr2.length>2){
            arr2.shift()
            arr3 = arr2.join('=')
            return decodeURI(arr3)
          }
            return decodeURI(arr2[1]);  //返回翻译编码后的cookie值
        }
    }
  },

  // 删除数据
  remove(key) {
    //localStorage.removeItem(key);
    this.set(key, '', -1);  //cookie的过期时间设为昨天
  }

}

export default storage