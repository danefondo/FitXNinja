<template>
  <router-link class="workout" :to="'/videos/'+workout._id">
    <div class="workoutPreviewContainer">
      <img class="streamPreview" :src="thumbnail" />
      <div class="videoOverlay">
        <!-- <div class="workoutName">{{workout.name}}</div> -->
      </div>
      <div class="live"></div>
      <div class="viewerCount"></div>
    </div>
    <div class="workoutMetaContainer">
      <div class="workoutNameContainer">
        <div class="workoutName">{{workout.name}}</div>
      </div>
      <div class="workoutDescContainer">
        <div class="workoutDesc" v-html="workout.description"></div>
      </div>
      <div class="streamer_profile_container_discover">
        <div class="streamerLevelContainer">
          <div class="streamerStar"></div>
          <div class="streamerLevel"></div>
          <div class="verifiedSign hidden"></div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "WorkoutBox",
  props: ["workout"],
  computed: {
    thumbnail() {
      return `https://img.youtube.com/vi/${this.workout.video_id}/hqdefault.jpg`;
    }
  }
};
</script>

<style>
.workout {
  width: 445px;
  margin: 30px 12px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 15px;
  padding-bottom: 0px;
  border: 1px solid transparent;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: 0.1s ease-in-out;
}

.workout:hover {
  transform: scale(1.015);
  background-color: #191919;
}

.workoutMetaContainer {
  width: 100%;
  max-width: 405px;
  padding: 5px 5px;
  display: flex;
  flex-direction: column;
}

.workoutNameContainer {
  padding: 8px 5px 5px 4px;
  margin-bottom: 5px;
  width: unset;
}

.workoutName {
  font-size: 27px;
  color: white;
}

.workoutDescContainer {
  padding: 0px 5px;
}

.workoutDesc {
  color: #666;
}

img.streamPreview {
  min-height: 232.2px;
  object-fit: cover;
  border-radius: 3px;
}

.workoutPreviewContainer {
  position: relative;
  width: 420px;
  height: 236.2px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: transparent;
}

.streamPreviewMeta {
  height: 48px;
  background-color: #fbfbfb;
  /* z-index: 9999; */
  width: 31%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 2px 11px 0px rgba(10, 0, 70, 0.42);
}

.workoutGroup {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
}

.streamTime {
  padding: 11px 15px;
  font-weight: bold;
  font-size: 24px;
  color: #f4f3ff;
  color: #292295;
}

.streamOldPreviewDateContainer {
  height: 36px;
  background-color: #fbfbfbd4;
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 2px 11px 0px rgba(10, 0, 70, 0.42);
}

.streamOldPreviewDate {
  padding: 6px 5px;
  font-weight: bold;
  font-size: 20px;
  color: #292295c4;
}

.streamOldTime {
  padding: 6px 15px 6px 0px;
  font-weight: bold;
  font-size: 20px;
  color: #292295c4;
}

@media screen and (max-width: 1415px) and (min-width: 1280px) {
  .workout {
    width: 400px !important;
  }

  .workoutPreviewContainer {
    width: 375px !important;
    height: 211px !important;
  }
}

@media screen and (max-width: 1279px) and (min-width: 1185px) {
  .workout {
    width: 375px !important;
    margin: 30px 5px !important;
  }

  .workoutPreviewContainer {
    width: 350px !important;
    height: 196px !important;
  }
}

@media screen and (max-width: 1184px) and (min-width: 950px) {
  .examplesSection__landingPage {
    max-width: 915px !important;
    margin: 0 auto !important;
  }

  .examplesContainer__landingPage {
    width: 100% !important;
  }

  .workouts {
    display: grid !important;
  }

  .workoutGroup {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(475px, 475px)) !important;
    min-width: 80% !important;
  }
}

@media screen and (max-width: 949px) and (min-width: 800px) {
  .examplesSection__landingPage {
    max-width: 785px !important;
    margin: 0 auto !important;
  }

  .examplesContainer__landingPage {
    width: 100% !important;
  }

  .workouts {
    display: grid !important;
  }

  .workoutGroup {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(400px, 400px)) !important;
    min-width: 80% !important;
  }
  .workout {
    width: 375px !important;
    margin: 30px 5px !important;
  }

  .workoutPreviewContainer {
    width: 350px !important;
    height: 196px !important;
  }
}

@media screen and (max-width: 799px) {
  .landingTitleContainer {
    padding-top: 0vh !important;
  }
  .landingTitle {
    font-size: 50px !important;
    max-width: 100vw !important;
    width: 100vw !important;
  }
  .landingTitleColored {
    font-size: 25px !important;
    max-width: 100vw !important;
    width: 80vw !important;
  }
  .examplesSection__landingPage {
    max-width: 100vw !important;
    margin: 0 auto !important;
  }

  .examplesContainer__landingPage {
    width: 100vw !important;
  }

  .workouts {
    display: grid !important;
  }

  .workoutGroup {
    display: flex !important;
    flex-direction: column !important;
    min-width: 100vw !important;
  }
  .workout {
    width: 100vw !important;
    margin: 20px auto 20px auto !important;
    padding: 0px !important;
  }

  .workoutPreviewContainer {
    width: 100vw !important;
    height: 56.24vw !important;
  }

  img.streamPreview {
    height: 56.24vw !important;
    border-radius: unset !important;
  }

  .workoutMetaContainer {
    max-width: 94vw !important;
  }
}
</style>