/*
 * NodeJS Script that creates events and newsletters HTML pages
 *
 */

var fs = require("fs");

var dirname = "textFiles/"; //Main directory folder
var templateFileDir = "template"; //name of folder with HTML Templates
var wordSwitch = "{{OOPBA}}"; //Key word in HTML template to switch words
var dateSwitch = "{{DATE}}"; //Key word in HTML template to switch date
var titleSwitch = "{{TITLE}}"; //Key word in HTML template to switch title

saveAllFiles(readFiles(dirname));

/**
 * Reads all the files and templates in the directory.
 * From the files and folders, there are folder classes and
 * file classes.
 *
 * @param {string} dirname - Directory name of text files
 * @returns {Objects[]} - Array of folder classes for making HTML pages
 */
function readFiles(dirname) {
  let foldersArray = [];
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      err(err);
      return;
    }
    //loop through each directory
    filenames.forEach(function (folderName) {
      if (folderName !== templateFileDir) {
        fs.readdir(dirname + folderName, function (err, folders) {
          if (err) {
            err(err);
            return;
          }
          let folderNow;
          //checks if it's a special folder
          switch (folderName) {
            case "event":
              foldersNow = new EventFolder(folderName);
              break;
            case "newsletter":
              foldersNow = new NewsletterFolder(folderName);
              break;
            default:
              foldersNow = new FolderTxt(folderName);
              break;
          }
          folders.forEach(function (fileName) {
            foldersNow.files.push(addWhichFile(folderName, dirname, fileName));
          });
          foldersArray.push(foldersNow);
        });
      }
    });
  });
  return foldersArray;
}

/**
 * Determines which file class should be used based on folder name
 *
 * @param {string} folderName - Name of the folder the file is in
 * @param {string} dirname - The directory of all the text files
 * @param {string} fileName - Name of the file
 * @returns {Object[]} - Specific file object depending on the folder name
 */
function addWhichFile(folderName, dirname, fileName) {
  switch (folderName) {
    case "event":
      return new EventFile(
        fileName,
        fs.readFileSync(dirname + folderName + "/" + fileName, {
          encoding: "utf8",
        })
      );
    case "newsletter":
      return new NewsletterFile(
        fileName,
        fs.readFileSync(dirname + folderName + "/" + fileName, {
          encoding: "utf8",
        })
      );
    default:
      return new FileTxt(
        fileName,
        fs.readFileSync(dirname + folderName + "/" + fileName, {
          encoding: "utf8",
        })
      );
  }
}

/**
 * @class regular text file
 */
class FileTxt {
  /**
   * Creates an instance of FileTxt
   *
   * @param {string} fileName - Name of file
   * @param {string} text - Text within the file
   */
  constructor(fileName, text) {
    this.fileName = fileName.replace(".txt", "");
    this.text = text.replace(/\n/g, "");
  }
}

/** @class event text file */
class EventFile extends FileTxt {
  /**
   * Creates an instance of EventFile
   *
   * @param {string} fileName - Name of file
   * @param {string} text - Text within the file
   */
  constructor(fileName, text) {
    let fullText = text;
    while (text.search("}") !== -1) {
      text = text.substring(text.search("}") + 1, text.length);
    }
    super(fileName, text);
    this.date = this.finDate(fullText);
    this.title = this.pascalCaseToTitle(fileName);
  }
  /**
   * Looks for date within the file by looking for {date:12-02-2021}
   *
   * @param {string} text - Text within the file
   * @returns {Date} - Date object of the date set in file
   */
  finDate(text) {
    let dateString = "No Date";
    if (text.search("{") >= 0) {
      let stringInfo = text.substring(text.search("{") + 1, text.search("}"));
      if (stringInfo.toLowerCase().search("date:") !== -1) {
        dateString = stringInfo.substring(
          stringInfo.search(":") + 1,
          stringInfo.length
        );
      }
    }
    return new Date(dateString);
  }
  /**
   * Turns the name of the file pascalCase or CamelCase to a string
   * with spaces and capital letters.
   *
   * @param {string} fileName - Name of the file
   * @returns {string} - Title of file
   */
  pascalCaseToTitle(fileName) {
    let stringBuilt = "";
    fileName = fileName.substring(0, fileName.search(".txt"));
    for (let i = 0; i < fileName.length; i++) {
      if (fileName.charAt(i) == fileName.charAt(i).toUpperCase()) {
        stringBuilt += " " + fileName.charAt(i);
      } else if (i == 0) {
        stringBuilt += fileName.charAt(i).toUpperCase();
      } else {
        stringBuilt += fileName.charAt(i);
      }
    }
    return stringBuilt;
  }
}

