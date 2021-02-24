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

let about = {
    Open: {
        time: {
            Sunday: "Closed",
            Monday: "Closed",
            Tuesday: "1:30pm - 7:00pm",
            Wednesday: "Closed",
            Thursday: "1:30pm - 7:00pm",
            Friday: "Closed",
            Saturday: "9:00am - 12:00pm"
        }
    }
}

var mainInfo = new Vue({
    el: "#mainInfo",
    data: {
        items
    }
})

var aboutInfo = new Vue({
    el: "#about",
    data: {
        about,
        date: new Date()
    },
    methods: {
        isSameDay: function(day) {
            for(let i = 0; i < Object.keys(about.Open.time).length; i++){
                if(day == Object.keys(about.Open.time)[i]){
                    if(this.date.getDay() == i){
                        return true;
                    }
                }
            }
            return false;
        },
        isOpen: function(day) {
            console.log(day)
            if(!this.isSameDay(day)){
                return false;
            }
            if(day == "Saturday"){
                if(this.date.getHours() >= 8 && this.date.getHours() <= 12){
                    return true;
                }
            }
            else if(day == "Tuesday") {
                if( ((this.date.getHours() == 12 && this.date.getMinutes() >= 30) || this.date.getHours() >= 13) && this.date.getHours() <= 18){
                    return true;
                }
            }
            else if(day == "Thursday"){
                if( ((this.date.getHours() == 12 && this.date.getMinutes() >= 30) || this.date.getHours() >= 13) && this.date.getHours() <= 18){
                    return true;
                }
            }
            return false;
        },
        dayNumToString: function(num) {
            for(let i = 0; i < Object.keys(about.Open.time).length; i++){
                if(num == i){
                    return Object.keys(about.Open.time)[i];
                }
            }
        }
    }
})