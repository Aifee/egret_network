/**
 * Http请求结果封装
*/
class NetHttpRequest{
	/**
	 * Http 请求
	*/
	public httpRequest:egret.HttpRequest;
	/**
	 * 请求地址
	*/
	public url:string;
	/**
	 * 请求成功回调
	*/
	public callback:Function;
	/**
	 * 请求错误回调
	*/
	public errorFunc:Function;
	/**
	 * 计时器
	*/
	public timer:egret.Timer;
	/**
	 * 请求超时回调
	*/
	public timeoutFunc:Function;
	/**
	 * this指针
	*/
	public thisObject:any;
}

/**
 * Http 网络连接
*/
class NetHttp {
	private static instance:NetHttp;
	public static get Instance():NetHttp{
		if(this.instance == null){
			this.instance = new NetHttp();
		}
		return this.instance;
	}
	/**
	 * 请求缓存列表
	 * 每一次发起请求都进行缓存
	 * 直到响应结果，错误，及超时后进行清理
	*/
	private requests:Array<NetHttpRequest> = new Array<NetHttpRequest>();
	/**
	 * Http以Get形式获取文本请求
	 * @param  {string} url 请求地址
	 * @param  {Function} callback 成功回调
	 * @param  {Function} errorFunc 错误回调
	 * @param  {Function} timeoutFunc 超时回调
	 * @param  {any} thisObject this指针
	 * @returns void
	 */
	public httpTextGet(url:string,callback: Function,errorFunc:Function,timeoutFunc:Function,thisObject:any):void{
		this.httpPostAndGet(url,callback,errorFunc,timeoutFunc,thisObject,true,true);
	}
	/**
	 * Http以Get形式获取二进制请求
	 * @param  {string} url 请求地址
	 * @param  {Function} callback 成功回调
	 * @param  {Function} errorFunc 错误回调
	 * @param  {Function} timeoutFunc 超时回调
	 * @param  {any} thisObject this指针
	 * @returns void
	 */
	public httpBufferGet(url:string,callback: Function,errorFunc:Function,timeoutFunc:Function,thisObject:any):void{
		this.httpPostAndGet(url,callback,errorFunc,timeoutFunc,thisObject,false,true);
	}
	/**
	 * Http以Post形式获取文本请求
	 * @param  {string} url 请求地址
	 * @param  {any} data post数据
	 * @param  {Function} callback 成功回调
	 * @param  {Function} errorFunc 错误回调
	 * @param  {Function} timeoutFunc 超时回调
	 * @param  {any} thisObject this指针
	 * @returns any
	 */
	public httpTextPost(url:string,data:any,callback: Function,errorFunc:Function,timeoutFunc:Function,thisObject:any):any{
		this.httpPostAndGet(url,callback,errorFunc,timeoutFunc,thisObject,true,false,data);
	}
	/**
	 * Http以Post形式获取二进制请求
	 * @param  {string} url 请求地址
	 * @param  {any} data post数据
	 * @param  {Function} callback 成功回调
	 * @param  {Function} errorFunc 错误回调
	 * @param  {Function} timeoutFunc 超时回调
	 * @param  {any} thisObject this指针
	 * @returns any
	 */
	public httpBufferPost(url:string,data:any,callback: Function,errorFunc:Function,timeoutFunc:Function,thisObject:any):any{
		this.httpPostAndGet(url,callback,errorFunc,timeoutFunc,thisObject,false,false,data);
	}
	/**
	 * http请求
	 * @param  {string} url 请求地址
	 * @param  {Function} callback 成功回调
	 * @param  {Function} errorFunc 错误回调
	 * @param  {Function} timeoutFunc 超时回调
	 * @param  {any} thisObject this指针
	 * @param  {boolean} isText 是否使用文本形式
	 * @param  {boolean} isGet 是否使用Get形式
	 * @param  {any} data? post数据，默认为空，当以get形式获取时可以为默认参数
	 */
	private httpPostAndGet(url:string,callback:Function,errorFunc:Function,timeoutFunc:Function,thisObject:any,isText:boolean,isGet:boolean,data?:any){
		var req: NetHttpRequest = new NetHttpRequest();
		req.httpRequest = new egret.HttpRequest();
		if(isText){
			req.httpRequest.responseType = egret.HttpResponseType.TEXT;
		}else{
			req.httpRequest.responseType = egret.HttpResponseType.ARRAY_BUFFER;
		}
		req.url = url;
		if(isGet){
			req.httpRequest.open(url,egret.HttpMethod.GET);
		}else{
			req.httpRequest.open(url,egret.HttpMethod.POST);
		}
		req.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.httpRequest.send(data);
		req.httpRequest.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
		req.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
		req.timer = new egret.Timer(5000,0);
		req.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimeStop,this);
		req.timer.start();
		req.callback = callback;
		req.errorFunc = errorFunc;
		req.timeoutFunc = timeoutFunc;
		this.requests.push(req);
	}
	/**
	 * 请求成功回调
	 * @param  {egret.Event} e
	 * @returns void
	 */
	private onGetComplete(e:egret.Event):void{
		var httpRequest = <egret.HttpRequest>e.currentTarget;
		var request:NetHttpRequest;
		var index = 0;
		this.requests.forEach(function (req,inx,array) {
			if(req.httpRequest == httpRequest){
				request = req;
				index = inx;
			}
			});
		if(request != null){
			request.httpRequest.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.httpRequest.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.timer.stop();
			request.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimeStop,this);
			request.callback.call(request.thisObject,request.httpRequest.response);
			this.requests.splice(index,1);
		}
		
	}
	/**
	 * 请求错误回调
	 * @param  {egret.IOErrorEvent} e
	 * @returns void
	 */
	private onGetIOError(e:egret.IOErrorEvent):void{
		var httpRequest = <egret.HttpRequest>e.currentTarget;
		console.log(httpRequest);
		var request:NetHttpRequest;
		var index = 0;
		this.requests.forEach(function (req,inx,array) {
			if(req.httpRequest == httpRequest){
				request = req;
				index = inx;
			}
			});
		if(request != null){
			request.httpRequest.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.httpRequest.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.timer.stop();
			request.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimeStop,this);
			request.errorFunc.call(request.thisObject,e);
			this.requests.splice(index,1);
		}
	}
	/**
	 * 请求超时回调
	 * @param  {egret.TimerEvent} e
	 * @returns void
	 */
	private onTimeStop(e:egret.TimerEvent):void{
		var timer:egret.Timer = <egret.Timer>e.currentTarget;
		console.log(timer);
		var request:NetHttpRequest;
		var index;
		this.requests.forEach(function (req,inx,array) {
			if(req.timer == timer){
				request = req;
				index = inx;
			}
			});
		if(request != null){
			request.httpRequest.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.httpRequest.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.timer.stop();
			request.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimeStop,this);
			request.timeoutFunc.call(request.thisObject,request.url);
			this.requests.splice(index,1);
		}
	}
	
}