/** @class newsletter text file */
class NewsletterFile extends FileTxt {
  /**
   * Creates an instance of NewsletterFile
   *
   * @param {string} fileName - Name of file
   * @param {string} text - Text within the file
   */
  constructor(fileName, text) {
    let fullText = text;
    //remove start of the text file info
    while (text.search("}") !== -1) {
      text = text.substring(text.search("}") + 1, text.length);
    }
    super(fileName, text);
    this.date = this.finDate(fullText);
  }
  /**
   * Looks for date within the file by looking for {date:12-02-2021}
   *
   * @param {string} text - Text within the file
   * @returns {Date} - Date object of the date set in file
   */
  finDate(text) {
    let dateString = "No Date";
    if (text.search("{") >= 0) {
      let stringInfo = text.substring(text.search("{") + 1, text.search("}"));
      if (stringInfo.toLowerCase().search("date:") !== -1) {
        dateString = stringInfo.substring(
          stringInfo.search(":") + 1,
          stringInfo.length
        );
      }
    }
    return new Date(dateString);
  }
}

/** @class Folder class of text files */
class FolderTxt {
  files = [];
  /**
   * Creates an instance of FolderTxt
   *
   * @param {string} name - Name of the folder
   */
  constructor(name) {
    this.name = name;
    let dirHTMLTemp = dirname + templateFileDir + "/" + name + ".html";
    //check if there a HTML template with the folder name
    if (fs.existsSync(dirHTMLTemp)) {
      this.html = fs.readFileSync(dirHTMLTemp, {
        encoding: "utf8",
      });
    } else {
      this.html = undefined;
      console.log(
        "ERROR: Template file doesn't exist for " +
          this.name +
          "  path: " +
          dirHTMLTemp +
          " !!!!"
      );
    }
  }
  /**
   * adds file objects an array of the files within the folder
   *
   * @param {File Object} file - File object that is in the folder
   */
  addFile(file) {
    this.files.push(file);
  }
  /**
   * saves each file within the folder as new HTML page
   */
  saveFiles() {
    for (let file of this.files) {
      if (this.html !== undefined) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        if (!fs.existsSync(this.name)) {
          fs.mkdirSync(this.name);
        }
        fs.writeFile(
          this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) err(err);
          }
        );
        console.log(this.name + "/" + file.fileName + ".html saved!!");
      }
    }
  }
  /**
   * removes all matches of a string with new string.
   * used for switch template words with content
   *
   * @param {string} text - text that is being filtered
   * @param {string | regex} searching - string or regex of word that is being matched
   * @param {string} replacer - string that is replacing the matched string or regex
   * @returns {string} - updated text with replaced words
   */
  replaceAllStrings(text, searching, replacer) {
    while (text.search(searching) !== -1) {
      text = text.replace(searching, replacer);
    }
    return text;
  }
}

