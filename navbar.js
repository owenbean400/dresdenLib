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

var navbar = new Vue({
    el: '#navbar',
    data: {
        links,
        isPhone: (window.innerWidth <= PHONE_SIZE),
        showPhoneLinks: false,
        loaded: false,
        logoName: (window.innerWidth <= NAV_HEAD_SIZE) ? "BAPL" : "Bridge Academy Public Library"
    },
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