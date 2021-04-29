const fs = require("fs");
const rollup = require("rollup");
const { babel, getBabelOutputPlugin } = require("@rollup/plugin-babel");
const del = require("rollup-plugin-delete");
const json = require("@rollup/plugin-json");
const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");

const packageJSON = require("./package.json");

const inputOptions = {
  input: "./src/app.js",
  plugins: [
    del({ targets: "./dist/*" }),
    getBabelOutputPlugin({
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
      plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
    }),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
    json(),
    commonjs(),
    terser(),
  ],
};
const outputOptions = { dir: "./dist", format: "cjs" };

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  // generate code and a sourcemap
  // const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);

  // 生成 package.json

  // 只配置 '生产模式' 下需要的依赖
  const packageJSONForProduction = {
    name: packageJSON.name,
    dependencies: packageJSON.dependencies,
  };

  const writeStream = fs.createWriteStream("./dist/package.json");
  writeStream.write(JSON.stringify(packageJSONForProduction));
}

build();
