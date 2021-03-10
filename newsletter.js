newsletters = {
  "2021 May": {
    about: "\r<b>New Book by local author:</b>  After many year...",
    date: "2021 May",
    link: "htmlLoaded/newsletter/july2021.html",
  },
  "2021 February": {
    about: "\rCHIP books: Thanks to a grant from the Community ...",
    date: "2021 February",
    link: "htmlLoaded/newsletter/march2021.html",
  },
  "2021 April": {
    about: "\rDid you know?  The Maine Infonet Download Library...",
    date: "2021 April",
    link: "htmlLoaded/newsletter/may2021.html",
  },
};
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
