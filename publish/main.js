//about context information for main web page
let items = {
  Newsletter: {
    //EJECT_NEWSLETTERS_START
stuff: [{"title":"2021 March","subtitle":false,"info":"\rFrom the developer -- Currently, newsletter page ...","link":"newsletter/march2021.html"},],
//EJECT_NEWSLETTERS_END
    link: "./newsletters.html",
  },
  Events: {
    //EJECT_EVENTS_START
stuff: [{"title":" Book , Bake ,  and Plant Sale","subtitle":"5/30/2021","info":"\rOur book, bake, and plant sale...","link":"event/Book,Bake, andPlantSale.html"},{"title":"Summer Reading Program","subtitle":"6/23/2020","info":"\rOur annual Summer Reading Program Begins...","link":"event/summerReadingProgram.html"},],
//EJECT_EVENTS_END
    link: "./events.html",
  },
};

//about information for main page
let about = {
  History: {
    history:
      "At one time there were 10 school districts [in Dresden,] each with its own one-room building. Students, especially the boys, attended when they were not needed on the farm. It was not until the latter part of the 1800's that some type of higher education was available. By 1890 Bridge Academy was established, by private endowment, providing the type of education that enabled young adults to go out into the world in other than the labor field...",
    link: "history.html",
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
    items: items,
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
// /response.data.items[0].volumeInfo.imageLinks.thumbnail
//this.isbn.Object.keys(ISBNnumbers)[i].src =

var aboutInfo = new Vue({
  el: "#about",
  data: {
    about: about,
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
