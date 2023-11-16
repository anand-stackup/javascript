let params = new URLSearchParams(document.location.search);
let id = params.get("id");
console.log(id);


function employeeDetailsById(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
        method: "GET",
    })
        .then(res => res.json())
        .then(employee => {
            console.log(employee);

            // calculate age 
            var dobParts = employee.dob.split('-');
            var day = parseInt(dobParts[0], 10);
            var month = parseInt(dobParts[1], 10) - 1; 
            var year = parseInt(dobParts[2], 10);

            var dob = new Date(year, month, day);
            console.log(dob);

            var currentDate = new Date();
              
            var age = currentDate.getFullYear() - dob.getFullYear();
            console.log(dob.getFullYear());

            if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
                age--;
            }
            console.log(age);

            const employeeDetails = document.getElementById('employee-details');

            employeeDetails.innerHTML = `
        <div class="details">
                    <div class="details_bg">
                        <img src="Img/bg.jpg" alt="">
                    </div>

                    <div class="employee_img_bg" id="empGetImg">
                        <img src="http://localhost:3000/employees/${employee.id}/avatar" alt="">
                    </div>

                    <div class="employee_details">
                        <h6>${employee.firstName}</h6>
                        <p>${employee.email}</p>
                    </div>

                    <div class="info_box">
                        <div class="info">
                            <p>Gender</p>
                            <h6>${employee.gender}</h6>
                        </div>
                        <div class="info">
                            <p>Age</p>
                            <h6>${age}</h6>
                        </div>
                        <div class="info">
                            <p>Date of Birth</p>
                            <h6>${employee.dob}</h6>
                        </div>
                    </div>

                    <div class="info_details_box">
                        <div class="info">
                            <p>Mobile Number</p>
                            <h6>${employee.phone}</h6>
                        </div>
                        <div class="info">
                            <p>Qualifications</p>
                            <h6>${employee.qualifications}</h6>
                        </div>
                
                    </div>

                    <div class="info_details_box">
                        <div class="info">
                            <p>Address</p>
                            <h6>${employee.address}</h6>
                        </div>
                        <div class="info">
                            <p>Username</p>
                            <h6>${employee.username}</h6>
                        </div>
                    </div>
                    <div class="details_btn">
                        <button class="btn danger_btn">Delete</button>
                        <button class="btn primary_btn">Edit Details</button>
                    </div>
                </div>
        `

        })
}

employeeDetailsById(id);