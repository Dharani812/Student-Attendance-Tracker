let students =
    JSON.parse(localStorage.getItem("students")) || [];

let today =
    new Date().toISOString().split("T")[0];

document.getElementById("attendanceDate").value = today;


function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


function addStudent() {

    let name =
        document.getElementById("name").value.trim();

    let regno =
        document.getElementById("regno").value.trim();

    if (name == "" || regno == "") {

        alert("Enter student details");
        return;
    }

    students.push({

        name: name,
        regno: regno,
        present: 0,
        absent: 0,
        attendanceDates: []

    });

    saveData();

    document.getElementById("name").value = "";
    document.getElementById("regno").value = "";

    refresh();
}


function editStudent(index) {

    let student = students[index];

    let newName =
        prompt(
            "Enter Student Name:",
            student.name
        );

    if (newName === null) {
        return;
    }

    newName = newName.trim();

    if (newName == "") {

        alert("Name cannot be empty");
        return;
    }

    let newRegno =
        prompt(
            "Enter Register Number:",
            student.regno
        );

    if (newRegno === null) {
        return;
    }

    newRegno = newRegno.trim();

    if (newRegno == "") {

        alert("Register number cannot be empty");
        return;
    }

    student.name = newName;
    student.regno = newRegno;

    saveData();

    refresh();

    alert(
        "Student details updated successfully!"
    );
}


function markPresent(index) {

    let date =
        document.getElementById(
            "attendanceDate"
        ).value;

    if (date == "") {

        alert("Select attendance date");
        return;
    }

    if (!students[index].attendanceDates) {

        students[index].attendanceDates = [];
    }

    let exists =
        students[index].attendanceDates.some(
            record => record.date == date
        );

    if (exists) {

        alert(
            "Attendance already marked for this date"
        );

        return;
    }

    students[index].present++;

    students[index].attendanceDates.push({

        date: date,
        status: "Present"

    });

    saveData();

    refresh();
}




function markAbsent(index) {

    let date =
        document.getElementById(
            "attendanceDate"
        ).value;

    if (date == "") {

        alert("Select attendance date");
        return;
    }

    if (!students[index].attendanceDates) {

        students[index].attendanceDates = [];
    }

    let exists =
        students[index].attendanceDates.some(
            record => record.date == date
        );

    if (exists) {

        alert(
            "Attendance already marked for this date"
        );

        return;
    }

    students[index].absent++;

    students[index].attendanceDates.push({

        date: date,
        status: "Absent"

    });

    saveData();

    refresh();
}




function deleteStudent(index) {

    if (
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ) {
        return;
    }

    students.splice(index, 1);

    saveData();

    refresh();
}




function searchStudent() {

    let search =
        document.getElementById("search")
        .value
        .toLowerCase();

    let result =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(search)

            ||

            student.regno
                .toLowerCase()
                .includes(search)

        );

    displayStudents(result);
}



function displayStudents(data) {

    let list =
        document.getElementById(
            "studentList"
        );

    list.innerHTML = "";

    data.forEach(student => {

        let index =
            students.indexOf(student);

        let present =
            Number(student.present) || 0;

        let absent =
            Number(student.absent) || 0;

        let total =
            present + absent;

        let percentage =
            total == 0
            ? 0
            : ((present / total) * 100)
                .toFixed(1);

        let progress =
            Math.min(
                Number(percentage),
                100
            );

        let alertMessage =
            percentage < 75

            ? "<span class='alert'>Low Attendance</span>"

            : "<span class='good'>Good</span>";

        let parentButton =
            percentage < 75

            ? `
                <br>

                <button
                class="parent-alert"
                onclick="parentAlert(${index})">

                Parent Alert

                </button>
              `

            : "";

        list.innerHTML += `

            <tr>

                <td>

                    <span
                    class="student-name-link"
                    onclick="showProfile(${index})">

                    ${student.name}

                    </span>

                </td>

                <td>
                    ${student.regno}
                </td>

                <td>

                    ${present}

                    <button
                    class="present"
                    onclick="markPresent(${index})">

                    Present

                    </button>

                </td>

                <td>

                    ${absent}

                    <button
                    class="absent"
                    onclick="markAbsent(${index})">

                    Absent

                    </button>

                </td>

                <td>

                    <div class="percentage">
                        ${percentage}%
                    </div>

                    <div class="progress-container">

                        <div
                        class="progress-bar ${
                            percentage < 75
                            ? "progress-low"
                            : ""
                        }"
                        style="width:${progress}%">

                        </div>

                    </div>

                </td>

                <td>

                    ${alertMessage}

                    ${parentButton}

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                        class="history"
                        onclick="showStudentHistory(${index})">

                        History

                        </button>

                        <button
                        class="edit"
                        onclick="editStudent(${index})">

                        Edit

                        </button>

                        <button
                        class="delete"
                        onclick="deleteStudent(${index})">

                        Delete

                        </button>

                    </div>

                </td>

            </tr>

        `;
    });
}




