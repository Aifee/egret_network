/**
 * 网络连接工具类
 * 负责架子啊protocol并进行静态缓存
*/
class NetUtil {

	private static _ApcData: any;
	public static get ApcData(): any {
		return this._ApcData;
	}
	private static _MessageData: any;
	public static get MessageData(): any {
		return this._MessageData;
	}

	/**
	 * 加载protocol
	 * 支持加载多个protocol文件
	 * 需要手动扩展
	 * @param  {Function=null} callback 加载完回到
	 * @returns void
	 */
	public static loadProtocol(callback: Function = null): void {
		this.load("./resource/protocol/ApcData.proto", (err: any, root: any) => {
			this._ApcData = root.Protocol;
		});
		this.load("./resource/protocol/MessageData.proto", (err: any, root: any) => {
			this._MessageData = root.Protocol;
			///为了加载protocol完成回调的正确执行，要在最后一个protocol加载完后进行回到处理
			if (callback != null) {
				callback();
			}
		});
	}


    /** 使用框架内部加载外部proto文件
     * @param  {any} url proto文件路径 也可以是路径数组（可包含多条路径）
     * @param  {any} options (err: any, root: any) => {}加载完成后回调
     * @param  {any} callback=null
     * @returns void
     */
	private static load(url: any, options, callback = null): void {
		let self: any = new protobuf.Root();
		let queued: number = 0;
		let path: string;
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}
		let finish = (err, root) => {
			if (!callback || queued) return;
			callback(err, root);
		}
		let process = (filename, source) => {
			self.files.push(filename);
			let parsed = protobuf.parse(source, self, options), resolved;
			if (parsed.imports) {
				queued += parsed.imports.length;
				for (let i = 0; i < parsed.imports.length; ++i) {
					if (resolved = self.resolvePath(path, parsed.imports[i])) {
						let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
						if (!RES.getRes(str)) {
							RES.getResByUrl(resolved, function (source_: any) {
								process(resolved, source_);
								--queued;
								finish(null, self);
							}, this, RES.ResourceItem.TYPE_TEXT)
						} else {
							process(resolved, RES.getRes(str));
							--queued;
						}
					}
				}
			}
			if (parsed.weakImports) {
				queued += parsed.imports.length;
				for (let i = 0; i < parsed.weakImports.length; ++i) {
					if (resolved = self.resolvePath(path, parsed.weakImports[i])) {
						let str: any = resolved.slice(resolved.lastIndexOf("/") + 1, resolved.length).replace(".", "_");
						if (!RES.getRes(str)) {
							RES.getResByUrl(resolved, function (source_: any) {
								process(resolved, source_);
								--queued;
								finish(null, self);
							}, this, RES.ResourceItem.TYPE_TEXT);
						} else {
							process(resolved, RES.getRes(str));
							--queued;
						}
					}
				}
			};
			finish(null, self);
		}

		if (typeof url === "string") {
			path = url.slice(0, url.lastIndexOf("/") + 1);
			RES.getResByUrl(url, function (source_: any) {
				process(url, source_);
			}, this, RES.ResourceItem.TYPE_TEXT);
		} else {
			for (let i = 0; i < url.length; i++) {
				RES.getResByUrl(url[i], function (source_: any) {
					let tempurl: string = url[i];
					path = tempurl.slice(0, tempurl.lastIndexOf("/") + 1);
					process(tempurl, source_);
				}, this, RES.ResourceItem.TYPE_TEXT);
			}
		}
	}

}