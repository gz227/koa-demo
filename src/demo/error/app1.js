/**
 * - app.on('error') 处理
 */
const Koa = require("koa");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.use(async (ctx, next) => {
  JSON.parse("{}");
  ctx.body = "Hello Koa";
  await next(); // 可以捕获
});

app.use(async (ctx) => {
  const data = await readFile("./dnskjandsa.html");
  ctx.type = "html";
  ctx.body = data;
});

app.on("error", (err) => {
  console.log("app error", err);
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
