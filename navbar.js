//JSON object of links name with html file location
let links = {
  About: "history.html",
  Newsletter: "newsletters.html",
  Events: "events.html",
};

//variable constants
const PHONE_SIZE = 760;
const NAV_HEAD_SIZE = 500; //size change text BABL to full out word

//navbar component vue
Vue.component("Navbar", {
  template:
    '<nav id="navbar" v-bind:class="[phoneClass, showNavClass]"><a class="navlogo" :href="beginningDirectory(\'index.html\')">{{logoName}}</a><div class="link-container" v-bind:class="toggleShowPhoneNav"><div class="phoneNavbar" v-bind:class="{none: !isPhone}"><a class="navlogo" :href="beginningDirectory(\'index.html\')">{{logoName}}</a><svg v-on:click="hideLinks" class="x" version="1.1"id="Layer_1"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"viewBox="0 0 64 64"style="enable-background:new 0 0 64 64;" xml:space="preserve"><polygon class="st0" points="58.9,50.4 50.4,58.9 28.5,35.5 5.1,13.6 13.6,5.1 35.5,28.5 " /><polygon class="st0" points="5.1,50.4 13.6,58.9 35.5,35.5 58.9,13.6 50.4,5.1 28.5,28.5 "/></svg></div><div class="links"><ol><li v-for="(link, name) in links"><a v-bind:href="beginningDirectory(link)">{{name}}</a></li></ol></div></div><div v-on:click="showLinks" class="hamburger"><div v-for="i in 3"></div></div></nav>',
  data: function () {
    return {
      links: links,
      isPhone: window.innerWidth <= PHONE_SIZE,
      prevScrollPosition: 0,
      showPhoneLinks: false,
      showNav: true,
      loaded: false,
      logoName:
        window.innerWidth <= NAV_HEAD_SIZE
          ? "BAPL"
          : "Bridge Academy Public Library", //switch text header based on phone size
    };
  },
  created: function () {
    window.addEventListener("scroll", this.navShowing);
    window.addEventListener("resize", this.updateNav);
  },
  destroyed: function () {
    window.removeEventListener("resize", this.updateNav);
    window.removeEventListener("scroll", this.navShowing);
  },
  methods: {
    //updates variables based on size width
    updateNav: function (event) {
      this.isPhone = window.innerWidth <= PHONE_SIZE;
      this.showPhoneLinks =
        window.innerWidth <= PHONE_SIZE ? this.showPhoneLinks : false;
      this.logoName =
        window.innerWidth <= NAV_HEAD_SIZE
          ? "BAPL"
          : "Bridge Academy Public Library";
    },
    //show the links if phone
    showLinks: function () {
      (this.loaded = true), (this.showPhoneLinks = true);
    },
    //hide the links if phone
    hideLinks: function () {
      this.showPhoneLinks = false;
    },
    navShowing: function (event) {
      this.showNav =
        this.prevScrollPosition - window.scrollY >= 0 || window.scrollY < 10;
      this.prevScrollPosition = window.scrollY;
    },
    beginningDirectory: function (path) {
      let cd = window.location.href;
      let filePath = window.location.pathname;
      let realPath;
      if (filePath !== "/") {
        realPath = cd.substring(cd.search("//") + 2, cd.search(filePath));
      } else {
        realPath = cd.substring(cd.search("//"), cd.length);
      }
      stringCD = "";
      filePath = filePath.substring(1, filePath.length);
      if (realPath.search("github") !== -1) {
        filePath = filePath.substring(
          filePath.search("/") + 1,
          filePath.length
        );
        filePath = filePath.replace(".html");
      }
      while (filePath.search("/") !== -1) {
        stringCD += "../";
        filePath = filePath.substring(
          filePath.search("/") + 1,
          filePath.length
        );
      }
      return stringCD + path;
    },
  },
  computed: {
    //switch between classes based on boolean (might put inside Vue HTML template later)
    phoneClass: function () {
      return this.isPhone ? "navPhone" : "navDesk";
    },
    showNavClass: function () {
      return this.showNav ? "navShow" : "navHide";
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
