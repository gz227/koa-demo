const Koa = require("koa");
const Router = require("@koa/router");
const static = require("koa-static");
const path = require("path");
const mount = require("koa-mount");

const app = new Koa();
app.use(mount("/foo", static(path.join(__dirname, "./public")))); // 静态资源托管

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "home page";
});

router.get("/users/:id", (ctx) => {
  console.log(ctx.params);
  ctx.body = "users page";
});

router.get("/bar", (ctx) => {
  // 重定向针对的同步请求
  ctx.redirect("/");
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
