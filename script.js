// Opening and closing functions 
const addEmployeeModal = document.getElementById('addEmployeeModal');
//open add employee Modal
function openAddEmployee() {
    addEmployeeModal.style.display = 'block';
}

//close add employee Modal
function closeAddEmployee() {
    addEmployeeModal.style.display = 'none';
    clearModalInputs();
}

// dropdown 
function myFunction(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'flex';
    }
}

const del_emp = document.getElementById('deleteEmployeeModal');
//open delete employee Modal
async function deleteEmployeeById(empID) {
    var value = empID;
    del_emp.style.display = 'block';

    const delButton = document.querySelector('#deletediv #deleteButton');
    delButton.addEventListener('click', function (e) {
        DeleteEmployee(empID);
    });
}

//close delete employee Modal
function closeDelEmployee() {
    del_emp.style.display = 'none';
}

const edit_emp = document.getElementById('editEmployeeModal');
//close Edit employee Modal
function closeEditEmployee() {
    edit_emp.style.display = 'none';
    clearModalInputs();
}

// to select employee image 
const uploadUserImage = document.getElementById('fileUpload');
const fileInput = document.getElementById('imgUpload');
const imageSection = document.getElementById('imageSection');
const imagePreview = document.getElementById('image_preview');

// fileInput.addEventListener('click', function (e) {
//     uploadUserImage.click();
// });

uploadUserImage.addEventListener('change', function (e) {
    const selectedImage = uploadUserImage.files[0];

    if (selectedImage) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const imageUrl = event.target.result;

            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;

            imagePreview.innerHTML = '';
            imagePreview.appendChild(imgElement);
            imageSection.style.display = 'flex';
            fileInput.style.display = 'none';
        };

        reader.readAsDataURL(selectedImage);
    }
});

// function to upload employee image
async function uploadImage(empID, file) {

    const empAvatar = new FormData();
    empAvatar.append('avatar', file);

    fetch(`http://localhost:3000/employees/${empID}/avatar`, {
        method: 'POST',
        body: empAvatar
    }).then((res) => res.json())
        .then((value) => console.log(value))
        .catch((error) => console.error(error));
}

// Reading employee data from api
ReadEmployee();

