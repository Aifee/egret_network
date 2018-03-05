/**
 * 网络连接示例
 * 游戏中需要根据自己的逻辑进行适当的修改
 * 这里提供的是如何使用。具体游戏中自行更改
*/
class GameNetwork {
	private static instance: GameNetwork;
	public static get Instance(): GameNetwork {
		if (this.instance == null) {
			this.instance = new GameNetwork();
		}
		return this.instance;
	}
	private link: NetSocket;
	public constructor() {
		this.link = new NetSocket();
		this.initListener();
	}
	
	/**
	 * 连接服务器
	 * @returns void
	 */
	public connect(): void {
		this.link.connect("echo.websocket.org", 80, this.onSocketHandler, this);
	}
	/**
	 * 初始化消息监听
	 * 所关心的协议在初始化时应注册进去
	 * @returns void
	 */
	private initListener(): void {
		this.link.addListenerMessage(MessageCode.Login, this.recLogin, this);
		this.link.addListenerMessage(MessageCode.Register, this.recRegister, this);
	}
	private onSocketHandler(status: NetSocketStatus): void {
		switch (status) {
			case NetSocketStatus.Connected:
				this.reqLogin("liuaf", "123456");
				break;
			case NetSocketStatus.ConnectFailed:
				this.link.close();
				break;
			case NetSocketStatus.Disconnect:
				this.link.close();
				break;
			case NetSocketStatus.Error:
				this.link.close();
				break;
		}
	}
	public reqLogin(ac: string, pd: string): void {
		var msg: Object = {
			"account": ac,
			"password": pd
		}
		var body: any = NetUtil.MessageData.Login;
		var bytes: any = body.encode(body.create(msg)).finish();
		this.link.send(MessageCode.Login, bytes);
	}
	private recLogin(msg: any): void {
		var body: any = NetUtil.MessageData.Login.decode(msg);
	}
	public sendRegister(): void {

	}
	private recRegister(msg: any): void {

	}

}