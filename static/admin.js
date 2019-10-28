function edit_lecture(lecture) {

    document.getElementById('modal_header').innerHTML = "Edit Lecture";
    document.getElementById('modal_body').innerHTML = document.getElementById('edit_lecture_form').innerHTML;

    document.getElementById('edit_lecture_id').value = lecture.childNodes[1].innerHTML;
    document.getElementById('edit_lecture_name').value = lecture.childNodes[3].innerHTML;
    document.getElementById('edit_lecture_code').value = lecture.childNodes[5].innerHTML;
    document.getElementById('edit_lecture_class').value = lecture.childNodes[7].innerHTML;
    // document.getElementById('edit_lecture_start').value = lecture.childNodes[9].innerHTML;
    // document.getElementById('edit_lecture_end').value = lecture.childNodes[11].innerHTML;
    // document.getElementById('edit_lecture_date').value = lecture.childNodes[13].innerHTML;
    document.getElementById('edit_lecture_venue').value = lecture.childNodes[15].innerHTML;
    document.getElementById('edit_lecture_lecturer').value = lecture.childNodes[17].innerHTML;
}

function add_lecture_modal() {
    let modal_header = document.getElementById('modal_header');
    let modal_body = document.getElementById('modal_body');

    modal_header.innerHTML = "Add Lecture";
    modal_body.innerHTML = document.getElementById('add_lecture_form').innerHTML;
}

function fetch_lectures() {
    document.getElementById('lectures_fetching_status').innerHTML = "<i>Fetching lectures...</i>";
    document.getElementById('lectures_table').style.display = "none";
    document.getElementById('lectures_tbody').innerHTML = "";

    fetch('http://127.0.0.1:3000/load_lessons', {
        mode: 'no-cors'
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);

                    document.getElementById('lectures_fetching_status').innerHTML = "<i>Problem encountered while fetching lectures</i>";
                    return;
                }

                // Examine the text in the response
                response.json().then(function (data) {
                    console.log(data);
                    if (data.length == 0) {
                        document.getElementById('lectures_fetching_status').innerHTML = "<i> No lectures found</i>";
                    } else {
                        document.getElementById('lectures_fetching_status').innerHTML = "";
                        populate_lectures_table(data);
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function populate_lectures_table(lectures) {
    let table = document.getElementById("lectures_table");
    let tbody = document.getElementById("lectures_tbody");
    table.style.display = "block";

    lectures.forEach(lecture => {
        tbody.innerHTML += `
            <tr onclick="edit_lecture(this)" data-toggle="modal" data-target="#myModal">
                <td>${lecture.coodinates}</td>
                <td>${lecture.day_of_week}</td>
                <td>${lecture.lec_name}</td>
                <td>${lecture.lec_tel}</td>
                <td>${lecture.str_time}</td>
                <td>${lecture.st_time}</td>
                <td>${lecture.status}</td>
                <td>${lecture.subject}</td>
                <td>${lecture.venue}</td>
            </tr>
        `;
    });
}

function add_notice() {

    let display = document.getElementById("notice_display");

    let notice_from = "Waema";
    let notice_subject = "Apology";
    let notice_date = "12/08/2019";
    let notice_message = "I'm very sorry";

    let card = `
        <div>
            <div class="w3-card-4" style="width:75%;">
                <header class="w3-container w3-blue" style="padding: 10px;">
                    <h3 style="display: inline;">Subject: </h3>
                    <h4 style="display: inline;">${notice_subject}</h4>
                </header>

                <div class="w3-container" style="padding: 20px;">
                    <h3 style="display: inline;">From: </h3> ${notice_from} <br><br>
                    <h3 style="display: inline;">Date: </h3> ${notice_date} <br><br>

                    <h3>Message:</h3>
                    <p>${notice_message}</p>
                </div>
            </div>
        </div>
    `;

    display.innerHTML += card;
}
add_notice();