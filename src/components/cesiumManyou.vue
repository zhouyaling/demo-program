<template>
  <div>
    <div id="cesiumContainer">
        
    </div>
    <div class="btn-group">
      <button @click="showBig">放大</button>
      <button @click="showSmall">缩小</button>
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium/Cesium";
// import "cesium/Widgets/widgets.css";
export default {
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    // token
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNTUwOTMxNS1jNjhmLTRiM2MtYTdlMi0wYzYzMDY3YWI4NDkiLCJpZCI6NjE3MTcsImlhdCI6MTYyNjMxMjEzOX0.B0lgtVKkGd_RK-snHBqDf_4VdBrjwk9YiyJWJRkm79U";
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
      90,
      -20,
      110,
      90
    ); //西南东北，默认显示中国
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.2;

    // 实例化容器
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
      selectionIndicator: false,
      navigation: false,
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      shouldAnimate: true,
      //   imageryProvider: new Cesium.SingleTileImageryProvider({
      //     url: "http://211.149.185.229:8080/static/images/earth/earth_3.jpg"//"static/images/earth/earth_1.jpg",
      //   }), // 加载图片底图
      // imageryProvider: new Cesium.UrlTemplateImageryProvider({
      //   url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", // 默认
      // }),
    });

    // mapbox
    // let imageryProvider = new Cesium.MapboxStyleImageryProvider({
    //   //   url: "https://api.mapbox.com/styles/v1/marsgis/cki0a0ire3jvh19r92vwfau1e/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
    // //   url: "https://api.mapbox.com/styles/v1/zhouyaling/cjrbqt0np29ov2stg4uhaul3g/wmts?access_token=pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
    //   url: "https://api.mapbox.com/styles/v1",
    //   username: "zhouyaling",
    //   styleId:'cjrbqt0np29ov2stg4uhaul3g',
    //   accessToken:
    //     "pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
    //   scaleFactor: true,
    // });

    // ArcGIS
    let imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer", // 蓝色底图
      //   url: "https://lbs.amap.com/dev/mapstyle/mapshare/fb9958c3f4c97d17907059d343d1b055",
    });

    // // 高德 地图不能自定义地图地图样式
    // let imageryProvider = new Cesium.UrlTemplateImageryProvider({
    //   //   url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",  //   // 路网
    //     url: "https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",  //   // 电子街道
    // });

    this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    this.viewer.scene.debugShowFramesPerSecond = true; // 显示针
    this.get_camera_height();

    var center = Cesium.Cartesian3.fromDegrees(106.482312, 29.610641, 3000); // 位置
    var heading = Cesium.Math.toRadians(70.0);
    var pitch = Cesium.Math.toRadians(-20);
    var range = 3000;
    // 定位
    // this.viewer.camera.lookAt(
    //   center,
    //   new Cesium.HeadingPitchRange(heading, pitch, range)
    // );

    this.viewer.camera.setView({
      destination: center,
      orientation: {
        heading: heading,
        pitch: pitch,
        roll: 0,
      },
    });

    this.initGltf();
  },
  methods: {
    showBig() {
      this.big();
    },
    showSmall() {
      this.samll();
    },
    big() {
      console.log("放大", this.get_camera_height());
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          this.get_camera_height().centerLon,
          this.get_camera_height().centerLat,
          this.get_camera_height().height / 2.8
        ),
        duration: 1.0,
      });
    },
    samll() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          this.get_camera_height().centerLon,
          this.get_camera_height().centerLat,
          this.get_camera_height().height * 2.8
        ),
        duration: 1.0,
      });
    },
    // 获取当前相机高，经纬度
    get_camera_height() {
      // 获取当前镜头位置的笛卡尔坐标
      var cameraPosition = this.viewer.camera.position;
      // 获取当前坐标系标准
      var ellipsoid = this.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      var cartographic = ellipsoid.cartesianToCartographic(cameraPosition);
      // 获取镜头的高度
      var height = cartographic.height;
      // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
      var centerLon = parseFloat(
        Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      );
      var centerLat = parseFloat(
        Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      );

      return { height, centerLon, centerLat };
    },

    // 加载模型
    initGltf() {
      var _this = this;
        var url = "static/models/daochu/daochu.gltf";
      // var url = "static/models/A4.gltf";
      var position = Cesium.Cartesian3.fromDegrees(106.482312, 29.610641, 0);
      var heading = Cesium.Math.toRadians(0);
      var pitch = 0;
      var roll = 0;
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      var entity = _this.viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          minimumPixelSize: 128,
          maximumScale: 20000,
          scale: 1,
        },
      });

      _this.viewer.trackedEntiti = entity;
    },
  },
};
</script>
<style scoped>
.btn-group {
  position: absolute;
  top: 0;
  left: 0;
  color: #ffffff;
}
</style>