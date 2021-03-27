Vue.component("imagecarousel", {
  props: {
    images: Array,
  },
  template:
    '<div class="carsousel-container"><svg class="arrow" width="32px" v-on:click="leftMove" version="1.1" id="Layer_1"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve"><polygon class="st0" points="64,0 0,32 64,64 " /></svg><img :key="this.image" :src="this.image" alt="Book Sale Photo" width="80%"/><svg class="arrow" width="32px" v-on:click="rightMove" version="1.1" id="Layer_1"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve"><polygon class="st0" points="0,0 64,32 0,64 " /></svg></div>',
  data: function () {
    console.log("data");
    for (let i = 0; i < this.images.length; i++) {
      this.images[i] = "/images/booksale/" + this.images[i];
    }
    this.timer;
    return {
      images: this.images,
      image: this.images[0],
      index: 0,
    };
  },
  methods: {
    showing: function () {
      this.image = this.images[this.index];
    },
    leftMove: function () {
      this.index = this.index !== 0 ? this.index - 1 : this.images.length - 1;
      this.showing();
    },
    rightMove: function () {
      this.index = this.index !== this.images.length - 1 ? this.index + 1 : 0;
      this.showing();
    },
  },
});

var imageCarousel = new Vue({
  el: "#imageCarousel",
});
