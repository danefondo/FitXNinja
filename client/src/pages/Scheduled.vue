<template>
  <div class="contentArea">
    <div v-if="!isAuthenticated" class="registration-block">
      <img class="fitxlogo" src="../assets/images/fitxbiglogo.png" />
      <div class="frame">
        <iframe
          class="framevideo"
          width="760"
          height="427"
          style="margin-bottom:40px !important;"
          src="https://www.youtube.com/embed/ctVKbsPlHc0"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="frame">
        <iframe
          class="framevideo"
          width="760"
          height="427"
          src="https://www.youtube.com/embed/7k7DmdowKaQ"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Scheduled"
};
</script>

<style scoped>
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
