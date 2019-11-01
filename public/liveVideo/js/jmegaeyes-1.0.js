/**
 * 互信互通视频监控平台 WEB开发API
 * @project
 */

/**
 * 互信互通视频监控平台 WEB开发API</br> 
 *   -所有API全部放到Megaeyes名命空间</br> 
 *   -以下划线开头的方法、属性为私有，在外部使用会导到程序异常</br> 
 *   -文档生成命令：</br>
 *   CD E:\2012_Workspace\EC_SDK\__mega_com\HxhtIEBox\Javascript</br>
 *   C:\Users\Administrator\AppData\Roaming\npm\yuidoc.cmd -c yuidoc.json -T simple .
 * @module JMegaeyes 
 */
var JMegaeyes = {};
/**
 * 辅助函数命名空间
 * @module JMegaeyes
 * @class Utils
 * @static
 */
JMegaeyes.Utils = {};
/**
 * 判断浏览器类型
 * @method isIE
 * @static
 * @return {Boolean} true:Microsoft Internet Explorer
 */
JMegaeyes.Utils.isIE = function(){
	var isIE = false;
	if ((navigator.appName == "Microsoft Internet Explorer")&&(navigator.platform != "MacPPC"))
		isIE = true;
	else if ((navigator.appName == "Netscape"))
		isIE = false;
	return isIE;
};
/**
 * 构建<OBJECT>元素，符合IE浏览器规范
 * @method objectStringFromClsID
 * @static
 * @param name {String} 插件ID
 * @param clsid {String} ActiveX控件的CLSID，格式：6B19191C-7BA3-4DA0-8088-BAE774642304。
 * @param width {Integer} 控件的宽度
 * @param height {Integer } 控件的高度
 * @return {String} 嵌入到HTML文档中的ActiveX对像语法串
 */
JMegaeyes.Utils.objectStringFromClsID = function(name, clsid, width, height){
	var embedded_objstr = "<OBJECT ID=\"" + name + "\" ";
	embedded_objstr += "WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\" ";
	embedded_objstr += "CLASSID=\"CLSID:" + clsid + "\">";
	embedded_objstr += "</OBJECT>";
	return embedded_objstr;
};
/**
 * 构建<OBJECT>元素，符合fireFox、chrome浏览器规范
 * @method objecctStringFromMimeType
 * @static
 * @param name {String} 插件ID
 * @param mime {String} fireFox插件的MIME类型，格式：application/hxht-ibox。
 * @param width {Integer} 控件的宽度
 * @param height {Integer } 控件的高度
 * @return {String} 嵌入到HTML文档中的npPlugin对像语法串
 */
JMegaeyes.Utils.objecctStringFromMimeType = function(name, mime, width, height)
{
	var embedded_objstr = "<OBJECT ID=\"" + name + "\" ";
	embedded_objstr += "WIDTH=\"" + width + "\" HEIGHT=\"" + height + "\" ";
	embedded_objstr += "TYPE=\"" + mime + "\" >";
	embedded_objstr += "</OBJECT>";
	return embedded_objstr;
};
/**
 * 创建容器控件（IBOX），并在其中初始化clsID指定的目标控件
 * 注：IBOX使用的数据类型为[true, false, 23234, {"int64":"923ABdf"}, 234.2392, "skf9waer", {"handle":21}]
 * @method createActiveX
 * @static
 * @param placeHolder {String} HTML元素的ID，如DIV、SPAN。将在这个元素内部创建插件。
 * @param pluginName {String} 插件ID
 * @param clsID {String} 在IBOX中加载的ActiveX控件的CLSID,格式：{6B19191C-7BA3-4DA0-8088-BAE774642304}
 * @param width {Integer} 控件的宽度
 * @param height {Integer } 控件的高度
 * @return {Object} 插件对像
 */
JMegaeyes.Utils.createActiveX = function(placeHolder, pluginName, clsID, width, height){
	var embedStr;
	if(JMegaeyes.Utils.isIE())
	{
		embedStr = JMegaeyes.Utils.objectStringFromClsID(pluginName, "6B19191C-7BA3-4DA0-8088-BAE774642304", width, height);
	}
	else
	{
		embedStr = JMegaeyes.Utils.objecctStringFromMimeType(pluginName, "application/x-hxht-iebox", width, height);
	}
	
	var holder = $("#" + placeHolder);
	//holder.html(embedStr);
	holder.append(embedStr);
	var plugin = holder.find("#" + pluginName);

	var ret = 0;
	if(width == 0 || height == 0 )
	{
		ret = plugin[0].BoxCreateCom(clsID);
	}
	else
	{
		ret = plugin[0].BoxCreateOcx(clsID);
	}
	
	if(ret != 0)
	{
		alert("Can't create COM/Activex, the CLSID is " + clsID + ".");
	}
	return plugin[0];
};
/**
 * 注册控件事件处理函数
 * @method attchEvent
 * @static
 * @param plugin {Object} 插件对像
 * @param obj {Object} 事件回调对象，必须有成员函数obj._defaultEventProc
 */
JMegaeyes.Utils.attchEvent = function(plugin, obj)
{
	var objInstance = obj;
	var handler = function(evName, strJson){
		objInstance._defaultEventProc(evName, strJson);
	}
	if(plugin.attachEvent){
		plugin.attachEvent("OnEvent", handler);
	}
	else{
		plugin.addEventListener("OnEvent", handler, false);
	}
};
/**
 * 创建XML DOM对像
 * @method parseXML
 * @static
 * @param txt {String} XML文档格式的字符串
 * @return {Object} XML DOM (Document Object Model) 
 */
JMegaeyes.Utils.parseXML = function(txt){
	var xmlDoc = null;
	if(JMegaeyes.Utils.isIE())
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(txt);
	}
	else
	{
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(txt,"text/xml");
	}
	return xmlDoc;
};
/**
 * 会话管理模块</br>
 * 主要功能用于向平台登录及注销, 登录有两种方式：</br>
 * &nbsp;1 - 直接登录到平台(loginToPlatform)</br>
 * &nbsp;2 - 在WEB服务器上实现登录，客户端模块只登录到接入服务器(loginToServer)。参考互信平台HTTP API。</br>
 * </br>
 * <pre><code>var mySession = new JMegaeyes.Session();
 * mySession.createPlugin("pluginDivId");
 * var ret = mySession.loginToPlatform("192.168.0.1",8080,"use","123456");
 * if(ret){
 * //...您的业务代码...
 * }
 * mySession.logout();
 * 
 * HTML:&lt;body&gt;&lt;div id="pluginDivId"&gt;控件在这里创建&lt;/div&gt;&lt;/body&gt;</br>
 * </code></pre>
 * @module JMegaeyes
 * @class Session
 * @constructor
  */
