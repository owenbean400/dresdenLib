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
    '<div class="events-container"><div v-for="(info, title) in events" class="event-card"><h4 class="title">{{title}}</h4><p class="date">{{info.date}}</p><p class="about">{{info.about}}</p><a :href="info.link">View More</a></div></div>',
  data: function () {
    return { events: events };
  },
});

var events = new Vue({
  el: "#events",
});
