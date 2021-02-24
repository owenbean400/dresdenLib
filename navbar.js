let links = {
    "About": "/about/about.html",
    "Newsletter": "/newsletter/newsletter.html",
    "Events": "/events/event.html",
    "FAQ": "faq.html",
    "Catalog": "catalog.html",
}

const PHONE_SIZE = 760;
const NAV_HEAD_SIZE = 500;

let template = "";

Vue.component('Navbar', {
    template: `<nav id="navbar" class="bg-dark" v-bind:class="phoneClass">
            <a class="navlogo">{{logoName}}</a>
            <div class="link-container" v-bind:class="toggleShowPhoneNav">
                <div class="phoneNavbar" v-bind:class="{none: !isPhone}">
                    <a class="navlogo">{{logoName}}</a>
                    <div v-on:click="hideLinks" class="x">X</div>
                </div>
                <div class="links">
                    <ol>
                        <li v-for="(link, name) in links"><a v-bind:href="link">{{name}}</a></li>
                    </ol>
                </div>
            </div>
            <div v-on:click="showLinks" class="hamburger">
                <div v-for="i in 3"></div>
            </div>
        </nav>`,
    data() {return {
        links,
        isPhone: (window.innerWidth <= PHONE_SIZE),
        showPhoneLinks: false,
        loaded: false,
        logoName: (window.innerWidth <= NAV_HEAD_SIZE) ? "BAPL" : "Bridge Academy Public Library"
    }},
    created() {
        window.addEventListener("resize", this.updateNav);
    },
    destroyed() {
        window.removeEventListener("resize", this.updateNav);
    },
    methods: {
        updateNav(event) {
            this.isPhone = (window.innerWidth <= PHONE_SIZE);
            this.showPhoneLinks = (window.innerWidth <= PHONE_SIZE) ? this.showPhoneLinks : false;
            this.logoName = (window.innerWidth <= NAV_HEAD_SIZE) ? "BAPL" : "Bridge Academy Public Library"
        },
        showLinks() {
            console.log("open");
            this.loaded = true,
            this.showPhoneLinks = true;
        },
        hideLinks() {
            console.log("close");
            this.showPhoneLinks = false;
        }
    },
    computed: {
        phoneClass: function() {
            return this.isPhone ? 'navPhone' : 'navDesk';
        },
        toggleShowPhoneNav: function() {
            let classCss;
            if(!this.loaded && window.innerWidth <= PHONE_SIZE){
                classCss = 'none'
            }
            else{
                classCss = this.showPhoneLinks ? 'showPhoneLink' : 'hidePhoneLink'
            }
            return classCss;
        }
    }
})

var navbar = new Vue({
    el: '#navbar'
})