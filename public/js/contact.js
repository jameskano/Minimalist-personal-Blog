// jshint esversion:9
const submitBTN = document.querySelector(".submit-btn");
const email = document.querySelector("#email");
const name = document.querySelector("#name");
const message = document.querySelector("#message");



// Validation contact form
function failure(input, text) {
  let small = document.querySelector(`.${input.id}`);
  input.classList.remove("success");
  input.classList.add("failure");
  small.innerText = text;
  small.classList.add("show");
}

function success(input) {
  let small = document.querySelector(`.${input.id}`);
  small.classList.remove("show");
  input.classList.remove("failure");
  input.classList.add("success");
  small.innerText = "";
}

// Inpur Required
function inputRequired(input) {
  let required = false;
  if (input.value.trim() === "") {
    failure(input, `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} is required`);
  } else {
    success(input);
    required = true;
  }
  return required;
}

// Email Validation
function emailVerification(input) {
  let required = false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.toLowerCase())) {
    success(input);
    required = true;
  } else {
    failure(input, "Email is not valid");
  }
  return required;
}

//Verification chain
function nameValidation() {
  inputRequired(name);
}

function emailValidation() {
  if(inputRequired(email)) {
    emailVerification(email);
  }
}

function messageValidation() {
  inputRequired(message);
}


submitBTN.addEventListener("click", function(e) {
  nameValidation();
  emailValidation();
  messageValidation();

  if (name.classList.contains("failure") || email.classList.contains("failure") || message.classList.contains("failure")) {
    e.preventDefault();
  }
});
