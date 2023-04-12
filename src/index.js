const koa = require("../koa");
const app = new koa();
const a1 = (ctx, next) => {
  console.log("gz", ctx.header);
  console.log("gz", ctx.url);
  console.log("gz", ctx.body);
  // ctx.body = "hello world";
  ctx.body = Buffer.from("hello world");
  // ctx.body = JSON.stringify('{"a": "1"}');

  console.log("gz", ">>a1>>");
  next();
  console.log("gz", "<<a1<<");
};
const a2 = (ctx, next) => {
  console.log("gz", ">>a2>>");
  next();
  console.log("gz", "<<a2<<");
};
const a3 = (ctx, next) => {
  console.log("gz", ">>a3>>");
  next();
  console.log("gz", "<<a3<<");
};
app.use(a1);
app.use(a2);
app.use(a3);
app.listen(3000);