async function ReadEmployee() {
    try {
        const response = await fetch('http://localhost:3000/employees');
        const empData = await response.json();

        let temp = "";
        let maxCountOnPage = 5;

        let totalPage = Math.ceil(empData.length / maxCountOnPage);
        const currentPage = Pagination(totalPage);

        for (var i = (currentPage - 1) * maxCountOnPage; i < Math.min(empData.length, currentPage * maxCountOnPage); i++) {

            const emp = empData[i];
            const dropdownId = `emp_${i}`;
            // const imageUrl = await getImage(emp.id);


            temp += `
            <tr class="table_row" id="empRow_${emp.id}">
            <td>#${i + 1}</td>
            <td><span class="icon"><img src="http://localhost:3000/employees/${emp.id}/avatar" alt="img">${emp.salutation} ${emp.firstName} ${emp.lastName}</span></td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.gender}</td>
            <td>${emp.dob}</td>
            <td>${emp.city}</td>
            <td>
                <div class="dropdown" id="dropDown">
                    <button onclick="myFunction('${dropdownId}')" class="btn btn-secondary" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <span class="material-symbols-rounded"> more_horiz </span>
                    </button>
                   <ul class="dropdown-details" id="${dropdownId}">
    
                        <li><a href="javascript:void(0)" id="viewButton" onclick="viewEmployeeById('${emp.id}')" ><span class="material-symbols-outlined">
                                    visibility
                                </span>View Details</a></li>
    
                        <li><a href="javascript:void(0)" id="editButton" onclick="editEmployeeById('${emp.id}')"><span class="material-symbols-outlined">
                                    edit
                                </span> Edit </a></li>
                                
                        <li><a href="javascript:void(0)" id="deleteButton" onclick="deleteEmployeeById('${emp.id}')"><span class="material-symbols-outlined">
                                    delete
                                </span> Delete </a></li>
                    </ul>
                </div>
            </td>
        </tr>
            `;
        }

        document.getElementById('employeeList').innerHTML = temp;

    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
}

// Pagination
var currentPage = 1;

function Pagination(totalPage) {
    const pagination = document.getElementById('pagination');

    if (totalPage > 1) {

        pagination.style.display = 'flex';

        var temp = `<button id="prev-btn"><span class="material-symbols-outlined">navigate_before</span></button>`;

        for (var i = 1; i <= totalPage; i++) {
            temp += ` <button id="page${i}">${i}</button>`;
        }

        temp += `<button id="next-btn"><span class="material-symbols-outlined">navigate_next</span></button>`;

        pagination.innerHTML = temp;

        for (var i = 1; i <= totalPage; i++) {
            (function (pageNumber) {
                const pageCounter = document.getElementById(`page${pageNumber}`);
                pageCounter.addEventListener('click', function (e) {
                    currentPage = pageNumber;
                    ReadEmployee();
                });
            })(i);
        }
    }
    const currentPageBtn = document.getElementById(`page${currentPage}`);
    currentPageBtn.style.backgroundColor = '#4318FF';
    currentPageBtn.style.color = '#FFF';

    const PrevBtn = document.getElementById('prev-btn');
    if (currentPage == 1) {
        PrevBtn.style.display = 'none';
    }
    PrevBtn.addEventListener('click', function (e) {
        if (currentPage > 1) {

            PrevBtn.style.backgroundColor = '#4318FF';
            PrevBtn.style.color = '#FFF';

            currentPage--;
            ReadEmployee();
        }
    });

    const NextBtn = document.getElementById('next-btn');
    if (currentPage == totalPage) {
        NextBtn.style.display = 'none';
    }
    NextBtn.addEventListener('click', function (e) {
        if (currentPage < totalPage) {
            NextBtn.style.backgroundColor = '#4318FF';
            NextBtn.style.color = '#FFF';
            currentPage++;
            ReadEmployee();
        }
    });

    return currentPage;
}


//Add Employee

const addEmployee = document.getElementById('addEmployeeForm');

addEmployee.addEventListener('submit', async event => {

    event.preventDefault();

    if (formValidation()) {
        const newEmpData = new FormData(addEmployee);

        const dateString = document.querySelector('input[name="dob"]').value;
        const [year, month, day] = dateString.split("-");
        const newDateString = `${day}-${month}-${year}`;

        const file = document.getElementById('fileUpload').files[0];
        const selectedGender = document.querySelector('input[name="gender"]:checked').value;
        const userName = document.querySelector('input[name="firstName"]').value;

        newEmpData.set('dob', newDateString);
        newEmpData.set('gender', selectedGender)

        newEmpData.append('username', userName);
        // newEmpData.append('password', newDateString);

        await fetch('http://localhost:3000/employees', {
            method: 'POST',
            body: newEmpData
        }).then((res) => res.json())
            .then((value) => {
                console.log(value);

                uploadImage(`${value.id}`, file);
            })
            .catch((error) => console.error(error));

        ReadEmployee();
        closeAddEmployee();
        Alert("add");
    }

});

//Clear Input Fields

function clearModalInputs() {
    const modal = document.getElementById("addEmployeeModal");
    const inputFields = modal.querySelectorAll("input");

    inputFields.forEach((input) => {
        input.value = "";
    });

    const selectFields = modal.querySelectorAll('select');
    selectFields.forEach((select) => {
        select.value = "";
    });

    const error = modal.querySelectorAll('.validation-label');

    error.forEach(e => {
        e.textContent = "";
    });

    const imageSection = document.getElementById('imageSection');
    const fileInput = document.getElementById('imgUpload');

    imageSection.style.display = 'none';
    fileInput.style.display = 'flex';

}

//Alerts 

async function Alert(type) {
    const alert = document.getElementById('alert');
    const alertMsg = document.getElementById('alertMsg');

    alert.classList.add('show');
    alert.classList.remove('hide');
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('hide');
    }, 5000);

    if (type === "delete") {
        alert.classList.add('bg-danger');
        alertMsg.textContent = "Employee data is deleted!"
    } else if (type === "add") {
        alert.classList.add('bg-success');
        alertMsg.textContent = "New Employee is added!"
    } else if (type === "update") {
        alert.classList.add('bg-warning');
        alertMsg.textContent = "Employee data updated!"
    }

}

//Validation

function printError(elemId, errMsg) {
    document.getElementById(elemId).textContent = errMsg;
}

