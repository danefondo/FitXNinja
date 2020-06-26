<template>
  <div ref="dropdown" class="share-dropdown" :class="{'is-expanded': isOpened}">
    <div class="share_options" @click="toggleDropdown()">{{isOpened ? "Close options": "Options"}}</div>
    <nav class="Dropdown-nav SettingsNav share-links">
      <ul class="Dropdown-group">
        <!-- <li>
          <a :href="buildFbShare" target="_blank" class="entypo-newspaper NavLinkX">Facebook</a>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>
        <li>
          <a :href="buildTwitterShare" target="_blank" class="entypo-archive NavLinkX">Twitter</a>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>-->
        <li>
          <div
            v-if="user"
            @click="copyLink()"
            class="entypo-archive NavLinkX copylink"
          >{{inLibrary ? "Remove from library" : "Add to library"}}</div>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>
        <li>
          <div
            v-if="user"
            @click="copyLink()"
            class="entypo-archive NavLinkX copylink"
          >Add to favorites</div>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>
        <!-- <li>
          <div @click="copyLink()" class="entypo-archive NavLinkX copylink">Add to new collection</div>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>
        <li>
          <div @click="copyLink()" class="entypo-archive NavLinkX copylink">Add to existing collection</div>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>-->
        <li>
          <div @click="copyLink()" class="entypo-archive NavLinkX copylink">{{ linkText }}</div>
          <a class="entypo-plus OptionLink" href="#"></a>
        </li>
        <li>
          <router-link
            v-if="!user"
            to="/register"
            class="entypo-archive NavLinkX copylink specialOption"
          >Create an account to save & collect your favorite workouts</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "VideoOptions",
  props: ["video", "user"],
  data() {
    return {
      isOpened: false,
      linkText: this.$t("watch.copy"),
      inLibrary: false,
      liked: false
    };
  },
  mounted() {
    document.addEventListener("click", this.onClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClick);
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
    onClick(e) {
      const dropdownRef = this.$refs.dropdown;
      if (
        dropdownRef &&
        dropdownRef !== e.target &&
        !dropdownRef.contains(e.target) &&
        this.isOpened
      ) {
        this.toggleDropdown();
      }
    },
    copyLink() {
      var input = document.createElement("textarea");
      input.innerHTML = window.location.href;
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand("copy");
      document.body.removeChild(input);
      this.linkText = this.$t("watch.copied");
      setTimeout(() => {
        this.linkText = this.$t("watch.copy");
      }, 2000);
      return result;
    }
  },
  computed: {
    buildFbShare() {
      let currentBase = window.location.origin;
      console.log("cb", currentBase);
      let fbLink = `https://www.facebook.com/sharer/sharer.php?u=${currentBase}/videos/${this.video._id}`;
      return fbLink;
    },
    buildTwitterShare() {
      let currentBase = window.location.origin;
      let twitterLink = `https://twitter.com/home?status=${currentBase}/videos/${this.video._id}`;
      return twitterLink;
    }
  }
};
</script>

<style scoped>
.specialOption {
  height: unset !important;
  background-color: #f9f9f9 !important;
  border-radius: 3px !important;
  color: orange !important;
  font-size: 15px !important;
  font-weight: bold !important;
  line-height: 23px !important;
}
.specialOption:hover {
    color: rgba(255, 166, 0, 0.712) !important;
}

.Dropdown-nav {
  width: 290px;
  margin-top: 0px;
}

.copylink {
  color: #666;
  -webkit-transition: color 0.3s ease;
  -moz-transition: color 0.3s ease;
  transition: all 0.3s;
  cursor: pointer;
}

.copylink:hover {
  color: #1e323c;
}

.share-dropdown.is-expanded nav {
  visibility: visible;
  opacity: 1;
}

.share_options {
  /*border: 2px solid #eee;*/
  /*  box-shadow: 3px 3px 0px 0px #eee;*/
  cursor: pointer;
  /*  margin-right: 10px;*/
  margin-right: 15px;
  padding: 10px;
  overflow: hidden;
  width: 270px;
  margin-bottom: 5px;
  /*  min-width: 160px;*/
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.share_dropdown.is-expanded .MenuIcon-line:nth-child(1) {
  top: 50%;
}
.share_dropdown.is-expanded .MenuIcon-line:nth-child(3) {
  top: 50%;
}

.share-dropdown {
  position: relative;
}

.share-links {
  position: absolute;
  right: 15px;
}
</style>
