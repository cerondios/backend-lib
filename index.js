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
	this._handle = function (req, res) {
		const { method, url } = req;
        console.log(url);
		this._routes[url][method.toLowerCase()](req, res);
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
