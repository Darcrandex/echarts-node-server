const KoaRouter = require("koa-router");
const { createCanvas } = require("canvas");
const echarts = require("echarts");

const router = new KoaRouter();

router.post("/get-echarts-image", (ctx) => {
  const { width = 500, height = 500, option } = ctx.request.body;

  const canvas = createCanvas(width, height);
  echarts.setCanvasCreator(() => canvas);
  const chartIns = echarts.init(canvas);

  chartIns.setOption(
    option || {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    }
  );

  const buffer = canvas.toBuffer();
  const base64 = "data:image/jpg;base64," + buffer.toString("base64");

  ctx.body = {
    code: 2000,
    data: base64,
  };
});

module.exports = router;
