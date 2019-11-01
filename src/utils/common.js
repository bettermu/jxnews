import storage from "./storage"

//推荐景区二维数组转换
export function handleArray(num,data) {
  let arr = new Array(Math.ceil(data.length / num))
  for(let i=0;i<arr.length;i++){
    arr[i] = new Array()
    for(let j=0;j<num;j++){
      arr[i][j] = '';
    }
  }
  for (let k = 0; k < data.length; k++) {
    arr[parseInt(k / num)][k % num] = data[k];
  }
  return arr
}

//动态添加SEO信息
export function addSeo(key, des) {

  let flag = true

  let metaDoms = document.getElementsByTagName('meta')
  for (let i = 0; i < metaDoms.length; i++) {
    if (metaDoms[i].name === 'keywords' || metaDoms[i].name === 'description') {
      flag = false
      return
    }
  }
  if (flag) {
    let keyMeta = document.createElement('meta')
    let DesMeta = document.createElement('meta')
    let headDom = document.getElementsByTagName('head')[0]
    keyMeta.name = 'keywords'
    keyMeta.content = key
    DesMeta.name = 'description'
    DesMeta.content = des
    headDom.insertBefore(keyMeta, headDom.children[3])
    headDom.insertBefore(DesMeta, headDom.children[3])
  }
}


//浏览器添加收藏
export function addFavorite(url,title) {
  //var url = window.location;
  //var title = document.title;
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("360se") > -1) {
      alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
  }
  else if (ua.indexOf("msie 8") > -1) {
      window.external.AddToFavoritesBar(url, title); //IE8
  }
  else if (document.all) {//IE类浏览器
    try{
     window.external.addFavorite(url, title);
    }catch(e){
     alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
  }
  else if (window.sidebar) {//firfox等浏览器；
      window.sidebar.addPanel(title, url, "");
  }
  else {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
  }
}

//设置首页
export function setHome(obj,url){
  try{
      obj.style.behavior='url(#default#homepage)';
      obj.setHomePage(url);
  }catch(e){
      if(window.netscape){
          try{
              netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
          }catch(e){
              alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
          }
      }else{
          alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
      }
  }
}

//下拉框数据格式转换
export function handleOption(data){
  let arr = []
  for(let i=0;i<data.length;i++){
    arr.push({
      value:data[i].id,
      label:data[i].name
    })
  }
  return arr

}

//登录拦截器
export function loginInterceptor(axios,url,succ,fail){
  axios.get(url).then((res)=>{
    let {code,msg,data} = res.data
    if(code === 0 ){
      succ && succ(res)
    } else {
      fail && fail(res)
    }
  })
}

//登录过期跳转登录页公共方法
export function redirectToLogin(message,pubPath){
  storage.remove('token')
  storage.remove('account')
  message({
    showClose: true,
    message: "账号未登录或过期，即将跳转登录页进行登录",
    duration: 1500,
    type: "error",
    onClose: () => {
      location.href=pubPath + "/person.html#/login";
    }
  });
}

//密码加密
export function Base64() {
  // private property
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // public method for encoding
  this.encode = function (input) {
   var output = "";
   var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
   var i = 0;
   input = _utf8_encode(input);
   while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
     enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
     enc4 = 64;
    }
    output = output +
    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
   }
   return output;
  }
  // public method for decoding
  this.decode = function (input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
   while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++));
    enc2 = _keyStr.indexOf(input.charAt(i++));
    enc3 = _keyStr.indexOf(input.charAt(i++));
    enc4 = _keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
     output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
     output = output + String.fromCharCode(chr3);
    }
   }
   output = _utf8_decode(output);
   return output;
  }
  // private method for UTF-8 encoding
  var _utf8_encode = function (string) {
   string = string.replace(/\r\n/g,"\n");
   var utftext = "";
   for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
     utftext += String.fromCharCode(c);
    } else if((c > 127) && (c < 2048)) {
     utftext += String.fromCharCode((c >> 6) | 192);
     utftext += String.fromCharCode((c & 63) | 128);
    } else {
     utftext += String.fromCharCode((c >> 12) | 224);
     utftext += String.fromCharCode(((c >> 6) & 63) | 128);
     utftext += String.fromCharCode((c & 63) | 128);
    }
   }
   return utftext;
  }
  // private method for UTF-8 decoding
  var _utf8_decode = function (utftext) {
   var string = "";
   var i = 0;
   var c = c1 = c2 = 0;
   while ( i < utftext.length ) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
     string += String.fromCharCode(c);
     i++;
    } else if((c > 191) && (c < 224)) {
     c2 = utftext.charCodeAt(i+1);
     string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
     i += 2;
    } else {
     c2 = utftext.charCodeAt(i+1);
     c3 = utftext.charCodeAt(i+2);
     string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
     i += 3;
    }
   }
   return string;
  }
 }
