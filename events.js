events = {
  "Launch Day Reminder": {
    about:
      "\rThe Dresden Rocket Club has been hard at work building their rockets and getting reading for the bi...",
    date: "10/10/2020",
    link: "event/launchDayReminder.html",
  },
  "Make Your Own Ghost At The Library": {
    about:
      "\rThese little ghosts will be a boo-tiful addition to your Halloween decorations! Join us for a morni...",
    date: "12/21/2021",
    link: "event/makeYourOwnGhostAtTheLibrary.html",
  },
  "Test Site": {
    about:
      "\rLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...",
    date: "3/7/2021",
    link: "event/testSite.html",
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
