//about context information for main web page
let items = {
  Newsletter: {
    stuff: [
      {
        title: "June 2020",
        subtitle: false,
        info: "Meet 3 live animals that use special",
        link: "./newsletter/june2020.html",
      },
      {
        title: "May 2020",
        subtitle: false,
        info:
          "Come use our rainbow of colors to create your own customized working pen for home or school or pass it on as a fun gift for a friend!",
        link: "./newsletter/june2020.html",
      },
      {
        title: "April 2020",
        subtitle: false,
        info:
          "Bridge Academy Public Library will be raffling off a special basket filled with a bookstore gift certificate and other goodies for readers",
        link: "./newsletter/june2020.html",
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
        link: "./events/yardsale.html",
      },
      {
        title: "Book Donations",
        subtitle: false,
        info:
          "These little ghosts will be a boo-tiful addition to your Halloween decorations!",
        link: "./events/yardsale.html",
      },
    ],
    link: "./events.html",
  },
};

//about information for main page
let about = {
  History: {
    history:
      "At one time there were 10 school districts [in Dresden,] each with its own one-room building. Students, especially the boys, attended when they were not needed on the farm. It was not until the latter part of the 1800's that some type of higher education was available. By 1890 Bridge Academy was established, by private endowment, providing the type of education that enabled young adults to go out into the world in other than the labor field...",
  },
  Hours: {
    time: {
      Sunday: "Closed",
      Monday: "Closed",
      Tuesday: "1:30pm - 7:00pm",
      Wednesday: "Closed",
      Thursday: "1:30pm - 7:00pm",
      Friday: "Closed",
      Saturday: "9:00am - 12:00pm",
    },
  },
  Activity: {
    activites: [
      "basketball",
      "pickelball",
      "reading",
      "using computers",
      "borrow a book",
    ],
  },
};

var mainInfo = new Vue({
  el: "#mainInfo",
  data: {
    items,
  },
});

var aboutInfo = new Vue({
  el: "#about",
  data: {
    about,
    date: new Date(), //today's date
    colors: ["#66ff66", "eed"], //color of background when the day is today or opened
  },
  methods: {
    //calculate if day of about hours JSON object equals today
    isSameDay: function (day) {
      for (let i = 0; i < Object.keys(about.Hours.time).length; i++) {
        if (day == Object.keys(about.Hours.time)[i]) {
          if (this.date.getDay() == i) {
            return true;
          }
        }
      }
      return false;
    },
    //checks if the time now is opened
    isOpen: function (day) {
      if (!this.isSameDay(day)) {
        return false;
      }
      if (day == "Saturday") {
        if (this.date.getHours() >= 8 && this.date.getHours() <= 12) {
          return true;
        }
      } else if (day == "Tuesday" || day == "Thursday") {
        if (
          ((this.date.getHours() == 13 && this.date.getMinutes() >= 30) ||
            this.date.getHours() >= 13) &&
          this.date.getHours() <= 18
        ) {
          return true;
        }
      }
      return false;
    },
    //change the date class day number to the object string
    dayNumToString: function (num) {
      for (let i = 0; i < Object.keys(about.Hours.time).length; i++) {
        if (num == i) {
          return Object.keys(about.Hours.time)[i];
        }
      }
    },
  },
});
