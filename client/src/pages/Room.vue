<template lang="pug">
	NotFoundStream(v-if='roomNotFound')
	.special-container(v-else-if='room')
		.watch
			.host-bar
				.is_host {{userIsHost ? 'You are the HOST!' : 'You are currently not a host.'}}
			.watch-area
				.video-core
					.video-container
						.video-block.video
							youtube(:video-id='videoId', ref='youtube', width='840px' height='472px' :player-vars="playerVars" @playing='playing' @paused='paused' @ended='ended' @buffering='buffering')
				.video-sidebar(style="margin-top:unset; padding-top:40px")
					.video-actions
						.video-action-group
							.video-start-workout.wider(v-if="videoUnstarted" @click='playVideo') Start
							.video-start-workout.wider(v-if="!videoPlaying && !videoUnstarted" @click='playVideo') Play
							.video-start-workout.wider(v-if="videoPlaying" @click='pauseVideo') Pause
							.video-control-workout.reset(v-if="!videoUnstarted && userIsHost" @click='resetVideo') Reset
							.video-control-workout.set(v-if="!videoUnstarted && userIsHost" @click='setTheTime') Set time
							.video-copy-link(@click="copyLink()") {{linkText}}
					Session(v-if="sessionId && apiKey && token" :sessionId="sessionId" :apiKey="apiKey" :token="token")
					MoreWorkoutOptions(v-if="video && room && userIsHost" :video="video" :room="room" @emit_video_id="updateVideoId")
					MoreWorkoutOptions(v-else-if="!video && room && userIsHost" :room="room" @emit_video_id="updateVideoId")
</template>

<script>
import axios from "axios";
import auth from "../config/auth";
import NotFoundStream from "../components/NotFoundStream";
import MoreWorkoutOptions from "../components/MoreWorkoutOptions";
import Session from "../components/Session";