/** @class Folder class of event text files */
class EventFolder extends FolderTxt {
  /**
   * Creates an instance of EventFolder
   *
   * @param {string} name - Name of the folder aka should be "event"
   */
  constructor(name) {
    super(name);
  }
  /**
   * saves each file within the folder as new HTML page
   * @override
   */
  saveFiles() {
    if (this.html !== undefined) {
      let eventsJSON = {};
      for (let file of this.files) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        //make new directory if it's not there
        if (!fs.existsSync(this.name)) {
          fs.mkdirSync(this.name);
        }
        //switching all the template words with context
        fileData = this.replaceAllStrings(
          fileData,
          dateSwitch,
          dateToString(file.date)
        );
        fileData = this.replaceAllStrings(fileData, titleSwitch, file.title);
        //creating object of file information for injecting JSON in VueJS files
        eventsJSON[file.title] = {
          about: file.text.substring(0, 100) + "...",
          date: dateToString(file.date),
          link: this.name + "/" + file.fileName + ".html",
        };
        //writes the file
        fs.writeFile(
          this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) err(err);
          }
        );
        console.log(this.name + "/" + file.fileName + ".html saved!!");
      }
      //injection methods
      this.injectEventLinks(eventsJSON);
      this.injectEventsMainPage(eventsJSON);
    } else {
      console.log("ERROR: File Not Load :: No HTML Template");
    }
  }
  /**
   * Injects information about the event file in events page
   * to make dynamic cards that links to each event page
   *
   * @param {Object} aboutJSON - Object of the event info
   */
  injectEventLinks(aboutJSON) {
    let eventFile = fs.readFileSync("events.js").toString();
    eventFile = eventFile.substring(
      eventFile.search("//EJECTION_AWAY"),
      eventFile.length
    );
    eventFile = "events = " + JSON.stringify(aboutJSON) + "\n" + eventFile;
    try {
      const data = fs.writeFileSync("events.js", eventFile);
    } catch (err) {
      err(err);
    }
  }
  /**
   *  Injects information about two of the events onto the main page
   *  as a teaser to look into
   *
   * @param {Object} aboutJSON - Object of the event info
   */
  injectEventsMainPage(aboutJSON) {
    let stuffs = [];
    let stuff = {};
    let c = 0;
    while (c < 2 && Object.keys(aboutJSON)[c] !== undefined) {
      stuff["title"] = Object.keys(aboutJSON)[c];
      stuff["subtitle"] = aboutJSON[Object.keys(aboutJSON)[c]]["date"];
      stuff["info"] = removeHTMLTags(
        aboutJSON[Object.keys(aboutJSON)[c]]["about"]
      );
      stuff["link"] = aboutJSON[Object.keys(aboutJSON)[c]]["link"];
      stuffs.push(JSON.stringify(stuff) + ",");
      c++;
    }
    let injectionString = "stuff: [";
    for (let objectString of stuffs) {
      injectionString += objectString;
    }
    injectionString += "],";
    let mainFile = fs.readFileSync("main.js").toString();
    mainFile =
      mainFile.substring(
        0,
        mainFile.search("//EJECT_EVENTS_START") + "//EJECT_EVENTS_START".length
      ) +
      "\n" +
      injectionString +
      "\n" +
      mainFile.substring(
        mainFile.search("//EJECT_EVENTS_END"),
        mainFile.length
      );
    try {
      const data = fs.writeFileSync("main.js", mainFile);
    } catch (err) {
      err(err);
    }
  }
}

