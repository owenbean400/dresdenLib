let links = {
    "About": "/about/about.html",
    "Newsletter": "/newsletter/newsletter.html",
    "Events": "/events/event.html",
    "FAQ": "faq.html",
    "Catalog": "catalog.html",
}

const PHONE_SIZE = 760;

let template = "";

var navbar = new Vue({
    el: '#navbar',
    data: {
        links,
        isPhone: (window.innerWidth <= PHONE_SIZE),
        showPhoneLinks: true,
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
        },
        showLinks() {
            console.log("open");
            this.showPhoneLinks = false;
        },
        hideLinks() {
            console.log("close");
            this.showPhoneLinks = true;
        }
    },
    computed: {
        phoneClass: function() {
            return this.isPhone ? 'navPhone' : 'navDesk';
        },
        toggleShowPhoneNav: function() {
            return this.showPhoneLinks ? 'hidePhoneLink' : 'showPhoneLink';
        }
    }

})