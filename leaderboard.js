function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
firebase.database().ref('Data/01_RaceInfo').once('value', function (data) {
    raceInfo = data.val()
    console.log(raceInfo)
})
firebase.database().ref('Data/02_Participants').once('value', function (data) {
    participants = data.val()
    console.log(participants[1])
})
var reader1_Timings = []
var reader2_Timings = []
var reader3_Timings = []

function getFirebaseDataon() {
    firebase.database().ref('Data/03_Inbox').on('value', function (data) {
        keys = []
        reader0 = []
        reader1Inbox = []
        reader1_Timings = []
        readerPositions = []
        reader2Positions = []
        reader2Inbox = []
        reader2_Timings = []
        reader3Inbox = []
        reader3_Timings = []
        pName = []
        pClub = []
        runnerdelays = []

        inbox = data.val()
        Object.keys(inbox).forEach((key) => {
            keys.push(key)
            if (inbox[key].includes("Reader 3")) {
                reader3Inbox.push(inbox[key]); // 'Bob', 47

            }
            if (inbox[key].includes("Reader 2")) {
                reader2Inbox.push(inbox[key]);

            }
            if (inbox[key].includes("Reader 1")) {
                reader1Inbox.push(inbox[key]);
            }
            if (inbox[key].includes("Reader 0")) {
                reader0.push(inbox[key]);
            }



        });
        // console.log(keys)
        // console.log(reader0)

        // console.log(reader2Inbox)
        console.log(reader3Inbox)
        arduino0 = parseInt(reader0[0].slice(22)) * 1000 + parseInt(reader0[0].slice(36))
        reader0sync = arduino0 + new Date("Mar 31, 1900").getTime();

        arduino3 = parseInt(reader3Inbox[14].slice(22)) * 1000 + parseInt(reader3Inbox[14].slice(36)) //change this
        reader3sync = arduino3 + new Date("Mar 31, 1900").getTime();
        for (i = 0; i <= reader3Inbox.length - 2; i++) { //Change This
            let t = reader3Inbox[i].slice(21, 31)
            let ms = reader3sync + Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000 + Number(t.split(':')[2]) * 1000 + Number(t.split(':')[3]);
            reader3_Timings.push(ms);
            readerPositions.push(parseInt(reader3Inbox[i].slice(-2)))
            // console.log(reader1Inbox[i])
        }

        arduino2 = parseInt(reader2Inbox[0].slice(22)) * 1000 + parseInt(reader2Inbox[0].slice(36))
        reader2sync = arduino2 + new Date("Mar 31, 1900").getTime();
        for (i = 1; i <= reader2Inbox.length - 1; i++) {
            let t = reader2Inbox[i].slice(21, 31)
            let ms = reader2sync + Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000 + Number(t.split(':')[2]) * 1000 + Number(t.split(':')[3]);
            reader2_Timings.push(ms);
            readerPositions.push(parseInt(reader2Inbox[i].slice(-2)))
            // console.log(reader1Inbox[i])
        }

        arduino1 = parseInt(reader1Inbox[0].slice(22)) * 1000 + parseInt(reader1Inbox[0].slice(36))
        reader1sync = arduino1 + new Date("Mar 31, 1900").getTime();
        for (i = 1; i <= reader1Inbox.length - 1; i++) {
            let t = reader1Inbox[i].slice(21, 32)
            let ms = reader1sync + Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000 + Number(t.split(':')[2]) * 1000 + Number(t.split(':')[3]);
            reader1_Timings.push(ms);
            readerPositions.push(parseInt(reader1Inbox[i].slice(-2)))
            // console.log(reader1Inbox[i])
        }
        for (i = 1; i < participants.length; i++) {
            readerPositions.push(i)
        }
        let uniquePositions = [];
        readerPositions.forEach((c) => {
            if (!uniquePositions.includes(c)) {
                uniquePositions.push(c);
                pName.push(participants[c]["Name"] + " " + participants[c]["Surname"])
                pClub.push(participants[c]["Club"])
            }
        });
        let t = reader0[1].slice(20, 30)
        raceStartTime = reader0sync + Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000 + Number(t.split(':')[2]) * 1000 + Number(t.split(':')[3])
        var time = 0;
        document.getElementById("leaderboard").innerHTML = ""
        const div = document.createElement("div");
        const innerdiv = document.createElement("div");
        const name = document.createElement("div");
        const number = document.createElement("div");
        const time1 = document.createElement("div");
        const club1 = document.createElement("div");
        innerdiv.appendChild(number);
        innerdiv.appendChild(name);
        div.appendChild(innerdiv);
        div.appendChild(time1);
        document.getElementById("leaderboard").appendChild(div)
        // document.getElementById("leaderboard").childNodes[1].childNodes[0].childNodes[1].appendChild(club1);
        // document.getElementById("leaderboard").childNodes[1].childNodes[0].appendChild(name).appendChild(club1);
        number.innerHTML = 1;
        name.innerHTML = pName[0];
        name.appendChild(club1);
        club1.innerHTML = pClub[0]
        function firstRunner() {
            // Get today's date and time
            now = new Date("December 19, 2021 9:00:20").getTime();
            // console.log("hi")
            // console.log(now)
            // Find the distance between now and the count down date
            if (raceStartTime) {
                time = now - raceStartTime;
            }
            if (reader3_Timings[0]) {
                time = reader3_Timings[0] - raceStartTime;
            }

            time1.innerHTML = millisToMinutesAndSeconds(time);
        }
        
        var Timer = setInterval(firstRunner(),
            1000);
        firstRunner()
        if (reader3_Timings[0]) {
            clearInterval(Timer);
            const img = document.createElement("img");
            img.setAttribute("class", "flag");
            img.setAttribute("src", "finish flag.png");
            time1.appendChild(img)
        }
        runnerdelays.push(raceStartTime)
        for (i = 1; i < reader1_Timings.length; i++) {
            if (reader3_Timings[i]) {
                runnerdelays.push(reader3_Timings[i] - reader3_Timings[0])
            }
            else if (reader2_Timings[i]) {
                runnerdelays.push(reader2_Timings[i] - reader2_Timings[0])
            }
            else if (reader1_Timings[i]) {
                runnerdelays.push(reader1_Timings[i] - reader1_Timings[0])
            }
            else {
                runnerdelays.push(0)
            }

        }

        // greeting = `Hello, ${name}`;
        console.log(uniquePositions)
        console.log(participants.length)
        console.log(pName)
        console.log(runnerdelays)
        for (i = 1; i < participants.length - 1; i++) {
            const div = document.createElement("div");
            const innerdiv = document.createElement("div");
            const name = document.createElement("div");
            const number = document.createElement("div");
            const time = document.createElement("div");
            innerdiv.appendChild(number);
            innerdiv.appendChild(name);
            div.appendChild(innerdiv);
            div.appendChild(time);
            document.getElementById("leaderboard").appendChild(div)
            number.innerHTML = i + 1;
            name.innerHTML = pName[i];
            time.innerHTML = "+" + millisToMinutesAndSeconds(runnerdelays[i]);
            if (reader3_Timings[i]) {
                const img = document.createElement("img");
                img.setAttribute("class", "flag");
                img.setAttribute("src", "finish flag.png");
                time.appendChild(img)
            }
            if (i < 3) {
                const club = document.createElement("div");
                club.innerHTML = pClub[i]
                document.getElementById("leaderboard").appendChild(div).childNodes[0].childNodes[1].appendChild(club);
            }
            // console.log(reader3_Timings)
            // document.getElementById("leaderboard");
        }
        // console.log(millisToMinutesAndSeconds(runnerdelays))



        // console.log(reader0sync)
        // console.log(reader1sync)
        // console.log(reader2sync)
        // console.log(reader3sync)
        // console.log(raceStartTime)



        // console.log(reader1_Timings)
        // console.log(reader2_Timings)
        // console.log(reader3_Timings)

    })
}
function getData() {
    getFirebaseDataon()
}
fRunner()
function fRunner() {
    var y = 2412 / 3
    var time1Coordinate = 681

    if (window.sessionStorage.getItem("dot_place")) {
        var dot_place = JSON.parse(window.sessionStorage.getItem("dot_place"));
        firstRunner = dot_place[1]
        secondRunner = dot_place[2]
        thirdRunner = dot_place[3]
        console.log(dot_place)
    }
    else {
        firstRunner = 0;
        secondRunner = 0;
        thirdRunner = 0;
    }
    // if (raceStartTime) {
    if (firstRunner <= y + 20) {
        firstRunner += 10;
        if (reader1_Timings[1]) {
            firstRunner = y
        }
    }
    if (firstRunner <= 2 * y + 20 && reader1_Timings[1]) {
        firstRunner += 10;
        if (reader2_Timings[1]) {
            firstRunner = 2 * y
        }
    }
    if ((firstRunner <= 3 * y - 10) && reader2_Timings[1]) {
        firstRunner += 10;
    }
    if (reader3_Timings[1]) {
        firstRunner = 2411
    }

    if (secondRunner <= y) {
        secondRunner += 9
        if (reader1_Timings[2]) {
            secondRunner = y
        }
    }
    if (secondRunner <= 2 * y && reader1_Timings[2]) {
        secondRunner = Math.floor(firstRunner - (runnerdelays[1] / time1Coordinate));
        if (reader2_Timings[2]) {
            secondRunner = 2 * y
        }
    }
    if ((secondRunner <= 3 * y - 10) && reader2_Timings[2]) {
        secondRunner = Math.floor(firstRunner - (runnerdelays[1] / time1Coordinate));
    }
    if (reader3_Timings[2]) {
        secondRunner = 2411
        finish2 = 30
    }
    if (thirdRunner <= y - 20) {
        thirdRunner += 8
        if (reader1_Timings[3]) {
            thirdRunner = y
        }
    }
    if (thirdRunner <= 2 * y - 20 && reader1_Timings[3]) {
        thirdRunner = Math.floor(firstRunner - (runnerdelays[2] / time1Coordinate));
        if (reader2_Timings[3]) {
            thirdRunner = 2 * y - 20
        }
    }
    if ((thirdRunner <= 3 * y - 10) && reader2_Timings[3]) {
        thirdRunner = Math.floor(firstRunner - (runnerdelays[2] / time1Coordinate));
    }
    if (reader3_Timings[3]) {
        thirdRunner = 2411
        finish3 = -30
    }
    var dot_place = {
        1: firstRunner,
        2: secondRunner,
        3: thirdRunner
    }
    window.sessionStorage.setItem("dot_place", JSON.stringify(dot_place));
}
const render1 = setInterval(fRunner, 510)
if (reader3_Timings[participants.length - 1]) { //change this
    clearInterval(render1)
}