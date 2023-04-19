// Firebase Authentication
const firebaseConfig = {
  apiKey: "AIzaSyCy1NZ33p2s8e0GhkjgKBe56ojYucqy2zQ",
  authDomain: "esp32water-7b3da.firebaseapp.com",
  databaseURL: "https://esp32water-7b3da-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esp32water-7b3da",
  storageBucket: "esp32water-7b3da.appspot.com",
  messagingSenderId: "149395523839",
  appId: "1:149395523839:web:be70b70a1c1540dbe8e4ca"
};
firebase.initializeApp(firebaseConfig);

var d = new Date();
var day = d.getDate();

var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
document.getElementById("date").innerHTML = day + "-" + month + "-" + year;
// Retrieve data from Firebase Realtime Database
const database = firebase.database();
// Reference to the Firebase database node to fetch data from
let dataRef = database.ref("readings/" + year + "/" + month + "/" + day);


// Fetch data from the Firebase node
// dataRef.once("value").then((snapshot) => {
  //   const data = snapshot.val();

//   if (data) {
//     const labels = Object.keys(data);
//     const values = Object.values(data);
//     const total = values.reduce((sum, value) => sum + value, 0);

//     let options = {
//       startAngle: -1.55,
//       size: 150,
//       value: 1,
//       fill: { gradient: ["#28313B", "#485461"] },
//     };
//     $(".circle .bar")
//       .circleProgress(options)
//       .on("circle-animation-progress", function (event, progress, stepValue) {
  //         $(this)
//           .parent()
//           .find("span")
//           .text(String(stepValue.toFixed(2).substr(2)) + "%");
//       });
//     $(".per .bar").circleProgress({
  //       value: (1000-total) / 1000,
  //     });
//     document.getElementById("text").innerHTML = total + "ml / 3000ml";
//   }
// });

const ctx = document.getElementById("myChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Water Intake (ml)",
        data: [],
        backgroundColor: "rgba(84, 58, 183, 1)",
        // borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 10,
        fill: {
          target: 'origin',
        }
        // barThickness: 25,
        // hoverBackgroundColor: "green"
      },
    ],
  },
  options: {
    // alignToPixels: true,
    indexAxis: 'y',
    // responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Water Intake (ml)',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Time (hh:mm:ss)',
        },
        beginAtZero: true,
      },
    },
    
  },
  // responsive: true,
});

// Update chart with data from Firebase Realtime Database


function showGraph(){
dataRef.on(
  "value",
  (snapshot) => {
    
    const data = snapshot.val();

    // Convert data to a format that can be used by Chart.js
    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((sum, value) => sum + value, 0);
    console.log(total);
    let options = {
      startAngle: -1.55,
      size: 150,
      value: 1,
      fill: { gradient: ["#28313B", "#485461"] },
    };
    $(".circle .bar")
    .circleProgress(options)
      .on("circle-animation-progress", function (event, progress, stepValue) {
        $(this)
          .parent()
          .find("span")
          .text(String(stepValue.toFixed(2).substr(2)) + "%");
      });
      $(".per .bar").circleProgress({
        value: total <= 15 ? 0.99 : ((total % 1000) / 1057)
      });
      document.getElementById("text").innerHTML = parseInt(total) + "ml / 3000ml";
    document.getElementById("filled").innerHTML = "Filled";

    // Update chart with new data
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update(); // Refresh the chart with new data
  },
  (error) => {
    console.log("Error retrieving data:", error);
  }
  );
}
showGraph();

// Show graph with date

const datePicker = document.getElementById('datepicker');

const today = year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0');

datePicker.setAttribute('max', today);
datePicker.value = today;

datePicker.addEventListener('change', (event) => {
  const selectedDate = new Date(datePicker.value);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1);
  const day = String(selectedDate.getDate());
  const formattedDate = `${year}-${month}-${day}`;
  document.getElementById("date").innerHTML = day + "-" + month + "-" + year;
  dataRef = database.ref("readings/" + year + "/" + month + "/" + day);
  showGraph();
  
});