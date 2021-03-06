events = {
  "Launch Day Reminder": {
    about: "\rThe Dresden Rocket Club has been hard at work bui",
    date: "10/10/2020",
    link: "htmlLoaded/event/launchDayReminder.html",
  },
  "Make Your Own Ghost At The Library": {
    about: "\rThese little ghosts will be a boo-tiful addition ",
    date: "12/21/2021",
    link: "htmlLoaded/event/makeYourOwnGhostAtTheLibrary.html",
  },
  "Test Site": {
    about: "\rLorem Ipsum is simply dummy text of the printing ",
    date: "3/7/2021",
    link: "htmlLoaded/event/testSite.html",
  },
};
//EJECTION_AWAY

Vue.component("Events", {
  template: `
        <div class="events-container">
            <div v-for="(info, title) in events" class="event-card">
                <h4 class="title">{{title}}</h4>
                <p class="date">{{info.date}}</p>
                <p class="about">{{info.about}}</p>
                <a :href="info.link">View More</a>
            </div>
        </div>
    `,
  data() {
    return { events: events };
  },
});

var events = new Vue({
  el: "#events",
});
