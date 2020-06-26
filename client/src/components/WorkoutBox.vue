<template>
  <router-link class="stream" :to="'/videos/'+workout._id">
    <div class="streamPreviewContainer">
      <img class="streamPreview" :src="thumbnail" />
      <div class="live"></div>
      <div class="viewerCount"></div>
    </div>
    <div class="streamMetaContainer">
      <div class="streamNameContainer">
        <div class="streamName">{{workout.name}}</div>
      </div>
      <!-- <div class="streamTags">
        <div v-for="(tag, index) in stream.stream_tags" :key="index" class="streamTag">{{tag}}</div>
      </div>-->
      <div class="streamer_profile_container_discover">
        <!-- <div class="streamer_profile_image_container">
          <img class="streamer_profile_icon_discover" :src="profileImage" />
        </div>-->
        <div class="streamerLevelContainer">
          <div class="streamerStar"></div>
          <div class="streamerLevel"></div>
          <div class="verifiedSign hidden"></div>
        </div>
        <!-- <div class="streamer_name_container_discover">
          <p
            class="streamer_firstname_discover"
          >{{stream.streamer.firstname || stream.streamer.username}}</p>
          <p
            v-if="stream.streamer.firstname && stream.streamer.lastname"
            class="streamer_lastname_discover"
          >{{ stream.streamer.lastname }}</p>
        </div>-->
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
  },
};
</script>

<style>
.streamPreviewContainer {
  position: relative;
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
</style>