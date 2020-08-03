<template lang="pug">
	.share-dropdown(ref='dropdown', :class="{'is-expanded': isOpened}")
		.deleteStreamModal(v-if='changingVideo')
			.deleteStreamModalBackground(@click='changingVideo=false')
			.deleteStreamModalWrapper
				.deleteStreamContentWrapper
					.deleteStreamTextContainer
						.deleteStreamModalTitle {{ $t("newworkout.change-video") }}
						.deleteStreamModalBody {{ $t("newworkout.change-desc") }}
					input(v-model="swap_url" class="stream_input stream_name" :placeholder="$t('newworkout.link-placeholder')" max-length="50")
					.action-group
						.button-filled.neon-green(@click='swapWorkoutVideo()') {{ $t("newworkout.change-action") }}
						.cancelDeleteStream.button-outline(@click='changingVideo=false') {{ $t("editvideo.cancel-delete") }}
		.share_options.wide_share(@click='toggleDropdown()') {{isOpened ? "Close more": "More"}}
		nav.Dropdown-nav.SettingsNav.share-links.Dropdown-wide
			ul.Dropdown-group
				li
					router-link.entypo-archive.NavLinkX.copylink(v-if='isLocalWorkout', :to='getLocation()') Return to video
				li
					.entypo-archive.NavLinkX.copylink(@click='changingVideo=true') Change video
					a.entypo-plus.OptionLink(href='#')
				li
					router-link.entypo-archive.NavLinkX.copylink.specialOption(v-if='!user', to='/register') Create an account to save & collect your favorite workouts
</template>

<script>
import axios from "axios";
import auth from "../config/auth";

export default {
  name: "MoreWorkoutOptions",
  props: ["video", "room"],
  data() {
    return {
      isOpened: false,
      linkText: this.$t("watch.copy"),
      inLibrary: false,
      inFavorites: false,
      liked: false,
      isAuthenticated: false,
      user: {},
      changingVideo: false,
      swap_url: "",
      isLocalWorkout: false
    };
  },
  mounted() {
    document.addEventListener("click", this.onClick);
    if (auth.isAuthenticated()) {
      this.user = auth.isAuthenticated();
      this.isAuthenticated = true;
      if (this.video) {
        this.getUserData();
      }
    }
    this.checkIfLocalWorkout();
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
    checkIfLocalWorkout() {
      if (this.$route.query.localvideo && this.room.video_id && this.video) {
        this.isLocalWorkout = true;
      }
    },
    async getUserData() {
      try {
        const { data } = await axios.get(
          `/profile/${this.user._id}/getUserData/${this.video._id}`
        );
        this.inLibrary = data.inLibrary;
        this.inFavorites = data.inFavorites;
      } catch (error) {
        console.log("errFFAIL", error);
      }
    },
    async addRemoveFromLibrary() {
      try {
        this.inLibrary = !this.inLibrary;
        await axios.post(
          `/profile/${this.user._id}/addRemoveFromLibrary/${this.video._id}`
        );
      } catch (error) {
        console.log("err", error);
      }
    },
    async addRemoveFromFavorites() {
      try {
        this.inFavorites = !this.inFavorites;
        await axios.post(
          `/profile/${this.user._id}/addRemoveFromFavorites/${this.video._id}`
        );
      } catch (error) {
        console.log("err", error);
      }
    },
    async swapWorkoutVideo() {
      try {
        let urlData = {};
        urlData.swap_url = this.swap_url;
        const { data } = await axios.post(
          `/workoutRooms/${this.room._id}/swapVideoUrl`,
          urlData
        );
        let youtubeId = data.youtubeId;
        this.swap_url = "";
        this.changingVideo = false;
        this.$emit("emit_video_id", youtubeId);
      } catch (error) {
        console.log("err", error);
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
    },
    getLocation() {
      let location = `/videos/${this.video._id}`;
      return location;
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
  },
  watch: {
    $route() {
      this.getUserData();
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

.Dropdown-wide {
  width: 340px !important;
  border-radius: 2px !important;
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
  margin-right: 0px;
  padding: 10px;
  overflow: hidden;
  width: 320px;
  margin-bottom: 5px;
  /*  min-width: 160px;*/
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.wide_share {
  width: 320px !important;
  background-color: #232323 !important;
  color: #969696 !important;
  transition: unset !important;
  font-size: 20px !important;
  font-weight: unset !important;
  border-radius: 2px !important;
  padding: 7px 10px !important;
  margin-top: 5px !important;
}

.wide_share:hover {
  background-color: #1b1b1b !important;
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
  right: 0px;
}
</style>
