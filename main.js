let items = {
    Newsletter: {
        stuff: [
            {
                title: "June 2020",
                subtitle: false,
                info: "Meet 3 live animals that use special",
                link: "./newsletter/june2020.html"
            },
            {
                title: "May 2020",
                subtitle: false,
                info: "Come use our rainbow of colors to create your own customized working pen for home or school or pass it on as a fun gift for a friend!",
                link: "./newsletter/june2020.html"
            },
            {
                title: "April 2020",
                subtitle: false,
                info: "Bridge Academy Public Library will be raffling off a special basket filled with a bookstore gift certificate and other goodies for readers",
                link: "./newsletter/june2020.html"
            },
        ],
        link: "./newsletter/newsletter.html",
    },
    Events: {
        stuff: [
        {
            title: "Yard Sale",
            subtitle: "on May 31, 2021",
            info: "This year's reading theme is all about water! WOW",
            link: "./events/yardsale.html"
        },
        {
            title: "Book Donations",
            subtitle: false,
            info: "These little ghosts will be a boo-tiful addition to your Halloween decorations!",
            link: "./events/yardsale.html"
        },
        ],
        link: "./events/events.html"
    }
}

var mainInfo = new Vue({
    el: "#mainInfo",
    data: {
        items
    }
})