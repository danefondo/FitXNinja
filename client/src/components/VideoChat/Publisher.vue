<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client';
export default {
  name: 'publisher',
  props: {
    session: {
      type: OT.Session,
      required: false
    },
    opts: {
      type: Object,
      required: false
    }
  },
  mounted: function() {
    const publisher = OT.initPublisher(this.$el, this.opts, err => {
      if (err) {
        this.$emit('error', err);
      } else {
        this.$emit('publisherCompleted');
      }
    });
    console.log('publisher created', publisher)
    this.$emit('publisherCreated', publisher);
    const publish = () => {
      this.session.publish(publisher, err => {
        if (err) {
          this.$emit('error', err);
        } else {
          this.$emit('publisherConnected', publisher);
        }
      });
    };
    //console.log(this.session, this.session.isConnected)
    if (this.session && this.session.isConnected()) {
      console.log('session connected for publisher')
      publish();
    }
    if (this.session) {
      console.log('session connected')
      this.session.on('sessionConnected', publish);
    }
  }
};
</script>