function formValidation() {

    console.log("Hello executed form validation")

    let salutationField = document.querySelector('select[name="salutation"]').value;
    let firstNameField = document.querySelector('input[name="firstName"]').value;
    let lastNameField = document.querySelector('input[name="lastName"]').value;
    let emailField = document.querySelector('input[name="email"]').value;
    let phoneField = document.querySelector('input[name="phone"]').value;
    let dobField = document.querySelector('input[name="dob"]').value;
    let genderField = document.querySelector('input[name="gender"]').value;
    let qualificationField = document.querySelector('input[name="qualifications"]').value;
    let addressField = document.querySelector('input[name="address"]').value;
    let countryField = document.querySelector('select[name="country"]').value;
    let stateField = document.querySelector('select[name="state"]').value;
    let cityField = document.querySelector('input[name="city"]').value;
    let pinField = document.querySelector('input[name="pin"]').value;
    let userNameField = document.querySelector('input[name="userName"]').value;
    let passwordField = document.querySelector('input[name="password"]').value;

    var salutationValidation = firstNameValidation = lastNameValidation = emailValidation = phoneValidation = dobValidation = genderValidation = qualificationsValidation = addressValidation = countryValidation = stateValidation = cityValidation = pinValidation = userNameValidation = passwordValidation = true;

    // validate salutation

    if (salutationField == "") {
        printError("salutationValidation", "Please select your salutation.");
    } else {
        printError("salutationValidation", "");
        salutationValidation = false;
    }

    //validate firstName

    if (firstNameField == "") {
        printError("firstNameValidation", "Please enter your First name");
    } else {
        var regex = /^[a-zA-Z\s]+$/;
        if (regex.test(firstNameField) === false) {
            printError("firstNameValidation", "Please enter a valid First name");
        } else {
            printError("firstNameValidation", "");
            firstNameValidation = false;
        }
    }

    // validate lastName

    if (lastNameField == "") {
        printError("lastNameValidation", "Please enter your Last name");
    } else {
        var regex = /^[a-zA-Z\s]+$/;
        if (regex.test(lastNameField) === false) {
            printError("lastNameValidation", "Please enter a valid Last name");
        } else {
            printError("lastNameValidation", "");
            lastNameValidation = false;
        }
    }

    // validate email

    if (emailField == "") {
        printError("emailValidation", "Please enter your email address");
    } else {
        var regex = /^\S+@\S+\.\S+$/;
        if (regex.test(emailField) === false) {
            printError("emailValidation", "Please enter a valid email address");
        } else {
            printError("emailValidation", "");
            emailValidation = false;
        }
    }

    // mobile number validation

    if (phoneField == "") {
        printError("phoneValidation", "Please enter your mobile number");
    } else {
        var regex = /^[0-9]\d{9}$/;
        if (regex.test(phoneField) === false) {
            printError("phoneValidation", "Please enter a valid 10 digit mobile number");
        } else {
            printError("phoneValidation", "");
            phoneValidation = false;
        }
    }

    // dob

    if (dobField == "") {
        printError("dobValidation", "Please select your Date of Birth.");
    } else {
        printError("dobValidation", "");
        dobValidation = false;
    }

    // Gender validation

    if (genderField == "") {
        printError("genderValidation", "Please select your gender");
    } else {
        printError("genderValidation", "");
        genderValidation = false;
    }

    // qualification validation

    if (qualificationField == "") {
        printError("qualificationsValidation", "Please enter your qualification");
    } else {
        printError("qualificationsValidation", "");
        qualificationsValidation = false;
    }

    // Address validation

    if (addressField == "") {
        printError("addressValidation", "Please enter your Address");
    } else {
        printError("addressValidation", "");
        addressValidation = false;
    }

    //country validation

    if (countryField == "") {
        printError("countryValidation", "Please select your country.");
    } else {
        printError("countryValidation", "");
        countryValidation = false;
    }

    //state validation

    if (stateField == "") {
        printError("stateValidation", "Please select your state.");
    } else {
        printError("stateValidation", "");
        stateValidation = false;
    }

    // city validation

    if (cityField == "") {
        printError("cityValidation", "Please enter your City.");
    } else {
        printError("cityValidation", "");
        cityValidation = false;
    }

    // Pin validation

    if (pinField == "") {
        printError("pinValidation", "Please enter your PIN/ZIP.");
    } else {
        var regex = /^[1-9]\d{5}$/;
        if (regex.test(pinField) === false) {
            printError("pinValidation", "Please enter a valid 6 digit PIN");
        } else {
            printError("pinValidation", "");
            pinValidation = false;
        }
    }

    //validate userName

    if (userNameField == "") {
        printError("userNameValidation", "Please enter your User name");
    } else {
        var regex = /^[a-zA-Z\s]+$/;
        if (regex.test(userNameField) === false) {
            printError("userNameValidation", "Please enter a valid User name");
        } else {
            printError("userNameValidation", "");
            userNameValidation = false;
        }
    }

    //validate password

    if (passwordField == "") {
        printError("passwordValidation", "Please enter your Password");
    } else {
        var regex = /^[a-zA-Z0-9\s]+$/;
        if (regex.test(firstNameField) === false) {
            printError("passwordValidation", "Please enter a valid password");
        } else {
            printError("passwordValidation", "");
            passwordValidation = false;
        }
    }

    if ((salutationValidation || firstNameValidation || lastNameValidation || emailValidation || phoneValidation || dobValidation || genderValidation || qualificationsValidation || addressValidation || countryValidation || stateValidation || cityValidation || pinValidation || userNameValidation || passwordValidation) == true) {
        return false;
    } else {
        return true;
    }
}

//Delete Employee

