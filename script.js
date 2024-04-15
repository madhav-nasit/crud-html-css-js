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

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
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

// Set max date for DOB
const setMaxDob = () => {
  // Get today's date
  var today = new Date();

  // Format the date to YYYY-MM-DD
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  // Set the max attribute of the date input field to today
  document.getElementById("birthday").setAttribute("max", today);
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

  const existingUserIndex = userData.findIndex((user) => user.id === id);
  if (existingUserIndex != -1) {
    // Update existing user
    userData[existingUserIndex] = {
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
    };
    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("update-btn").style.display = "none";
    showSuccessMessage("User details updated successfully.");
  } else {
    userData.push({
      id: generateUniqueId(),
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
    showSuccessMessage("User details added successfully.");
  }
  renderUserList();
  form.reset();
};

// Function to show success message after form submission
const showSuccessMessage = (message) => {
  const alertView = document.getElementById("alert-view");
  setTimeout(() => {
    alertView.classList.add("show");
    alertView.innerHTML = message;
  }, 100);
  setTimeout(() => {
    alertView.classList.remove("show");
  }, 4000);
};

document.addEventListener("DOMContentLoaded", function () {
  // Initial render
  renderUserList();
  setMaxDob();
});

// Function to render user cards
const renderUserList = () => {
  const userListContainer = document.getElementById("userList");
  userListContainer.innerHTML =
    userData.length > 0 ? "" : "No user data found!";
  userData.forEach((user, index) => {
    generateUserCard(user, userListContainer, index);
  });
};

// Function to generate user cards
const generateUserCard = (user, userListContainer, index) => {
  const card = document.createElement("div");
  card.classList.add("user-card");

  card.innerHTML = `
    <div class="user-details">
      <p><span>No:</span> ${index + 1}</p>
      <p><span>Name:</span> ${user.fname} ${user.lname}</p>
      <p><span>Email:</span> ${user.email}</p>
      <p><span>Birthday:</span> ${user.birthday}</p>
      <p><span>State:</span> ${user.state}</p>
      <p><span>Gender:</span> ${user.gender}</p>
      <p><span>Hobbies:</span> ${user.hobby.join(", ")}</p>
    </div>
    <div class="user-buttons">
      <button class="edit" onclick="editUser('${user.id}')">Edit</button>
      <div class="horizontal-input-spacer"></div>
      <button class="delete" onclick="deleteUser('${user.id}')">Delete</button>
    </div>
  `;

  userListContainer.appendChild(card);
};

// Function to edit user data
const editUser = (userId) => {
  const userIndex = userData.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const user = userData[userIndex];
    // Populate form fields with user data for editing
    document.getElementById("id").value = user.id;
    document.getElementById("fname").value = user.fname;
    document.getElementById("lname").value = user.lname;
    document.getElementById("email").value = user.email;
    document.getElementById("birthday").value = user.birthday;
    document.getElementById("state").value = user.state;
    document.getElementById("password").value = user.password;
    document.getElementById("confirm-password").value = user.confirmPassword;

    // Set gender radio button
    const genderOptions = document.getElementsByName("gender");
    for (let i = 0; i < genderOptions.length; i++) {
      if (genderOptions[i].value === user.gender) {
        genderOptions[i].checked = true;
        break;
      }
    }

    // Set hobby checkboxes
    const hobbyCheckboxes = document.getElementsByName("hobby");
    for (let i = 0; i < hobbyCheckboxes.length; i++) {
      if (user.hobby.includes(hobbyCheckboxes[i].value)) {
        hobbyCheckboxes[i].checked = true;
      } else {
        hobbyCheckboxes[i].checked = false;
      }
    }

    // Change submit button to update button
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("update-btn").style.display = "block";

    // Scroll to the top of the form for better visibility
    document.getElementById("form-container").scrollIntoView();
  } else {
    console.error("User not found!");
  }
};

// Function to delete user data
const deleteUser = (userId) => {
  const userIndex = userData.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      userData.splice(userIndex, 1);
      renderUserList();
      showSuccessMessage("User details deleted successfully.");
    }
  } else {
    console.error("User not found!");
  }
};
