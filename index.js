let extraData; // Holds miscellaneous information
let studentData; // Holds information about the students

////////////////////
// INITIALIZATION //
////////////////////

window.onload = async function () {
    await GetData();
    SetRandomHeavenTitle();
    PlaceStudents();
};

async function GetData() {
    extraData = await AJAX("./extra.json");
    studentData = await AJAX("./students.json");

    console.log(studentData);
}

function SetRandomHeavenTitle() {
    let titleRef = document.querySelector("#heavenTitle");
    let randomIndex = GetRandomInt(0, extraData.titles.length - 1);

    titleRef.innerHTML = extraData.titles[randomIndex];
}

function PlaceStudents() {
    let hellBoxRef = document
        .querySelector("#hell")
        .querySelector(".card-holder");

    let purgatoryBoxRef = document
        .querySelector("#purgatory")
        .querySelector(".card-holder");

    // Heaven is a special place that needs to be handled differently
    let heavenRef = document.querySelector("#heaven");
    let groupARef = heavenRef.querySelector(".group-a");
    let groupBRef = heavenRef.querySelector(".group-b");
    let secondYearRef = heavenRef.querySelector("#secondYearSection");

    // Place them
    for (let j = 0; j < studentData.heaven.length; j++) {
        let currentStudent = studentData.heaven[j];

        if (currentStudent.year_of_death === 1) {
            // Sort them into Group A and Group B
            if (currentStudent.group == "A") {
                groupARef.innerHTML += CreateStudentCardHTML(currentStudent);
            } else if (currentStudent.group == "B") {
                groupBRef.innerHTML += CreateStudentCardHTML(currentStudent);
            } else {
                console.error(
                    "Student does not have a group despite being in first year\nEx.",
                    currentStudent,
                );
            }
        } else {
            // Place second-year students together
            secondYearRef.innerHTML += CreateStudentCardHTML(currentStudent);
        }
    }

    for (let i = 0; i < studentData.hell.length; i++) {
        hellBoxRef.innerHTML += CreateStudentCardHTML(studentData.hell[i]);
    }

    for (let p = 0; p < studentData.purgatory.length; p++) {
        purgatoryBoxRef.innerHTML += CreateStudentCardHTML(
            studentData.purgatory[p],
        );
    }
}

///////////////////
// HTML CREATION //
///////////////////

function CreateStudentCardHTML(studentObj) {
    let html = `<div class="card ${GetFactionClass(studentObj.faction)}">`;

    html += `<h3>${studentObj.name}</h3>`;
    html += `<p class="desc">`;
    html += CleanDescription(studentObj);
    html += "</p>";

    html += "</div>";

    return html;
}

/////////////
// HELPERS //
/////////////

function IsEmpty(string) {
    if (string == undefined) {
        return true;
    }

    if (string == "") {
        return true;
    }

    if (string == null) {
        return true;
    }

    return false;
}

function GetFactionClass(faction) {
    if (IsEmpty(faction)) {
        return "";
    }

    return faction.replaceAll(" ", "-").toLowerCase();
}

// Returns placeholder text if a student's description is missing
function CleanDescription(studentObj) {
    let desc = studentObj.desc;

    if (studentObj.year_of_death == 0 && desc == "") {
        return `${studentObj.name}'s fate is unknown`;
    }

    if (desc == null || desc == undefined || desc == "") {
        return "Assumed to be programming with the angels";
    }

    return desc;
}

// Creates a random integer between two values
function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gets JSON data from file or wherever
function AJAX(fileName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", fileName, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;

            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error(`HTTP error: ${xhr.status}`));
            }
        };

        xhr.send();
    });
}
