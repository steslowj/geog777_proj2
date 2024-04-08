/* ======================= Page Interactions ====================== */

function menuFunction() {
  var x = document.getElementById("buttonBoxNav");
  if (x.className === "buttonBox") {
    x.className += " responsive";
  } else {
    x.className = "buttonBox";
  }
}

function modalFunction() {
  var aboutModal = document.getElementById("aboutModal");
  aboutModal.style.display = "block";  
}

function spanFunction() {
  var aboutModal = document.getElementById("aboutModal");
  aboutModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == aboutModal) {
    aboutModal.style.display = "none";
  }
} 

/* ======================= Page to Map Interactions ====================== */

function changeValue(x) {
  
  /*x is the button id*/
  if (x.value === "") {
    
    /*for a click on any queryBtn, reset class of all queryBtns*/
    /*this allows for only one selected value at a time*/
    allQueryBtns = document.getElementsByClassName("queryBtn");
    for (let i = 0; i < allQueryBtns.length; i++) {
      allQueryBtns[i].value = "";
      allQueryBtns[i].className = "btn queryBtn";
    };

    /*set the value of clicked button (x) and add class*/
    x.value = "selected";
    x.className += " selected";
  } else {
    /*remove 'selected' from value and reset classes*/
    x.value = ""
    x.className = "btn queryBtn"
  }
}

function plantsBtnFunction() {
  var x = document.getElementById("plantsBtn")
  changeValue(x);
}

function animalsBtnFunction() {
  var x = document.getElementById("animalsBtn")
  changeValue(x)
}

function eventsBtnFunction() {
  var x = document.getElementById("eventsBtn")
  changeValue(x)
}

function facilitiesBtnFunction() {
  var x = document.getElementById("facilitiesBtn")
  changeValue(x)
}