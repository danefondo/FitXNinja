<template>
  <div class="contentArea">
    <div class="registration-block">
      <img class="fitxlogo" src="../assets/images/fitxbigblacklogo.png" />
      <div class="discovery_section">
        <div class="examplesSection__landingPage">
          <div class="examplesContainer__landingPage">
            <div class="examplesTitle__landingPage">Full body workouts</div>
          </div>
        </div>
        <div v-if="workouts" class="streams">
          <div class="streamGroup">
            <WorkoutBox v-for="workout in workouts" :key="workout._id" :workout="workout" />
          </div>
        </div>
      </div>
      <div class="discovery_section">
        <div class="examplesSection__landingPage">
          <div class="examplesContainer__landingPage">
            <div class="examplesTitle__landingPage">Cardio</div>
          </div>
        </div>
        <div v-if="workouts" class="streams">
          <div class="streamGroup">
            <WorkoutBox v-for="workout in cardioWorkouts" :key="workout._id" :workout="workout" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import WorkoutBox from "../components/WorkoutBox";

export default {
  name: "Scheduled",
  data() {
    return {
      workouts: {},
      cardioWorkouts: {},
      warmUps: {}
    };
  },
  components: {
    WorkoutBox
  },
  async mounted() {
    try {
      console.log("umxxxx");
      const { data } = await axios.get(`/workoutVideos/getAll`);
      console.log("ddd", data);
      this.workouts = data.videos;
    } catch (error) {
      console.log("error", error);
    }
  }
};
</script>

<style scoped>

.examplesContainer__landingPage {
  margin-bottom: unset;
}
.examplesTitle__landingPage {
  color: black;
  font-size: 55px;
}
.nav-container {
  background-color: #111 !important;
}

.registration-block {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 0px;
}

.fitxlogo {
  width: 280px;
  margin: 0 auto;
  margin-top: -10px;
  margin-bottom: 20px;
}

.container {
  background-color: #111 !important;
}

.framevideo {
  border-radius: 30px;
}

.frame {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.frame {
  position: relative;
  width: 70%;
  padding-bottom: 39.25%;
  height: 0;
  margin-bottom: 50px;
}
.frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.featured_streamer_description_container_discover span,
.scheduled_stream_description span {
  background-color: transparent !important;
  color: inherit !important;
}

.stream {
  padding-top: 20px;
}

.streamGroup {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.dateGroups {
  margin-top: 40px;
}

.dateGroup {
  padding-bottom: 20px;
}

.dateGroupTitle {
  text-transform: capitalize;
  margin-left: 30px;
  font-size: 36px;
  font-weight: 600;
  color: #120088e3;
}
</style>
