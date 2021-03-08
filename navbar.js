//JSON object of links name with html file location
let links = {
  About: "/about/about.html",
  Newsletter: "/newsletter/newsletter.html",
  Events: "events.html",
  FAQ: "faq.html",
  Catalog: "catalog.html",
};

//variable constants
const PHONE_SIZE = 760;
const NAV_HEAD_SIZE = 500; //size change text BABL to full out word

//navbar component vue
Vue.component("Navbar", {
  template: `<nav id="navbar" class="bg-dark" v-bind:class="phoneClass">
            <a class="navlogo" :href="beginningDirectory('index.html')">{{logoName}}</a>
            <div class="link-container" v-bind:class="toggleShowPhoneNav">
                <div class="phoneNavbar" v-bind:class="{none: !isPhone}">
                    <a class="navlogo">{{logoName}}</a>
                    <div v-on:click="hideLinks" class="x">X</div>
                </div>
                <div class="links">
                    <ol>
                        <li v-for="(link, name) in links"><a v-bind:href="beginningDirectory(link)">{{name}}</a></li>
                    </ol>
                </div>
            </div>
            <div v-on:click="showLinks" class="hamburger">
                <div v-for="i in 3"></div>
            </div>
        </nav>`,
  data() {
    return {
      links,
      isPhone: window.innerWidth <= PHONE_SIZE,
      showPhoneLinks: false,
      loaded: false,
      logoName:
        window.innerWidth <= NAV_HEAD_SIZE
          ? "BAPL"
          : "Bridge Academy Public Library", //switch text header based on phone size
    };
  },
  created() {
    window.addEventListener("resize", this.updateNav);
  },
  destroyed() {
    window.removeEventListener("resize", this.updateNav);
  },
  methods: {
    //updates variables based on size width
    updateNav(event) {
      this.isPhone = window.innerWidth <= PHONE_SIZE;
      this.showPhoneLinks =
        window.innerWidth <= PHONE_SIZE ? this.showPhoneLinks : false;
      this.logoName =
        window.innerWidth <= NAV_HEAD_SIZE
          ? "BAPL"
          : "Bridge Academy Public Library";
    },
    //show the links if phone
    showLinks() {
      console.log("open");
      (this.loaded = true), (this.showPhoneLinks = true);
    },
    //hide the links if phone
    hideLinks() {
      console.log("close");
      this.showPhoneLinks = false;
    },
    beginningDirectory(path) {
      let cd = window.location.pathname;
      let slashCount = 0;
      while (cd.search("/") !== -1) {
        cd = cd.substring(cd.search("/") + 1, cd.length);
        slashCount++;
      }
      let cdLeave = "";
      for (let i = 1; i < slashCount; i++) {
        cdLeave += "../";
      }
      cdLeave += "./";
      return cdLeave + path;
    },
  },
  computed: {
    //switch between classes based on boolean (might put inside Vue HTML template later)
    phoneClass: function () {
      return this.isPhone ? "navPhone" : "navDesk";
    },
    //switch the class depending on if links should show, hide, or not display based on size width
    toggleShowPhoneNav: function () {
      let classCss;
      if (!this.loaded && window.innerWidth <= PHONE_SIZE) {
        classCss = "none";
      } else {
        classCss = this.showPhoneLinks ? "showPhoneLink" : "hidePhoneLink";
      }
      return classCss;
    },
  },
});

//navbar vue
var navbar = new Vue({
  el: "#navbar",
});
