// ==================================================================
//
// Initialisation of variables
//
// ====================================================================

let emotionChart = document.getElementById("emotion-chart").getContext("2d");
let partOfSpeechChart = document
  .getElementById("partOfSpeech-chart")
  .getContext("2d");
let keywordChart = document.getElementById("keyword-chart").getContext("2d");
let optionValues = [];
let responseSection = document.getElementById("response-section");
let selectTag = document.getElementById("response-select-tag");
let errorSection = document.getElementById("error-section");
let response = {};
var keyChart = new Chart(keywordChart);
var myPartOfSpeechChart = new Chart(partOfSpeechChart);
var myEmotionChart = new Chart(emotionChart);
// =====================================================================
//
//  Method to fix height of Hero Section
//
// =====================================================================

const heroWidth = () => {
  let navWidth = document.getElementById("navbar").offsetHeight;
  document.getElementById(
    "hero-section"
  ).style.minHeight = `calc(100vh - ${navWidth}px)`;
};
heroWidth();

// =====================================================================
//
// Method to give random colors in charts
//
// ======================================================================
function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + ", 0.5)";
}
function poolColors(a) {
  var pool = [];
  for (i = 0; i < a; i++) {
    pool.push(dynamicColors());
  }
  return pool;
}
// ======================================
//
// on Submit Method
//
// =====================================

const handleSubmit = (e) => {
  errorSection.style.display = "none";
  e.preventDefault();
  optionValues = [];
  let linkToFile = document.getElementById("file-link-input").value;
  axios
    .get(linkToFile)
    .then((res) => res.data)
    .then((res) => {
      response = res;
      res.data.map((singleObject) => {
        optionValues.push(singleObject.respondent_uen);
      });
    })
    .then(() => {
      let optionhtml = ``;
      optionhtml += optionValues.map((value) => {
        return `<option>${value}</option>`;
      });
      selectTag.innerHTML = optionhtml;
      initialiseCharts(selectTag.value);
      responseSection.style.display = "inline";
    })
    .catch(() => {
      errorSection.style.display = "grid";
    });
};

const initialiseCharts = (text) => {
  let obj = response.data.find((singleObject) => {
    return text === singleObject.respondent_uen;
  });

  let emotionChartData = obj.textProcessing.emotion.document.emotion;
  makeEmotionChart(emotionChartData);
  makePartOfSpeechChart(obj.partOfSpeech);
  makeKeyWordChart(obj.textProcessing.keywords);
  console.log(obj);
};
// ===========================================================
//
// Methods to make Charts
//
// ===========================================================

const makeKeyWordChart = (keywords) => {
  let label = [];
  let labelValue = [];

  keywords.map((singleKeyWord) => {
    labelValue.push(singleKeyWord.count);
    label.push(singleKeyWord.text);
  });
  const data = {
    datasets: [
      {
        label: "Count",
        data: labelValue,
        backgroundColor: poolColors(labelValue.length),
        borderColor: poolColors(labelValue.length),
      },
    ],
    labels: label,
  };
  keyChart.destroy();
  keyChart = new Chart(keywordChart, {
    type: "line",
    data: data,
  });
};
const makePartOfSpeechChart = (partOfSpeech) => {
  let data = makeChartDataObject(partOfSpeech, "Part of Speech");
  myPartOfSpeechChart.destroy();
  myPartOfSpeechChart = new Chart(partOfSpeechChart, {
    type: "bar",
    data: data,
  });
};
const makeEmotionChart = (emotionChartData) => {
  let data = makeChartDataObject(emotionChartData, "Emotion");
  myEmotionChart.destroy();
  myEmotionChart = new Chart(emotionChart, {
    type: "doughnut",
    data: data,
  });
};

// =====================================================================
//
// Method to make objects to be passed in chart data
//
// =====================================================================

const makeChartDataObject = (objectName, nameString) => {
  let label = [];
  let labelValue = [];
  for (key in objectName) {
    if (objectName.hasOwnProperty(key)) {
      label.push(key);
      labelValue.push(objectName[key]);
    }
  }
  const data = {
    datasets: [
      {
        label: nameString,
        data: labelValue,
        backgroundColor: poolColors(labelValue.length),
        borderColor: poolColors(labelValue.length),
      },
    ],
    labels: label,
  };
  return data;
};

const handleSelectTag = (e) => {
  e.preventDefault();
  initialiseCharts(e.target.value);
};
