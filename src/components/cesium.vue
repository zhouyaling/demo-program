<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
export default {
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNTUwOTMxNS1jNjhmLTRiM2MtYTdlMi0wYzYzMDY3YWI4NDkiLCJpZCI6NjE3MTcsImlhdCI6MTYyNjMxMjEzOX0.B0lgtVKkGd_RK-snHBqDf_4VdBrjwk9YiyJWJRkm79U";
    this.$nextTick(() => {
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        // shouldAnimate: true,
        // animation: false, // 是否创建动画小器件，左下角仪表
        // baseLayerPicker: false, // 是否显示图层选择器
        // fullscreenButton: false, // 是否显示全屏按钮
        // geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
        // homeButton: false, // 是否显示Home按钮
        // infoBox: false, // 是否显示信息框
        // sceneModePicker: false, // 是否显示3D/2D选择器
        // selectionIndicator: false, // 是否显示选取指示器组件
        // timeline: false, // 是否显示时间轴
        // navigationHelpButton: false, // 是否显示右上角的帮助按钮
        // scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        // clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
        // selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
        // imageryProviderViewModels:
        //   Cesium.createDefaultImageryProviderViewModels(), // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        // selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
        // terrainProviderViewModels:
        //   Cesium.createDefaultTerrainProviderViewModels(), // 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
        // // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        // //   url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
        // // }),
        // fullscreenElement: document.body, // 全屏时渲染的HTML元素,
        // useDefaultRenderLoop: true, // 如果需要控制渲染循环，则设为true
        // targetFrameRate: undefined, // 使用默认render loop时的帧率
        // showRenderLoopErrors: false, // 如果设为true，将在一个HTML面板中显示错误信息
        // automaticallyTrackDataSourceClocks: true, // 自动追踪最近添加的数据源的时钟设置
        // contextOptions: undefined, // 传递给Scene对象的上下文参数（scene.options）
        // sceneMode: Cesium.SceneMode.SCENE3D, // 初始场景模式为三维
        // mapProjection: new Cesium.WebMercatorProjection(), // 地图投影体系
        // dataSources: new Cesium.DataSourceCollection(),
        // // 需要进行可视化的数据源的集合
      });

      //   this.viewer.terrainProvider = Cesium.createWorldTerrain({
      //     requestWaterMask: true, // required for water effects
      //     requestVertexNormals: true, // required for terrain lighting
      //   });
      //   this.viewer.scene.globe.depthTestAgainstTerrain = true;

      // 方法
      this.doImageryLayerFunc();

      //   this.viewer.imageryLayers.get(0).brightness = 0.88;
      //   this.viewer.imageryLayers.get(0).contrast = 0.94;
      //   this.viewer.imageryLayers.get(0).hue = 0.48;
      //   this.viewer.imageryLayers.get(0).saturation = 1.4;
      //   this.viewer.imageryLayers.get(0).gamma = 0.46;

      //   this.viewer._cesiumWidget._creditContainer.style.display = "none";

      //   this.viewer.scene.postProcessStages.fxaa.enabled = false;
      //   /* 设置相机最小高度 */
      //   this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2000;
      //   /* 设置相机最大高度 */
      //   this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 14023;
    });
  },
  methods: {
    doImageryLayerFunc() {
      // 1.加载地形
      //   this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0));
      //   this.viewer.imageryLayers.addImageryProvider(
      //     new Cesium.IonImageryProvider({ assetId: 3954 })
      //   );

      // 2.设置相机位置,距离，方向角度
         var initialPosition = new Cesium.Cartesian3.fromDegrees(120.56523,31.308526, 2631.082799425431); // china
      // var initialPosition = new Cesium.Cartesian3.fromDegrees(
      //   -73.998114468289017509,
      //   40.674512895646692812,
      //   2631.082799425431
      // );
      // newyork
      var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
        7.1077496389876024807,
        -31.987223091598949054,
        0.025883251314954971306
      );
      var homeCameraView = {
        destination: initialPosition,
        orientation: {
          heading: initialOrientation.heading,
          pitch: initialOrientation.pitch,
          roll: initialOrientation.roll,
        },
      };
      this.viewer.scene.camera.setView(homeCameraView);

      // 3. 加载3d tiles
      //   var url = Cesium.IonResource.fromAssetId(96188);
      //   var city = this.viewer.scene.primitives.add(
      //     new Cesium.Cesium3DTileset({
      //       url: url, // "https://assets.cesium.com/96188/tileset.json?v=15" //
      //     })
      //   );
      //   var heightOffset = -32;
      //   city.readyPromise.then(function (tileset) {
      //     // Position tileset
      //     var boundingSphere = tileset.boundingSphere;
      //     var cartographic = Cesium.Cartographic.fromCartesian(
      //       boundingSphere.center
      //     );
      //     var surface = Cesium.Cartesian3.fromRadians(
      //       cartographic.longitude,
      //       cartographic.latitude,
      //       0.0
      //     );
      //     var offset = Cesium.Cartesian3.fromRadians(
      //       cartographic.longitude,
      //       cartographic.latitude,
      //       heightOffset
      //     );
      //     var translation = Cesium.Cartesian3.subtract(
      //       offset,
      //       surface,
      //       new Cesium.Cartesian3()
      //     );
      //     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      //   });
      //   var defaultStyle = new Cesium.Cesium3DTileStyle({
      //     color: "color('white')",
      //     show: true,
      //   });
      //   city.style = defaultStyle;

      // 4. 加载 模型
      // 4.1 方式一
      // var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      //   Cesium.Cartesian3.fromDegrees(
      //     -75.62898254394531,
      //     40.02804946899414,
      //     0.0
      //   )
      // );
      // var scene = this.viewer.scene;
      // var model = scene.primitives.add(
      //   Cesium.Model.fromGltf({
      //     url: "static/models/GroundVehicle.glb",
      //     // url:"static/models/daochu/daochu.gltf",
      //     modelMatrix: modelMatrix,
      //     scale: 200,
      //   })
      // );

      // 4.2方式二
      var _this = this;
      var url = "static/models/daochu/daochu.gltf";
      // var url = "static/models/九曲河/九曲河.gltf";
      // var url = "static/models/CesiumAir/Cesium_Air.glb";
      var position = Cesium.Cartesian3.fromDegrees(120.56523, 31.308526, 0);
      var heading = Cesium.Math.toRadians(90); // 90
      var pitch = 0;
      var roll = 0;
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );

      var entity = _this.viewer.entities.add({
        name: url, //url,
        position: position,
        orientation: orientation,
        model: {
          uri:  url,
          minimumPixelSize: 128,
          maximumScale: 20000,
          scale: 1,
        },
      });

      _this.viewer.trackedEntity = entity;
      return;


      var _this = this;
      // 586786 daochu
      // 587926 cesium_air1
      var promise = Cesium.IonResource.fromAssetId(587926).then(function (
        resource
      ) {
        // var url = "static/models/daochu/daochu.gltf";
        var url = "static/models/CesiumAir/Cesium_Air.glb";
        var position = Cesium.Cartesian3.fromDegrees(120.56523, 31.308526, 0);
        var heading = Cesium.Math.toRadians(0); // 90
        var pitch = 0;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(
          position,
          hpr
        );

        var entity = _this.viewer.entities.add({
          name: resource.url, //url, //
          position: position,
          orientation: orientation,
          model: {
            uri: resource.url, //url,//
          },
        });

        _this.viewer.trackedEntity = entity;
      });
      // end
    },
  },
};
</script>
<style scoped>
#cesiumContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>