// Regular expressions for input validation
const nameRegex = /^[A-Za-z'-]+$/; // Matches alphabetical characters, hyphens, and apostrophes
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches email addresses
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches date strings in the format YYYY-MM-DD
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/; // Matches passwords with specific criteria

// Error message for password validation
const passwordError =
  "Password must contain a minimum of 8 characters, 1 uppercase, 1 lowercase, 1 numeric, and 1 special character.";

// Array to store user data
let userData = [];

// Function to generate a unique ID
window.onload = function () {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.id = "id";
  document.body.appendChild(hiddenInput);
  hiddenInput.value = uniqueId;
};

// Function to get input value by element ID
const getInputValueById = (elementId) => {
  const input = document.getElementById(elementId);
  return input?.value ?? "";
};

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to validate input on blur event
const validateInputOnBlur = (inputElement) => {
  if (!!inputElement) {
    switch (inputElement.id) {
      case "fname":
      case "lname":
        return validateField(inputElement, nameRegex);
      case "email":
        return validateField(inputElement, emailRegex);
      case "birthday":
      case "state":
      case "gender":
        return validateDob(inputElement);
      case "password":
        return validateField(inputElement, passwordRegex, passwordError);
      case "confirm-password":
        return validateConfirmPassword(inputElement);
      default:
        return true;
    }
  }
  return true;
};

// Function to validate input against a regular expression
const validateRegex = (regexPattern, inputString) => {
  try {
    const regex = new RegExp(regexPattern);
    return regex.test(inputString);
  } catch (error) {
    console.error("Invalid regex pattern:", error);
    return false;
  }
};

// Function to add error message to input element
const addError = (inputElement, errorSpan, message) => {
  let fieldName = inputElement?.placeholder || inputElement?.id;
  inputElement.classList.add("error");
  inputElement.style.borderColor = "red";
  errorSpan.textContent = capitalizeFirstLetter(fieldName) + " " + message;
};

// Function to remove error message from input element
const removeError = (inputElement, errorSpan) => {
  inputElement.classList.remove("error");
  inputElement.style.borderColor = "#e6e6e6";
  errorSpan.textContent = "";
};

// Function to add required error message
const addRequiredError = (
  inputElement,
  errorSpan,
  message = "is required."
) => {
  addError(inputElement, errorSpan, message);
};

// Function to add not valid error message
const addNotValidError = (
  inputElement,
  errorSpan,
  message = "is not valid."
) => {
  addError(inputElement, errorSpan, message);
};

// Function to validate input field
const validateField = (inputElement, regex, message) => {
  const inputValue = inputElement.value;
  const errorSpan = inputElement.nextElementSibling;
  if (inputElement.hasAttribute("required") && inputValue?.trim() === "") {
    addRequiredError(inputElement, errorSpan);
    return false;
  } else if (regex && !validateRegex(regex, inputValue)) {
    if (message) {
      addNotValidError(inputElement, errorSpan, message);
    } else {
      addNotValidError(inputElement, errorSpan);
    }
    return false;
  } else {
    removeError(inputElement, errorSpan);
    return true;
  }
};

// Function to validate date of birth
const validateDob = (inputElement) => {
  const dateValue = inputElement.value;
  const errorSpan = inputElement.nextElementSibling;
  const [year, month, day] = dateValue.split("-").map(Number);
  const dobDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  if (inputElement.hasAttribute("required") && dateValue?.trim() === "") {
    addRequiredError(inputElement, errorSpan);
    return false;
  } else if (dobDate > currentDate) {
    addNotValidError(inputElement, errorSpan, "must be in past date.");
    return false;
  } else {
    removeError(inputElement, errorSpan);
    return true;
  }
};

// Function to validate confirm password
const validateConfirmPassword = (inputElement) => {
  const inputValue = inputElement.value;
  const errorSpan = inputElement.nextElementSibling;
  const password = getInputValueById("password");
  if (inputElement.hasAttribute("required") && inputValue?.trim() === "") {
    addRequiredError(inputElement, errorSpan);
    return false;
  } else if (inputValue !== password) {
    addNotValidError(inputElement, errorSpan, "do not match.");
    return false;
  } else {
    removeError(inputElement, errorSpan);
    return true;
  }
};

// Function to validate form on click event
const validateFormOnClick = () => {
  let isValid = true;
  var inputs = document.querySelectorAll(
    "#form-container input, #form-container select"
  );
  inputs.forEach((inputElement) => {
    const isError = validateInputOnBlur(inputElement);
    if (!isError) {
      isValid = false;
    }
  });
  if (isValid) {
    onFormSubmit();
  }
};

// Function to handle form submission
const onFormSubmit = () => {
  // Implement form submission logic here
  const form = document.getElementById("form-container");
  const id = getInputValueById("id");
  const fname = getInputValueById("fname");
  const lname = getInputValueById("lname");
  const email = getInputValueById("email");
  const birthday = getInputValueById("birthday");
  const state = getInputValueById("state");
  let gender = "";
  const genderOptions = document.getElementsByName("gender");
  for (let i = 0; i < genderOptions.length; i++) {
    if (genderOptions[i].checked) {
      gender = genderOptions[i].value;
      break;
    }
  }
  const hobby = [];
  const hobbyCheckboxes = document.getElementsByName("hobby");
  for (let i = 0; i < hobbyCheckboxes.length; i++) {
    if (hobbyCheckboxes[i].checked) {
      hobby.push(hobbyCheckboxes[i].value);
    }
  }
  const password = getInputValueById("password");
  const confirmPassword = getInputValueById("confirm-password");

  userData.push({
    id,
    fname,
    lname,
    email,
    birthday,
    state,
    gender,
    hobby,
    password,
    confirmPassword,
  });
  showSuccessMessage();
  form.reset();
};

// Function to show success message after form submission
const showSuccessMessage = () => {
  const alertView = document.getElementById("alert-view");
  setTimeout(function () {
    alertView.classList.add("show");
    alertView.innerHTML = "User added successfully.";
  }, 100);
  setTimeout(function () {
    alertView.classList.remove("show");
    console.log("userData", userData);
  }, 4000);
};
