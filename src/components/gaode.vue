<template>
  <div class="hello">
    <div id="container"></div>
    <div class="cc">
      shanghai city 3D models by Michael Zhang /
      <a target="_blank" href="https://creativecommons.org/licenses/by/2.0/"
        >CC BY
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "11",
  data() {
    return {};
  },
  mounted() {
    this.mapInit();
  },
  methods: {
    mapInit() {
      // 创建地图实例
      var map = new AMap.Map("container", {
        viewMode: "3D",
        pitch: 60,
        rotation: 25,
        zoom: 15,
        center: [120.583936,31.278154],
        mapStyle: "amap://styles/macaron",
        showBuildingBlock:false,
        showIndoorMap: false,
      });

      // 创建Object3DLayer图层
      var object3Dlayer = new AMap.Object3DLayer();
      map.add(object3Dlayer);

      var druckMeshes;

      map.plugin(["AMap.GltfLoader"], function () {
        // var urlDuck = "https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf";
        //  var urlDuck = "https://staticfile-service.oss-cn-shanghai.aliyuncs.com/Duck/Duck.gltf";
        // var urlDuck = "https://staticfile-service.oss-cn-shanghai.aliyuncs.com/ceshi.gltf";
        // var urlDuck = "https://staticfile-service.oss-cn-shanghai.aliyuncs.com/daochu/daochu.gltf"
        var urlDuck = "static/daochu/daochu.gltf"

        var paramDuck = {
          position: new AMap.LngLat(120.56523,31.308526), // 必须
          scale: 7.8, // 非必须，默认1
          height: 0, // 非必须，默认0
          scene: 0, // 非必须，默认0
        };

        var gltfObj = new AMap.GltfLoader();

        // 来福士
        gltfObj.load(urlDuck, function (gltfDuck) {
          druckMeshes = gltfDuck;
          gltfDuck.setOption(paramDuck);
          gltfDuck.rotateX(90);
          gltfDuck.rotateZ(-1);
          object3Dlayer.add(gltfDuck);
        });
      });

      // 给gltf模型绑定事件
      // 
      map.on("click", function (ev) {
        var pixel = ev.pixel;
        var px = new AMap.Pixel(pixel.x, pixel.y);
        var obj =
          map.getObject3DByContainerPos(px, [object3Dlayer], false) || {};
        if (obj && obj.object) {
          var meshId = obj.object.id;
          if (druckMeshes && druckMeshes.layerMesh) {
            for (var i = 0; i < druckMeshes.layerMesh.length; i++) {
              if (meshId === druckMeshes.layerMesh[i].id) {
                return log.info("您点击了模型！");
              }
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.hello {
  width: 100%;
  height: 100%;
}

#container {
  width: 100%;
  height: 100%;
}

.cc {
  position: absolute;
  color: #000000;
  bottom: 10px;
  left: 10px;
}
</style>
