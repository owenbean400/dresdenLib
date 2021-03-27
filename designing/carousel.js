Vue.component("Carousel", {
  props: {
    isbns: Array,
    title: String,
  },
  template:
    '<div class="carsousel"><h4>{{title}}</h4><div class="carsousel-container"><svg class="arrow" width="32px" v-on:click="leftMove" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve"><polygon class="st0" points="64,0 0,32 64,64 "/></svg><div class="book" v-for="(data, num) in showingISBN"><div class="image-container"><img :key="num" :src="data.src" :alt="\'book isbn: \' + num" width="120px" height="192px"/></div><p>{{data.title}}</p></div><svg class="arrow" width="32px" v-on:click="rightMove" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve"><polygon class="st0" points="0,0 64,32 0,64 "/></svg></div></div>',
  data: function () {
    let ISBNnumbers = {};
    for (let i = 0; i < this.isbns.length; i++) {
      ISBNnumbers[this.isbns[i].toString()] = {
        src: "blank",
        alt: this.isbns[i].toString(),
        title: "loading title",
        author: "loading author",
      };
    }
    return {
      isbn: ISBNnumbers,
      showingISBN: ISBNnumbers,
      width: window.innerWidth,
      title: this.title,
      index: 0,
    };
  },
  created: function () {
    window.addEventListener("resize", this.resizeScreen);
  },
  destroyed: function () {
    window.removeEventListener("resize", this.resizeScreen);
  },
  methods: {
    resizeScreen: function () {
      this.width = window.innerWidth;
      this.showing();
    },
    showing: function () {
      let amount = Math.floor((this.width - 132) / 152);
      if (amount > Object.values(this.isbn).length) {
        amount = Object.values(this.isbn).length;
      } else if (amount <= 0) {
        amount = 1;
      }
      this.showingISBN = {};
      for (let i = this.index; i < amount + this.index; i++) {
        let num = Object.keys(this.isbn)[i % Object.values(this.isbn).length];
        this.showingISBN[num] = {
          src: this.isbn[num]["src"],
          title: this.isbn[num]["title"],
          author: this.isbn[num]["author"],
        };
      }
    },
    leftMove: function () {
      this.index =
        this.index !== 0 ? this.index - 1 : Object.values(this.isbn).length - 1;
      this.showing();
    },
    rightMove: function () {
      this.index =
        this.index !== Object.values(this.isbn).length - 1 ? this.index + 1 : 0;
      this.showing();
    },
  },
  beforeMount: function () {
    this.showing();
  },
  mounted: function () {
    for (let i = 0; i < Object.keys(this.isbn).length; i++) {
      let num = Object.keys(this.isbn)[i];
      axios
        .get("https://www.googleapis.com/books/v1/volumes?q=isbn" + num)
        .then((response) => {
          this.isbn[num]["src"] =
            response.data.items[0].volumeInfo.imageLinks.thumbnail;
          this.isbn[num]["title"] = response.data.items[0].volumeInfo.title;
          this.isbn[num]["author"] =
            response.data.items[0].volumeInfo.authors[0];
          this.showing();
        });
    }
  },
});

var carousel = new Vue({
  el: "#carousel",
});
