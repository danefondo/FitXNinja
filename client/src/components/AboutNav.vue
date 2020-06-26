<template>
  <div class="nav-container-about auto-side-margins">
    <div class="navlinks-container">
      <router-link
        to="/about"
        :class="[checkActive('about'), 'topNavigationLink__topBar__about']"
      >{{$t("footer.about")}}</router-link>
      <!-- <router-link
        to="/privacy"
        :class="[checkActive('privacy'), 'topNavigationLink__topBar']"
      >{{$t("footer.privacy")}}</router-link>
      <router-link
        to="/terms"
        :class="[checkActive('terms'), 'topNavigationLink__topBar']"
      >{{$t("footer.terms")}}</router-link>-->
      <router-link
        to="/contact"
        :class="[checkActive('contact'), 'topNavigationLink__topBar__about']"
      >{{$t("footer.contact")}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutNav",
  // data() {
  //     return {
  //         isActive: 'active-about',
  //     };
  // },
  // computed: {
  //     currentPage() {
  //         return this.$route.path;
  //     }
  // },
  methods: {
    checkActive(page) {
      return this.$route.path.includes(page) ? "active-about" : "";
    }
  }
};
</script>

<style scoped>
.nav-container-about {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0px 15px;
  background-color: white;
  height: 60px;
  padding-top: 0px;
}

.topNavigationLink__topBar__about {
font-weight: bold;
    padding: 10px 16px;
    display: inline-block;
border-radius: 4px;
    margin: 0px 6px;
    box-sizing: border-box;
    margin-bottom: 0px;
    border: 1px solid transparent;
}

.topNavigationLink__topBar__about:hover {
  background-color: #f5f5f5;
}
</style>