<template lang="pug">
  .contentArea(v-if="user && user.admin")
    .deleteStreamModal(v-if='showDeleteModal')
      .deleteStreamModalBackground(@click='showDeleteModal=false')
      .deleteStreamModalWrapper
        .deleteStreamContentWrapper
          .deleteStreamTextContainer
            .deleteStreamModalTitle {{ $t("editvideo.delete-confirm-title") }}
            .deleteStreamModalBody {{ $t("editvideo.delete-notice") }}
          .action-group
            .cancelDeleteStream.button-outline(@click='showDeleteModal=false') {{ $t("editvideo.cancel-delete") }}
            .confirmPermaDeleteStream.button-filled(@click='deleteVideo') {{ $t("editvideo.confirm-delete") }}
    .generalErrorContainer(v-if="error")
      .generalErrorText {{ $t("form.wrong") }}
    .stream_details_block
      .save_stream_changes(@click="updateVideo") {{ $t("editstream.save") }}
      router-link.cancel_stream_changes(:to="$route.query.manage ? '/master' : `/videos/${video._id}`") {{ $t("editstream.cancel") }}
    .stream_input_container
      .stream_input_title {{ $t("newworkout.give-name") }}
      input(v-model="name" class="stream_input stream_name" :placeholder="$t('newworkout.name-holder')" max-length="50")
      .inputErrorContainer(v-if="nameEmpty && !name")
        .inputErrorText {{ $t("form.empty") }}
    .stream_input_container
      .stream_input_title {{ $t("newworkout.give-desc") }}
      ckeditor.unreset.ckspecial(:editor="editor" v-model="description" :config="editorConfig")
      .inputErrorContainer(v-if="descriptionEmpty && !description")
        .inputErrorText {{ $t("form.empty") }}
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-type") }}
      v-select(multiple taggable v-model="types" :options="workoutTypeOptions" placeholder="Select or add muscle group")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.muscle-group") }}
      v-select(multiple taggable v-model="muscles" :options="muscleGroupOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-goal") }}
      v-select(multiple taggable v-model="goals" :options="workoutGoalsOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-sport") }}
      v-select(multiple taggable v-model="sports" :options="workoutSportOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-level") }}
      v-select(multiple taggable v-model="levels" :options="workoutLevelOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-equipment") }}
      v-select(multiple taggable v-model="equipment" :options="workoutEquipmentOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-location") }}
      v-select(multiple taggable v-model="location" :options="workoutLocationOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-duration") }}
      v-select(multiple taggable v-model="duration" :options="workoutDurationOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-style") }}
      v-select(multiple taggable v-model="styles" :options="workoutStyleOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-other") }}
      v-select(multiple taggable v-model="specifications")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-teacher") }}
      v-select(multiple taggable v-model="teachers" :options="workoutTeacherOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.workout-organization") }}
      v-select(multiple taggable v-model="organizations" :options="workoutOrganizationOptions")
    .stream_input_container
      .stream_input_title {{ $t("newworkout.video-url") }}
      input(v-model="url" class="stream_input stream_name" :placeholder="$t('newworkout.link-placeholder')" max-length="50")
    .schedule_stream_section
      .stream_input_title {{ $t("golive.privacy") }}
      .switch-field
        input#radio-one(type="radio" v-model="public_status" name="switch-one" value="public" checked)
        label(for="radio-one") {{ $t("newworkout.public") }}
        input#radio-two(type="radio" v-model="public_status" name="switch-one" value="unlisted")
        label(for="radio-two") {{ $t("newworkout.unlisted") }}
        input#radio-three(type="radio" v-model="public_status" name="switch-one" value="private")
        label(for="radio-three") {{ $t("newworkout.private") }}
      .inputErrorContainer
        .inputErrorText
    .schedule_stream_section
      .stream_input_title {{ $t("newworkout.music-title") }}
      .switch-field
        input#radio-four(type="radio" v-model="music" name="switch-two" value="true")
        label(for="radio-four") {{ $t("newworkout.yes") }}
        input#radio-five(type="radio" v-model="music" name="switch-two" value="false")
        label(for="radio-five") {{ $t("newworkout.no") }}
      .inputErrorContainer
        .inputErrorText
    .stream_input_container(v-if="music == 'true'")
      .stream_input_title {{ $t("newworkout.songs") }}
      v-select(multiple taggable v-model="songs")
    .scheduleErrorContainer(v-if="scheduleError")
      .scheduleErrorText {{ $t("golive.fill-in") }}
    .stream_delete_section
      .success_input_title {{ $t("editvideo.delete-title") }}
      .section__streamSettings
        .deleteStreamText {{ $t("editvideo.delete-desc") }}
        .deleteStreamButton(@click='showDeleteModal=true')
          p.deleteStreamButtonText {{ $t("editvideo.delete-video") }}
    //- CREATE NEW TEACHER, THEN SELECT
    //- CREATE NEW ORGANIZATION, THEN SELECT
