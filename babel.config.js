module.exports = function (api) {
  api.cache(true);

  const presets = [
      ["@babel/env", { "modules": false }],
      "@vue/babel-preset-jsx"
  ];


  return {
      presets
  };
}
