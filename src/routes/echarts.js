const KoaRouter = require("koa-router");
const { createCanvas } = require("canvas");
const echarts = require("echarts");

const router = new KoaRouter();

// echarts 生成图片
router.post("/get-echarts-image", (ctx) => {
  /**
   * @param {number?} width 宽
   * @param {number?} height 高
   * @param {object?} option echarts(5.x)的配置项
   */
  const { width = 500, height = 500, option } = ctx.request.body;
  const canvas = createCanvas(width, height);
  echarts.setCanvasCreator(() => canvas);
  const chartIns = echarts.init(canvas);

  // echarts 配置部分可能传入的是 json 字符串
  const _option = typeof option === "string" ? JSON.parse(option) : option;

  chartIns.setOption(
    _option || {
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
