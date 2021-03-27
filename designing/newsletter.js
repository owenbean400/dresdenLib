newsletters = {"2021 March":{"about":"\rFrom the developer -- Currently, newsletter page ...","date":"2021 March","link":"newsletter/march2021.html"}}
//EJECTION_AWAY

Vue.component("Newsletters", {
  template:
    '<div class="events-container"><a v-for="(info, title) in newsletters" class="event-card" :href="info.link"><h4 class="date">{{info.date}}</h4><div class="eventsInfo"><p class="about">{{info.about}}</p></div></a></div>',
  data: function () {
    return { newsletters: newsletters };
  },
});

var newsletters = new Vue({
  el: "#newsletters",
});