function parentAlert(index) {

    let student = students[index];

    let present =
        Number(student.present) || 0;

    let absent =
        Number(student.absent) || 0;

    let total =
        present + absent;

    let percentage =
        total == 0
        ? 0
        : ((present / total) * 100)
            .toFixed(1);

    alert(

        "Dear Parent,\n\n" +

        "Your ward " +
        student.name +

        "'s attendance is " +
        percentage +
        "%.\n\n" +

        "This is below 75% attendance."

    );
}



function updateDashboard() {

    let totalPresent = 0;

    let totalAbsent = 0;

    let good = 0;

    let low = 0;


    students.forEach(student => {

        let present =
            Number(student.present) || 0;

        let absent =
            Number(student.absent) || 0;

        totalPresent += present;

        totalAbsent += absent;

        let total =
            present + absent;

        let percentage =
            total == 0
            ? 0
            : (present / total) * 100;

        if (percentage >= 75) {

            good++;

        } else {

            low++;

        }

    });


    let totalClasses =
        totalPresent + totalAbsent;


    let average =
        totalClasses == 0
        ? 0
        : (
            totalPresent /
            totalClasses *
            100
        ).toFixed(1);


    document.getElementById(
        "totalStudents"
    ).innerText =
        students.length;


    document.getElementById(
        "goodStudents"
    ).innerText =
        good;


    document.getElementById(
        "lowStudents"
    ).innerText =
        low;


    document.getElementById(
        "totalPresent"
    ).innerText =
        totalPresent;


    document.getElementById(
        "totalAbsent"
    ).innerText =
        totalAbsent;


    document.getElementById(
        "averageAttendance"
    ).innerText =
        average + "%";
}




function updateTopAttendance() {

    let list =
        document.getElementById(
            "topAttendanceList"
        );

    list.innerHTML = "";


    if (students.length == 0) {

        list.innerHTML =
            "<p style='text-align:center;'>No students available</p>";

        return;
    }


    let rankedStudents =
        students.map(student => {

            let present =
                Number(student.present) || 0;

            let absent =
                Number(student.absent) || 0;

            let total =
                present + absent;

            let percentage =
                total == 0
                ? 0
                : (present / total) * 100;

            return {

                student: student,

                percentage: percentage

            };

        });


    rankedStudents.sort(
        (a, b) =>
            b.percentage - a.percentage
    );


    let topStudents =
        rankedStudents.slice(0, 3);


    let medals = [
        "🥇",
        "🥈",
        "🥉"
    ];


    topStudents.forEach(
        (item, index) => {

            let student =
                item.student;

            let percentage =
                item.percentage.toFixed(1);


            list.innerHTML += `

                <div class="top-card">

                    <div class="rank">

                        ${medals[index]}

                    </div>


                    <div class="top-student-info">

                        <h3>

                            ${student.name}

                        </h3>

                        <p>

                            Register No:
                            ${student.regno}

                        </p>

                    </div>


                    <div class="top-percentage">

                        ${percentage}%

                    </div>

                </div>

            `;

        }
    );
}


function showProfile(index) {

    let student =
        students[index];

    let present =
        Number(student.present) || 0;

    let absent =
        Number(student.absent) || 0;

    let total =
        present + absent;

    let percentage =
        total == 0
        ? 0
        : ((present / total) * 100)
            .toFixed(1);


    document.getElementById(
        "profileName"
    ).innerText =
        student.name;


    document.getElementById(
        "profileRegno"
    ).innerText =
        student.regno;


    document.getElementById(
        "profileTotal"
    ).innerText =
        total;


    document.getElementById(
        "profilePresent"
    ).innerText =
        present;


    document.getElementById(
        "profileAbsent"
    ).innerText =
        absent;


    document.getElementById(
        "profilePercentage"
    ).innerText =
        percentage + "%";


    let history =
        document.getElementById(
            "profileHistory"
        );

    history.innerHTML = "";


    if (
        !student.attendanceDates ||
        student.attendanceDates.length == 0
    ) {

        history.innerHTML =
            "<p>No attendance history available.</p>";

    } else {

        student.attendanceDates.forEach(
            record => {

                let className =
                    record.status == "Present"
                    ? "profile-present"
                    : "profile-absent";

                history.innerHTML += `

                    <div class="profile-history-row">

                        <span>
                            ${record.date}
                        </span>

                        <span class="${className}">

                            ${record.status}

                        </span>

                    </div>

                `;

            }
        );
    }


    document.getElementById(
        "profileModal"
    ).style.display =
        "flex";
}


