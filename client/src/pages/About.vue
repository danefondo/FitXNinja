<template>
  <div class="footer_page_container">
    <AboutNav />
    <div class="footer_page">
      <div class="frames">
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
      <p
        class="about_text"
      >The founders of FitX Ninja, Robert and Laima, took upon themselves a challenge to build a startup in 30 days to compete in TransferWise&rsquo;s 20Under20 program for young CEOs. The award sum is &pound;25,000 and the application deadline is 30th of June.</p>

      <p
        class="about_text"
      >We gave ourselves 30 days to create, launch and market our startup called FitX Ninja. A platform to make the world of working out more social, fun and enjoyable. Our long-term goal is to create the most fitness beginner, enthusiast and trainer friendly platform.</p>

      <p
        class="about_text"
      >To honor our name and vision, we also decided to challenge ourselves physically in those 30 days and take upon an equivalently long Fitness Challenge to get into the best shape of our lives.</p>

      <p class="about_text">Follow us to join and support us in our journey! Will we make it?</p>

      <p
        class="about_text"
      >30 days to build a startup you'll love. 30 days to do a fitness challenge.</p>
    </div>
  </div>
</template>

<script>
import AboutNav from "../components/AboutNav";

export default {
  name: "About",
  components: {
    AboutNav
  }
};
</script>


<style scoped>

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
.about_text {
  margin-bottom: 15px;
  line-height: 23px;
  padding: 0px 100px;
  text-align: center;
}

p {
  color: #999 !important;
}
.footer_page_container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  font-family: "Trebuchet MS", sans-serif;
}
.footer_page {
  padding: 30px 0px;
  padding-bottom: 40px;
  font-size: 18px !important;
  max-width: 800px;
  margin: 0 auto;
}

/*! CSS Used from: https://www.eeter.tv/css/navigation.css */
.topNavigationLink__topBar {
  border-radius: 4px;
  padding: 12px 16px;
  margin: 0px 6px;
  box-sizing: border-box;
  margin-bottom: 0px;
  border: 1px solid transparent;
}
.topNavigationLink__topBar {
  color: black !important;
  font-weight: bold;
  padding: 10px 16px;
  display: inline-block;
}
.topNavigationLink__topBar:hover {
  background-color: #272727;
}
.nav-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0px 15px;
  background-color: white !important;
  height: 60px;
}
.nav-container a {
  text-decoration: none;
}
/*! CSS Used from: https://www.eeter.tv/css/responsive.css */
@media screen and (max-width: 480px) {
  .nav-container {
    padding: 10px 0px;
    flex-wrap: wrap;
  }
  .navlinks-container {
    margin-left: 10px;
  }
  .topNavigationLink__topBar {
    padding: 10px 6px;
    margin: 0px 4px;
  }
}
/*! CSS Used from: https://www.eeter.tv/css/streaming.css */
.nav-container {
  padding-top: 0px;
}
.auto-side-margins {
  margin-left: auto;
  margin-right: auto;
}
</style>
