let footerLinks = {
  info: {
    contact: {
      email: "BALibrarian@Bridge-Academy.lib.me.us",
      address: {
        street: "44 Middle Rd, Dresden, ME 04342",
        url:
          "https://google.com/maps/dir//dresden+library/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x4cadf37bdae60865:0x42de305e75709fc6?sa=X",
      },
      phone: 12077378810,
    },
    hours: {
      Sunday: "Closed",
      Monday: "Closed",
      Tuesday: "1:30pm - 7:00pm",
      Wednesday: "Closed",
      Thursday: "1:30pm - 7:00pm",
      Friday: "Closed",
      Saturday: "9:00am - 12:00pm",
    },
  },
  links: {
    About: "/about/about.html",
    Newsletter: "/newsletter/newsletter.html",
    Events: "./events.html",
    FAQ: "faq.html",
    Catalog: "catalog.html",
  },
};

Vue.component("Foot", {
  template: `
        <footer id="footer">
            <div class="f-grid">
                <div class="footer-info">
                    <address>
                        Email: <a :href="'mailto:' + data.info.contact.email">{{data.info.contact.email}}</a>
                        <br>
                        Phone: <a :href="'tel:' + data.info.contact.phone">{{ phoneNumberDisplay(data.info.contact.phone) }}</a>
                        <br>
                        Address: <a :href="data.info.contact.address.url" target="_blank" rel="noreferrer">{{data.info.contact.address.street}}</a>
                    </address>
                    <table>
                        <thead>Hours Open</thead>
                        <tbody>
                            <tr v-for="(time, day) in data.info.hours">
                                <td>{{day}}</td>
                                <td>{{time}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <ol>
                        <li v-for="(link, name) in data.links"><a :href="beginningDirectory(link)">{{name}}</a></li>
                    </ol>
                </div>
                <p class="copyright">Copyright {{date.getFullYear()}} Bridge Academy Public Library</p>
            </div>
        </footer>`,
  methods: {
    phoneNumberDisplay: function (phone) {
      phone = phone.toString();
      let phoneString = "";
      for (let i = 0; i < phone.length; i++) {
        switch (i) {
          case 1:
            phoneString += "(";
            break;
          case 4:
            phoneString += ") ";
            break;
          case 7:
            phoneString += "-";
            break;
        }
        phoneString += phone.charAt(i);
      }
      return phoneString;
    },
    beginningDirectory(path) {
      let cd = window.location.pathname;
      let slashCount = 0;
      while (cd.search("/") !== -1) {
        cd = cd.substring(cd.search("/") + 1, cd.length);
        slashCount++;
      }
      let cdLeave = "";
      for (let i = 1; i < slashCount; i++) {
        cdLeave += "../";
      }
      cdLeave += "./";
      return cdLeave + path;
    },
  },
  data() {
    return { data: footerLinks, date: new Date() };
  },
});

var footer = new Vue({
  el: "#footer",
});