async function DeleteEmployee(empID) {
    try {
        await fetch(`http://localhost:3000/employees/${empID}`, {
            method: 'DELETE'
        });
        ReadEmployee();
        closeDelEmployee();
        Alert("delete");
    } catch (error) {
        console.error(error);
    }
}

//Edit Employee Modal

function editEmployeeById(empID) {
    edit_emp.style.display = 'block';

    fetch(`http://localhost:3000/employees/${empID}`)
        .then((response) => response.json())
        .then((value) => {

            const [day, month, year] = value.dob.split("-");
            const newDateString = `${year}-${month}-${day}`;

            document.querySelector('#editEmployeeModal [name="salutation"]').value = value.salutation;
            document.querySelector('#editEmployeeModal [name="firstName"]').value = value.firstName;
            document.querySelector('#editEmployeeModal [name="lastName"]').value = value.lastName;
            document.querySelector('#editEmployeeModal [name="email"]').value = value.email;
            document.querySelector('#editEmployeeModal [name="phone"]').value = value.phone;
            document.querySelector('#editEmployeeModal [name="dob"]').value = newDateString;
            document.querySelector(`#editEmployeeModal [name="gender"][value="${value.gender}"]`).checked = true;
            document.querySelector('#editEmployeeModal [name="qualifications"]').value = value.qualifications;
            document.querySelector('#editEmployeeModal [name="address"]').value = value.address;
            document.querySelector('#editEmployeeModal [name="country"]').value = value.country;
            document.querySelector('#editEmployeeModal [name="state"]').value = value.state;
            document.querySelector('#editEmployeeModal [name="city"]').value = value.city;
            document.querySelector('#editEmployeeModal [name="pin"]').value = value.pin;
            document.querySelector('#editEmployeeModal [name="userName"]').value = value.username;
            document.querySelector('#editEmployeeModal [name="password"]').value = value.password;
        });

    document.getElementById('submitBtn').addEventListener('click', function (event) {
        event.preventDefault();
        editEmployee(empID);
    });

    // img preview 
    fetch(`http://localhost:3000/employees/${empID}/avatar`)
        .then((res) => res.blob())
        .then((value) => {
            const imageUrl = URL.createObjectURL(value);
            const empImageBanner = document.getElementById('emp-image');

            empImageBanner.src = imageUrl;
        });

}

//updated image preview

function updateImage() {
    const updateUserImage = document.getElementById('editedImg');
    console.log('hi');
    updateUserImage.click();

    updateUserImage.addEventListener('change', function (event) {
        const selectedImage = updateUserImage.files[0];

        const reader = new FileReader();

        reader.onload = function (event) {
            const imageUrl = event.target.result;

            const newEmpImage = document.getElementById('emp-image');

            newEmpImage.src = imageUrl;

            // console.log(imageUrl);
        }
        reader.readAsDataURL(selectedImage);
    });


}

//Edit Employee
async function editEmployee(empID) {
    try {
        const editEmpForm = document.getElementById('editEmployeeForm');
        const editEmpData = new FormData(editEmpForm);
        const file = document.getElementById('editedImg').files[0];

        const dateString = document.querySelector('#editEmployeeModal input[name="dob"]').value;
        const [year, month, day] = dateString.split("-");
        const newDateString = `${day}-${month}-${year}`;

        const selectedGender = document.querySelector('#editEmployeeModal input[name="gender"]:checked').value;

        const userName = document.querySelector('#editEmployeeModal input[name="userName"]').value;


        editEmpData.set('dob', newDateString);
        editEmpData.set('gender', selectedGender);
        editEmpData.append('username', userName);

        const response = await fetch(`http://localhost:3000/employees/${empID}`, {
            method: 'PUT',
            body: editEmpData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Employee edited:', data);


        ReadEmployee();
        closeEditEmployee();
        Alert("update");
        uploadImage(`${empID}`, file);

    } catch (error) {
        console.error('Error editing employee:', error);
        console.log(empID);
    }
}

// View employee 

function viewEmployeeById(employeeId) {
    const viewUrl = `http://127.0.0.1:5502/employee/employee.html?id=${employeeId}`;
    window.location.href = viewUrl;
}


// search 

function Search() {
    let input, searchText, tableBody, tr, td, i, j, textValue;

    input = document.getElementById('search');
    searchText = input.value.toUpperCase();
    tableBody = document.getElementById('employeeList');
    tr = tableBody.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td');
        let rowMatch = false;

        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                textValue = td[j].textContent || td[j].innerText;
                if (textValue.toUpperCase().indexOf(searchText) > -1) {
                    rowMatch = true;
                    break;
                }
            }
        }
        if (rowMatch) {
            tr[i].style.display = '';
        } else {
            tr[i].style.display = 'none';
        }
    }
}
