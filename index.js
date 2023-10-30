const http = require("http");

function App() {
	this.router = createRouter();
	this.listen = function (port) {
		return http.createServer(this.callback()).listen(port);
	};
	this.callback = function () {
		const handle = this.router._handle.bind(this.router);
		return function (req, res) {
			handle(req, res);
		};
	};
}

function Router() {
	this._routes = {};
	this._handle = async function (req, res) {
		const { method, body, queryParams, pathName } = await this.parseRequest(req);
		this._routes[url][method.toLowerCase()](req, res);
	};
	this.parseRequest = async function (req) {
		function parseBody(){
			return new Promise((resolve, reject) => {
				let body = "";
				req.on("data", (chunk) => {
					body += chunk;
				});
				req.on("error", (chunk) => {
					reject("Error")
				});
				req.on("end", () => {
					body = JSON.parse(body);
					resolve(body)
				});
			})
		}
		function parseUrl(url){
			const {pathName,searchParams} = new URL(url);
			const queryParams = {}
			searchParams.forEach((value,key)=>{
				queryParams[key] = value;
			})
			return {
				pathName,
				queryParams
			}
		}
		const { method, url:oldUrl } = req;
		const path = `http://${req.headers.host}${oldUrl}`
		const {queryParams, pathName} = parseUrl(path)
		const body = await parseBody();
		return {
			method,
			body,
			queryParams,
			pathName
		};
	};
}

function createRouter() {
	http.METHODS.forEach((_method) => {
		const method = _method.toLowerCase();
		Router.prototype[method] = function (path, callback) {
			if (!this._routes[path]) {
				this._routes[path] = {};
			}
			if (!this._routes[path][method]) {
				this._routes[path][method] = undefined;
			}
			this._routes[path][method] = callback;
		};
	});
	return new Router();
}

module.exports = App;
