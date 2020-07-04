<template>
  <div class="contentArea">
    <div class="registration-block">
      <!-- <img class="fitxlogo" src="../assets/images/fitxbigblacklogo.png" /> -->
      <div class="landingTitleContainer cd-words-wrapper">
        <div class="landingTitle">Exercise with friends.</div>
        <div class="landingTitleColored">Because it's better together</div>
        <div class="landingSubtitle">Co-workouts over video calls to the best YouTube workout videos</div>
      </div>
      <!-- <div class="landingTitleContainer cd-words-wrapper">
        <div class="landingTitle">First time?</div>
        <div class="landingTitleColored">Here's how it works</div>
        <div class="landingSubtitle">Co-workouts over video calls to the best YouTube workout videos</div>
      </div> -->
      <!-- <router-link to="/register" class="signupPageLink">{{$t("home.join")}}</router-link> -->
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
.landingTitleContainer {
  margin: auto;
  text-align: center;
  padding: 20px;
  padding-left: 0px;
  padding-top: 110px;
  padding-bottom: 110px;
}
.landingTitle {
  font-size: 100px;
  margin-bottom: 25px;
  font-weight: 600;
  max-width: 1050px;
  display: inline-block;
  color: white;
}

.landingTitleColored {
  font-size: 60px;
  font-weight: 600;
  max-width: 1050px;
  display: inline-block;
  /* background-color: #04ffe740; */
  background-color: #04ffe7f5;
  margin-left: 18px;
}

.landingSubtitle {
  font-size: 28px;
  font-weight: 400;
  color: #afafaf;
  max-width: 800px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
}

.examplesContainer__landingPage {
  margin-bottom: unset;
  width: 1362px;
  margin: 0 auto;
}
.examplesTitle__landingPage {
  color: #bdbdbd;
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
  width: unset !important;
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

.streams {
  max-width: unset !important;
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

@media screen and (max-width: 1415px) and (min-width: 1280px) {
  .examplesContainer__landingPage {
    width: 1240px;
  }
}

@media screen and (max-width: 1279px) and (min-width: 1185px) {
  .examplesContainer__landingPage {
    width: 1140px;
  }
}


@media screen and (max-width: 1184px) and (min-width: 800px) {
  .examplesContainer__landingPage {
    width: 1100px;
  }
}

</style>
