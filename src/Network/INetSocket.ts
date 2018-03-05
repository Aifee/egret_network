// TypeScript file

/**
 * 连接状态枚举
*/
enum NetSocketStatus{
    /**
     * 空状态
    */
	None = 0,
    /**
     * 开始连接
    */
    BeginConnect,
    /**
     * 连接成功
    */
    Connected,
    /**
     * 连接失败
    */
    ConnectFailed,
    /**
     * 未连接
    */
    Disconnect,
    /**
     * 连接错误
    */
    Error,
}

interface INetSocket{
    /**
     * 添加监听消息
     * @param  {number} id 所关心的协议号
     * @param  {Function} func 对应的协议返回函数
     * @param  {any} thisObject this指针
     * @returns void
     */
    addListenerMessage(id:number,func:Function,thisObject: any):void;
    /**
     * 连接服务器，不加密连接，以ws开头
     * @param  {string} host 连接地址
     * @param  {number} port 连接端口
     * @param  {Function} func 连接后回调函数，成功，失败，服务器强制关闭，错误，都会触发
     * @param  {any} thisObject this指针
     * @returns void
     */
    connect(host:string,port:number,func:Function,thisObject: any):void;
    /**
     * 连接服务器，加密连接，以wss开头
     * @param  {string} host 连接地址
     * @param  {number} port 连接端口
     * @param  {Function} func 连接后回调函数，成功，失败，服务器强制关闭，错误，都会触发
     * @param  {any} thisObject this指针
     * @returns void
     */
    secureConnect(host:string,port:number,func:Function,thisObject: any):void;
    /**
     * 发送消息
     * @param  {number} id 协议ID
     * @param  {any} bytes protocol所转换的byte数组数据
     * @returns void
     */
    send(id:number,bytes:any):void;
    /**
     * 关闭连接服务
     * @returns void
     */
    close():void;
}