</template>

<script>
import axios from "axios";
import auth from "../config/auth";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import InputTag from "vue-input-tag";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "EditVideo",
  components: {
    InputTag,
    vSelect
  },
  data() {
    return {
      editor: DecoupledEditor,
      editorConfig: {
        placeholder: this.$t("newworkout.desc-holder"),
        removePlugins: [
          "FontSize",
          "MediaEmbed",
          "insertTable",
          "Heading",
          "alignment",
          "Undo",
          "Redo",
          "FontFamily",
          "highlight"
        ],
        toolbar: [
          "bold",
          "italic",
          "|",
          "bulletedList",
          "numberedList",
          "Link",
          "blockQuote"
        ]
      },
      showDeleteModal: false,
      isScheduledOpened: false,
      date: new Date(),
      limit: 3,
      time: "",
      name: "",
      description: "",
      tags: [],
      videoLink: "",
      error: "",
      scheduleError: "",
      tagsEmpty: false,
      nameEmpty: false,
      descriptionEmpty: false,
      videoLinkEmpty: false,
      dateEmpty: false,
      timeEmpty: false,
      public_status: "public",
      user: {},
      isAuthenticated: false,
      muscles: [],
      muscleGroupOptions: ["biceps"],
      types: [],
      workoutTypeOptions: ["HIIT"],
      goals: [],
      workoutGoalsOptions: [],
      sports: [],
      workoutSportOptions: [],
      levels: [],
      workoutLevelOptions: [],
      equipment: [],
      workoutEquipmentOptions: [],
      location: [],
      workoutLocationOptions: [],
      duration: [],
      workoutDurationOptions: [],
      music: "false",
      songs: [],
      styles: [],
      workoutStyleOptions: [],
      specifications: [],
      teachers: [],
      workoutTeacherOptions: [],
      organizations: [],
      workoutOrganizationOptions: [],
      url: "",
      video: {}
    };
  },
  mounted() {
    this.getVideo();
    if (auth.isAuthenticated()) {
      this.user = auth.isAuthenticated();
      this.isAuthenticated = true;
    }
  },
  methods: {
    toggle() {
      this.isScheduledOpened = !this.isScheduledOpened;
    },
    async getVideo() {
      try {
        const { data } = await axios.get(`/videos/${this.$route.params.id}`);
        this.video = data.video;
        let video = data.video;
        this.streamNotFound = false;

        this.name = video.name;
        this.description = video.description;
        this.public_status = video.public_status;
        this.muscles = video.muscles;
        this.types = video.types;
        this.goals = video.goals;
        this.sports = video.sports;
        this.levels = video.levels;
        this.equipment = video.equipment;
        this.location = video.location;
        this.duration = video.duration;
        this.music = video.music;
        this.songs = video.songs;
        this.styles = video.styles;
        this.specifications = video.specifications;
        this.teachers = video.teachers;
        this.organizations = video.organizations;
        this.url = video.url;
      } catch (error) {
        this.streamNotFound = true;
      }
    },
    async updateVideo() {
      try {
        let videoData = {
          name: this.name,
          description: this.description,
          url: this.url,
          types: this.types,
          styles: this.styles,
          muscles: this.muscles,
          goals: this.goals,
          sports: this.sports,
          levels: this.levels,
          equipment: this.equipment,
          location: this.location,
          duration: this.duration,
          music: this.music,
          songs: this.songs,
          specifications: this.specifications,
          teachers: this.teachers,
          organizations: this.organizations,
          public_status: this.public_status,
          video_id: this.video._id
        };

        await axios.post(`dashboard/updateWorkoutVideo`, videoData);
        if (this.$route.query.manage) {
          return this.$router.push(`/master`);
        }
        this.$router.push(`/videos/${this.video._id}`);
      } catch (error) {
        window.scrollTo(0, 0);
        this.error = true;
      }
    },
    async deleteVideo() {
      try {
        await axios.delete(`/videos/${this.video._id}/deleteVideo`);
        window.location.href = "/master";
      } catch (error) {
        console.log("err", error);
      }
    }
  },
  watch: {
    $route() {
      this.getVideo();
    }
  }
};
</script>

