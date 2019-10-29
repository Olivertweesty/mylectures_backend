function edit_lecture(lecture) {

    document.getElementById('modal_header').innerHTML = "Edit Lecture";
    document.getElementById('modal_body').innerHTML = document.getElementById('edit_lecture_form').innerHTML;

    document.getElementById('edit_lecture_id').value = lecture.childNodes[1].innerHTML;
    document.getElementById('edit_lecture_coodinates').value = lecture.childNodes[3].innerHTML;
    document.getElementById('edit_lecture_day').value = lecture.childNodes[5].innerHTML;
    document.getElementById('edit_lecture_lecturer').value = lecture.childNodes[7].innerHTML;
    document.getElementById('edit_lecture_contact').value = lecture.childNodes[9].innerHTML;
    // document.getElementById('edit_lecture_strtime').value = lecture.childNodes[11].innerHTML;
    // document.getElementById('edit_lecture_sttime').value = lecture.childNodes[13].innerHTML;
    document.getElementById('edit_lecture_unit').value = lecture.childNodes[15].innerHTML;
    document.getElementById('edit_lecture_venue').value = lecture.childNodes[17].innerHTML;
}

function edit_notice_modal(from, subject, message) {
    document.getElementById('modal_header').innerHTML = "Edit Notice";
    document.getElementById('modal_body').innerHTML = document.getElementById('edit_notice_form').innerHTML;

    document.getElementById("edit_notice_from").value = from;
    document.getElementById("edit_notice_subject").value = subject;
    document.getElementById("edit_notice_message").value = message;
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

    fetch(window.location + 'load_lessons', {
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
                <td>${lecture.id}</td>
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

function load_notices() {
    fetch(window.location + 'load_notices', {
        mode: 'no-cors'
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem fetching notices. Status Code: ' + response.status);

                    document.getElementById('notices_fetching_status').innerHTML = "<i>Problem encountered while fetching notices</i>";
                    return;
                }

                // Examine the text in the response
                response.json().then(function (data) {
                    console.log(data);
                    if (data.length == 0) {
                        document.getElementById('notices_fetching_status').innerHTML = "<i> No notices found</i>";
                    } else {
                        document.getElementById('notices_fetching_status').innerHTML = "";

                        data.forEach(notice => {
                            populate_notices(notice.date, notice.from, notice.message, notice.subject);
                        });
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}


function populate_notices(date, from, message, subject) {
    let display = document.getElementById("notice_display");

    let card = `
        <div  data-toggle="modal" data-target="#myModal" onclick="edit_notice_modal("${from}", "${subject}", "${message}")>
            <div class="w3-card-4" style="width:45%;">
                <header class="w3-container w3-blue" style="padding: 10px;">
                    <h3 style="display: inline;">Subject: </h3>
                    <h4 style="display: inline;">${subject}</h4>
                </header>

                <div class="w3-container" style="padding: 20px;">
                    <h3 style="display: inline;">From: </h3> ${from} <br><br>
                    <h3 style="display: inline;">Date: </h3> ${date} <br><br>

                    <h3>Message:</h3>
                    <p>${message}</p>
                </div>
            </div>
        </div> <br><br>
    `;

    display.innerHTML += card;
}


function add_notice_modal() {
    let modal_header = document.getElementById('modal_header');
    let modal_body = document.getElementById('modal_body');

    modal_header.innerHTML = "Add Notice";
    modal_body.innerHTML = document.getElementById('add_notice_form').innerHTML;
}

function submit_notice(event) {
    event.preventDefault()
    let notice_form = document.getElementById("notice_form");

    fetch(window.location + "add_notices", {
        method: 'POST',
        body: new FormData(notice_form)
    })
        .then(function (data) {
            console.log('Request succeeded with JSON response: ', data);
            document.getElementById("close_modal").click();
            load_notices();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function submit_lecture(event) {
    event.preventDefault()
    let lecture_form = document.getElementById("form_add_lecture");

    fetch(window.location + "addlesson", {
        method: 'POST',
        body: new FormData(lecture_form)
    })
        .then(function (data) {
            console.log('Request succeeded with JSON response: ', data);
            document.getElementById("close_modal").click();
            fetch_lectures();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function submit_edit_lecture(event) {
    event.preventDefault()
    let lecture_form = document.getElementById("form_edit_lecture");

    fetch(window.location + "editlesson", {
        method: 'POST',
        body: new FormData(lecture_form)
    })
        .then(function (data) {
            console.log('Request succeeded with JSON response: ', data);
            document.getElementById("close_modal").click();
            fetch_lectures();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}