JMegaeyes.Session = function(){
	/**
	 * 平台参数、用户参数、登录返回的会话参数
	 * @property sysSetting
	 * @type Object 
	 * @private
	 */
	this.sysSetting = {};
	/**
	 * 保存插件对像
	 * @property _implObject
	 * @type Object 
	 * @private
	 */
	this._implObject = null;
	/**
	 * 保存错误信息插件对像
	 * @property _impError
	 * @type Object 
	 * @private
	 */
	this._impError = null;
	/**
	 * HTML容器ID
	 * @property _divPlaceHolder
	 * @type String 
	 * @private
	 */
	this._divPlaceHolder = "",
	/**
	 * 插件对像ID
	 * @property _pluginName
	 * @type String 
	 * @private
	 * @default _divPlaceHolder + "_ibox"
	 */
	this._pluginName = "";
	/**
	 * 登录方式, true:登录到平台；false:不登录平台仅与接入服务器保持连接
	 * @property _loginMode
	 * @type Boolean 
	 * @private
	 */
	this._loginMode = true;
	/**
	 * 异步查询设备列表时，用于查询条件和返回结果间的匹配
	 * @property _queryHandler
	 * @private
	 */
	this._queryHandler = 0;
	/**
	 * 查询设备列表完成后，通知回调
	 * @property _queryCbFunction
	 * @private
	 */
	this._queryCbFunction = null;
	/**
	 * 以机构树方式组织的设备列表缓存
	 * @property _cacheOrgans
	 * @private
	 */
	this._cacheOrgans = null;
	/**
	 * 以数组方式组织的设备列表缓存
	 * @property _cacheDevs
	 * @private
	 */
	this._cacheDevs = null;
	/**
	 * 消息回调映射表，用于SendAccessMsg和SendCenterMsg
	 * @property _msgResponseMap
	 * @private
	 */
	this._msgResponseMap = {};
	/**
	 * 报警事件回调
	 * @property _onAlarm
	 * @type Function
	 * @private
	 * @default null
	 */
	this._onAlarm = null;
	/**
	 * 设备状态事件回调
	 * @property _onDevStatus 
	 * @type function
	 * @private
	 * @default null
	 */
	this._onDevStatus = null;
	/**
	 * 创建Session控件
	 * @method createPlugin
	 * @param divPlaceHolder {String} HTML文档中的占位元素ID
	 */
	this.createPlugin = function(divPlaceHolder){
		this._divPlaceHolder = divPlaceHolder;
		this._pluginName = divPlaceHolder + "_ibox";
		this._pluginThrdName = divPlaceHolder + "_thrd_ibox";
		this._impThrdMgr = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginThrdName, "{730C285B-0456-4C5F-B94F-52FC6B3C6DDC}", 0,0);
		this._impThrdMgr.BoxInvoke("RegUIThrd", "");
		this._pluginErrName = divPlaceHolder + "_err_ibox";
		this._impError = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginErrName, "{85D350AD-F685-4016-A9BE-C53BC4A09357}", 0,0);
		this._implObject = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginName, "{63295B40-53B0-4B04-AD08-E7C159CAD462}", 0,0);
		JMegaeyes.Utils.attchEvent(this._implObject, this);
	};
	/**
	 * 卸载Session控件
	 * @method removePlugin
	 */
	this.removePlugin = function(){
		this._implObject.BoxInvoke("Logout", "");
		this._impThrdMgr.BoxInvoke("UnRegUIThrd", "");
	};
	/**
	 * 登录到平台
	 * @method loginToPlatform
	 * @param ip {String} 监控平台中心管理服务器IP地址
	 * @param port {Integer} 监控平台中心管理服务器服务端口号
	 * @param user {String} 用户帐号
	 * @param password {String} 用户密码
	 * @return {Boolean} true：登录成功
	 * @example
	 * <pre><code>InstanceOfSession.loginToPlatform("192.168.0.1",8080,"user_account", "user_password");</code></pre>
	 */
	this.loginToPlatform = function(ip, port, user, password){
		var sCfg = "<Message type=\"center\"><Center host=\"" + ip + "\" port=\"" + port + "\" ssl=\"0\"/>";
		sCfg += "<Account name=\"" + user + "\" pswd=\"" + password + "\" /></Message>";
		var args = [sCfg, ""];
		
		var ret = this._implObject.BoxInvoke("Init", $.toJSON(args));
		ret = $.parseJSON(ret);
		if( ret[0].int64 != "0" )
			return false;
			
		ret = this._implObject.BoxInvoke("LoginSync", "");
		ret = $.parseJSON(ret);
		if( ret[0].int64 != "0" )
			return false;
			
		this.sysSetting["J2EE_IP"] = ip;
		this.sysSetting["J2EE_PORT"] = port;
		this.sysSetting["ACCOUNT"] = user;
		var tmp = this._implObject.BoxInvoke("GetAccessIP", "");
		ret = $.parseJSON(tmp);
		this.sysSetting["CENTER_IP"] = ret[0];
		tmp = this._implObject.BoxInvoke("GetAccessPort", "");
		ret = $.parseJSON(tmp);
		this.sysSetting["CENTER_PORT"] = ret[0];
		tmp = this._implObject.BoxInvoke("GetUserNaming", "");
		ret = $.parseJSON(tmp);
		this.sysSetting["ACCOUNT_NAMING"] = ret[0];
		tmp = this._implObject.BoxInvoke("GetPriority", "");
		ret = $.parseJSON(tmp);
		this.sysSetting["ACCOUNT_LEVEL"] = ret[0];
		tmp = this._implObject.BoxInvoke("GetSessionID", "");
		ret = $.parseJSON(tmp);
		this.sysSetting["SESSION_ID"] = ret[0];
		return true;
	};
	/**
	 * 发消息到接入服务器
	 * @method sendAccessMsg
	 * @return {Boolean}
	 */
	this.sendAccessMsg = function(msgID, xml, fnResponse){
		var tmp = this._implObject.BoxInvoke( "GenAccessMsgNo", "");
		var msgNO = $.parseJSON(tmp);
		var params = [
			msgNO[0],
			msgID, 
			xml
		];
		var tmp = this._implObject.BoxInvoke("SendAccessMsg", $.toJSON(params));
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0"){
			this._msgResponseMap[msgNO[0]] = fnResponse;	
		}
		else{
			tmp = this._impError.BoxInvoke("FormatError", $.toJSON( [{"int64":retVal[0].int64}, false]));
			var errInfo = $.parseJSON(tmp);
			fnResponse(false, errInfo);
		}
	};
	/**
	 * 登陆到接入服务器
	 * @method loginToServer
	 * @return {Boolean}
	 */
	this.loginToServer = function(){
		//TODO:
	};
	/**
	 * 立即更新设备状诚
	 * @method loginToServer
	 */
	this.updateDevStatus = function(){
		if(this._onDevStatus){
			this._implObject.BoxInvoke("StartDevStatus", "");
		}
	};
	
	
	/**
	 * 是否登录为状态
	 * @method isLogin
	 * @return {Boolean} true：已登录，false：未登录
	 */
	this.isLogin = function(){
		var tmp = this._implObject.BoxInvoke("LoggedIn", "");
		var ret = $.parseJSON(tmp);
		return ret[0];
	};
	/**
	 * 注销
	 * @method logout
	 */
	this.logout = function(){
		this._implObject.BoxInvoke("Logout", "");
	};
	/**
	 * 查询用户所有可访问的设备清单
	 * @method queryAllDevices
	 * @param fn {Function}
	 * @example
	 * <pre><code>
	 * //参数 orgs {name:&lt;String&gt;, naming:&lt;String&gt;, sub_group:[&lt;orgs对像&gt; ...]}
	 * //参数 devs [ {name:&lt;String&gt;, naming:&lt;String&gt;, path:[orgs.naming, ...], ... }, ... ]
	 * InstanceOfSession.queryAllDevices( function(orgs, devs){
	 * 	for(var i=0; i&lt;devs.length; i++){
	 *  	alert(devs[i].name + devs[i].naming + devs[i].path);
	 * 		if(devs[i].type == "C"){ //摄像头
	 *			if(devs[i].ptz){ alert("有云台");}
	 *			if(devs[i].scheme){ alert("支持报警预案功能"); }
	 *			alert("经度" + devs[i].x + ",纬度" + devs[i].y + ",海拔" + devs[i].z);
	 *		}
	 * 		else if(devs[i].type == "D"){ //电视墙
	 *			if(devs[i].scheme){ alert("支持报警预案功能"); }
	 *		}
	 * 		else if(devs[i].type == "I"){ //报警输入
	 *			if(devs[i].scheme){ alert("支持报警预案功能"); }
	 *			alert("经度" + devs[i].x + ",纬度" + devs[i].y + ",海拔" + devs[i].z);
	 *		}
	 * 		else if(devs[i].type == "O"){ //报警输出
	 *			if(devs[i].scheme){ alert("支持报警预案功能"); }
	 *		}
	 * 		else if(devs[i].type == "U"){ //GPS等外接设备
	 *		}
	 * 	}
	 * 	var stack = [];
	 *	stack.push(orgs);
	 * 	while(stack.length &gt; 0){
	 *		var curOrg = stack.pop();
	 *		alert(curOrg.name + curOrg.naming);
	 *		for(var i=0; i&lt;curOrg.sub_group.length; i++){
	 *			stack.push(curOrg.sub_group[i]);
	 *		}
	 *	}
	 * } );
	 * </code></pre>
	 */
	this.queryAllDevices = function(fn){
		//正在查询中
		if(this._queryHandler != 0)
		{
			return; 
		}
		this._queryHandler = 600;
		this._queryCbFunction = fn;

		var tmp = this._implObject.BoxInvoke("QueryDevListAll", "");
		var ret = $.parseJSON(tmp);
		if(ret[0].int64 != "0")
		{
			this._queryHandler = 0;
			this._queryCbFunction = null;
			fn(null, null);
			return;
		}
	};
	/**
	 * 获取平台参数、用户参数、登录返回的会话参数。在登录成功后调用。
	 * @method getSysSetting
	 * @return {Object} 平台参数 
	 * @example
	 * <pre><code>//平台参数对像结构：
	 * {J2EE_IP:"", J2EE_PORT:8080, CENTER_IP:"", CENTER_PORT:6001, ACCOUNT:"", SESSION_ID:"", ACCOUNT_NAMING:"", ACCOUNT_LEVEL:0 }
	 * </code></pre>
	 */
	this.getSysSetting = function(){
		return this.sysSetting;
	};
	/**
	 * 获取用户会话标识
	 * @method getSessionID
	 * @return {String} 登录后从平台返回的用户会话标识
	 */
	this.getSessionID = function(){
		return this.sysSetting.SESSION_ID;
	};
	/**
	 * 获取用户标识
	 * @method getUserNaming
	 * @return {String} 登录后从平台返回的用户标识
	 */
	this.getUserNaming = function(){
		return this.sysSetting.ACCOUNT_NAMING;
	};
	/**
	 * 获取平台标识
	 * @method getPlatformID
	 * @return {String} 登录后从平台返回的平台标识
	 */
	this.getPlatformID = function(){
		var tmp = this._implObject.BoxInvoke("GetPlatID", "");
		ret = $.parseJSON(tmp);
		return ret[0];
	};
	/**
	 * 用户是否为企业管理员
	 * @method isAdmin
	 * @return {Boolean} true：管理员；false：一般用户
	 */
	this.isAdmin = function(){
		var tmp = this._implObject.BoxInvoke("IsAdmin", "");
		ret = $.parseJSON(tmp);
		return ret[0];
	}
	
	/**
	 * 修改用户密码
	 * @method changePassword
	 * @param oldPassword {String} 现在使用的密码
	 * @param newPassword {String} 新密码
	 * @return {Boolean} true:调用成功
	 */
	this.changePassword = function(oldPassword, newPassword){
		var tmp = this._implObject.BoxInvoke( "ChangePassword", $.toJSON([oldPassword, newPassword]) );
		ret = $.parseJSON(tmp);
		if(ret[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 报警事件
	 * @method onAlarm
	 * @param fn {Function} 报警事件处理函数，原型function(eventObj)。
	 * @example
	 * <pre><code>
	 * app.Session.onAlarm( function(eventObj){
	 *	//eventObj.sSourceNaming 事件源标识。sSourceType为"P"时为用户标识；sSourceType为"C"时为摄像头标识；sSourceType为"I"时为报警输入设备标识；
	 *  //event.sSourceType 事件源类型， "P" - 客户端触发；"C" - 摄像头视频触发；"I" - 报警按扭触发
	 *	//event.sEventType 事件类型，C -摄像头移动侦测报警；I -报警器报警 E -门禁设备报警 A -视频智能分析报警 M -用户执行预案
	 *	//event.sAlarmTime 事件发生时间， 格式 "2012-02-09 19:48:05"。
	 * 	alarm("有报警事件");	
	 * });
	 * </code></pre>
	 */
	this.onAlarm = function(fn){
		this._onAlarm = fn;
	}
	/**
	 * 设备状态更新事件
	 * @method onDevStatus
	 * @param fn {Function} 设备状态更新事件处理函数，原型function(statusArray)。
	 * @example
	 * <pre><code>
	 * app.Session.onDevStatus( function(statusArray){
	 * 		for(var i=0; i<statusArray.length; i++){
	 *			//statusArray[i].naming 设备标识
	 *  		//statusArray[i].type 设备类型
	 *			//statusArray[i].online 是否在线
	 *			alert("设备：" + statusArray[i].naming + " 类型：" + statusArray[i].type + " 在线状态：" + statusArray[i].online);
	 * 		}
	 * });
	 * </code></pre>
	 */
	this.onDevStatus = function(fn){
		this._onDevStatus = fn;
	};
	/**
	 * 解析设备列表XML
	 * @method _paserOrganXml
	 * @private
	 * @param txt {String} 平台以XML格式返的设备列表文本
	 * @return {Array} 设备对像数组
	 */
	this._paserOrganXml = function(txt){
		var dom = JMegaeyes.Utils.parseXML(txt);
		var root = dom.documentElement;
		this._cacheOrgans = {
			type: "G",
			name:root.getAttribute("name"),
			naming: root.getAttribute("id"),
			sub_group:[]
		};
		this._cacheDevs = [];
		var path = new Array();
		path.push(root.getAttribute("id"));
		this._parserMegaeyesOrganization(root, path, this._cacheOrgans, this._cacheDevs);
	};
	/**
	 * 递归解析机构信息
	 * @method _parserMegaeyesOrganization
	 * @private
	 * @param node {Element}  机构节点
	 * @param curPath {Array} 根到当前机构的路径
	 * @param curGroup {Object} 当前机构，当前机构下的子机构会追加到这curGroup.sub_group中
	 * @param devList {Array} 设备列表，当前机构下的设备会追加到这个数组中
	 */
	this._parserMegaeyesOrganization = function (node, curPath, curGroup, devList)
	{
		var childNodes = node.childNodes;
		var childGroups = [];
		for(var i=0; i < childNodes.length; i++)
		{
			if(childNodes[i].nodeName == "video_input_channel")
			{
				/*
					attrs is : hasPan,storeType, x,y,z, AlarmSchemeid ... ...
				*/
				//是否有云台
				var hasPtz = (childNodes[i].getAttribute("hasPan") == "true") ? true:false;
				//是否支持报警预案功能
				var hasScheme  = (childNodes[i].getAttribute("scheme") == "true") ? true:false;
				var obj = { 
				path: curPath,
				type: "C",
				name: childNodes[i].getAttribute("name"),
				naming: childNodes[i].getAttribute("naming"),
				ptz: hasPtz,
				scheme: hasScheme,
				//x：经度[-180.0,+180.0]，0经度为原点，向东为正，向西为负；
				x: childNodes[i].getAttribute("x"),
				//y：纬度[-85.05112878, +85.05112878] 赤道纬度为原点，向北为正，向南为负；
				y: childNodes[i].getAttribute("y"),
				//z：海拔；
				z: childNodes[i].getAttribute("z")};
				
				devList.push(obj);
			}
			else if(childNodes[i].nodeName == "video_output_channel")
			{
				//是否支持报警预案功能
				var hasScheme  = (childNodes[i].getAttribute("scheme") == "true") ? true:false;
				var obj = { 
				path: curPath,
				type: "D",
				name: childNodes[i].getAttribute("name"),
				naming: childNodes[i].getAttribute("naming"),
				scheme: hasScheme };
				devList.push(obj);
			}
			else if(childNodes[i].nodeName == "alarm_input_channel")
			{
				//是否支持报警预案功能
				var hasScheme  = (childNodes[i].getAttribute("scheme") == "true") ? true:false;
				var obj = { 
				path: curPath,
				type: "I",
				name: childNodes[i].getAttribute("name"),
				naming: childNodes[i].getAttribute("naming"),
				scheme: hasScheme,
				//x：经度[-180.0,+180.0]，0经度为原点，向东为正，向西为负；
				x: childNodes[i].getAttribute("x"),
				//y：纬度[-85.05112878, +85.05112878] 赤道纬度为原点，向北为正，向南为负；
				y: childNodes[i].getAttribute("y"),
				//z：海拔；
				z: childNodes[i].getAttribute("z") };

				devList.push(obj);
			}
			else if(childNodes[i].nodeName == "alarm_output_channel")
			{
				//是否支持报警预案功能
				var hasScheme  = (childNodes[i].getAttribute("scheme") == "true") ? true:false;
				var obj = { 
				path: curPath,
				type: "O",
				name: childNodes[i].getAttribute("name"),
				naming: childNodes[i].getAttribute("naming"),
				scheme: hasScheme};
				devList.push(obj);
			}
			else if(childNodes[i].nodeName == "undefined_device") 
			{
				var obj = { 
				path: curPath,
				type: "U",
				name: childNodes[i].getAttribute("name"),
				naming: childNodes[i].getAttribute("naming") };
				devList.push(obj);
			}
			else if(childNodes[i].nodeName == "organ") 
			{
				childGroups.push(childNodes[i]);
			}
		}
	
		for(var n = 0; n < childGroups.length; n++)
		{
			var path = curPath.slice(0);
			var groupName = childGroups[n].getAttribute("name");
			var newGroup = {
				type: "G",
				name: groupName,
				naming: childGroups[n].getAttribute("id"),
				sub_group:[]
			};
			path.push(newGroup.naming);
			curGroup.sub_group.push(newGroup);
			this._parserMegaeyesOrganization(childGroups[n], path, newGroup, devList);
		}
	}
	/**
	 * 插件的事件分发函数
	 * @method _defaultEventProc
	 * @private
	 * @param evName {String} 事件名称
	 * @param jsonStr {JSONString} 事件参数
	 */
	this._defaultEventProc = function(evName, jsonStr){
	
		//if( evName != "OnStatusChanged" && evName != "OnQueryDevList" ){
		//	alert(evName + "[" + jsonStr + "]");
		//}
		
		//if(evName == "OnStatusChanged")
		//{
		//}
		//else 
		if(evName == "OnQueryDevList") 
		{
			var args = $.parseJSON(jsonStr);
			if(args[1].int64 != "0" )
			{
				this._queryCbFunction(this._cacheOrgans, this._cacheDevs);
				this._queryCbFunction = null;
				this._queryHandler = 0;
				return;
			}
			var buffer = "";
			if(typeof(args[2]) == "object") //{handle:123}
			{
				var bufferHandler = args[2].handle;
				while(true){
					var block = this._implObject.ReadBuffer(bufferHandler);
					if(block == "")
					{
						break;
					}
					buffer += block;
				}
			}
			else
			{
				buffer = args[2];
				
			}
			this._paserOrganXml(buffer);
			this._queryCbFunction(this._cacheOrgans, this._cacheDevs);
			this._queryCbFunction = null;
			this._queryHandler = 0;
			if(this._onDevStatus){
				//订阅所有设备状态
				var tmp = this._implObject.BoxInvoke( "RegDevStatusAll", "" );
				var ret = $.parseJSON(tmp);
				if(ret[0].int64 != "0"){
					alert("订阅设备状态错误");
				} 
				//else{
					//alert("订阅设备状态成功");
				//}
				
			}
		}
		else if(evName == "OnAccessReturn" || evName == "OnCenterReturn"){
			var args = $.parseJSON(jsonStr);
			var cbResponse = this._msgResponseMap[args[0]];
			if(cbResponse){
				if(args[1].int64 == "0"){
					var buffer = "";
					if(typeof(args[2]) == "object"){ //{handle:123}
						var bufferHandler = retVal[0].handle;
						while(true){
							var block = this._implObject.ReadBuffer(bufferHandler);
							if(block == ""){
								break;
							}
							buffer += block;
						}
					}
					else
					{
						buffer = args[2];
					}
					cbResponse(true, buffer);
				}
				else{
					var retVal = this._impError.BoxInvoke("FormatError", $.toJSON( [{int64:args[1].int64}, false]));
					var errInfo = $.parseJSON(retVal);
					cbResponse(false, errInfo[0]);
				}
			}
		}
		else if(evName == "OnAlarmEvent"){
			var args = $.parseJSON(jsonStr); //args[0] is szEvent; args[1] is nType
			var buffer = "";
			if(typeof(args[1]) == "object"){
				var bufferHandler = args[1].handle;
				while(true){
					var block = this._implObject.ReadBuffer(bufferHandler);
					if(block == ""){
						break;
					}
					buffer += block;
				}
			}
			else{
				buffer = args[1];
			}
			if(this._onAlarm){
				try{
					var dom = JMegaeyes.Utils.parseXML(buffer);
					var event = {};
					if(args[0] == 1){ //预案联动
						var tmp = dom.getElementsByTagName("Naming");
						if(tmp.length > 0){ //设备报警
							event.sSourceNaming = tmp[0].textContent;
							var devType = dom.getElementsByTagName("DevType")[0].textContent;
							if(devType == "general_camera_vic" || devType == "video_input_channel" ){
								event.sSourceType = "C";
								event.sEventType = "C";
							}
							else if(devType == "alarm_input_channel"){
								event.sSourceType = "I";
								event.sEventType = "I";
							}
							else if(devType == "entrance"){
								event.sSourceType = "C";
								event.sEventType = "E";
							}
							else if(devType == "defense_area"){
								event.sSourceType = "C";
								event.sEventType = "A";
							}
						}
						tmp = dom.getElementsByTagName("UserNaming");
						if(tmp.length > 0){
							event.sSourceNaming = tmp[0].textContent;
							event.sSourceType = "P";
							event.sEventType = "M";
						}
						var eventNode = dom.getElementsByTagName("Event")[0];
						event.sAlarmTime = eventNode.getAttribute("StartTime");
					}
					else{//传统报警联动
						var node = dom.getElementsByTagName("Alarm ")[0];
						var devType = parseInt(node.getAttribute("DevType"));
						event.sSourceNaming = node.getAttribute("DevID");
						event.sAlarmTime = node.getAttribute("BeginDT");
						if(devType == 5){
							event.sSourceType = "C";
							event.sEventType = "C";
						}
						else if(devType == 6){
							event.sSourceType = "I";
							event.sEventType = "I";
						}
					}
					if(typeof(event.sSourceName) != "undefined" && typeof(event.sSourceType) != "undefined" && typeof(event.sEventType) != "undefined"){
						this._onAlarm(event);
					}
				}
				catch(err){
				}
			}
		}
		else if( evName == "OnDevsStatus" ){
			var args = $.parseJSON(jsonStr); //args[0] is szDevsStatus;
			var buffer = "";
			if(typeof(args[0]) == "object"){
				var bufferHandler = args[0].handle;
				while(true){
					var block = this._implObject.ReadBuffer(bufferHandler);
					if(block == ""){
						break;
					}
					buffer += block;
				}
			}
			else{
				buffer = args[0];
			}
			if(this._onDevStatus){
				try{
					var dom = JMegaeyes.Utils.parseXML(buffer);
					var nodes = dom.getElementsByTagName("Dev");
					var devs = [];
					for(var i =0; i < nodes.length; i++){
						var tmp = nodes[i].getAttribute("type");
						if(tmp == "VideoInputChannel"){
							var one = {};
							one.naming = nodes[i].getAttribute("naming");
							one.type = "C";
							one.online = (( "0" == nodes[i].getAttribute("status") ) ? false:true);
							devs.push(one);
						}
					}
					this._onDevStatus(devs);
				}
				catch(err){
				}
			}
			
		}
	};
};

/**
 * 实时视频组件
 * @module JMegaeyes
 * @class RealPlayer
 * @constructor
 */
JMegaeyes.RealPlayer = function () {
    /**
    * 平台参数、用户参数、登录返回的会话参数
    * @property sysSetting
    * @type Object 
    * @private
    */
    this.sysSetting = null;
    /**
    * 保存插件对像
    * @property _implObject
    * @type Object 
    * @private
    */
    this._implObject = null;
    /**
    * HTML容器ID
    * @property _divPlaceHolder
    * @type String 
    * @private
    */
    this._divPlaceHolder = "",
    /**
    * 插件ID
    * @property _pluginName
    * @type String 
    * @private
    * @default _divPlaceHolder + "_ibox"	 
    */
	this._pluginName = "";
    /**
    * 当前视频源摄像头的统一标识
    * @property _cameraNaming
    * @type String
    * @private
    */
    this._cameraNaming = "";
    /**
    * 单击事件回调
    * @property _onClick
    * @type Function
    * @private
    * @default null
    */
    this._onClick = null;
    /**
    * 双击事件回调
    * @property _onDBClick
    * @type Function
    * @private
    * @default null
    */
    this._onDBClick = null;
    /**
    * 云镜控制事件回调
    * @property _onPtzControl
    * @type Function
    * @private
    * @default null
    */
    this._onPtzControl = null;
    /**
    * 创建播放控件
    * @method createPlugin
    * @param divPlaceHolder {String} HTML文档中占位元素的ID
    * @param width {Integer} 控件的宽度
    * @param height {Integer} 控件的高度
    */
    this.createPlugin = function (divPlaceHolder, width, height) {
        this._divPlaceHolder = divPlaceHolder;
        this._pluginName = divPlaceHolder + "_ibox";
        this._implObject = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginName, "{931379C7-422F-4743-82CE-15A25D075E4E}", width, height);
        JMegaeyes.Utils.attchEvent(this._implObject, this);
        var cfg = "<Source><Event value=\"|onlclick|onldblclk|\"/></Source>";
        this._implObject.BoxInvoke("Init", $.toJSON([cfg]));

    };
    /**
    * 调整插件窗口大小
    * @method resize
    * @param width {Integer} 控件的宽度
    * @param height {Integer} 控件的高度
    */
    this.resize = function (width, height) {
        this._implObject.width = width;
        this._implObject.height = height;
    }
    /**
    * 设置平台参数:中心服务器地址，中心服务端口，接入服务器地址，接入服务器端口，用户帐号，用户会话标识，用户统一命名，用户特权等级
    * @method setSysSetting
    * @param args {Object} 结构为{ J2EE_IP:"", J2EE_PORT:8080, CENTER_IP:"", CENTER_PORT:6001, ACCOUNT:"", SESSION_ID:"", ACCOUNT_NAMING:"", ACCOUNT_LEVEL:0 }
    * @example
    * <pre><code>var args = InstanceOfSession.getSysSetting();
    * InstanceOfRealPlayer.setSysSetting(args);</code></pre>
    */
    this.setSysSetting = function (args) {
        this.sysSetting = args;
    };
    /**
    * 播放实时视频。在setSysSetting后调用。
    * @method play
    * @param camera_naming {String} 摄像头的标识
    * @param title {String} 摄像头的名称
    * @return {Boolean} true-调用成功
    */

    this.play = function (camera_naming, title) {
        var cfg_str = "";
        cfg_str += "<Source type=\"access\">";
        cfg_str += "<Camera naming=\"" + camera_naming + "\" name=\"" + title + "\" />";
        cfg_str += "<Version value=\"1\" />";
        cfg_str += "<Account naming=\"" + this.sysSetting["ACCOUNT_NAMING"] + "\" name=\"" + this.sysSetting["ACCOUNT"] + "\" privilege=\"" + this.sysSetting["ACCOUNT_LEVEL"] + "\" sessionid=\"" + this.sysSetting["SESSION_ID"] + "\" />";
        cfg_str += "<Center ip=\"" + this.sysSetting["J2EE_IP"] + "\" port=\"" + this.sysSetting["J2EE_PORT"] + "\" />";
        cfg_str += "<Access ip=\"" + this.sysSetting["CENTER_IP"] + "\" port=\"" + this.sysSetting["CENTER_PORT"] + "\" />";
        cfg_str += "<Event value=\"|onlclick|onldblclk|onlbtndown|onlbtnup|onlmousemove|\">"
        cfg_str += "<onldblclk value=\"|dofullscreen|\"/>"
        cfg_str += "<onlmousemove value=\"|onptzctrl|\"/>"
        cfg_str += "</Event></Source>";
        var tmp = this._implObject.BoxInvoke("GetStatus", "");
        var status = $.parseJSON(tmp);
        if (status[0] > 1) {
            this._implObject.BoxInvoke("Stop", $.toJSON([0]));
        }
        tmp = this._implObject.BoxInvoke("Init", $.toJSON([cfg_str]));
        var retVal = $.parseJSON(tmp);
        if (retVal[0].int64 != "0") {
            //alert("Init failed!");
            return false;
        }
        tmp = this._implObject.BoxInvoke("Connect", "");
        retVal = $.parseJSON(tmp);
        if (retVal[0].int64 != "0") {
            //alert("Connect failed!");
            return false;
        }
        this._cameraNaming = camera_naming;
        return true;
    };
    /**
    * 关闭视频播放
    * @method stop
    */
    this.stop = function () {
        var tmp = this._implObject.BoxInvoke("GetStatus", "");
        var status = $.parseJSON(tmp);
        if (status[0] > 1) {
            this._implObject.BoxInvoke("Stop", $.toJSON([0]));
        }
        this._cameraNaming = "";
    };
    /**
    * 控件运行状态
    * 1 - 没有使用
    * 2 - 准备完成，开始连接
    * 3 - 正在查找视频源
    * 4 - 正在连接视频服务器
    * 5 - 正在播放，如果使用了录像回放，如果当前正在回放录像，则为该状态。可使用IsPlayRecord进一步区分。
    * 6 - 播放错误
    * @method getStatus
    * @return {Integer} 
    */
    this.getStatus = function () {
        var tmp = this._implObject.BoxInvoke("GetStatus", "");
        var status = $.parseJSON(tmp);
        return status[0];
    };
    /**
    * 全屏显示
    * @method fullScreen
    * @param flag {Boolean} true-全屏；false-取消全屏
    */
    this.fullScreen = function (flag) {
        if (flag)
            this._implObject.BoxInvoke("FullScreen", $.toJSON([true]));
        else
            this._implObject.BoxInvoke("FullScreen", $.toJSON([false]));
    }
    /**
    * 抓拍照片
    * @method snapshot
    * @param filepath {String} 如果没有指定文件路径名(filepath="")，插件将弹出保存文件对话框由用户自行输入。
    * @return {Boolean} true-调用成功
    */
    this.snapshot = function (filepath) {
        var path2 = "[\"" + filepath + "\"]";
        var tmp = this._implObject.BoxInvoke("Snapshot", path2);
        //var tmp = this._implObject.BoxInvoke("Snapshot",$.toJSON([filepath]));
        var retVal = $.parseJSON(tmp);
        //alert(tmp);
        if (retVal[0].int64 == "0") {
            return true;
        }
        return false;
    };

    /**
    * 抓拍照片2
    * @method snapshot
    * @param filepath {String} 如果没有指定文件路径名(filepath="")，插件将弹出保存文件对话框由用户自行输入。
    * @return {String} 文件名-调用成功；空串-调用失败
    */
    this.snapshotEx = function (filepath) {
        var tmp = this._implObject.BoxInvoke("SnapshotEx", $.toJSON([filepath]));
        var retVal = $.parseJSON(tmp);
        if (retVal[0].int64 == "0") {
            return retVal[1];
        }
        return "";
    };
    /**
    * 选择目录
    * @method selectFilePath
    * @param filepath {String} 对话框初始选择的目录
    * @return {String} 路径名-调用成功；空串-调用失败
    */
    this.selectFilePath = function (filepath) {
        var tmp = this._implObject.BoxInvoke("SelectFilePath", $.toJSON([filepath]));
        var retVal = $.parseJSON(tmp);
        return retVal[0];
    };
    /**
    * 得到抓拍图片的图片格式，目前有jpg和bmp两种，该格式由视频解码器决定。
    * 该函数必须在正在播放（包括处理缓冲和暂停）状态下使用。
    * @method getPictureExt
    * @return {String} 图片文件的扩展名
    */
    this.getPictureExt = function () {
        var tmp = this._implObject.BoxInvoke("GetStatus", "");
        var status = $.parseJSON(tmp);
        if (status[0] == 5) {
            tmp = this._implObject.BoxInvoke("GetPictureExt", "");
            var extName = $.parseJSON(tmp);
            return extName[0];
        }
        return "";
    };
    /**
    * 开始录制视频文件
    * @method startRecorder
    * @param filepath {String} 如果没有指定文件路径名(filepath="")，插件将弹出保存文件对话框由用户自行输入。
    * @return {Boolean} true-调用成功
    */
    this.startRecorder = function (filepath) {
        var tmp = this._implObject.BoxInvoke("StartRecorder", $.toJSON([filepath]));
        var retVal = $.parseJSON(tmp);
        if (retVal[0].int64 == "0") {
            return true;
        }
        return false;
    };
    /**
    * 结束录制视频文件
    * @method stopRecorder
    */
    this.stopRecorder = function () {
        this._implObject.BoxInvoke("StopRecorder", "");
    };
    /**
    * 左键单击事件
    * @method onClick
    * @param fn {Function} 回调函数
    * @example
    * <pre><code>
    * InstanceOfRealPlayer.onClick(function(){
    * 		alert("控件窗口单击事件");
    * });
    * </code></pre>
    */
    this.onClick = function (fn) {
        this._onClick = fn;
    };
    /**
    * 左键双击事件
    * @method onDBClick
    * @param fn {Function} 回调函数
    * @example
    * <pre><code>InstanceOfRealPlayer.onDBClick( function(){ alert("控件窗口双击事件");} );</code></pre>
    */
    this.onDBClick = function (fn) {
        this._onDBClick = fn;
    };
    /**
    * 云台控制事件
    * @method onPtzControl
    * @param fn {Function} 回调函数，函数原型为ptzControl(x,y);
    * @example
    * <pre><code>InstanceOfRealPlayer.onPtzControl( function(x,y){ alert("去镜控制事件[" + x + "," + y + "]");} );</code></pre>
    */
    this.onPtzControl = function (fn) {
        this._onPtzControl = fn;
    };
    /**
    * 插件的事件分发
    * @method _defaultEventProc
    * @private
    * @param evName {String} 事件名称
    * @param jsonStr {JSONString} 事件参数
    */
    this._defaultEventProc = function (evName, jsonStr) {
        //var obj = $.parseJSON(jsonStr);
        if (evName == "onlclick") {
            if (this._onClick) {
                this._onClick();
            }
        }
        else if (evName == "onldblclk") {
            if (this._onDBClick) {
                this._onDBClick();
            }
        }
        else if (evName == "onptzctrl") {
            var obj = $.parseJSON(jsonStr);
            if (this._onPtzControl) {
                this._onPtzControl(obj[0], obj[1]);
            }
        }
        else if (evName == "onlbtnup") {
            if (this._onPtzControl) {
                //this._onPtzControl(0, 0);
            }
        }
    };
};
/**
 * 历史视频组件
 * @module JMegaeyes
 * @class RecordPlayer
 * @constructor
 */
JMegaeyes.RecordPlayer = function() {
	/**
	 * 平台参数、用户参数、登录返回的会话参数
	 * @property sysSetting
	 * @type Object 
	 * @private
	 */
	this.sysSetting = null;
	/**
	 * 保存插件对像
	 * @property _implObject
	 * @type Object 
	 * @private
	 */
	this._implObject = null;
	/**
	 * HTML容器ID
	 * @property _divPlaceHolder
	 * @type String 
	 * @private
	 */
	this._divPlaceHolder = "",
	/**
	 * 插件ID
	 * @property _pluginName
	 * @type String 
	 * @private
	 * @default _divPlaceHolder + "_ibox"
	 */
	this._pluginName = "";
	/**
	 * 当前视频源摄像头的统一标识
	 * @property _cameraNaming
	 * @type String
	 * @private
	 */
	this._cameraNaming = "";
	/**
	 * 是否获取录像文件清单标志
	 * @property _fileListNotify
	 * @type Boolean
	 * @private
	 * @default false
	 */
	this._fileListNotify = false;
	/**
	 * 单击事件回调
	 * @property _onClick
	 * @type Function
	 * @private
	 * @default null
	 */
	this._onClick = null;
	/**
	 * 双击事件回调
	 * @property _onDBClick
	 * @type Function
	 * @private
	 * @default null
	 */
	this._onDBClick = null;
	/**
	 * 录像文件清单通知回调
	 * @property _onFilesNodity
	 * @type Function
	 * @private
	 * @default null
	 */
	this._onFilesNodity = null;
	/**
	 * 创建播放控件
	 * @method createPlugin
	 * @param divPlaceHolder {String} HTML文档中占位元素的ID
	 * @param width {Integer} 控件的宽度
	 * @param height {Integer} 控件的高度
	 */
	this.createPlugin = function(divPlaceHolder, width, height){
		this._divPlaceHolder = divPlaceHolder;
		this._pluginName = divPlaceHolder + "_ibox";
		this._implObject = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginName, "{23AA8151-158A-4112-AA2E-716FF76061AB}", width, height);
		JMegaeyes.Utils.attchEvent(this._implObject, this);
		var cfg = "<Source><Event value=\"|onlclick|onldblclk|\"/></Source>";
		this._implObject.BoxInvoke("Init", $.toJSON([cfg]) );
	};
	/**
	 * 调整插件窗口大小
	 * @method resize
	 * @param width {Integer} 控件的宽度
	 * @param height {Integer} 控件的高度
	 */
	this.resize = function(width, height){
		this._implObject.width = width;
		this._implObject.height = height;
	}
	/**
	 * 设置平台参数:中心服务器地址，中心服务端口，接入服务器地址，接入服务器端口，用户帐号，用户会话标识，用户统一命名，用户特权等级
	 * @method setSysSetting
	 * @param args {Object} 对像结构为{ J2EE_IP:"", J2EE_PORT:8080, CENTER_IP:"", CENTER_PORT:6001, ACCOUNT:"", SESSION_ID:"", ACCOUNT_NAMING:"", ACCOUNT_LEVEL:0 }
	 */
	this.setSysSetting = function(args){
		this.sysSetting = args;
	};
	/**
	 * 查找录像文件
	 * @method find
	 * @param camera_naming {String} 摄像头标识
	 * @param title {String} 摄像头名称
	 * @param beginTime {String} 时间格式为"2012-10-22 08:25:00"
	 * @param endTime {String} 时间格式为"2012-10-22 08:25:00"
	 * @param cachePath {String} 录像文件保存到本机的路径名
	 * @param cbFn {Function} 录像文件清单通知回调函数，
	 *    - 原型：function(array); 其中 array = [ "文件开始时间", "文件结束时间", "文件开始时间", "文件结束时间", ...]
	 * @return {Boolean} true-调用成功
	 */
	this.find = function(camera_naming, title, beginTime, endTime, pos, cachePath, cbFn){
		var cfg_str = "";
		cfg_str += "<Source type=\"access\" playmode=\"stream\">";
		cfg_str += "<Cache path=\"" + cachePath + "\"/>";
		cfg_str += "<Camera naming=\"" + camera_naming + "\" name=\"" + title + "\" />";
		cfg_str += "<Limit begin=\"" + beginTime + "\" end=\"" + endTime + "\" />";
		cfg_str += "<Account sessionid=\"" + this.sysSetting["SESSION_ID"] + "\" />";
		cfg_str += "<Center ip=\"" + this.sysSetting["J2EE_IP"] + "\" port=\"" + this.sysSetting["J2EE_PORT"] + "\" />";
		cfg_str += "<Access ip=\"" + this.sysSetting["CENTER_IP"] + "\" port=\"" + this.sysSetting["CENTER_PORT"] + "\" />";
		cfg_str += "<Server type=\"" + pos + "\"/>";
		cfg_str += "<Event value=\"|onlclick|onldblclk|\" /></Source>";
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] > 1 )
		{
			this._implObject.BoxInvoke("Stop", $.toJSON([0]) );
		}
		this._fileListNotify = false;
		this._onFilesNodity = null;
		tmp = this._implObject.BoxInvoke("Init", $.toJSON([cfg_str]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 != "0")
		{
			return false;
		}
		tmp = this._implObject.BoxInvoke("Connect", "");
		retVal = $.parseJSON(tmp);
		if(retVal[0].int64 != "0")
		{
			return false;
		}
		this._cameraNaming = camera_naming;
		this._onFilesNodity = cbFn;
		this._implObject.BoxInvoke("Pause", "");
		return true;
	};
	/**
	 * 播放
	 * @method play
	 * @param time {String} 格式为"2012-10-22 08:25:00", 如time=""，则从查找范围内最早的时间点开始播放。
	 * @return {Boolean} true-调用成功
	 */
	this.play = function(time){
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] > 1 && status[0] != 7 )
		{
			tmp = this._implObject.BoxInvoke("Play", "");
			var retVal = $.parseJSON(tmp)
			if(retVal[0].int64 == "0" && time && time != "")
			{
				tmp = this._implObject.BoxInvoke("SetCurPos", $.toJSON([time]));
				retVal = $.parseJSON(tmp);
			}
			if(retVal[0].int64 == "0")
			{
				return true;
			}
		}
		return false;
	};
	/**
	 * 跳转到指定的时间
	 * @method setPosition
	 * @param time {String} 时间格式为"2012-10-22 08:25:00"
	 * @return {Boolean} true-调用成功
	 */
	this.setPosition = function(time){
		if(!time || time == "")
		{
			return false;
		}
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] > 1 && status[0] != 7 )
		{
			tmp = this._implObject.BoxInvoke("SetCurPos", $.toJSON([time]) );
			var retVal = $.parseJSON(tmp);
			if(retVal[0].int64 == "0")
			{
				return true;
			}
		}
		return false;
	};
	/**
	 * 当前播放进度
	 * @method getPosition
	 * @return {String} 当前播放进度，格式为"2012-10-22 08:25:00"
	 */
	this.getPosition = function(){
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] > 1 && status[0] != 7 )
		{
			tmp = this._implObject.BoxInvoke("GetCurPos", "");
			var pos = $.parseJSON(tmp);
			return pos[0];
		}
		return "";
	};
	/**
	 * 结束播放
	 * @method stop
	 */
	this.stop = function(){
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] > 1 )
		{
			this._implObject.BoxInvoke("Stop", $.toJSON([0]) );
		}
		this._fileListNotify = false;
		this._onFilesNodity = null;
		this._cameraNaming = "";
	};
	/**
	 * 控件运行状态
	 * 1-没有使用
	 * 2-正在查找视频源，正在从接入服务器获取视频源地址信息
	 * 3-正在查找视频文件，正在从视频服务器查找文件列表，该状态下最底层对象已经分配
	 * 4-正在播放
	 * 5-正在处理缓冲，正在下载当前需要播放的文件
	 * 6-暂停
	 * 7-播放错误
	 * @method getStatus
	 * @return {Integer} 
	 */
	this.getStatus = function(){
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		return status[0];
	};
	/**
	 * 全屏显示
	 * @method fullScreen
	 * @param flag {Boolean} true-全屏；false-取消全屏
	 */
	this.fullScreen = function(flag){
		if( flag )
			this._implObject.BoxInvoke("FullScreen", $.toJSON([true]) );
		else
			this._implObject.BoxInvoke("FullScreen", $.toJSON([false]) );
	}
	/**
	 * 抓拍照片
	 * @method snapshot
	 * @param filepath {String} 如果没有指定文件路径名(filepath="")，插件将弹出保存文件对话框由用户自行输入。
	 * @return {Boolean} true-调用成功
	 */
	this.snapshot = function(filepath){
		var tmp = this._implObject.BoxInvoke("Snapshot", $.toJSON([filepath]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
		{
			return true;
		}
		return false;
	};
	/**
	 * 抓拍照片2
	 * @method snapshot
	 * @param filepath {String} 如果没有指定文件路径名(filepath="")，插件将弹出保存文件对话框由用户自行输入。
	 * @return {String} 文件名-调用成功；空串-调用失败
	 */
	this.snapshotEx = function(filepath){
		var tmp = this._implObject.BoxInvoke("SnapshotEx", $.toJSON([filepath]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
		{
			return retVal[1];
		}
		return "";
	};
	/**
	 * 选择目录
	 * @method selectFilePath
	 * @param filepath {String} 对话框初始选择的目录
	 * @return {String} 路径名-调用成功；空串-调用失败
	 */
	this.selectFilePath = function(filepath){
		var tmp = this._implObject.BoxInvoke("SelectFilePath", $.toJSON([filepath]) );
		var retVal = $.parseJSON(tmp);
		return retVal[0];
	};
	/**
	 * 得到抓拍图片的图片格式，目前有jpg和bmp两种，该格式由视频解码器决定。
	 * 该函数必须在正在播放（包括处理缓冲和暂停）状态下使用。
	 * @method getPictureExt
	 * @return {String} 图片文件的扩展名
	 */
	this.getPictureExt = function(){
		var tmp = this._implObject.BoxInvoke("GetStatus", "");
		var status = $.parseJSON(tmp);
		if( status[0] >= 4 && status[0] != 7 )
		{
			tmp = this._implObject.BoxInvoke("GetPictureExt", "");
			var extName = $.parseJSON(tmp);
			return extName[0];
		}
		return "";
	};
	/**
	 * 获取当前播放速度
	 * @method getSpeed
	 * @return {Integer} 播放速度。0 - 表示正常速度、当前没有播放或者错误，播放速度的范围是[-4，4]，-4、-3、-2、-1、0、1、2、3、4，分别代表1/16、1/8、1/4、1/2、1、2、4、8、16倍速。
	 */
	this.getSpeed = function(){
		var tmp = this._implObject.BoxInvoke("GetSpeed", "");
		var speed = $.parseJSON(tmp);
		return speed[0];
	};
	/**
	 * 设置播放速度
	 * @method setSpeed
	 * @param nSpeed {Integer} 播放速度。0 - 表示正常速度、当前没有播放或者错误，播放速度的范围是[-4，4]，-4、-3、-2、-1、0、1、2、3、4，分别代表1/16、1/8、1/4、1/2、1、2、4、8、16倍速
	 * @return {Boolean} true-调用成功
	 */
	this.setSpeed = function(nSpeed){
		var tmp = this._implObject.BoxInvoke("GetSpeed", $.toJSON([nSpeed]));
		var ret = $.parseJSON(tmp);
		if(ret[0].int64 == "0"){
			return true;
		}
		return false;
	};
	/**
	 * 左键单击事件
	 * @method onClick
	 * @param fn {Function} 回调函数
	 * @example
	 * <pre><code>InstanceOfRecordPlayer.onClick( function(){ alert("控件窗口单击事件");} );</code></pre>
	 */
	this.onClick = function(fn){
		this._onClick = fn;
	};
	/**
	 * 左键双击事件
	 * @method onDBClick
	 * @param fn {Function} 回调函数
	 * @example
	 * <pre><code>InstanceOfRecordPlayer.onDBClick( function(){ alert("控件窗口双击事件");} );</code></pre>
	 */
	this.onDBClick = function(fn){
		this._onDBClick = fn;
	};
	/**
	 * 插件的事件分发函数
	 * @method _defaultEventProc
	 * @private
	 * @param evName {String} 事件名称
	 * @param jsonStr {JSONString} 事件参数
	 */
	this._defaultEventProc = function(evName, jsonStr){
		//var obj = $.parseJSON(jsonStr);
		if(evName == "onlclick")
		{
			if(this._onClick)
			{
				this._onClick();
			}
		}
		else if(evName == "onldblclk")
		{
			if(this._onDBClick)
			{
				this._onDBClick();
			}
		}
		else if(evName == "OnPlayerStatusChanged")
		{
			if( this._fileListNotify == false )
			{
				var tmp = this._implObject.BoxInvoke("GetStatus", "");
				var status = $.parseJSON(tmp);
				if(status[0] >= 4 && status[0] <= 6 )
				{
					tmp = this._implObject.BoxInvoke("GetFileCount", "");
					var count = $.parseJSON(tmp);
					fileList = new Array();
					for(var i=0; i<count[0]; i++)
					{
						tmp = this._implObject.BoxInvoke("GetFileTime", $.toJSON([i]) );
						var fileInfo = $.parseJSON(tmp);
						if(fileInfo[0].int64 == "0")
						{
							fileList.push(fileInfo[1]);
							fileList.push(fileInfo[2]);
						}
					}
					this._fileListNotify = true;
					if(this._onFilesNodity)
					{
						this._onFilesNodity(fileList);
					}
				}
				else if( status[0] == 7 ) //服务器错误，未找到录像文件
				{
					this._fileListNotify = true;
					if(this._onFilesNodity)
					{
						this._onFilesNodity([]);
					}
				}
			}
		}
	};
};
/**
 * 云台和镜头控制组件
 * @module JMegaeyes
 * @class PTZ
 * @constructor
 */
JMegaeyes.PTZ = function(){
	/**
	 * 平台参数、用户参数、登录返回的会话参数
	 * @property sysSetting
	 * @type Object 
	 * @private
	 */
	this.sysSetting = null;
	/**
	 * 保存插件对像
	 * @property _implObject
	 * @type Object 
	 * @private
	 */
	this._implObject = null;
	/**
	 * HTML容器ID
	 * @property _divPlaceHolder
	 * @type String 
	 * @private
	 */
	this._divPlaceHolder = "",
	/**
	 * 插件ID
	 * @property _pluginName
	 * @type String 
	 * @private
	 * @default _divPlaceHolder + "_ibox"
	 */
	this._pluginName = "";
	/**
	 * 当前视频源摄像头的统一标识
	 * @property _cameraNaming
	 * @type String
	 * @private
	 */
	this._cameraNaming = "";
	/**
	 * 是否需要预制点功能
	 * @property _cameraNaming
	 * @type Boolean
	 * @private
	 */
	this._usePreset = true;
	/**
	 * 预置点信息成功获取通知回调
	 * @property _onStatusUpdate
	 * @type Function
	 * @private
	 */
	this._onStatusUpdate = null;
	/**
	 * 预置点信息成功获取标制
	 * @property _statusAlive
	 * @type Boolean
	 * @private
	 */
	this._statusAlive = false;
	/**
	 * 数据缓存
	 * @property _dataCache
	 * @type Object
	 * @private
	 */
	this._dataCache = {};
	/**
	 * 创建云镜控制控件
	 * @method createPlugin
	 * @param divPlaceHolder {String} HTML文档中占位元素的ID
	 * @param usePreset {Boolean} 是否需要使用预置点功能。使用预置点功能时应注册状态回调函数this.onStatusUpdate
	 */
	this.createPlugin = function(divPlaceHolder, usePreset){
		this._divPlaceHolder = divPlaceHolder;
		this._usePreset  = usePreset;
		this._pluginName = divPlaceHolder + "_ibox";
		this._implObject = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginName, "{693C851C-2BDD-419C-A7FB-3F056F7D0721}", 0, 0);
		JMegaeyes.Utils.attchEvent(this._implObject, this);
	};
	/**
	 * 设置平台参数:中心服务器地址，中心服务端口，接入服务器地址，接入服务器端口，用户帐号，用户会话标识，用户统一命名，用户特权等级
	 * @method setSysSetting
	 * @param args {Object} 对像结构为{ J2EE_IP:"", J2EE_PORT:8080, CENTER_IP:"", CENTER_PORT:6001, ACCOUNT:"", SESSION_ID:"", ACCOUNT_NAMING:"", ACCOUNT_LEVEL:0 }
	 */
	this.setSysSetting = function(args){
		this.sysSetting = args;
		this._setCenterAddress();
	};
	/**
	 * 设置接入服务器地址</br>
	 *  -如WEB页中未使用JMegaeyes.Session时，可以使用该接口设置接入服务器的地址
	 * @method setCenterAddress
	 * @param ip {String} 接入服务器IP地址
	 * @param port {Integer} 接入服务器服务端口号，默认值为6001
	 */
	this.setCenterAddress = function(ip, port){
		this.sysSetting = {};
		this.sysSetting.CENTER_IP = ip;
		this.sysSetting.CENTER_PORT = port;
		this._setCenterAddress();
	};
	/**
	 * 设置被控制的摄像头
	 * @method bindCamera
	 * @param cameraNaming {String} 摄像头标识
	 * @return {Boolean} true-调用成功
	 */
	this.bindCamera = function(cameraNaming){
		if( this._cameraNaming == cameraNaming )
		{
			return true;
		}
		this._cameraNaming = cameraNaming;
		this._dataCache = {}; //清空缓存数据
		var tmp = this._implObject.BoxInvoke("SetNaming", $.toJSON([cameraNaming]) );
		var retVal = $.parseJSON(tmp)
		if(retVal[0].int64 != "0")
		{
			return false;
		}
		if(this._usePreset)
		{
			tmp = this._implObject.BoxInvoke( "QueryVersion", "" );
			retVal = $.parseJSON(tmp);
			if(retVal[0].int64 != "0" )
			{
				return false;
			}
		}
		return true;
	};
	/**
	 * 转动云台
	 * @method direct 
	 * @param x {Integer} 水平转动参数，范围[-255，255]。负数代表向左转动，正数代表向右转动，绝对值越大表示转动越快。当x的绝对值小于等于y的绝对值时，只进行垂直转动。
	 * @param y {Integer} 垂直转动参数，范围[-255，255]。负数代表向上转动，正数代表向下转动，绝对值越大表示转动越快。当y的绝对值小于x的绝对值时，只进行水平转动。
	 * @return {Boolean} true-调用成功
	 */
	this.direct = function(x, y){
		var tmp = this._implObject.BoxInvoke( "Direct", $.toJSON([x, y]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 停止云台转动
	 * @method directStop 
	 * @return {Boolean} true-调用成功
	 */
	this.directStop = function(){
		var tmp = this._implObject.BoxInvoke( "DirectStop", "" );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制光圈开/关
	 * @method setAperture
	 * @param op {Integer} 操作码。0：停止；1：缩小；2：放大。
	 * @return {Boolean} true-调用成功
	 */
	this.setAperture = function(op){
		var tmp = this._implObject.BoxInvoke( "Aperture", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制是否使用自动光圈功能
	 * @method setAutoAperture
	 * @param op {Integer} 操作码。1：关闭自动光圈功能；2：打开自动光圈功能。
	 * @return {Boolean} true-调用成功
	 */
	this.setAutoAperture = function(op){
		var tmp = this._implObject.BoxInvoke( "AutoAperture", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制镜头变倍
	 * @method setZoom
	 * @param op {Integer} 操作码。0：停止；1：缩小；2：放大。
	 * @return {Boolean} true-调用成功
	 */
	this.setZoom = function(op){
		var tmp = this._implObject.BoxInvoke( "Zoom", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制镜头焦距
	 * @method setFocus
	 * @param op {Integer} 操作码。0：停止；1：焦距拉近；2：焦距拉远。
	 * @return {Boolean} true-调用成功
	 */
	this.setFocus = function(op){
		var tmp = this._implObject.BoxInvoke( "Focus", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制是否使用自动对焦功能
	 * @method setAutoFocus
	 * @param op {Integer} 操作码。1：关闭；2：打开。
	 * @return {Boolean} true-调用成功
	 */
	this.setAutoFocus = function(op){
		var tmp = this._implObject.BoxInvoke( "AutoFocus", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制辅助开关1
	 * @method setAux1
	 * @param op {Integer} 操作码。1：关闭；2：打开。
	 * @return {Boolean} true-调用成功
	 */
	this.setAux1 = function(op){
		var tmp = this._implObject.BoxInvoke( "Aux1", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制辅助开关2
	 * @method setAux2
	 * @param op {Integer} 操作码。1：关闭；2：打开。
	 * @return {Boolean} true-调用成功
	 */
	this.setAux2 = function(op){
		var tmp = this._implObject.BoxInvoke( "Aux2", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	 
	/**
	 * 获取灯光控制状态
	 * @method getLampStatus
	 * @return {Boolean} true-灯光开；false-灯光闭
	 */
	this.getLampStatus = function(){
		if( !this._usePreset )
		{
			alert("请在createPlugin时指定使用预置点功能");
			return false;
		}
		if( !this._statusAlive )
		{
			alert("请成onStatusUpdate事件通知后调用");
			return false;
		}
		if( typeof(this._dataCache.lamp) == "undefined" )
		{
			this._getPresetInfo();
		}
		return this._dataCache.lamp;
	};
	/**
	 * 控制灯光
	 * @method setLampStatus
	 * @param op {Integer} 操作码。1：关闭；2：打开。	 
	 * @return {Boolean} true-调用成功
	 */
	this.setLampStatus = function(op){
		var tmp = this._implObject.BoxInvoke( "Light", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 获取雨刷控制状态
	 * @method getWiperStatus
	 * @return {Boolean} true-雨刷开；false-雨刷闭
	 */
	this.getWiperStatus = function(){
		if( !this._usePreset )
		{
			alert("请在createPlugin时指定使用预置点功能");
			return false;
		}
		if( !this._statusAlive )
		{
			alert("请成onStatusUpdate事件通知后调用");
			return false;
		}
		if( typeof(this._dataCache.wiper) == "undefined" )
		{
			this._getPresetInfo();
		}
		return this._dataCache.wiper;
	};
	/**
	 * 控制雨刷
	 * @method setWiperStatus
	 * @param op {Integer} 操作码。1：关闭；2：打开。	 
	 * @return {Boolean} true-调用成功
	 */
	this.setWiperStatus = function(op){
		var tmp = this._implObject.BoxInvoke( "Wiper", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制自动归位功能开关
	 * @method setAutoGoHome
	 * @param op {Integer} 操作码。1：关闭；2：打开。	 
	 * @return {Boolean} true-调用成功
	 */
	this.setAutoGoHome = function(op){
		var tmp = this._implObject.BoxInvoke( "AutoGoHome", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 控制自动扫描功能开关
	 * @method setAutoScan
	 * @param op {Integer} 操作码。1：关闭；2：打开。	 
	 * @return {Boolean} true-调用成功
	 */
	this.setAutoScan = function(op){
		var tmp = this._implObject.BoxInvoke( "AutoScan", $.toJSON([op]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 获取预置点配置列表
	 * @method getPersetItems
	 * @return {Array} 预置点序号Object[i].index；预置点标识Object[i].id；是否设置该预置点Object[i].set,true-设置,false-未设置;预置位名称Object[i].name
	 * @example
	 * <pre><code>
	 *    var items = InstanceofPTZ.getPersetItems();
	 *    for(var i=0; i&lt;items.length; i++){
	 *    	if(items[i].set){
	 *	  		alert("这行代码InstanceofPTZ.gotoPreset(items[i].id);可以转到" + items[i].name);
	 *	  	}
	 *    }
	 * </code></pre>
	 */
	this.getPersetItems = function(){
		if( !this._usePreset )
		{
			alert("请在createPlugin时指定使用预置点功能");
			return [];
		}
		if( !this._statusAlive )
		{
			alert("请在onStatusUpdate事件通知后调用");
			return [];
		}
		if( typeof(this._dataCache.nodes) == "undefined" )
		{
			this._getPresetInfo();
		}
		return this._dataCache.nodes;
	};
	/**
	 * 转到预置点
	 * @method gotoPerset
	 * @param persetID {Integer} 预置点标识
	 * @param speed {Interget} 转动速度，取值范围0-128
	 * @return {Boolean} true-调用成功
	 */
	this.gotoPreset = function(persetID, speed){
		var tmp = this._implObject.BoxInvoke( "GotoPreset", $.toJSON([persetID, speed]) );
		var retVal = $.parseJSON(tmp)
		if( retVal[0].int64 != "0" )
		{
			return false;
		}
		return true;
	};
	/**
	 * 保存预置点
	 * @method savePreset
	 * @param persetID {Integer} 预置点标识
	 * @param name {String} 预置点名称，最长8个汉字
	 * @return {Boolean} true-调用成功
	 */
	this.savePreset = function(persetID, name){
		if( !this._usePreset )
		{
			alert("请在createPlugin时指定使用预置点功能");
			return false;
		}
		if( !this._statusAlive )
		{
			alert("请成onStatusUpdate事件通知后调用");
			return false;
		}
		if( typeof(this._dataCache.nodes) == "undefined" )
		{
			this._getPresetInfo();
		}
		var tmp = this._implObject.BoxInvoke( "SetPreset", $.toJSON([persetID, name]) );
		var retVal = $.parseJSON(tmp)
		if( retVal[0].int64 != "0" )
		{
			return false;
		}
		for(var i=0; i < this._dataCache.nodes.length; i++)
		{
			if(this._dataCache.nodes[i].id == persetID)
			{
				this._dataCache.nodes[i].name = name;
				this._dataCache.nodes[i].set = true;
				break;
			}
		}
		return true;
	};
	/**
	 * 清徐预置点
	 * @method removePreset
	 * @param persetID {Integer} 预置点标识
	 * @return {Boolean} true-调用成功
	 */
	this.removePreset = function(persetID){
		if( !this._usePreset )
		{
			alert("请在createPlugin时指定使用预置点功能");
			return false;
		}
		if( !this._statusAlive )
		{
			alert("请成onStatusUpdate事件通知后调用");
			return false;
		}
		if( typeof(this._dataCache.nodes) == "undefined" )
		{
			this._getPresetInfo();
		}
		for(var i=0; i < this._dataCache.nodes.length; i++)
		{
			if(this._dataCache.nodes[i].id == persetID)
			{
				var tmp = this._implObject.BoxInvoke( "RemovePreset", $.toJSON([persetID]) );
				var retVal = $.parseJSON(tmp)
				if( retVal[0].int64 != "0" )
				{
					return false;
				}
				this._dataCache.nodes[i].name = "";
				this._dataCache.nodes[i].set = false;
				return true;
			}
		}
		return false;
	};
	/**
	 * 云镜状态更新通知<br>
	 * 	- 灯光、雨刷状态；预置点配置信息
	 * @method onStatusUpdate
	 * @param fn {Function} 回调函数
	 */
	this.onStatusUpdate = function(fn){
		this._onStatusUpdate = fn;
	};
	/**
	 * 设置插件使用的接入服务器地址
	 * @method _setCenterAddress
	 * @private
	 */
	this._setCenterAddress = function(){
		var args = [this.sysSetting.CENTER_IP, this.sysSetting.CENTER_PORT];
		this._implObject.BoxInvoke("SetAccess", $.toJSON(args) );
	}
	/**
	 * 从控件中读取灯光、雨刷状态及预置点配置信息到缓存
	 * @method _getPresetInfo
	 * @private
	 */
	this._getPresetInfo = function(){
		var tmp = this._implObject.BoxInvoke("GetPresetCount", "" );
		var count = $.parseJSON(tmp);
		this._dataCache.count = count[0];
		this._dataCache.nodes = [];
		this._dataCache.lamp = false;
		this._dataCache.wiper = false;
		for(var i = 0; i < count[0]; i++)
		{
			tmp = this._implObject.BoxInvoke( "GetPresetID", $.toJSON([i]) );
			var presetID = $.parseJSON(tmp);
			if(presetID[0] > 0)
			{
				tmp = this._implObject.BoxInvoke( "GetPresetStatus", $.toJSON([presetID[0]]) );
				var status = $.parseJSON(tmp);
				if(status[0] == 1)
				{
					this._dataCache.nodes.push( {index:i, id:presetID[0], set:false, name:""} );
				}
				else if(status[0] == 2)
				{
					tmp = this._implObject.BoxInvoke( "GetPresetName", $.toJSON([presetID[0]]) );
					var title = $.parseJSON(tmp);
					if(title[0] == "")
					{
						title[0] = "预置点"+ presetID;
					}
					this._dataCache.nodes.push( {index:i, id:presetID[0], set:true, name:title[0]} );
				}
			}
		}
	
		tmp = this._implObject.BoxInvoke( "GetStatus", $.toJSON([5]) ); //灯光
		var status = $.parseJSON(tmp);
		if( status[0] == 2 ) 
		{
			this._dataCache.lamp = true;
		}
		tmp = this._implObject.BoxInvoke( "GetStatus", $.toJSON([6]) ); //雨刷
		status = $.parseJSON(tmp);
		if( status[0] == 2 ) 
		{
			this._dataCache.wiper = true;
		}
	};
	/**
	 * 插件的事件分发函数
	 * @method _defaultEventProc
	 * @private
	 * @param evName {String} 事件名称
	 * @param jsonStr {JSONString} 事件参数
	 */
	this._defaultEventProc = function(evName, jsonStr){
		if( evName == "OnPtzStatusReturn" || evName =="OnAccessReturn" )
		{
			var args = $.parseJSON(jsonStr);
			if( args[1].int64 != "0" )
			{
				return;
			}
			if(args[0] == 0) //查询预置点信息
			{
				this._statusAlive = true;
				if(this._onStatusUpdate)
				{
					this._onStatusUpdate();
				}
			}
		}
	};

};

/**
 * 语音通信组件
 * @module JMegaeyes
 * @class Audio
 * @constructor
 */
JMegaeyes.Audio = function(){
	/**
	 * 平台参数、用户参数、登录返回的会话参数
	 * @property sysSetting
	 * @type Object 
	 * @private
	 */
	this.sysSetting = {};
	/**
	 * 保存插件对像
	 * @property _implObject
	 * @type Object 
	 * @private
	 */
	/**
	 * 状态更新通知回调
	 * @property _onStatusUpdate
	 * @type Function
	 * @private
	 */
	this._onStatusUpdate = null;
	 
	this._implObject = null;
	/**
	 * HTML容器ID
	 * @property _divPlaceHolder
	 * @type String 
	 * @private
	 */
	this._divPlaceHolder = "",
	/**
	 * 插件对像ID
	 * @property _pluginName
	 * @type String 
	 * @private
	 * @default _divPlaceHolder + "_ibox"
	 */
	this._pluginName = "";
	/**
	 * 创建AudioCall控件
	 * @method createPlugin
	 * @param divPlaceHolder {String} HTML文档中的占位元素ID
	 */
	this.createPlugin = function(divPlaceHolder){
		this._divPlaceHolder = divPlaceHolder;
		this._pluginName = divPlaceHolder + "_ibox";
		this._implObject = JMegaeyes.Utils.createActiveX(divPlaceHolder, this._pluginName, "{E62B79E5-FDCA-4C6B-8A42-CFAB82ED4BCB}", 0,0);
		JMegaeyes.Utils.attchEvent(this._implObject, this);
	};
	/**
	 * 设置平台参数:中心服务器地址，中心服务端口，接入服务器地址，接入服务器端口，用户帐号，用户会话标识，用户统一命名，用户特权等级
	 * @method setSysSetting
	 * @param args {Object} 对像结构为{ J2EE_IP:"", J2EE_PORT:8080, CENTER_IP:"", CENTER_PORT:6001, ACCOUNT:"", SESSION_ID:"", ACCOUNT_NAMING:"", ACCOUNT_LEVEL:0 }
	 */
	this.setSysSetting = function(args){
		this.sysSetting = args;
	};
	/**
	 * 设置接入服务器地址和用户标识
	 * @method setCenterAndUser
	 * @param ip {String} 接入服务器地址
	 * @param port {Integer} 接入服务器服务端口号，默认值为6001
	 * @param session_id {String} 用户登录时获取的会话标识
	 * @param account_naming {String} 用户帐号标识
	 */
	this.setCenterAndUser = function(ip, port, session_id, account_naming){
		this.sysSetting = {};
		this.sysSetting.CENTER_IP = ip;
		this.sysSetting.CENTER_PORT = port;
		this.sysSetting.SESSION_ID = session_id;
		this.sysSetting.ACCOUNT_NAMING = account_naming;
	};
	/**
	 * 开始语音呼叫
	 * @method start
	 * @param cameras {Array} 摄像头标识数组 ["CAM1", "CAM2", ...]
	 * @param natFlags {Array} 摄像头所在设备是否处理防火墙后，数组长度与cameras一致 [true, false, ...]
	 * @return {Boolean} true：调用成功
	 */
	this.start = function(cameras, natFlags){
		var sCfg = "<Config>";
		for(var i=0; i < cameras.length; i++)
		{
			sCfg += "<Dest naming=\"" + cameras[i] +"\" IsNat=\"";
			if(natFlags[i]){
				sCfg += "Y";
			}
			else{
				sCfg += "N";
			}
			sCfg += "\" />";
		}
		sCfg += "<Account sessionid=\"" + this.sysSetting["SESSION_ID"] +"\"/>";
		sCfg += "<Access ip=\"" + this.sysSetting["CENTER_IP"] + "\" port=\"" + this.sysSetting["CENTER_PORT"] + "\"/>";
		sCfg += "<Src UserNaming=\"" + this.sysSetting["ACCOUNT_NAMING"] + "\"/>";
		sCfg += "</Config>";
		var tmp = this._implObject.BoxInvoke( "Open", $.toJSON([sCfg]) );
		var retVal = $.parseJSON(tmp);
		if(retVal[0].int64 == "0")
			return true;
		return false;
	};
	/**
	 * 开始语单呼叫
	 * @method stop
	 */
	this.stop = function(){
		this._implObject.BoxInvoke( "Close", "" );
	};
	/**
	 * 状态更新事件
	 * @method onStatusUpdate
	 * @param fn {Function} 回调函数
	 * @example
	 * <pre><code>
	 * InstanceOfAudio.onStatusUpdate(function(state){
	 * 	if(state == 0) {alert("空闲");}
	 * 	if(state == 1) {alert("开始呼叫");}
	 * 	if(state == 2) {alert("正在请求呼叫的视频服务器");}
	 * 	if(state == 3) {alert("正在连接视频服务器");}
	 * 	if(state == 4) {alert("正在向视频服务器发送呼叫请求")}
	 * 	if(state == 5) {alert("通话中");}
	 * 	if(state == 6) {alert("出现错误");}
	 * });
	 * </code></pre>
	 */
	this.onStatusUpdate = function(fn){
		this._onStatusUpdate = fn;
	};
	/**
	 * 插件的事件分发函数
	 * @method _defaultEventProc
	 * @private
	 * @param evName {String} 事件名称
	 * @param jsonStr {JSONString} 事件参数
	 */
	this._defaultEventProc = function(evName, jsonStr){
		if( evName == "OnStatusChanged" )
		{
			var args = $.parseJSON(jsonStr);
			if(this._onStatusUpdate)
			{
				this._onStatusUpdate(args[0]);
			}
		}
	};
};
/**
 * @module JMegaeyes
 * @class CameraConfig
 * @constructor
 * @param session {Object} JMegaeyes.Session实例
 */
JMegaeyes.CameraConfig = function(session){
	/**
	 * 会话
	 * @property _session
	 * @type Object
	 * @private
	 */
	this._session = session;
	/**
	 * 设置时间&字幕
	 * @method setOSD
	 * @param sCameraNaming {String} 摄像头标识
	 * @param cfg.bOSDing {Boolean} 是否显示时间
	 * @param cfg.nOSDPlace {Integer} 时间在图像中的位置 [1-8] 左上、中上、右上、左中、右中、左下、中下、右下
	 * @param cfg.nWordPlace {Integer} 字幕在图像中的位置 [1-8] 左上、中上、右上、左中、右中、左下、中下、右下
	 * @param cfg.sWord {String} 字幕文本
	 * @param done {Function} 执行结果，原型function(bSuccessed)。
	 */
	this.setOSD = function(sCameraNaming, cfg, done){
		var osding = "0";
		if(cfg.bOSDing){ osding = "1"; }
		var s = "<Message>";
		s += "<Naming>" + sCameraNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<Para>6</Para>"
		s += "<Record bOSDing=\"" + osding + "\" nOSDPlace=\"" + cfg.nOSDPlace + "\" nWordPlace=\"" + cfg.nWordPlace + "\" Word=\"" + cfg.sWord + "\"/>";
		s += "</Message>";
		this._session.sendAccessMsg(5032, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 读取时间&字幕
	 * @method getOSD
	 * @param sCameraNaming {String} 摄像头标识
	 * @param done {Function} 执行结果，原型function(bSuccess, cfg)。@see setOSD
	 */
	this.getOSD = function(sCameraNaming, done){
		var s = "<Message>";
		s += "<Naming>" + sCameraNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<Para>6</Para>"
		s += "</Message>";
		this._session.sendAccessMsg(5034, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("Record")[0];
					var cfg = {};
					cfg.bOSDing = node.getAttribute("bOSDing") == "0" ? false:true;
					cfg.nOSDPlace = parseInt(node.getAttribute("nOSDPlace"));
					cfg.sWord = node.getAttribute("Word");
					cfg.nWordPlace = parseInt(node.getAttribute("nWordPlace"));
					done(true, cfg);
				}
				catch(err){
					done(false, "解析响应消息错误");
				}
			}
			else{
				done(false, xml);
			}
		});
	};
	/**
	 * 设置视频参数
	 * @method setImageSetting
	 * @param sCameraNaming {String} 摄像头标识
	 * @param cfg.sStreamType {String} 视频流类型，取值为MainStream或SubStream1或SubStream2或SubStream3， 缺省值为MainStream
	 * @param cfg.nFrameRate {Integer} 帧率，范围：0-30
	 * @param cfg.nKeyFrameIntervals {Integer} 关键帧间隔，范围：3-100
	 * @param cfg.nLevel {Integer} 视频质量，范围：0-3（数值越小，质量越好）
	 * @param cfg.nMaxBPS {Integer} 最大码率，范围：64-4096，单位K bits/sec
	 * @param cfg.nBrightness {Integer} 亮度，范围：0-255
	 * @param cfg.nContrast {Integer} 对比度，范围：0-255
	 * @param cfg.nSaturation {Integer} 饱和度，范围：0-255
	 * @param cfg.nHue {Integer} 色调，范围：0-255
	 * @param cfg.sResolution {String} 分辨率, @see getImageSetting, 指定设备支持的分辨率保存在数据cfg.aResolutionSupport {array}中
	 * @param done {Function} 执行结果，原型function(bSuccessed)。
	 */
	this.setImageSetting = function(sCameraNaming, cfg, done){
		if(typeof(cfg.sStreamType) == "undefined"){
			cfg.sStreamType = "MainStream";
		}
		var s = "<Message Stream=\""+ cfg.sStreamType +"\">";
		s += "<Naming>"+ sCameraNaming + "</Naming>";
		s += "<Para>1</Para>";
		s += "<Source ID=\"" + this._session.getSessionID() + "\" Type = \"1\"/>";
		s += "<Destination ID=\"" + sCameraNaming.substr(0, sCameraNaming.indexOf(":")) + "\" Type =\"5\"/>";
		s += "<FrameStruct FrameRate=\"" + cfg.nFrameRate + "\" KeyFrameIntervals=\"" + cfg.nKeyFrameIntervals + "\"/>"
		s += "<Quant Level=\"" + cfg.nLevel + "\"/>";
		s += "<BaudRate MaxBPS=\"" + cfg.nMaxBPS + "\"/>";
		s += "<VideoPara Brightness=\"" + cfg.nBrightness + "\" Contrast=\"" + cfg.nContrast + "\" Saturation=\"" + cfg.nSaturation + "\" Hue=\"" + cfg.nHue + "\" />";
		s += "<Resolution Current=\"" + cfg.sResolution + "\" Support=\"\" />";
		s += "</Message>";
		this._session.sendAccessMsg(5074, s, function(succ, xml){
			done(succ);
		});

	}
	/**
	 * 读取视频参数
	 * @method getImageSetting
	 * @param sCameraNaming {String} 摄像头标识
	 * @param sStreamType {String} 视频流类型，取值为MainStream或SubStream1或SubStream2或SubStream3， 缺省值为MainStream
	 * @param done {Function} 执行结果，原型function(bSuccess, cfg)。@see setImageSetting
	 */
	this.getImageSetting = function(sCameraNaming, sStreamType, done){
		var s = "<Message Stream=\"";
		if(typeof(sStreamType) == "undefined" || sStreamType == ""){
			s += "MainStream";
		}
		else{
			s += sStreamType;
		}
		s += "\"><Naming>" + sCameraNaming + "</Naming>";
		s += "<Para>1</Para>";
		s += "<Source ID=\"" + this._session.getSessionID() + "\" Type = \"1\"/>";
		s += "<Destination ID=\"" + sCameraNaming.substr(0, sCameraNaming.indexOf(":")) + "\" Type =\"5\"/>";
		s += "</Message>";
		alert(s);
		this._session.sendAccessMsg(5076, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("FrameStruct")[0];
					var cfg = {};
					cfg.nFrameRate = parseInt(node.getAttribute("FrameRate"));
					cfg.nKeyFrameIntervals = parseInt(node.getAttribute("KeyFrameIntervals"));
					node = dom.getElementsByTagName("Quant")[0];
					cfg.nLevel = parseInt(node.getAttribute("Level"));
					node = dom.getElementsByTagName("BaudRate")[0];
					cfg.nMaxBPS = parseInt(node.getAttribute("MaxBPS"));
					node = dom.getElementsByTagName("Resolution")[0];
					cfg.sResolution =  node.getAttribute("Current");
					cfg.aResolutionSupport = node.getAttribute("Support").split("|");
					node = dom.getElementsByTagName("VideoPara")[0];
					cfg.nBrightness = parseInt(node.getAttribute("Brightness"));
					cfg.nContrast = parseInt(node.getAttribute("Contrast"));
					cfg.nSaturation = parseInt(node.getAttribute("Saturation"));
					cfg.nHue = parseInt(node.getAttribute("Hue"));
					done(true, cfg);
				}
				catch(err){
					done(false, "解析响应消息错误");
				}
			}
			else{
				done(false, xml);
			}
		});
	}
};

/**
 * @module JMegaeyes
 * @class DisplayConfig
 * @constructor
 * @param session {Object} JMegaeyes.Session实例
 */
JMegaeyes.DisplayConfig = function(session){
	/**
	 * 会话
	 * @property _session
	 * @type Object
	 * @private
	 */
	this._session = session;
	/**
	 * 设置电视墙的分屏数
	 * @method setScreenSplit
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param nScreenCount {Integer} 将要全屏显示的分屏数量，取值可为1、4、6、7、8、9、10、13、16，最大值由电视墙设备性能决定。
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.setScreenSplit = function(sDispalyNaming, nScreenCount, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<SetSplit DisplayID=\"" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "\" ScreenNo=\"" + nScreenCount + "\"/>";
		s += "</Message>";
		this._session.sendAccessMsg(5018, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("SetSplitRet")[0];
					var nSuccess = parseInt(node.getAttribute("Success"));
					if(nSuccess == 1 ){
						done(true);
					}
					else{
						done(false);
					}
				}
				catch(err){
					done(false);
				}
			}
			else{
				done(false);
			}
		});
	}
	/**
	 * 设置电视墙的全屏显示
	 * @method setScreenSplit
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param nScreenNo {Integer} 将要全屏显示的分屏号，从0开始，必须小于当前设备的分屏数@see setScreenSplit
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.setFullScreen = function(sDispalyNaming, nScreenNo, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<FullScreen DisplayID=\"" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "\" ScreenNo=\"" + nScreenNo + "\"/>";
		s += "</Message>";
		this._session.sendAccessMsg(5018, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("FullScreenRet")[0];
					var nSuccess = parseInt(node.getAttribute("Success"));
					if(nSuccess == 1 ){
						done(true);
					}
					else{
						done(false);
					}
				}
				catch(err){
					done(false);
				}
			}
			else{
				done(false);
			}
		});
	}
	/**
	 * 取消电视墙的全屏显示
	 * @method cancelFullScreen
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.cancelFullScreen = function(sDispalyNaming, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<FullScreen DisplayID=\"" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "\" ScreenNo=\"-1\"/>";
		s += "</Message>";
		this._session.sendAccessMsg(5018, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("FullScreenRet")[0];
					var nSuccess = parseInt(node.getAttribute("Success"));
					if(nSuccess == 1 ){
						done(true);
					}
					else{
						done(false);
					}
				}
				catch(err){
					done(false);
				}
			}
			else{
				done(false);
			}
		});
	}
	/**
	 * 查询电视墙的分屏数及运行状态
	 * @method getScreenInfo
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param done {Function} 执行结果，原型function(bSuccess, cfg) 
	 * @example 
	 * <pre><code>
	 * var displayCfg = new JMegaeyes.DisplayConfig(app.Session);
	 * displayCfg.getScreenInfo(alarmoutNaming, function(bSuccess, cfg){
	 *   if(bSuccess){
	 *     var info = "";
	 *     info += "是否全屏：" + cfg.bFullScreen + "\n";
	 *     if(cfg.bFullScreen){info += "第" + cfg.nFullScreenNo + "分屏处于全屏播放状态\n";
	 *     info += "分屏数：" + cfg.nScreenCount + "\n";
	 *     for(var i=0; i<cfg.jobs.length; i++){
	 *       info += "第" + i + "分屏状态为：" + cfg.jobs[i].nStatus + " (注：0=空闲；1=实时；2=历史；3=轮询)\n";
	 *       if(cfg.jobs[i].nStatus>0){info += "第" + i + "分屏正投放" + cfg.jobs[i].sCameraNaming + "的视频\n";}
	 *     }
	 *     info += "CPU使用率：" + cfg.nUseCPU + "%\n";
	 *     info += "内存使用量：" + cfg.sUseMem + "\n";
	 *     info += "总内存数量：" + cfg.sTotalMem + "\n";	 
	 *     alert(info);
	 *   }
	 * });
	 * </code></pre>
	 */
	this.getScreenInfo = function(sDispalyNaming, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<QueryScreen DisplayID=\"" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "\" ScreenNo=\"-1\"/>";
		s += "<System/>";
		s += "</Message>";
		this._session.sendAccessMsg(5018, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("QueryScreenRet")[0];
					var cfg = {};
					
					var nFullScreenNo = parseInt(node.getAttribute("FullScreenNo"));
					cfg.bFullScreen = (nFullScreenNo == -1) ? false : true;
					cfg.nScreenCount = parseInt(node.getAttribute("SplitCount"));
					if(!cfg.bFullScreen){
						cfg.nFullScreenNo = nFullScreenNo;
					}
					var jobs = node.getElementsByTagName("Job");
					cfg.jobs = new array();
					for(var i=0; i<jobs.length; i++){
						var tmp = {};
						tmp.nStatus = parseInt(jobs[i].getAttribute("Status"));
						tmp.sCameraNaming = jobs[i].getAttribute("Naming");
						cfg.jobs.push(tmp);
					}
					var sysInfo = dom.getElementsByTagName("SystemRet")[0];
					cfg.nUseCPU = parseInt(sysInfo.getAttribute("CPUUsage"));
					cfg.sUseMem = sysInfo.getAttribute("MemUsage");
					cfg.sTotalMem = sysInfo.getAttribute("TotalMem");
					done(true, cfg);
					
				}
				catch(err){
					done(false, {});
				}
			}
			else{
				done(false, {});
			}
		});
	}
	/**
	 * 向电视墙投放实时视频
	 * @method playRealtimeVideo
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param sCameraNaming {String} 摄像头标识
	 * @param nScreenNo {Integer} 分屏序号，从0开始，必须小于当前设备的分屏数@see setScreenSplit
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.playRealtimeVideo = function(sDispalyNaming, sCameraNaming, nScreenNo, done ){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<DisplayID>" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "</DisplayID>";
		s += "<ScreenNo>" + nScreenNo + "</ScreenNo>";
		s += "<CameraID Naming=\"" + sCameraNaming + "\">" + sCameraNaming.substr(0, sCameraNaming.indexOf(":")) + "</CameraID>";
		s += "</Message>";
		this._session.sendAccessMsg(5100, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 向电视墙投放历史视频
	 * @method playHistoryVideo
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param sCameraNaming {String} 摄像头标识
	 * @param nScreenNo {Integer} 分屏序号，从0开始，必须小于当前设备的分屏数@see setScreenSplit	 
	 * @param sBeginTime {String} 起始时间，格式2013-02-26 18:30:00
	 * @param sEndTime {String} 截止时间，格式2013-02-26 18:50:00
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.playHistoryVideo = function(sDispalyNaming, sCameraNaming, nScreenNo, sBeginTime, sEndTime, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<DisplayID>" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "</DisplayID>";
		s += "<ScreenNo>" + nScreenNo + "</ScreenNo>";
		s += "<CameraID Naming=\"" + sCameraNaming + "\">" + sCameraNaming.substr(0, sCameraNaming.indexOf(":")) + "</CameraID>";
		s += "<BeginDT>" + sBeginTime + "</BeginDT>";
		s += "<EndDT>" + sEndTime + "</EndDT>";
		s += "</Message>";
		this._session.sendAccessMsg(5104, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 向电视墙投放视频轮询队列
	 * @method playSlides
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param aCameraNaming {Array of String} 摄像头标识数组
	 * @param aStopTime {Array of Integer} 摄像头视频播放间隔时间，长度与aCameraNaming应保持一致
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.playSlides = function(sDispalyNaming, aCameraNaming, aStopTime, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<DisplayID>" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "</DisplayID>";
		s += "<ScreenNo>" + nScreenNo + "</ScreenNo>";
		for(var i=0; i<aCameraNaming.length; i++){
			s += "<CameraID Naming=\"" + aCameraNaming[i] +"\" ";
			s += "Delay=\"" + aStopTime[i] + "\">" + aCameraNaming[i].substr(aCameraNaming[i].indexOf(":")) + "</CameraID>";
		}
		s += "</Message>";
		this._session.sendAccessMsg(5102, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 关闭电视墙上正在投放的视频
	 * @method stopVideo
	 * @param sDispalyNaming {String} 电视墙设备标识
	 * @param nScreenNo {Integer} 分屏序号，从0开始，必须小于当前设备的分屏数@see setScreenSplit
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.stopVideo = function(sDispalyNaming, nScreenNo, done){
		var s = "<Message ClientID=\"" + this._session.getSessionID() + "\">";
		s += "<Naming>" + sDispalyNaming + "</Naming>";
		s += "<UsrNaming>" + this._session.getUserNaming() + "</UsrNaming>";
		s += "<DisplayID>" + sDispalyNaming.substr(0, sDispalyNaming.indexOf(":")) + "</DisplayID>";
		s += "<ScreenNo>" + nScreenNo + "</ScreenNo>";
		s += "</Message>";
		this._session.sendAccessMsg(5106, s, function(succ, xml){
			done(succ);
		});
	};
};

/**
 * @module JMegaeyes
 * @class AlarmoutConfig
 * @constructor
 * @param session {Object} JMegaeyes.Session实例
 */
JMegaeyes.AlarmoutConfig = function(session){
	/**
	 * 会话
	 * @property _session
	 * @type Object
	 * @private
	 */
	this._session = session;
	/**
	 * 打开报警输出装置
	 * @method open
	 * @param sAlarmoutNaming {String} 报警输出装置标识
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.open = function(sAlarmoutNaming, done){
		var s = "<Message>";
		s += "<Naming>" + sAlarmoutNaming + "</Naming>";
		s += "<DeviceID>" + sAlarmoutNaming.substr(0, sAlarmoutNaming.indexOf(":")) + "</DeviceID>";
		s += "<Op>1</Op>";
		s += "</Message>";
		this._session.sendAccessMsg(5064, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 关闭报警输出装置
	 * @method close
	 * @param sAlarmoutNaming {String} 报警输出装置标识
	 * @param done {Function} 执行结果，原型function(bSuccess) 
	 */
	this.close = function(sAlarmoutNaming, done){
		var s = "<Message>";
		s += "<Naming>" + sAlarmoutNaming + "</Naming>";
		s += "<DeviceID>" + sAlarmoutNaming.substr(0, sAlarmoutNaming.indexOf(":")) + "</DeviceID>";
		s += "<Op>0</Op>";
		s += "</Message>";
		this._session.sendAccessMsg(5064, s, function(succ, xml){
			done(succ);
		});
	};
	/**
	 * 查询报警输出装置开关状态
	 * @method getState
	 * @param sAlarmoutNaming {String} 报警输出装置标识
	 * @param done {Function} 执行结果，原型function(bSuccess, state)
	 * @example
	 * <pre><code>
	 * var alarmCfg = new JMegaeyes.AlarmoutConfig(app.Session);
	 * alarmCfg.getState( alarmoutNaming, function(bSuccess, state){
	 *   if(bSuccess){
	 *      if(state == 1){alert("报警输出装置当前状态为【开】")}
	 *      if(state == 0){alert("报警输出装置当前状态为【关】")}
	 *   }
	 *   else{
	 *      alert("查询报警输出装置当前状态错误");
	 *   }
	 * });
	 * </code></pre>
	 */
	this.getState = function(sAlarmoutNaming, done){
		var s = "<Message>";
		s += "<Naming>" + sAlarmoutNaming + "</Naming>";
		s += "<DeviceID>" + sAlarmoutNaming.substr(0, sAlarmoutNaming.indexOf(":")) + "</DeviceID>";
		s += "</Message>";
		this._session.sendAccessMsg(5066, s, function(succ, xml){
			if(succ && xml.length > 0){
				try{
					var dom = JMegaeyes.Utils.parseXML(xml);
					var node = dom.getElementsByTagName("State")[0];
					var nState = parseInt(node.textContent);
					done(true, nState);
				}
				catch(err){
					done(false, 0);
				}
			}
			else{
				done(false, 0);
			}
		});
	};
	
};