<style>
.vs__actions {
  display: none !important;
}
.vue-input-tag-wrapper {
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

.vue-input-tag-wrapper .input-tag {
  color: unset !important;
  cursor: default !important;
  margin: 9px 7px 3px 0 !important;
  padding: 5px 6px !important;
  background: #f2f2f2 !important;
  font-size: 20px !important;
  border: 0 solid #d0d0d0 !important;
  display: inline-block !important;
}

.vue-input-tag-wrapper .input-tag .remove {
  color: unset !important;
}

.vue-input-tag-wrapper .new-tag {
  font-size: 18px !important;
}

.date_picker input {
  max-width: 285px;
  width: 285px;
  border-radius: 3px;
  border: 1px solid #eee;
  margin-right: 16px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px !important;
  display: block !important;
  font-size: 18px !important;
  box-shadow: 4px 5px 0px 0px #e6e6e6;
  margin-top: 15px;
  box-sizing: border-box;
  font-family: "Trebuchet MS", sans-serif;
}

.date_picker input:focus {
  border-left: 3px solid #120088;
}

.timepicker {
  max-width: 285px;
  width: 285px;
  border-radius: 3px;
  border: 1px solid #eee;
  margin-right: 16px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px !important;
  display: block !important;
  font-size: 18px !important;
  box-shadow: 4px 5px 0px 0px #e6e6e6;
  margin-top: 15px;
  box-sizing: border-box;
  font-family: "Trebuchet MS", sans-serif;
}

.timepicker:focus {
  border-left: 3px solid #120088;
}

/*! CSS Used from: https://www.eeter.tv/css/main.css */
.ckspecial {
  outline: none !important;
  box-shadow: 4px 5px 0px 0px #e6e6e6 !important;
  border: 1px solid #eee !important;
  border-radius: 3px;
  border: 1px solid #eee;
  margin-right: 16px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 325px;
  padding: 15px !important;
  padding-top: 0px !important;
  display: block !important;
  font-size: 18px !important;
  box-shadow: 4px 5px 0px 0px #e6e6e6;
  margin-top: 15px;
  box-sizing: border-box;
  font-family: "Trebuchet MS", sans-serif;
}

.ckspecial:focus {
  border-left: 3px solid #120088 !important;
}
* {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input:focus {
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
div {
  display: block;
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
/*! CSS Used from: https://www.eeter.tv/css/streaming.css */
.padding-60 {
  padding-top: 60px;
  padding-bottom: 60px;
}
.auto-side-margins {
  margin-left: auto;
  margin-right: auto;
}
.ck-content {
  height: 200px;
}
</style>