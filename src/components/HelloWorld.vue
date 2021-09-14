<template>
  <div id="cesiumContainer"></div>
</template>
<script>
import * as Cesium from "cesium/Cesium";
import { addToolbarButton, declare } from "@/assets/Sandcastle-header";
import "cesium/Widgets/widgets.css";
import czmlData from "@/assets/js/czmlPath.js";
export default {
  name: "HelloWorld",
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNTUwOTMxNS1jNjhmLTRiM2MtYTdlMi0wYzYzMDY3YWI4NDkiLCJpZCI6NjE3MTcsImlhdCI6MTYyNjMxMjEzOX0.B0lgtVKkGd_RK-snHBqDf_4VdBrjwk9YiyJWJRkm79U";
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain(),
      baseLayerPicker: false,
      shouldAnimate: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
    });

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        106.48289044313123,
        29.61231013622676,
        100.0
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-40),
        roll: 0,
      },
    });

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    //Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);

    //Set bounds of our simulation time
    var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    var stop = Cesium.JulianDate.addSeconds(
      start,
      360,
      new Cesium.JulianDate()
    );

    this.viewer.clock.startTime = start.clone();
    this.viewer.clock.stopTime = stop.clone();
    this.viewer.clock.currentTime = start.clone();
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    this.viewer.clock.multiplier = 10;

    this.viewer.timeline.zoomTo(start, stop);

    var _this = this;
    function computeCirclularFlight(lon, lat, radius) {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i <= 360; i += 45) {
        var radians = Cesium.Math.toRadians(i);
        var time = Cesium.JulianDate.addSeconds(
          start,
          i,
          new Cesium.JulianDate()
        );
        var position = Cesium.Cartesian3.fromDegrees(
          lon + radius * 1.5 * Math.cos(radians),
          lat + radius * Math.sin(radians),
          Cesium.Math.nextRandomNumber() * 500 + 1750
        );
        property.addSample(time, position);
        //Also create a point for each sample we generate.
        _this.viewer.entities.add({
          position: position,
          point: {
            pixelSize: 8,
            color: Cesium.Color.TRANSPARENT,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3,
          },
        });
      }
      return property;
    }

    var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);

    var entity = _this.viewer.entities.add({
      //Set the entity availability to the same interval as the simulation time.
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: start,
          stop: stop,
        }),
      ]),

      //Use our computed positions
      position: position,

      //Automatically compute orientation based on position movement.
      orientation: new Cesium.VelocityOrientationProperty(position),

      //Load the Cesium plane model to represent the entity
      model: {
        uri: "static/Cesium_Air.glb",
        minimumPixelSize: 64,
      },

      //Show the path as a pink line sampled in 1 second increments.
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.YELLOW,
        }),
        width: 10,
      },
    });

    _this.viewer.trackedEntity = undefined;
    _this.viewer.zoomTo(
      _this.viewer.entities,
      new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90))
    );
  },
  methods: {},
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
