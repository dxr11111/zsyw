// 生产环境去除console.log
const prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  // prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [...prodPlugins],


  // presets: ["@babel/preset-react"],
  // plugins: ["@babel/plugin-transform-react-jsx", "@/babel/plugin-syntax-jsx"]
};
