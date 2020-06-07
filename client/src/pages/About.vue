<template>
  <div class="footer_page_container">
    <AboutNav />
    <div class="footer_page">
      <p>The founders of FitX Ninja, Robert and Laima, took upon themselves a challenge to build a startup in 30 days to compete in TransferWise&rsquo;s 20Under20 program for young CEOs. The award sum is &pound;25,000 and the application deadline is 30th of June.</p>

      <p>We gave ourselves 30 days to create, launch and market our startup called FitX Ninja. A platform to make the world of working out more social, fun and enjoyable. Our long-term goal is to create the most fitness beginner, enthusiast and trainer friendly platform.</p>

      <p>To honor our name and vision, we also decided to challenge ourselves physically in those 30 days and taken upon an equivalently long Fitness Challenge to get into the best shape of our lives.</p>

      <p>Follow us to join and support us in our journey! Will we make it?</p>

      <p>30 days to build a startup you'll love. 30 days to do a fitness challenge.</p>
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

p {
  color: white !important;
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
  max-width: 600px;
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
  color: #120088;
  font-weight: bold;
  padding: 10px 16px;
  display: inline-block;
}
.topNavigationLink__topBar:hover {
  background-color: #f5f5f5;
}
.nav-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0px 15px;
  background-color: #111;
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
.active-about {
  background-color: #f7f7fb;
}
</style>
