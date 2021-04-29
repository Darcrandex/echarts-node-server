const path = require("path");
const Koa = require("koa");
const KoaRouter = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const IP = require("ip");
const requireDirectory = require("require-directory");

const { server } = require("./config");

const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// cors 前端要用xhr请求,fetch请求会无效
app.use(cors());

// 处理post请求
app.use(bodyParser());

// routes 自动加载路由
const routesDir = path.resolve(__dirname, "./routes");
requireDirectory(module, routesDir, {
  visit(item) {
    if (item instanceof KoaRouter) {
      app.use(item.routes());
    }
  },
});

app.listen(server.port, () => {
  const local = IP.address();
  console.log(`koa server listening at: http://${local}:${server.port}`);
});
