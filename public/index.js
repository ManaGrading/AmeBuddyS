const loaderLine = document.getElementById('loader-line');

// Unity WebGL loading
var buildUrl = "Build";
var loaderUrl = buildUrl + "/Builds.loader.js";
var config = {
  dataUrl: buildUrl + "/Builds.data",
  frameworkUrl: buildUrl + "/Builds.framework.js",
  codeUrl: buildUrl + "/Builds.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "Mana Grading Collectibles",
  productName: "Mana Studio",
  productVersion: "0.1",
};

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(document.querySelector("#loader-line"), config, (progress) => {
    loaderLine.style.strokeDasharray = 100 * progress + "%";
  }).then((unityInstance) => {
    loaderLine.style.display = "none";
  }).catch((message) => {
    alert(message);
  });
};
document.body.appendChild(script);