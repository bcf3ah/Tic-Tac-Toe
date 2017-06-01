$(document).ready(function() {
  $("#introModal").modal();
  $("#gameOverModal").modal();
  $("#introModal").modal("open");
});

var userMark;
var computerMark;

var pathways = [
  { "1": "", "2": "", "3": "", X: 0, O: 0, status: "open" },
  { "4": "", "5": "", "6": "", X: 0, O: 0, status: "open" },
  { "7": "", "8": "", "9": "", X: 0, O: 0, status: "open" },
  { "1": "", "4": "", "7": "", X: 0, O: 0, status: "open" },
  { "2": "", "5": "", "8": "", X: 0, O: 0, status: "open" },
  { "3": "", "6": "", "9": "", X: 0, O: 0, status: "open" },
  { "1": "", "5": "", "9": "", X: 0, O: 0, status: "open" },
  { "7": "", "5": "", "3": "", X: 0, O: 0, status: "open" }
];

var pathwaysCopy = JSON.parse(JSON.stringify(pathways));

var round = 1;
var isGameActive = true;
var teamChosen = false;

$(".chooseX").click(() => {
  userMark = "X";
  computerMark = "O";
  isGameActive = true;
  teamChosen = true;
  $(".playButton").removeClass("disabled");
});

$(".chooseO").click(() => {
  userMark = "O";
  computerMark = "X";
  isGameActive = true;
  teamChosen = true;
  $(".playButton").removeClass("disabled");
});

  $(".flexbox").click(e => {
    var boxNum = e.target.name;
    var aclicked = $("a[name=" + boxNum + "]").data("clicked");
    if (isGameActive && !aclicked) {
      userMove(boxNum, userMark);
      if (isGameActive) {
        computerMove(computerMark);
      } else {
        setTimeout(() => {
          reset("Player");
        }, 300);
      }
    }
  });

  function userMove(boxNum, mark) {
    for (path of pathwaysCopy) {
      if (path.hasOwnProperty(boxNum)) {
        path[boxNum] = mark;
        inc = path[mark] + 1;
        path[mark] = inc;
        $("a[name=" + boxNum + "] p").text(mark);
        $("a[name=" + boxNum + "]").data("clicked", true);
        switch (path[mark]) {
          case 3:
            isGameActive = false;
            break;
          case 2:
            path["status"] = "danger";
            break;
          case 1:
            path["status"] = "alert";
            break;
          default:
            console.log(
              "something went wrong with the switch statement in userMove"
            );
        }

        if (path[userMark] + path[computerMark] === 3) {
          path["status"] = "closed";
        }
      }
    }
  }

  function computerMove(mark) {
    //fill the middle if it is still clear
    if (pathwaysCopy[1]["5"] === "") {
      fillBoxes("5", mark);
    } else {
      //see if any pathways are up for winning now
      for (path of pathwaysCopy) {
        if (path[mark] === 2) {
          var boxToFill;
          for (key in path) {
            if (path[key] === "") {
              boxToFill = key;
              break;
            }
          }
          if (boxToFill) {
            $("a[name=" + boxToFill + "] p").text(mark);
            $("a[name=" + boxToFill + "]").data("clicked", true);
            setTimeout(() => {
              reset("Computer");
            }, 300);
            return;
          }
        }
      }

      var temp = checkStatus("danger");
      if (temp) {
        var boxToFill;
        for (key in temp) {
          if (temp[key] === "") {
            boxToFill = key;
            break;
          }
        }
        fillBoxes(boxToFill, mark);
        $("a[name=" + boxToFill + "] p").text(mark);
        $("a[name=" + boxToFill + "]").data("clicked", true);
      }
      if (!temp) {
        temp = checkStatus("alert");
        if (temp) {
          var boxToFill;
          for (key in temp) {
            if (temp[key] === "") {
              boxToFill = key;
              break;
            }
          }
          fillBoxes(boxToFill, mark);
          $("a[name=" + boxToFill + "] p").text(mark);
          $("a[name=" + boxToFill + "]").data("clicked", true);
        } else {
          setTimeout(() => {
            reset("No one");
          }, 300);
        }
      }
    }
  }

  function checkStatus(status) {
    return _.find(pathwaysCopy, ["status", status]);
  }

  function fillBoxes(boxNumber, mark) {
    for (path of pathwaysCopy) {
      if (path.hasOwnProperty(boxNumber)) {
        path[boxNumber] = mark;
        inc = path[mark] + 1;
        path[mark] = inc;
        $("a[name=" + boxNumber + "] p").text(mark);
        $("a[name=" + boxNumber + "]").data("clicked", true);
      }

      if (path[mark] === 3) {
        setTimeout(() => {
          reset("Computer");
        }, 300);
        break;
      }

      if (path[userMark] + path[computerMark] === 3) {
        path["status"] = "closed";
      }
    }
  }

  function reset(winner) {
    $("#whoWins").text(winner);
    if (winner === "Player") {
      var inc = $("#playerScore").text();
      inc++;
      $("#playerScore").text(inc);
    }
    if (winner === "Computer") {
      var inc = $("#computerScore").text();
      inc++;
      $("#computerScore").text(inc);
    }
    round++;
    isGameActive = false;
    for (var i = 1; i <= 9; i++) {
      $("a[name=" + i.toString() + "] p").text("");
    }
    $("#gameOverModal").modal("open");
  }

  $("#playAgain").click(() => {
    isGameActive = true;
    $("#round").text(round);
    pathwaysCopy = JSON.parse(JSON.stringify(pathways));
    for (var i = 0; i <= 9; i++) {
      $("a[name=" + i + "]").data("clicked", false);
    }
    if (round % 2 === 0) {
      fillBoxes("5", computerMark);
    }
  });
