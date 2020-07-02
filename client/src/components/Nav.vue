<template lang="pug">
	.nav-container(:class="isAuthenticated ? 'authNav' : 'notAuthNav'")
		.deleteStreamModal(v-if='startWorkoutModal')
			.deleteStreamModalBackground(@click='startWorkoutModal=false')
			.deleteStreamModalWrapper
				.deleteStreamContentWrapper
					.deleteStreamTextContainer
						.deleteStreamModalTitle {{ $t("newworkout.video-url") }}
						.deleteStreamModalBody {{ $t("newworkout.start-custom") }}
					input(v-model="custom_url" class="stream_input stream_name" :placeholder="$t('newworkout.link-placeholder')" max-length="50")
					.action-group
						.button-filled.neon-green(@click='startCustomWorkout') {{ $t("newworkout.start-workout") }}
						.cancelDeleteStream.button-outline(@click='startWorkoutModal=false') {{ $t("editvideo.cancel-delete") }}
		.title-container
			router-link(to='/')
				img.fitxlogosmall(:src='ninjaImage')
			// <router-link class="title-btn" to="/">FitX Ninja</router-link>
		.navlinks-container
			router-link.topNavigationLink__topBar.desktopSize(to='/scheduled') Discover
			router-link.topNavigationLink__topBar(to='/discover') Browse
			template(v-if='isAuthenticated')
				.stream_buttons.desktopSize
					router-link.go_live_button.isOnAir(v-if='user.is_live && user.active_stream_id', :to="'/watch/' + user.active_stream_id") {{ $t("nav.is-live") }}
					.go_live_button.goOnAir(v-if="!isWorkoutRoom" @click='startWorkoutModal=true') Start a workout
				.logout-container(:class="isAuthenticated ? 'authProfile' : 'notAuthProfile'")
					.DropdownX(ref='dropdown', @click='toggleDropdown()', :class="{'is-expanded': isOpened}")
						.Dropdown-profile
							.Photo
								svg(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 30 30')
									path(style='fill:#00ffe7; text-indent:0;text-align:start;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans', d='M 16 5 C 12.145852 5 9 8.1458513 9 12 C 9 14.408843 10.23116 16.55212 12.09375 17.8125 C 8.5266131 19.342333 6 22.881262 6 27 L 8 27 C 8 22.569334 11.569334 19 16 19 C 20.430666 19 24 22.569334 24 27 L 26 27 C 26 22.881262 23.473387 19.342333 19.90625 17.8125 C 21.76884 16.55212 23 14.408843 23 12 C 23 8.1458513 19.854148 5 16 5 z M 16 7 C 18.773268 7 21 9.2267317 21 12 C 21 14.773268 18.773268 17 16 17 C 13.226732 17 11 14.773268 11 12 C 11 9.2267317 13.226732 7 16 7 z', color='#000', overflow='visible', font-family='Bitstream Vera Sans')
							#5e770037c84aaa1088d5315c.userId
						nav.Dropdown-nav.SettingsNav
							ul.Dropdown-group
								li.dropLive
									.go_live_button.goOnAir(v-if="!isWorkoutRoom" @click='startWorkoutModal=true') Start a workout
									a.entypo-plus.OptionLink(href='#')
								li
									router-link.entypo-newspaper.NavLinkX(:to='myProfile') {{$t("nav.profile")}}
									a.entypo-plus.OptionLink(href='#')
								li(v-if='user.superadmin')
									router-link.entypo-archive.NavLinkX(to='/master') {{$t("admin.superadmin")}}
									a.entypo-plus.OptionLink(href='#')
								//- li
								//- 	router-link.entypo-archive.NavLinkX(to='/manage-streams') {{$t("nav.manage-streams")}}
								//- 	a.entypo-plus.OptionLink(href='#')
								li
									router-link.entypo-archive.NavLinkX(to='/settings') {{$t("nav.settings")}}
									a.entypo-plus.OptionLink(href='#')
								li
									a.entypo-logout.NavLinkX(@click='logout') {{$t("nav.logout")}}
			template(v-else='')
				.stream_buttons
					.go_live_button.goOnAir.white-button(v-if="!isWorkoutRoom" @click='startWorkoutModal=true') Start a workout
					router-link.go_live_button.login-nav.login-responsive(to='/login') {{$t("nav.login")}}
					router-link.go_live_button(to='/register') {{$t("nav.register")}}
		.stream_buttons.mobileSize(v-if='isAuthenticated')
			router-link.go_live_button.isOnAir(v-if='user.is_live && user.active_stream_id', :to="'/watch/' + user.active_stream_id") {{ $t("nav.is-live") }}
			router-link.go_live_button.goOnAir(v-if='!user.is_live', to='/golive') {{ $t("nav.go-live") }}
</template>

<script>
import auth from "../config/auth";
import axios from "axios";
import { setTempToken } from "../config/axios";
import ninjaIcon from "../assets/images/whiteninjalogo.png";

export default {
  name: "Nav",
  data() {
    return {
      isOpened: false,
      startWorkoutModal: false,
      custom_url: "",
      isWorkoutRoom: false
    };
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  mounted() {
    document.addEventListener("click", this.onClick);
    this.checkIfWorkoutRoom();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClick);
  },
  computed: {
    myProfile() {
      return `/profile/${this.user._id}`;
    },
    ninjaImage() {
      return ninjaIcon;
    }
  },
  methods: {
    getYoutubeId(url) {
      url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      return url[2] !== undefined ? url[2].split(/[^0-9a-z_-]/i)[0] : url[0];
    },
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
    async startCustomWorkout() {
      try {
        let roomData = {};
        if (this.user && this.user._id) {
          roomData.host_id = this.user._id;
        }
        let url = this.custom_url;
        url = url.replace(/ /g, "");
        roomData.video_url = url;
        roomData.youtube_id = this.getYoutubeId(url);
        roomData.date_created = new Date();
        const result = await axios.post(`workoutRooms/createNewRoom`, roomData);
        console.log("res", result);
        this.startWorkoutModal = false;
        this.custom_url = "";
        setTempToken(result.data.tempToken);
        localStorage.tempHost = JSON.stringify(result.data.tempHost);
        this.$router.push(`/rooms/${result.data.room._id}`);
      } catch (error) {
        console.log("error", error);
      }
    },
    checkIfWorkoutRoom() {
      console.log("yoo", window.location.href);
      if (window.location.href.indexOf("rooms") > -1) {
        this.isWorkoutRoom = true;
        return true;
      } else {
        this.isWorkoutRoom = false;
        return false;
      }
    },
    logout() {
      auth.logout();
    }
  },
  watch: {
    $route() {
      this.checkIfWorkoutRoom();
    }
  }
};
</script>

<style>
.stream_input {
  width: 275px;
}

.white-button {
  background-color: white !important;
}

.white-button:hover {
  background: #ccc !important;
}

.neon-green {
  margin-right: 12px;
  color: #000 !important;
  background-color: #00ffe7 !important;
}

.neon-green:hover {
  background-color: #00ffe5a9 !important;
}

.Dropdown-profile:hover {
  background-color: #272727;
}

.fitxlogosmall {
  width: 32px;
}
.dropLive {
  display: none;
  background-color: #130088;
  color: white;
  font-weight: 600;
  border-radius: 2px;
}

.mobileSize {
  display: none;
}

.DropdownX.is-expanded nav {
  visibility: visible;
  opacity: 1;
}
.navlinks-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
}

.login-nav {
  color: #00ffe7;
  background-color: transparent;
}

.login-nav:hover {
  color: black !important;
  background-color: #f5f5f5;
}
</style>
