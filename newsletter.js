newsletters = {"2021 March":{"about":"\rFrom the developer -- Currently, newsletter page ...","date":"2021 March","link":"newsletter/march2021.html"}}
//EJECTION_AWAY

Vue.component("Newsletters", {
  template: `
        <div class="events-container">
            <div v-for="(info, title) in newsletters" class="event-card">
                <h4 class="title">{{title}}</h4>
                <p class="date">{{info.date}}</p>
                <p class="about">{{info.about}}</p>
                <a :href="info.link">View More</a>
            </div>
        </div>
    `,
  data() {
    return { newsletters: newsletters };
  },
});

var newsletters = new Vue({
  el: "#newsletters",
});
