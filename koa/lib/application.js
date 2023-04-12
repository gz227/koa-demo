const Emitter = require("events");
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  callback() {
    // 聚合中间件
    const fnMiddleware = compose(this.middleware);
    const handleRequest = (req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res);
      const handleResponse = () => respond(ctx); // 处理body 不同的格式 buffer、string、json
      // 执行中间件
      fnMiddleware(ctx)
        .then(handleResponse)
        .catch((err) => {
          res.end(err.message);
        });
    };
    return handleRequest;
  }

  createContext(req, res) {
    // 一个app会有多个请求，每个请求都会创建新的上下文对象，避免数据污染，这里拷贝一份
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));

    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    return context;
  }

  use(fn) {
    this.middleware.push(fn);
    return this;
  }
};

function respond(ctx) {
  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;
  if (body === null) {
    res.statusCode = 204;
    return res.end();
  }
  if (Buffer.isBuffer(body)) return res.end(body); // buffer
  if ("string" === typeof body) return res.end(body); // string
  if (body instanceof Stream) return body.pipe(res); // stream
  body = JSON.stringify(body); // body: json
  res.end(body);
}

function compose(middleware) {
  return function (ctx) {
    const dispatch = (index) => {
      if (index >= middleware.length) return Promise.resolve();
      const fn = middleware[index++];
      // 这里要创建上下文
      return Promise.resolve(fn(ctx, () => dispatch(index))); // 参数就是中间件的参数（ctx、next）
    };
    return dispatch(0); // 返回第一个中间件执行函数。
  };
}
