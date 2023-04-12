/**
 * - 全局异常处理
 */
const Koa = require("koa");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const app = new Koa();

// 在最外层添加异常捕获的中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

app.use(async (ctx, next) => {
  JSON.parse("{}");
  ctx.body = "Hello Koa";
  // next(); // 无法捕获后面的异步中间件
  // return next() // 可以捕获
  await next(); // 可以捕获
});

app.use(async (ctx) => {
  const data = await readFile("./dnskjandsa.html");
  ctx.type = "html";
  ctx.body = data;
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
