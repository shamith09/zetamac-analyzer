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
  var audio = new Audio();
  audio.src =
    "https://soundboardguy.com/wp-content/uploads/2022/05/moan-By-Tuna.mp3";

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        // Reset audio to start and play
        audio.currentTime = 0;
        audio.play();
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Options for the observer (which mutations to observe)
  var config = { childList: true, subtree: true };

  // Select the target node
  var target = document.querySelector(".problem");

  // Check if there's a target node to avoid errors
  if (target) {
    // Start observing the target node for configured mutations
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
      var data = JSON.stringify({ score: score });
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
