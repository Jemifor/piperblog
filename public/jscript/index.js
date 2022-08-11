(function () {
    "use strict";
    // Graphs
    var Mychart = document.getElementById("myChart");
    // eslint-disable-next-line no-unused-vars
    var myChart = new Chart(Mychart, {
      type: "line",
      data: {
        labels: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        datasets: [
          {
            data: [1239, 31575, 12930, 24200, 56489, 49232, 78034],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#007bff",
            borderWidth: 3,
            pointBackgroundColor: "#007bff",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
        legend: {
          display: true,
        },
      },
    });
  })();
  