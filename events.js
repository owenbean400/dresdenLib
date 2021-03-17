events = {
  " Book , Bake ,  and Plant Sale": {
    about: "\rOur book, bake, and plant sale...",
    date: "5/30/2021",
    link: "event/Book,Bake, andPlantSale.html",
  },
  "Summer Reading Program": {
    about: "\rOur annual Summer Reading Program Begins...",
    date: "6/23/2020",
    link: "event/summerReadingProgram.html",
  },
};
//EJECTION_AWAY

Vue.component("Events", {
  template:
    '<div class="events-container"><a v-for="(info, title) in events" class="event-card" :href="info.link"><h4 class="date">{{getMonth(info.date) + " " + getDay(info.date) + ", " + info.date.substring(info.date.lastIndexOf("/") + 1, info.date.length)}}</h4><div class="eventsInfo"><h5 class="title">{{title}}</h5><p class="about">{{info.about}}</p></div></a></div>',
  data: function () {
    return { events: events };
  },
  methods: {
    getDay: function (dayString) {
      dayString = dayString.split("/");
      return dayString[1];
    },
    getMonth: function (dayString) {
      dayString = dayString.split("/");
      switch (dayString[0]) {
        case "1":
          return "Jan";
        case "2":
          return "Feb";
        case "3":
          return "Mar";
        case "4":
          return "Apr";
        case "5":
          return "May";
        case "6":
          return "June";
        case "7":
          return "July";
        case "8":
          return "Aug";
        case "9":
          return "Sept";
        case "10":
          return "Oct";
        case "11":
          return "Nov";
        case "12":
          return "Dec";
        default:
          return "NAN";
      }
    },
  },
});

var events = new Vue({
  el: "#events",
});