/** @class Folder class of newsletter text files */
class NewsletterFolder extends FolderTxt {
  /**
   * Creates an instance of NewsletterFolder
   *
   * @param {string} name - Name of the folder aka should be "newsletter"
   */
  constructor(name) {
    console.log(name);
    super(name);
  }
  /**
   * saves each file within the folder as new HTML page
   * @override
   */
  saveFiles() {
    if (this.html !== undefined) {
      let newsletterInfo = {};
      for (let file of this.files) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        if (!fs.existsSync(this.name)) {
          fs.mkdirSync(this.name);
        }
        fileData = this.replaceAllStrings(
          fileData,
          dateSwitch,
          this.dateToNewsletterTitle(file.date)
        );
        newsletterInfo[this.dateToNewsletterTitle(file.date)] = {
          about: file.text.substring(0, 50) + "...",
          date: this.dateToNewsletterTitle(file.date),
          link: this.name + "/" + file.fileName + ".html",
        };
        fs.writeFile(
          this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) err(err);
          }
        );
        console.log(this.name + "/" + file.fileName + ".html saved!!");
      }
      this.injectNewsletterLinks(newsletterInfo);
      this.injectEventsMainPage(newsletterInfo);
    } else {
      console.log("ERROR: File Not Load :: No HTML Template");
    }
  }
  /**
   * Injects information about the newletters file in newletters page
   * to make dynamic cards that links to each newletter page
   *
   * @param {Object} aboutJSON - Object of the newletter info
   */
  injectNewsletterLinks(aboutJSON) {
    let newsletterFile = fs.readFileSync("newsletter.js").toString();
    newsletterFile = newsletterFile.substring(
      newsletterFile.search("//EJECTION_AWAY"),
      newsletterFile.length
    );
    console.log(newsletterFile);
    newsletterFile =
      "newsletters = " + JSON.stringify(aboutJSON) + "\n" + newsletterFile;
    try {
      const data = fs.writeFileSync("newsletter.js", newsletterFile);
    } catch (err) {
      err(err);
    }
  }
  /**
   *  Injects information about three of the latest newsletters onto the main page
   *  as a teaser to look into
   *
   * @param {Object} aboutJSON - Object of the newsletter info
   */
  injectEventsMainPage(aboutJSON) {
    let stuffs = [];
    let stuff = {};
    let c = 0;
    while (c < 3 && Object.keys(aboutJSON)[c] !== undefined) {
      stuff["title"] = Object.keys(aboutJSON)[c];
      stuff["subtitle"] = false;
      stuff["info"] = removeHTMLTags(
        aboutJSON[Object.keys(aboutJSON)[c]]["about"]
      );
      stuff["link"] = aboutJSON[Object.keys(aboutJSON)[c]]["link"];
      stuffs.push(JSON.stringify(stuff) + ",");
      c++;
    }
    let injectionString = "stuff: [";
    for (let objectString of stuffs) {
      injectionString += objectString;
    }
    injectionString += "],";
    let mainFile = fs.readFileSync("main.js").toString();
    mainFile =
      mainFile.substring(
        0,
        mainFile.search("//EJECT_NEWSLETTERS_START") +
          "//EJECT_NEWSLETTERS_START".length
      ) +
      "\n" +
      injectionString +
      "\n" +
      mainFile.substring(
        mainFile.search("//EJECT_NEWSLETTERS_END"),
        mainFile.length
      );
    try {
      const data = fs.writeFileSync("main.js", mainFile);
    } catch (err) {
      err(err);
    }
  }
  /**
   * Changes the date to a string for displaying on website
   *
   * @param {Date} date - Date Object of newsletter
   * @returns {string} - String of the year and month
   */
  dateToNewsletterTitle(date) {
    let monthString;
    switch (date.getMonth()) {
      case 0:
        monthString = "January";
        break;
      case 1:
        monthString = "February";
        break;
      case 2:
        monthString = "March";
        break;
      case 3:
        monthString = "April";
        break;
      case 4:
        monthString = "May";
        break;
      case 5:
        monthString = "June";
        break;
      case 6:
        monthString = "July";
        break;
      case 7:
        monthString = "August";
        break;
      case 8:
        monthString = "September";
        break;
      case 9:
        monthString = "October";
        break;
      case 10:
        monthString = "November";
        break;
      case 11:
        monthString = "December";
        break;
      default:
        monthString = "Month is Null!!";
        break;
    }
    return date.getFullYear() + " " + monthString;
  }
  /**
   * Rearrange file in files by date (for the three latest newsletter on main page)
   */
  sortDates() {
    this.files = this.files.sort((a, b) => b.date - a.date);
  }
}

/**
 * Saves each file in a folder of an array of Folder Objects
 *
 * @param {Folder Object[]} foldersArray - Array of folders
 */
function saveAllFiles(foldersArray) {
  setTimeout(function test() {
    console.log(foldersArray.length);
    for (foldez of foldersArray) {
      foldez.saveFiles();
    }
  }, 5000);
}

/**
 * Changes the date to a string
 *
 * @param {Date} date - The date
 * @returns {string} - String of the day, month, and year as MM/DD/YYYY
 */
function dateToString(date) {
  let stringDate =
    date.getMonth() + 1 + "/" + (date.getDate() + 1) + "/" + date.getFullYear();
  return stringDate;
}

/**
 * Removes all HTML tags from the text
 *
 * @param {string} text - The text
 * @returns {string} - Updated text
 */
function removeHTMLTags(text) {
  const HTML_REGEX = /<.*>/;
  while (text.search(HTML_REGEX) !== -1) {
    text = text.replace(HTML_REGEX, "");
  }
  return text;
}

function err(err) {
  console.log(err);
}