export default {
	name: "Room",
	components: {
		NotFoundStream,
		MoreWorkoutOptions,
		Session,
	},
	data() {
		return {
			video: null,
			room: null,
			roomId: null,
			roomNotFound: false,
			streamNotFound: false,
			isAuthenticated: false,
			user: {},
			tempHost: {},
			hostPresent: false,
			userIsHost: false,
			connection: null,
			title: "initial yo",
			isConnected: false,
			socketMessage: "",
			//   player: null,
			videoId: null,
			videoUnstarted: true,
			videoPlaying: false,
			videoPaused: false,
			videoBuffering: false,
			linkText: this.$t("watch.copy"),
			playerVars: {
				start: 0,
			},
			sessionId: "",
			apiKey: "",
			token: "",
		};
	},
	mounted() {
		console.log("routess", this.$route);
		if (auth.isAuthenticated()) {
			this.user = auth.isAuthenticated();
			this.isAuthenticated = true;
			this.getRoom();
		} else {
			this.getRoom();
		}

		this.sockets.listener.subscribe("playVideo", (data) => {
			console.log("time", data);
			this.player.playVideo();
			if (!this.videoUnstarted) {
				this.player.seekTo(data.playTime);
			}
		});

		this.sockets.listener.subscribe("pauseVideo", (data) => {
			console.log("data", data);
			this.pauseVideo();
		});

		this.sockets.listener.subscribe("resetVideo", (data) => {
			console.log("data", data);
			this.resetVideo();
		});

		this.sockets.listener.subscribe("setVideoTime", (data) => {
			console.log("time", data);
			this.setNewTime(data.playTime);
		});

		// this.sockets.listener.subscribe("bufferingVideo", data => {
		//   console.log("data", data);
		// });

		this.sockets.listener.subscribe("reloadVideo", (data) => {
			console.log("data", data);
			this.reloadVideo();
		});
	},
	methods: {
		async playVideo() {
			await this.player.playVideo();
		},
		async pauseVideo() {
			await this.player.pauseVideo();
		},
		async resetVideo() {
			await this.player.seekTo(0);

			if (this.userIsHost) {
				let roomData = {
					room_id: this.roomId,
				};
				this.$socket.emit("reset", roomData);
			}

			this.videoBuffering = false;
		},
		async setTheTime() {
			let playTime = await this.player.getCurrentTime();
			console.log("time", playTime);
			if (this.userIsHost) {
				let roomData = {
					room_id: this.roomId,
					playTime: playTime,
				};
				this.$socket.emit("setTime", roomData);
			}
		},
		async setNewTime(time) {
			await this.player.seekTo(time);
		},
		async getTheTime() {
			let playTime = await this.player.getCurrentTime();
			let roomData = {
				room_id: this.roomId,
				playTime: playTime,
			};
			this.$socket.emit("play", roomData);
		},
		playing() {
			console.log("o/ we are watching!!!");
			if (this.videoUnstarted) {
				this.player.seekTo(0);
			}
			this.videoUnstarted = false;
			this.videoPlaying = true;
			this.videoPaused = false;
			this.videoBuffering = false;
			//- SHARE HOST CONTROLS
			if (this.userIsHost) {
				if (!this.videoUnstarted) {
					this.getTheTime();
				} else {
					let roomData = {
						room_id: this.roomId,
						playTime: 0,
					};
					this.$socket.emit("play", roomData);
				}
			}
		},
		paused() {
			console.log("o/ we are paused!!!");
			this.videoPlaying = false;
			this.videoPaused = true;
			this.videoBuffering = false;
			if (this.userIsHost) {
				let roomData = {
					room_id: this.roomId,
				};
				this.$socket.emit("pause", roomData);
			}
		},
		ended() {
			console.log("endeeed");
		},
		buffering() {
			console.log("buufffeerin");
			this.videoBuffering = true;
		},
		updateVideoId(youtubeId) {
			console.log("eeve", youtubeId);
			if (this.userIsHost) {
				let roomData = {
					room_id: this.roomId,
				};
				this.$socket.emit("updateUrl", roomData);
				this.reloadVideo();
			}
			// this.videoId = youtubeId;
			// this.player.loadVideoById(this.videoId);
		},
		reloadVideo() {
			location.reload();
		},
		// pingServer() {
		//   this.$socket.emit("message", "hello");
		// },
		async getRoom() {
			try {
				const { data } = await axios.get(
					`/workoutRooms/${this.$route.params.id}`
				);
				this.videoId = data.room.youtube_id;
				this.room = data.room;
				this.roomId = data.room._id;
				this.roomNotFound = false;
				this.sessionId = data.sessionId;
				this.apiKey = data.apiKey;
				this.token = data.token;
				if (this.room.video_id) {
					//- In other case, it's a custom version, no workout video on our platform
					this.getVideo();
				}
				if (auth.checkTempToken()) {
					this.tempHost = auth.checkTempToken();
					if (this.tempHost._id == this.room.host_id) {
						this.userIsHost = true;
					}
				} else if (this.user._id == this.room.host_id) {
					this.userIsHost = true;
				}
				//- JOIN ROOM
				let user_id;
				let room_id = this.room._id;
				if (this.tempHost) {
					user_id = this.tempHost._id;
				} else if (this.user) {
					user_id = this.user._id;
				}
				let roomData = {
					user_id: user_id,
					room_id: room_id,
				};
				this.$socket.emit("joinRoom", roomData);
			} catch (error) {
				this.roomNotFound = true;
			}
		},
		async getVideo() {
			try {
				const { data } = await axios.get(
					`/workoutVideos/${this.room.video_id}`
				);
				this.video = data.video;
				this.streamNotFound = false;
			} catch (error) {
				this.streamNotFound = true;
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
	},
	computed: {
		videoUrl() {
			return `https://www.youtube-nocookie.com/embed/${this.room.youtube_id}?autoplay=0&amp;modestbranding=1&amp;showinfo=0&amp;rel=0&amp;theme=light&amp;color=white&enablejsapi=1`;
		},
		conferenceSrc() {
			return `https://tokbox.com/embed/embed/ot-embed.js?embedId=9dec12a2-922b-4d1c-8c36-a96eea192176&room=${this.room._id}&iframe=true`;
		},
		player() {
			return this.$refs.youtube.player;
		},
	},
	watch: {
		$route() {
			this.getRoom();
		},
	},
};
</script> 

<style>
iframe {
	border-radius: 2px !important;
}
.host-bar {
	text-align: center;
	width: 400px;
	margin: 0 auto;
	margin-top: 20px;
	margin-bottom: 20px;
	color: #969696;
	font-size: 20px;
	padding: 12px 0px;
	background-color: #232324;
	border-radius: 2px;
	max-height: 20px !important;
	height: 20px !important;
}
.video-copy-link,
.video-more {
	padding: 7px 10px;
	font-size: 20px;
	color: #969696;
	width: 320px;
	background-color: #232323;
	text-align: center;
	cursor: pointer;
	margin-bottom: 10px;
	border-radius: 2px;
}

.video-copy-link:hover,
.video-more:hover {
	background-color: #1b1b1b;
}

.video-control-workout {
	padding: 14px 10px;
	font-size: 28px;
	width: 148px;
	font-weight: bold;
	background-color: #04ffe7;
	text-align: center;
	cursor: pointer;
	margin-bottom: 10px;
	display: inline-block;
	border-radius: 2px;
}

.video-control-workout:hover {
	background-color: #00ffe5a9;
}

.reset {
	background-color: #395bff;
}

.reset:hover {
	background-color: #395affb9;
}

.set {
	background-color: #2e33de;
	margin-left: 4px;
}

.set:hover {
	background-color: #2e34deb4;
}

.wider {
	width: 320px;
}

.video-block {
	padding-top: 40px;
}

.special-container {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 116px);
	background-color: #121212;
}

.video-details {
	display: block;
}

.stream_description_display span {
	background-color: transparent !important;
	color: inherit !important;
}
.shareSpecial {
	margin-left: auto;
	box-sizing: border-box;
	height: 38px;
}

.take_live {
	padding: 10px 16px;
	padding-top: 11px;
	font-size: 17px;
	display: inline-block;
	background-color: #f7f7f7;
	border-radius: 3px;
	margin-right: 15px;
	text-align: center;
	transition: 0.2s ease;
	cursor: pointer;
	white-space: nowrap;
	font-weight: bold;
	width: 100px;
}

.take_live:hover {
	color: #aaa;
}

.take_live {
	background-color: #130089;
	color: white;
}

.takeLiveSpecial {
	float: right;
	margin-top: 10px;
}

.editSpecial {
	background-color: #e8e8e8 !important;
}

.stream_not_live {
	padding: 10px;
	font-size: 20px;
	background-color: #f7f7f7;
	margin-bottom: 15px;
	border-radius: 4px;
	width: 800px;
	margin-left: auto;
	margin-right: auto;
	color: blue;
}
.streamPreviewTimeContainer {
	height: 60px;
	background-color: #fbfbfb;
	/* z-index: 9999; */
	position: absolute;
	padding: 0px 5px;
	top: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.streamPreviewDateContainer {
	height: 60px;
	background-color: #fbfbfb;
	/* z-index: 9999; */
	padding: 0px 5px;
	position: absolute;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 3px 2px 11px 0px rgba(10, 0, 70, 0.42);
}

.unsetPosition {
	position: relative !important;
	background-color: white !important;
	box-shadow: unset !important;
	height: 50px;
}

.streamPreviewTime {
	padding: 0px 15px;
	font-weight: bold;
	font-size: 28px;
	color: #f4f3ff;
	color: #292295;
}

.streamPreviewDate {
	padding: 0px 15px;
	font-weight: bold;
	font-size: 28px;
	color: #f4f3ff;
	color: #292295;
}

.streamTimeMeta,
.streamDateMeta {
	height: 48px;
	/* background-color: #fbfbfb; */
	background-color: transparent;
	/* z-index: 9999; */
	width: auto;
	position: absolute;
	top: 20px;
	right: 35px;
	display: flex;
	justify-content: center;
	align-items: center;
	/* box-shadow: 3px 2px 11px 0px rgba(10, 0, 70, 0.42); */
}

.layer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	align-items: flex-start;
}

.layer .share_options {
	background-color: #e8e8e8;
}

.streamTagPreview {
	font-size: 16.5px;
	margin-right: 5.5px;
	padding: 4px 20px;
	display: inline-block;
	border-radius: 2px;
	background-color: #1500a00a;
	color: #0f007363;
	margin: 2px 2px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	max-width: 150px;
	letter-spacing: 1px;
	text-transform: lowercase;
	margin-left: 0px;
	margin-right: 9px;
}

.scheduled_stream_container {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 600px;
	width: 600px;
}

.scheduled_stream_details {
	background-color: #f9f9f9;
	padding: 40px;
	width: 600px;
	box-sizing: border-box;
	padding-top: 30px;
}

.scheduled_stream_details_section {
	margin-top: 15px;
	font-family: "Poppins";
}

.custom_area {
	flex-direction: row !important;
}
.scheduled_stream_name {
	font-size: 35px;
	font-family: "Poppins";
	line-height: 44px;
}
.scheduled_stream_description {
	font-size: 21px;
	color: #333;
	font-family: "Poppins";
	line-height: 26px;
}
.register_block {
}
.register_text {
	font-size: 40px;
	text-align: center;
}

.register_email_block {
	margin-top: 20px;
	margin-bottom: 30px;
}

.watch_register_input {
	width: 200px;
	border-radius: 3px;
	border: 1px solid #eee;
	margin-right: 16px;
	padding: 10px;
	margin-left: auto;
	margin-right: auto;
	width: 600px;
	padding: 15px !important;
	display: block !important;
	font-size: 28px !important;
	/* box-shadow: 4px 5px 0px 0px #e6e6e6; */
	margin-top: 15px;
	box-sizing: border-box;
	font-family: "Trebuchet MS", sans-serif;
}

.register_watch_button,
.register_email_watch_button,
.register_success {
	text-align: center;
	margin-top: 20px;
	padding: 20px 20px;
	font-size: 35px;
	border-radius: 3px;
	margin-left: auto;
	margin-right: auto;
	color: #fff;
	background-color: #ca4c2f;
	cursor: pointer;
	transition: 0.1s ease;
	margin-bottom: 15px;
	max-width: 600px;
	box-sizing: border-box;
}

.register_watch_button:hover,
.register_email_watch_button:hover {
	background-color: #ca4c2fcf;
	transform: scale(1.02);
}

.register_success {
	background-color: #130088;
}

.register_success:hover {
	background-color: #120088bd;
	transform: scale(1.02);
}
.watch,
.watch-area {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
	height: 100%;
	margin-bottom: 100px;
}

/*! CSS Used from: https://www.eeter.tv/css/reset.css */
div,
span,
iframe,
h3,
p,
img,
form {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/*! CSS Used from: https://www.eeter.tv/css/main.css */
* {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}
input:focus,
textarea:focus {
	outline: none;
}
input {
	width: 100%;
	padding: 16px;
	box-sizing: border-box;
	border: none;
	border-radius: 0;
	background-color: #fff;
	font-family: "Trebuchet MS", sans-serif;
}
h3 {
	font-size: 18px;
	font-weight: 500;
}
p {
	white-space: normal;
}
div,
p {
	display: block;
}
.container {
	display: flex;
	flex-wrap: wrap;
	max-width: 100%;
	height: 100%;
	min-height: calc(100vh - 116px);
}
.show {
	display: block !important;
}
.hide {
	display: none !important;
}
.entryDetailsGroup {
	background-color: #fbfbfb;
	font-size: 20px;
	color: #0e0e0e;
	border-radius: 6px;
	position: relative;
	border: 1px solid #eee;
	margin-top: 15px;
	max-width: 325px;
}
.confirm_modal {
	position: fixed;
	z-index: 9999;
	top: 20%;
	right: 0;
	left: 0;
	margin: 0 auto;
	width: 350px;
	background: #ffffff;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.05);
	border-radius: 2px;
	border: none;
	padding: 20px;
}
.confirm_modal {
	width: 400px;
	padding: 25px;
}
.big-content-wrapper {
	margin: auto;
	margin-top: 20px;
}
.confirm_modal_background {
	background-color: #1f1f1f;
	opacity: 0.5;
	top: 0;
	z-index: 1003;
	position: fixed;
	width: 100%;
	height: 100%;
}
.cancel_end_stream {
	padding: 7px 11px;
	transition: 0.2s ease-in-out;
	margin: auto 0px auto auto;
	font-size: 18px;
}
.cancel_end_stream:hover {
	background-color: #ececec;
	border-radius: 360px;
	cursor: pointer;
}
.cancel_end_stream {
	float: right;
}
.file-upload {
	background-color: #fbfbfb;
	box-sizing: border-box;
}
.file-upload-btn {
	margin: 0;
	font-size: 29px;
	background: transparent;
	border: none;
	padding: 10px;
	border-radius: 4px;
	transition: all 0.2s ease;
	outline: none;
	font-weight: 700;
	color: #130089;
	font-family: "Trebuchet MS", sans-serif;
	margin-bottom: 10px;
}
.file-upload-btn:hover {
	background: #1aa059;
	color: #ffffff;
	transition: all 0.2s ease;
	cursor: pointer;
}
.file-upload-btn:active {
	border: 0;
	transition: all 0.2s ease;
}
.file-upload-content {
	text-align: center;
}
.file-upload-input {
	position: absolute;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	outline: none;
	opacity: 0;
	cursor: pointer;
}
.image-upload-wrap {
	position: relative;
}
.image-upload-wrap:hover {
	background-color: white;
	border-color: 4px solid #efefef;
	border-radius: 3px;
}
.image-title-wrap {
	padding: 0 15px 15px 15px;
	color: #222;
}

.drag-text {
	text-align: center;
	padding: 30px 0px;
	color: white;
}
.drag-text h3 {
	color: #333;
	font-weight: bold;
	font-size: 18px;
}
.file-upload-image {
	max-height: 200px;
	max-width: 200px;
	margin: auto;
	padding: 20px;
}
.remove-image {
	width: 200px;
	margin: 0;
	border: none;
	padding: 10px;
	border-radius: 4px;
	transition: all 0.2s ease;
	outline: none;
	text-transform: uppercase;
	font-weight: 700;
}
.remove-image {
	background: #cd4535;
	border-bottom: 4px solid #b02818;
	color: #fff;
}
.remove-image:hover {
	background: #c13b2a;
	color: #ffffff;
	transition: all 0.2s ease;
	cursor: pointer;
}
.remove-image:active {
	border: 0;
	transition: all 0.2s ease;
}
.donate_button {
	background-color: #130088;
	padding: 11px 15px;
	margin-left: auto;
	margin-right: 80px;
	color: #ff9800;
	font-weight: bold;
	border-radius: 3px;
	cursor: pointer;
	transition: 0.2s ease;
	display: block;
}
.donate_button:hover {
	opacity: 0.8;
}
/*! CSS Used from: https://www.eeter.tv/css/registration.css */
.inputErrorContainer {
	padding: 10px;
	color: red;
	background-color: transparent;
}
/*! CSS Used from: https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css */
.ui-sortable-handle {
	-ms-touch-action: none;
	touch-action: none;
}
/*! CSS Used from: https://www.eeter.tv/css/streaming.css */
.livestream_buttons {
	margin-left: auto;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	align-self: self-start;
}

.stream_edit_button,
.stream_end_button,
.share_options {
	padding: 10px 16px;
	padding-top: 11px;
	font-size: 17px;
	display: inline-block;
	background-color: #f7f7f7;
	border-radius: 3px;
	margin-right: 0px;
	text-align: center;
	transition: 0.2s ease;
	cursor: pointer;
	/* color: white; */
	white-space: nowrap;
	font-weight: bold;
}

.stream_edit_button:hover,
.stream_end_button:hover,
.share_options:hover {
	color: #aaa;
}

.streaming_area {
	margin-left: auto;
	margin-right: auto;
	margin-top: 50px;
	display: flex;
	flex-direction: column;
}
.streamer_first_name,
.streamer_last_name {
	font-size: 22px;
	display: inline;
	margin-right: 5px;
}
.player_container {
	margin-right: 50px;
	margin-top: 1.3%;
}
.player_sidebar_container {
	margin-top: 1.3%;
	margin-right: 10px;
}
.sidebar_section_top {
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	padding: 20px 15px;
	background-color: #f9f9f9;
}
.live_player {
	border-radius: 10px;
}
.live_player_facebook {
	border-radius: 10px;
	height: 479px;
	width: 850px;
}
.live_chat {
	border-radius: 3px;
}
.stream_owner {
	display: flex;
	align-items: center;
	padding: 8px 10px 8px 10px;
	border-radius: 2px;
	cursor: pointer;
	margin-right: 15px;
}
.stream_owner:hover {
	background-color: #f7f7f7;
}
.stream_details {
	max-width: 850px;
	padding-top: 10px;
}

.stream_details_part {
	padding: 10px;
	display: flex;
	/* align-items: center; */
	align-items: flex-start;
}

.stream_details_block {
	padding: 10px;
	display: flex;
	/* justify-content: center; */
	width: 325px;
	margin: 0 auto;
}
.stream_name_display {
	font-size: 25px;
	line-height: 30px;
	max-width: 500px;
}
.stream_description_display {
	max-width: 600px;
	color: #555;
	line-height: 21px;
}
.stream_tag {
	display: inline-block;
	background-color: #f7f7f7;
	padding: 6px 12px;
	margin-right: 8px;
	border-radius: 18px;
	font-size: 16px;
	color: #000000ad;
	max-width: 130px;
	text-overflow: ellipsis;
	overflow: hidden;
}
.stream_center_top {
	display: flex;
	align-items: center;
	max-width: 865px;
}

.stream_center_top_preview {
	display: flex;
	align-items: center;
	max-width: 865px;
	width: 600px;
	box-sizing: border-box;
	margin-top: 10px;
	/* background-color: #f9f9f9; */
	/* border-top: 1px solid #efefef; */
	/* border-bottom: 1px solid #efefef; */
}

.stream_live,
.stream_offline {
	padding: 6px 12px;
	border-radius: 3px;
	font-size: 17px;
	display: inline-block;
	/* background-color: #ff0000d4; */
	color: #ca1b0e;
	/* color: #1600ff; */
	background-color: #f7f7f7;
	font-weight: bold;
	margin-left: 15px;
	border-radius: 3px;
	margin-right: 15px;
	text-align: center;
	cursor: default;
}

.stream_offline {
	color: #555;
	width: 100%;
	max-width: 90px;
}

.stream_likes {
	margin-left: auto;
	margin-right: 20px;
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	border-radius: 4px;
	padding: 4px 15px;
	cursor: pointer;
	transition: 0.2s ease;
}
.stream_likes:hover {
	background-color: #0000ff17;
	transform: scale(1.01);
}
.stream_likes:hover > .stream_like_button {
	border-color: #8686862b;
}
.stream_like_button {
	display: flex;
	align-items: center;
	border-right: 1px solid #c7c7c7;
	padding-right: 10px;
}
.stream_like_icon {
	max-height: 30px;
}
.stream_like_text {
	margin-left: 10px;
}
.stream_likes_count {
	margin-left: 12px;
}
.streamer_profile_icon {
	height: 45px;
	min-height: 45px;
	margin-right: 10px;
	width: 45px;
	min-width: 45px;
	border-radius: 360px;
	object-fit: cover;
}

.streamer_follow_preview {
	margin-right: 20px;
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	border-radius: 4px;
	padding: 4px 15px;
	cursor: pointer;
	transition: 0.2s ease;
	font-weight: bold;
	margin-left: auto;
}

.streamer_follow_preview:hover {
	background-color: #e4ff00;
	transform: scale(1.01);
}

.streamer_follow {
	margin-left: 22px;
	margin-right: 20px;
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	border-radius: 4px;
	padding: 4px 15px;
	cursor: pointer;
	transition: 0.2s ease;
	font-weight: bold;
}
.streamer_follow:hover {
	background-color: #e4ff00;
	transform: scale(1.01);
}
.streamer_follow:hover
	> .streamer_follow_button
	.streamer_follow_preview:hover
	> .streamer_follow_button {
	border-color: #8686862b;
}
.streamer_follow_button {
	display: flex;
	align-items: center;
}
.streamer_follow_icon {
	max-height: 24px;
}
.streamer_follow_state {
	margin-left: 12px;
}
.fixed_user_header {
	position: fixed;
	background: white;
	padding: 6px 13px;
	top: 0px;
	width: 100%;
	z-index: 9999;
}
.edit_stream_details {
	padding: 15px;
	border-radius: 3px;
	max-width: 850px;
	box-sizing: border-box;
}
.edit_stream_inputs {
	/* display: flex;
	flex-wrap: wrap; */
	margin-top: 40px;
	margin-left: 60px;
}
.edit_input {
	margin-right: 55px;
	max-width: 325px;
}
.padding-60 {
	padding-top: 60px;
	padding-bottom: 60px;
}
.auto-side-margins {
	margin-left: auto;
	margin-right: auto;
}
/*! CSS Used from: https://www.eeter.tv/css/content.css */
textarea {
	resize: none;
}
.stream_input_container {
	margin-bottom: 40px !important;
	max-width: 325px;
}
.stream_input {
	width: 200px;
	border-radius: 3px;
	border: 1px solid #eee;
	margin-right: 16px;
	padding: 10px;
	margin-left: auto;
	margin-right: auto;
	width: 325px;
	padding: 15px !important;
	display: block !important;
	font-size: 18px !important;
	box-shadow: 4px 5px 0px 0px #e6e6e6;
	margin-top: 15px;
	box-sizing: border-box;
	font-family: "Trebuchet MS", sans-serif;
}
.stream_input:focus {
	border-left: 3px solid #120088;
}
.stream_input_title {
	font-size: 20px;
	line-height: 22px;
}
/*! CSS Used from: https://www.eeter.tv/css/modal.css */
.big-content-wrapper {
	margin: auto;
	margin-top: 20px;
}
.inputErrorContainer {
	padding: 10px;
	color: red;
	background-color: transparent;
}
.confirm_modal_title {
	font-size: 24px;
	margin-bottom: 45px;
}
.end_stream_actions {
	display: flex;
	align-items: center;
}
.end_stream_confirm {
	/* width: 165px; */
	background-color: #f5f5f5;
	cursor: pointer;
	border-radius: 2px;
	padding: 10px 16px;
	margin: 20px 12px 55px 0px;
	box-sizing: border-box;
	color: #333;
	font-weight: 500;
	font-size: 23px;
	display: inline-block;
	margin-bottom: 0px;
	margin-left: auto;
	display: block;
}
.end_stream_confirm:hover {
	background-color: #e8e8e8 !important;
}
.end_stream_confirm {
	margin: unset;
}
.end_stream_fail_message {
	display: none;
	color: red;
	margin-top: 15px;
	margin-left: 5px;
}
/*! CSS Used from: https://www.eeter.tv/css/selectize.css */
.selectize-control {
	position: relative;
}
.selectize-dropdown,
.selectize-input,
.selectize-input input {
	color: #303030;
	font-family: inherit;
	font-size: 16px;
	line-height: 18px;
	-webkit-font-smoothing: inherit;
}
.selectize-input {
	background: #fff;
	cursor: text;
	display: inline-block;
}
.selectize-input {
	overflow: hidden;
	position: relative;
	z-index: 1;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	box-shadow: inset 0 0 0 1px #ececec;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
	margin-top: 7px;
	width: 200px !important;
	border-radius: 3px !important;
	border: 1px solid #eee !important;
	margin-right: 16px !important;
	padding: 10px !important;
	margin-left: auto !important;
	margin-right: auto !important;
	width: 325px !important;
	padding: 15px !important;
	display: block !important;
	font-size: 18px !important;
	box-shadow: 4px 5px 0px 0px #e6e6e6 !important;
	margin-top: 15px !important;
	box-sizing: border-box !important;
	font-family: "Trebuchet MS", sans-serif !important;
}
.selectize-control.multi .selectize-input.has-items {
	padding: 6px 8px 3px;
}
.selectize-input > * {
	vertical-align: baseline;
	display: -moz-inline-stack;
	display: inline-block;
	zoom: 1;
	*display: inline;
}
.selectize-control.multi .selectize-input > div {
	cursor: pointer;
	margin: 0 3px 3px 0;
	padding: 2px 6px;
	background: #f2f2f2;
	color: #303030;
	border: 0 solid #d0d0d0;
}
.selectize-input > input {
	display: inline-block !important;
	padding: 0 !important;
	min-height: 0 !important;
	max-height: none !important;
	max-width: 100% !important;
	margin: 0 2px 0 0 !important;
	text-indent: 0 !important;
	border: 0 none !important;
	background: none !important;
	line-height: inherit !important;
	-webkit-user-select: auto !important;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
	font-size: 18px !important;
}
.selectize-input > input::-ms-clear {
	display: none;
}
.selectize-input > input:focus {
	outline: none !important;
}
.selectize-input::after {
	content: " ";
	display: block;
	clear: left;
}
.selectize-dropdown {
	position: absolute;
	display: none !important;
	z-index: 10;
	left: 10px !important;
	width: 320px;
	border: 1px solid #d0d0d0;
	background: yellow;
	margin: -1px 0 0 0;
	border-top: 0 none;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	-webkit-border-radius: 0 0 3px 3px;
	-moz-border-radius: 0 0 3px 3px;
	border-radius: 0 0 3px 3px;
}
.selectize-dropdown-content {
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 200px;
	-webkit-overflow-scrolling: touch;
}
.followingBg {
	background-color: #e4ff00;
	font-weight: bold;
}
.userLiked {
	background-color: #0000ff17;
}

.pass_field {
	font-size: 13px;
	color: #545454;
	font-weight: 500;
	margin-left: auto;
	display: block;
	margin-bottom: -10px;
	margin-top: 20px;
}
</style>
