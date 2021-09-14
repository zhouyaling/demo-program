<template>
  <div class="content">
    <div class="html_3d" id="cesiumContainer"></div>
    <div class="toolbar">
      <div @click="flyToA">A飞行到B</div>
      <div @click="cartesian3ToDegree">世界坐标转换为经纬度</div>
      <div @click="degreeToCartesian3">经纬度为世界坐标转换</div>
      <div @click="flyByAircraft">跟随视角漫游</div>
      <div @click="flyByMine">第一人称漫游</div>
      <div @click="load_gltf">加载gltf模型</div>
      <div @click="load_line">加载线条流光模型</div>
      <div @click="load_line_normal">画线</div>
      <!-- <div @click="load_3d_tiles">加载3d Tiles</div> -->
    </div>
    <div class="html_2d">
      <div class="head"></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium/Cesium";
import { addToolbarButton, declare } from "@/assets/Sandcastle-header";
import "cesium/Widgets/widgets.css";
import czmlData from "@/assets/js/czmlPath.js";

export default {
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNTUwOTMxNS1jNjhmLTRiM2MtYTdlMi0wYzYzMDY3YWI4NDkiLCJpZCI6NjE3MTcsImlhdCI6MTYyNjMxMjEzOX0.B0lgtVKkGd_RK-snHBqDf_4VdBrjwk9YiyJWJRkm79U";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      // terrainProvider: Cesium.createWorldTerrain(),
      baseLayerPicker: false,
      shouldAnimate: false,
      //   imageryProvider:new Cesium.UrlTemplateImageryProvider({
      //   //   url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",  //   // 路网
      //     url: "https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",  //   // 电子街道
      // })
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //   // url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      //   // url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      //   // url:'https://lbs.amap.com/dev/mapstyle/mapshare/fb9958c3f4c97d17907059d343d1b055'
      // }),
      //mapbox://styles/zhouyaling/cjrbqt0np29ov2stg4uhaul3g
      // imageryProvider: new Cesium.MapboxStyleImageryProvider({
      //   //   url: "https://api.mapbox.com/styles/v1/marsgis/cki0a0ire3jvh19r92vwfau1e/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
      //   //   url: "https://api.mapbox.com/styles/v1/zhouyaling/cjrbqt0np29ov2stg4uhaul3g/wmts?access_token=pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
      //   url: "https://api.mapbox.com/styles/v1",
      //   username: "zhouyaling",
      //   styleId: "cjrbqt0np29ov2stg4uhaul3g",
      //   accessToken:"pk.eyJ1IjoiemhvdXlhbGluZyIsImEiOiJjanJibnQ3Y3cwNmU3NDNwNHBjNHFscWc1In0.ir-kFtEbcIM_X6HhvgByiA",
      //   scaleFactor: true,
      // }),
    });

    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    // this.viewer.scene.skyAtmosphere.show = false;

    // this.viewer.scene.globe.imageryLayers.get(0).alpha = 0.0;
    // this.viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0); //默认为蓝色，这里改成绿色

    var heading = Cesium.Math.toRadians(0.0);
    var pitch = Cesium.Math.toRadians(-40);
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        106.48289044313123,
        29.61231013622676,
        100.0
      ),
      orientation: {
        heading: heading,
        pitch: pitch,
        roll: 0,
        // heading: 5.837346505274043,
        // pitch: -0.7927209256695096,
        // roll: 6.281137980253018,
      },
    }); // 设置初始位置

    // 添加图片
    this.addImage();

    // 打点监听
    // this.pointLister();

    // 官网漫游
    // this.manyou();

    // 漫游路径设置
    // this.setCzmlData();
  },
  methods: {
    // 划线
    load_line_normal() {
      var line = this.viewer.entities.add({
        name: "Red line on terrain",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          material: Cesium.Color.RED,
          clampToGround: true,
        },
      });

     this.viewer.trackedEntiti = line;
    },
    // 加载流光
    load_line() {
      var path = new Streamerpath();
      var positions = [
        [
          112.5535107330670854, 37.8612394690389991, 112.5538984750296407,
          37.8641210799073491, 112.5548608906540977, 37.8727717334314775,
          112.5554135315933593, 37.8753251873433427, 112.5555353064015094,
          37.8773057395881594, 112.5555974196704341, 37.8815753240675477,
        ],
        [
          112.5282013702352373, 37.8808761261214144, 112.527530551863677,
          37.873057142173252, 112.5264227060055191, 37.8609562994944753,
        ],
        [
          112.5220237760754713, 37.8643118141969666, 112.5201885781767999,
          37.8726141616944716,
        ],
      ];
      var obj = {
        positions: positions, //positions 经纬度二维数组，没有高度 position 经纬度数组，没有高度
        //position:[112.5220237760754713, 37.8643118141969666,112.5201885781767999, 37.8726141616944716]
        lineColor: "#0033FF", //线的颜色
        lineAlpha: 1.0, //线的透明度
        linewidth: 5.0, //线的宽度
        pointColor: "#FFFFFF", //移动点的颜色
        pointAlpha: 1.0, //移动点的透明度
        id: "line", //
        speed: 0.5, //移动速度
      };
      path.create(obj);

      path.getprimitivebyid("line");
    },
    // 加载gltf
    load_gltf() {
      this.initGltf();
    },

    // 加载3d tiles
    load_3d_tiles() {
      let res = Cesium.IonResource.fromAssetId(596357);
      var tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: res,
        })
      );

      let _this = this;
      tileset.readyPromise
        .then(function () {
          _this.viewer.zoomTo(tileset);

          // Apply the default style if it exists
          var extras = tileset.asset.extras;
          if (
            Cesium.defined(extras) &&
            Cesium.defined(extras.ion) &&
            Cesium.defined(extras.ion.defaultStyle)
          ) {
            tileset.style = new Cesium.Cesium3DTileStyle(
              extras.ion.defaultStyle
            );
          }
        })
        .otherwise(function (error) {
          console.log(error);
        });
    },

    // 经纬度坐标转世界坐标
    degreeToCartesian3(list) {
      if (!list || list.length < 0) {
        list = [
          [106.48314, 29.604911, 10],
          [106.481552, 29.611012, 10],
          [106.484427, 29.611907, 10],
        ];
      }
      var newList = [];
      list.forEach((element) => {
        var item = Cesium.Cartesian3.fromDegrees(
          element[0],
          element[1],
          element[2]
        );
        newList.push(item);
      });

      console.log("转换坐标：", newList);
      return newList;
    },

    // 世界坐标转换为经纬度
    cartesian3ToDegree() {
      var ellipsoid = this.viewer.scene.globe.ellipsoid;
      var list = [
        { x: -1836325.2395491807, y: 5148166.491233011, z: 3276618.910605113 },
        { x: -1835597.4399745292, y: 5148701.172107532, z: 3276189.4552097474 },
        { x: -1834869.5952150826, y: 5149235.726666775, z: 3275759.9185746373 },
        { x: -1834141.7052953872, y: 5149770.154884838, z: 3275330.300726121 },
        { x: -1833413.7702399974, y: 5150304.456735839, z: 3274900.6016905494 },
        { x: -1832685.7900734725, y: 5150838.6321939025, z: 3274470.821494278 },
        { x: -1831957.7648203738, y: 5151372.68123317, z: 3274040.9601636706 },
        { x: -1831229.6945052668, y: 5151906.603827793, z: 3273611.0177251017 },
        { x: -1830501.579152726, y: 5152440.399951934, z: 3273180.9942049477 },
        { x: -1829773.4187873278, y: 5152974.069579769, z: 3272750.8896296015 },
        { x: -1829045.2134336494, y: 5153507.612685489, z: 3272320.7040254585 },
        { x: -1828316.9631162782, y: 5154041.029243291, z: 3271890.437418924 },
        { x: -1827588.6678598027, y: 5154574.319227392, z: 3271460.0898364084 },
        { x: -1826860.327688816, y: 5155107.4826120185, z: 3271029.6613043346 },
        { x: -1826823.0284855259, y: 5155134.782277407, z: 3271007.617061297 },
        { x: -1826815.7433521205, y: 5155140.112605474, z: 3271003.3140896126 },
        { x: -1826808.455251766, y: 5155145.4417167455, z: 3270999.0146382796 },
        { x: -1826801.1641866972, y: 5155150.769609597, z: 3270994.7187086088 },
        { x: -1826793.8701591422, y: 5155156.096282392, z: 3270990.426301919 },
        { x: -1826786.5731713395, y: 5155161.421733502, z: 3270986.1374195213 },
        { x: -1826779.273225524, y: 5155166.745961299, z: 3270981.8520627273 },
        { x: -1826771.9703239305, y: 5155172.068964153, z: 3270977.5702328435 },
        { x: -1826764.6644687997, y: 5155177.390740435, z: 3270973.291931181 },
        { x: -1826757.3556623682, y: 5155182.711288518, z: 3270969.0171590447 },
        { x: -1826750.043906879, y: 5155188.030606775, z: 3270964.7459177384 },
        { x: -1826742.7292045727, y: 5155193.3486935785, z: 3270960.478208567 },
        { x: -1826735.411557694, y: 5155198.665547302, z: 3270956.214032832 },
        { x: -1826728.0909684855, y: 5155203.98116632, z: 3270951.9533918323 },
        { x: -1826720.7674391968, y: 5155209.295549008, z: 3270947.6962868655 },
        { x: -1826713.440972072, y: 5155214.608693739, z: 3270943.4427192323 },
        { x: -1826706.1115693587, y: 5155219.920598893, z: 3270939.1926902253 },
        { x: -1826698.779233308, y: 5155225.231262843, z: 3270934.9462011396 },
        { x: -1826691.4439661717, y: 5155230.540683969, z: 3270930.703253266 },
        { x: -1826684.1057702021, y: 5155235.848860645, z: 3270926.4638478984 },
        { x: -1826676.7646476508, y: 5155241.155791251, z: 3270922.2279863213 },
        { x: -1826669.4206007742, y: 5155246.461474165, z: 3270917.995669828 },
        { x: -1826662.0736318293, y: 5155251.765907767, z: 3270913.7668996975 },
        { x: -1826654.7237430706, y: 5155257.069090438, z: 3270909.5416772235 },
        { x: -1826647.3709367602, y: 5155262.371020555, z: 3270905.3200036823 },
        { x: -1826640.015215156, y: 5155267.671696498, z: 3270901.1018803585 },
        { x: -1826632.6565805196, y: 5155272.971116655, z: 3270896.8873085296 },
        { x: -1826625.2950351117, y: 5155278.269279401, z: 3270892.676289476 },
        { x: -1826617.9305811995, y: 5155283.566183122, z: 3270888.468824474 },
        { x: -1826610.563221047, y: 5155288.861826201, z: 3270884.2649147995 },
        { x: -1826603.1934496614, y: 5155294.157597704, z: 3270880.0654500206 },
        { x: -1826595.8219175953, y: 5155299.455325728, z: 3270875.8716001157 },
        { x: -1826588.4486304417, y: 5155304.755018092, z: 3270871.683372376 },
        { x: -1826581.0735904528, y: 5155310.056673168, z: 3270867.5007680436 },
        { x: -1826573.6967998757, y: 5155315.360289325, z: 3270863.3237883598 },
        { x: -1826566.318260956, y: 5155320.665864936, z: 3270859.152434571 },
        { x: -1826558.9379759475, y: 5155325.973398367, z: 3270854.986707911 },
        { x: -1826551.5559471003, y: 5155331.282887985, z: 3270850.8266096166 },
        { x: -1826544.1721766659, y: 5155336.594332161, z: 3270846.6721409257 },
        { x: -1826536.786666897, y: 5155341.907729262, z: 3270842.523303068 },
        { x: -1826529.3994200467, y: 5155347.223077654, z: 3270838.380097271 },
      ];

      let newList = [];
      list.forEach((element) => {
        var cartographic = ellipsoid.cartesianToCartographic(element);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        newList.push({ lat, lng, alt });
      });
      console.log("转换坐标：", newList);
    },
    // 第一人称漫游
    flyByMine() {},
    // 跟随漫游
    flyByAircraft() {
      let newPositions = this.degreeToCartesian3();
      let ALLLength = this.getPositionsLength(newPositions);
      let eachStep = 0.05;

      //Set the random number seed for consistent results.
      Cesium.Math.setRandomNumberSeed(3);
      //Set bounds of our simulation time
      let start = Cesium.JulianDate.now();
      let stop = Cesium.JulianDate.addSeconds(
        start,
        ALLLength * eachStep,
        new Cesium.JulianDate()
      );

      //Make sure viewer is at the desired time.
      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      this.viewer.clock.multiplier = 1;
      this.viewer.clock.shouldAnimate = true;
      let position = new Cesium.SampledPositionProperty();
      for (let i = 0; i < newPositions.length; i++) {
        let first = Array.from(newPositions);
        let moveArray = first.slice(0, i + 1);
        let moveLength = this.getPositionsLength(moveArray);
        let time = Cesium.JulianDate.addSeconds(
          start,
          moveLength * eachStep,
          new Cesium.JulianDate()
        ); //时间递增
        position.addSample(time, newPositions[i]);
      }
      let entity = this.viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        model: {
          uri: "static/Cesium_Air.glb",
          minimumPixelSize: 1,
          maximumScale: 1,
        },
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position),
      });
      this.viewer.trackedEntity = entity;
    },

    getPositionsLength(centerline_cartesian) {
      let _this = this;
      if (centerline_cartesian && centerline_cartesian.length > 1) {
        let newPosition = centerline_cartesian.map((p) =>
          _this.cartesian2lonlat(p)
        );
        let line = turf.lineString(newPosition);
        let options = { units: "kilometers" };
        let kiloLength = turf.length(line, options);
        return parseFloat(kiloLength * 1000);
      } else {
        return 0;
      }
    },
    cartesian2lonlat(cartesian) {
      let ellipsoid = Cesium.Ellipsoid.WGS84;
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      return [longitudeString, latitudeString];
    },

    // 飞行到A
    flyToA() {
      Sandcastle.declare(this.flyToA);
      var camera = this.viewer.scene.camera;
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          106.51820523894823,
          29.579002467845893,
          363.34038727246224
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-40),
          roll: 0,
        },
        complete: () => {
          setTimeout(() => {
            camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                106.44521054121198,
                29.64221597442077,
                1000
              ),
              //   flyOverLongitude: Cesium.Math.toRadians(60.0),
              orientation: {
                heading: Cesium.Math.toRadians(130.0),
                pitch: Cesium.Math.toRadians(-40.0),
              },
              easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            });
            console.log("当前相机的高度经纬度：", this.get_camera_height());
          }, 1000);
        },
      });
    },
    // 加载模型
    initGltf() {
      var _this = this;
      var url = "static/models/daochu/daochu.gltf";
      //   var url = "static/models/九曲河/九曲河.gltf";
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

    // 漫游路径设置
    setCzmlData() {
      var czmlDataRes = czmlData;
      this.viewer.dataSources
        .add(Cesium.CzmlDataSource.load(czmlDataRes.czmlData))
        .then((ds) => {
          debugger;
          this.viewer.trackedEntity = ds.entities.getById("path");
        });
    },
    // 打点监听
    pointLister() {
      let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      handler.setInputAction((event) => {
        var earthPosition = this.viewer.camera.pickEllipsoid(
          event.position,
          this.viewer.scene.globe.ellipsoid
        );
        if (Cesium.defined(earthPosition)) {
          let ellipsoid = this.viewer.scene.globe.ellipsoid;
          let cartographic = ellipsoid.cartesianToCartographic(earthPosition);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lon = Cesium.Math.toDegrees(cartographic.longitude);
          let params = {
            id: "打点" + lon,
            name: "text",
            lon: lon,
            lat: lat,
          };
          this.AddPoint(params);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    // 官网漫游
    manyou() {
      Sandcastle.addToolbarButton("Vehicle", () => {
        this.viewer.dataSources.add(
          Cesium.CzmlDataSource.load("../static/czml/Vehicle.czml")
        );

        this.viewer.scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
          orientation: {
            heading: 6,
          },
        });
      });
    },

    // 添加点位文本
    AddPoint(params) {
      console.log("dddddddddd", params);
      if (params.lon === undefined || params.lat === undefined) {
        alert("请提供经纬度!");
        return;
      }
      let entity = new Cesium.Entity({
        id: params.id || `${params.lon}点`,
        name: params.name || "点",
        show: true,
        position: Cesium.Cartesian3.fromDegrees(params.lon, params.lat, 0),
        point: new Cesium.PointGraphics({
          show: true,
          pixelSize: params.pixelSize || 5,
          heightReference: params.pixelSize || Cesium.HeightReference.NONE,
          color: new Cesium.Color(243, 243, 9, 1),
          outlineColor: new Cesium.Color(0, 0, 0, 0),
          outlineWidth: params.outlineWidth || 0,
          scaleByDistance:
            params.scaleByDistance || new Cesium.NearFarScalar(0, 1, 5e10, 1),
          translucencyByDistance:
            params.translucencyByDistance ||
            new Cesium.NearFarScalar(0, 1, 5e10, 1),
          distanceDisplayCondition:
            params.translucencyByDistance ||
            new Cesium.DistanceDisplayCondition(0, 4.8e10),
        }),
        label: {
          text: params.id,
          font: "10pt Source Han Sans CN", //字体样式
          fillColor: Cesium.Color.BLACK, //字体颜色
          backgroundColor: Cesium.Color.AQUA, //背景颜色
          showBackground: true, //是否显示背景颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //label样式
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
        },
      });
      this.viewer.entities.add(entity);
      return entity;
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

    // 添加图片
    addImage() {
      var entityImage = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(106.482312, 29.610641, 100),
        billboard: {
          image: require("../assets/tq-logo.jpg"),
          show: true, // default
          pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
          eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
          scale: 2.0, // default: 1.0
          //   color: Cesium.Color.LIME, // default: WHITE
          //   rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
          //   alignedAxis: Cesium.Cartesian3.ZERO, // default
          width: 68, // default: undefined
          height: 23, // default: undefined
        },
      });

      this.viewer.entities.add(entityImage);
    },
  },
};
</script>
<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/images/bg.png) no-repeat center;
  background-size: 100% 100%;
}
.toolbar {
  position: absolute;
  bottom: 0;
  left: 50%;
  color: #ffffff;
}

.html_3d {
  width: 100%;
  height: 100%;
}

.html_2d {
  /* width: 50%;
  height: 100%; */
  /* position: absolute;
  top: 0;
  left: 0; */
}

.html_2d .head {
  width: 100%;
  height: 106px;
  background: url(../assets/images/1.png) no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.html_2d .left {
  width: 38%;
  height: 100%;
  background: url(../assets/images/2.png) no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.html_2d .right {
  width: 38%;
  height: 100%;
  background: url(../assets/images/3.png) no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  right: 0;
}
</style>