(function () {
  document.body.style.backgroundColor = "black";
  document.body.style.color = "white";
  document.getElementsByClassName("banner")[0].style.backgroundColor = "#333";
  document.getElementsByClassName("banner")[0].style.padding = "24px";
  document.querySelectorAll("a").forEach(function (a) {
    a.style.color = "white";
  });
  document.querySelectorAll("input").forEach(function (a) {
    a.style.color = "white";
    a.style.backgroundColor = "#111";
  });
  document.querySelectorAll(".start > *").forEach(function (child) {
    child.style.fontSize = "64px";
  });
  // Callback function to execute when mutations are observed
  var times = [];
  var lastCallbackTime = Date.now();

  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        var currentTime = Date.now();
        var timeSinceLastCallback = currentTime - lastCallbackTime;
        lastCallbackTime = currentTime;

        times.push({
          problem: document.querySelector(".problem").textContent,
          time: timeSinceLastCallback,
        });
      }
    }
  };

  var observer = new MutationObserver(callback);
  var config = { childList: true, subtree: true };
  var target = document.querySelector(".problem");

  if (target) {
    observer.observe(target, config);
  } else {
    console.log("Target element not found");
  }

  window.save = 0;
  setInterval(function () {
    // console.log("THIS STARTED");
    secondsHTML = document.getElementsByClassName("left")[0].innerHTML;
    var seconds = parseInt(secondsHTML.match(/\d+/g).map(Number));

    scoreHTML = document.getElementsByClassName("correct")[0].innerHTML;
    var score = parseInt(scoreHTML.match(/\d+/g).map(Number));
    chrome.storage.sync.get("data", function (items) {
      if (!chrome.runtime.error) {
        window.urlVal = items.data;
        // console.log(items.data);
      }
    });
    var save = seconds === 0 && window.save === 0;
    if (save) {
      var xhr = new XMLHttpRequest();
      var url = window.urlVal;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          //var json = JSON.parse(xhr.responseText);
          console.log(xhr.responseText);
        }
      };
      var editedTimes = times.filter((_, index) => index % 2 === 0);
      var data = JSON.stringify({ score, times: editedTimes });
      xhr.send(data);
      console.log("GAME COMPLETED");
      console.log("Score: ", score);
      console.log("Seconds: ", seconds);
      console.log("SAVED RESULTS");
      window.save = 1;
    }

    document.body.style.backgroundColor = "black";
  }, 300);
})();