function closeProfile() {

    document.getElementById(
        "profileModal"
    ).style.display =
        "none";
}


window.onclick = function(event) {

    let modal =
        document.getElementById(
            "profileModal"
        );

    if (event.target == modal) {

        closeProfile();

    }
};



function updateCharts() {

    let totalPresent = 0;

    let totalAbsent = 0;


    students.forEach(student => {

        totalPresent +=
            Number(student.present) || 0;

        totalAbsent +=
            Number(student.absent) || 0;

    });


    document.getElementById(
        "presentChartValue"
    ).innerText =
        totalPresent;


    document.getElementById(
        "absentChartValue"
    ).innerText =
        totalAbsent;


    let max =
        Math.max(
            totalPresent,
            totalAbsent,
            1
        );


    document.getElementById(
        "presentBar"
    ).style.height =
        (totalPresent / max * 250) +
        "px";


    document.getElementById(
        "absentBar"
    ).style.height =
        (totalAbsent / max * 250) +
        "px";


    let chart =
        document.getElementById(
            "studentChart"
        );

    chart.innerHTML = "";


    students.forEach(student => {

        let present =
            Number(student.present) || 0;

        let absent =
            Number(student.absent) || 0;

        let total =
            present + absent;

        let percentage =
            total == 0
            ? 0
            : ((present / total) * 100)
                .toFixed(1);


        chart.innerHTML += `

            <div class="student-chart-row">

                <div class="student-name">

                    ${student.name}

                </div>


                <div class="student-chart-container">

                    <div
                    class="student-chart-bar"
                    style="width:${percentage}%">

                    </div>

                </div>


                <div class="student-percentage">

                    ${percentage}%

                </div>

            </div>

        `;

    });
}




function displayHistory() {

    let section =
        document.getElementById(
            "historySection"
        );

    let list =
        document.getElementById(
            "historyList"
        );

    list.innerHTML = "";

    let hasHistory = false;


    students.forEach(student => {

        if (
            !student.attendanceDates ||
            student.attendanceDates.length == 0
        ) {

            return;

        }


        hasHistory = true;


        let rows = "";


        student.attendanceDates.forEach(
            record => {

                rows += `

                    <tr>

                        <td>
                            ${record.date}
                        </td>

                        <td>
                            ${record.status}
                        </td>

                    </tr>

                `;

            }
        );


        list.innerHTML += `

            <div class="history-card">

                <h3>

                    ${student.name}
                    -
                    ${student.regno}

                </h3>


                <table class="history-table">

                    <tr>

                        <th>Date</th>

                        <th>Status</th>

                    </tr>

                    ${rows}

                </table>

            </div>

        `;

    });


    section.style.display =
        hasHistory
        ? "block"
        : "none";
}



function showStudentHistory(index) {

    let student =
        students[index];

    let section =
        document.getElementById(
            "historySection"
        );

    let list =
        document.getElementById(
            "historyList"
        );

    section.style.display =
        "block";

    list.innerHTML = "";


    if (
        !student.attendanceDates ||
        student.attendanceDates.length == 0
    ) {

        list.innerHTML = `

            <div class="history-card">

                <h3>
                    ${student.name}
                </h3>

                <p>
                    No attendance history available.
                </p>

            </div>

        `;

        return;
    }


    let rows = "";


    student.attendanceDates.forEach(
        record => {

            rows += `

                <tr>

                    <td>
                        ${record.date}
                    </td>

                    <td>
                        ${record.status}
                    </td>

                </tr>

            `;

        }
    );


    list.innerHTML = `

        <div class="history-card">

            <h3>

                ${student.name}
                -
                ${student.regno}

            </h3>


            <table class="history-table">

                <tr>

                    <th>Date</th>

                    <th>Status</th>

                </tr>

                ${rows}

            </table>

        </div>

    `;
}



function refresh() {

    displayStudents(students);

    updateDashboard();

    updateTopAttendance();

    updateCharts();

    displayHistory();
}




refresh();
