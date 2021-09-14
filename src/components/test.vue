<template>
  <div class="fullSize" id="cesiumContainer"></div>
</template>
<script>
import "cesium/Widgets/widgets.css";

import Cesium from "cesium/Cesium";

// import CesiumFactory from "@/js/cesium/CesiumFactory";

import PolylineTrailMaterialProperty from "@/js/PolylineTrailMaterialProperty";

export default {
  name: "CesiumDynamicLine1",

  data() {
    return {
      viewer: null,
    };
  },

  mounted() {
    const factory = new CesiumFactory();

    this.viewer = factory.getViewer();

    this.create();
  },

  methods: {
    create() {
      //创建射线

      var data = {
        center: {
          id: 0,

          lon: 114.302312702,

          lat: 30.598026044,

          size: 20,

          color: Cesium.Color.PURPLE,
        },

        points: [
          {
            id: 1,

            lon: 115.028495718,

            lat: 30.200814617,

            color: Cesium.Color.YELLOW,

            size: 15,
          },

          {
            id: 2,

            lon: 110.795000473,

            lat: 32.638540762,

            color: Cesium.Color.RED,

            size: 15,
          },

          {
            id: 3,

            lon: 111.267729446,

            lat: 30.698151246,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 4,

            lon: 112.126643144,

            lat: 32.058588576,

            color: Cesium.Color.GREEN,

            size: 15,
          },

          {
            id: 5,

            lon: 114.885884938,

            lat: 30.395401912,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 6,

            lon: 112.190419415,

            lat: 31.043949588,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 7,

            lon: 113.903569642,

            lat: 30.93205405,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 8,

            lon: 112.226648859,

            lat: 30.367904255,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 9,

            lon: 114.86171677,

            lat: 30.468634833,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 10,

            lon: 114.317846048,

            lat: 29.848946148,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 11,

            lon: 113.371985426,

            lat: 31.70498833,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 12,

            lon: 109.468884533,

            lat: 30.289012191,

            color: Cesium.Color.BLUE,

            size: 15,
          },

          {
            id: 13,

            lon: 113.414585069,

            lat: 30.368350431,

            color: Cesium.Color.SALMON,

            size: 15,
          },

          {
            id: 14,

            lon: 112.892742589,

            lat: 30.409306203,

            color: Cesium.Color.WHITE,

            size: 15,
          },

          {
            id: 15,

            lon: 113.16085371,

            lat: 30.667483468,

            color: Cesium.Color.SALMON,

            size: 15,
          },

          {
            id: 16,

            lon: 110.670643354,

            lat: 31.74854078,

            color: Cesium.Color.PINK,

            size: 15,
          },
        ],

        options: {
          name: "",

          polyline: {
            width: 2,

            material: [Cesium.Color.GREEN, 3000],
          },
        },
      };

      this.createFlyLines(data);
    },

    createFlyLines(data) {
      const center = data.center;

      const cities = data.points;

      const startPoint = Cesium.Cartesian3.fromDegrees(
        center.lon,

        center.lat,

        0
      ); //中心点

      this.viewer.entities.add({
        position: startPoint,

        point: {
          pixelSize: center.size,

          color: center.color,
        },
      }); //大批量操作时，临时禁用事件可以提高性能

      this.viewer.entities.suspendEvents(); //散点

      cities.map((city) => {
        let material = new Cesium.PolylineTrailMaterialProperty({
          color: Cesium.Color.GREEN,

          duration: 3000,

          trailImage: "images/colors1.png",
        });

        const endPoint = Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 0);

        this.viewer.entities.add({
          position: endPoint,

          point: {
            pixelSize: city.size - 10,

            color: city.color,
          },
        });

        this.viewer.entities.add({
          polyline: {
            positions: this.generateCurve(startPoint, endPoint),

            width: 2,

            material: material,
          },
        });
      });

      this.viewer.entities.resumeEvents();

      this.viewer.flyTo(this.viewer.entities);
    } /**

    * 生成流动曲线

    * @param startPoint 起点

    * @param endPoint 终点

    * @returns {Array}

    */,

    generateCurve(startPoint, endPoint) {
      let addPointCartesian = new Cesium.Cartesian3();

      Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);

      let midPointCartesian = new Cesium.Cartesian3();

      Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);

      let midPointCartographic =
        Cesium.Cartographic.fromCartesian(midPointCartesian);

      midPointCartographic.height =
        Cesium.Cartesian3.distance(startPoint, endPoint) / 5;

      let midPoint = new Cesium.Cartesian3();

      Cesium.Ellipsoid.WGS84.cartographicToCartesian(
        midPointCartographic,

        midPoint
      );

      let spline = new Cesium.CatmullRomSpline({
        times: [0.0, 0.5, 1.0],

        points: [startPoint, midPoint, endPoint],
      });

      let curvePoints = [];

      for (let i = 0, len = 200; i < len; i++) {
        curvePoints.push(spline.evaluate(i / len));
      }

      return curvePoints;
    },
  },
};
</script>
