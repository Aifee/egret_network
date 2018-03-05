/**
 * 地址封装
 * 支持加密和不加密
*/
class HostAdress {
	public host: string;
	public port: number;
	public encryption: boolean;

	/**
	 * 获取完整地址：
	 * 加密格式："wss:echo.websocket.org:80"
	 * 不加密格式："ws:echo.websocket.org:80"
	 * @returns string
	 */
	public completeAddress(): string {
		var prefix = this.encryption ? "wss" : "ws";
		return prefix + "://" + this.host + ":" + this.port;
	}
}