
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
let season = ''
let constructor = ''

const $heading = $('.parameters')
const $driverA = $('#driverA')
const $driverB = $('#driverB')
const $picA = $('#picA')
const $picB = $('#picB')
const $p = $('p')

const $a1 = $('#a1')
const $b1 = $('#b1')

 $.ajax({
    url: `https://ergast.com/api/f1/seasons.json?limit=100`
    }).then(
    (data) => {
        data.MRData.SeasonTable.Seasons.forEach(function (elem){
            const $newListItem = $(`<li class='year'>${elem.season}</li>`);
            $('#seasonDropdown').prepend($newListItem);
        })
        const years = document.querySelector("#seasonDropdown");
        years.addEventListener("click", handleYearClick);
        
    }),
    (error) => {
        console.log("bad request", error)
    }

$('#seasonBtn').on('click', handleSeasonClick);
$('#teamBtn').on('click', handleConstructorClick)

function handleSeasonClick() {
    document.getElementById("seasonDropdown").classList.toggle("show");
  }
  
//  Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

function handleYearClick(event) {
    //remove teams from previous search
    const teams = document.querySelectorAll('.team');
    teams.forEach(team => {
    team.remove();
    })
    $.ajax({
        url: `https://ergast.com/api/f1/${event.target.textContent}/constructors.json?limit=100`
        }).then(
        (data) => {
            data.MRData.ConstructorTable.Constructors.forEach(function (elem){
                const $newListItem = $(`<li class='team' id='${elem.constructorId}'>${elem.name}</li>`);
                $('#teamDropdown').append($newListItem);

            })
            const teams = document.querySelector("#teamDropdown");
            teams.addEventListener("click", handleTeamClick);
            
        }),
        (error) => {
            console.log("bad request", error)
        }
        season = event.target.textContent;
        $('#seasonBtn').text(season);
        return season;
    }

function handleConstructorClick() {
    document.getElementById("teamDropdown").classList.toggle("show");
}

function handleTeamClick(event) {
    event.preventDefault();
    $('.rounds').remove();
    $('#driver').text('');
    $heading.text('');

    $.ajax({
        url: `https://ergast.com/api/f1/${season}/constructors/${event.target.id}/results.json?limit=100`
        }).then(
        (data) => {
            teamData = data;
            renderHeading ()
            renderDrivers();
            renderPhotos();
            renderRaceResults();
            
        }),
        (error) => {
            console.log("bad request", error)
        }
        constructor = event.target.textContent;
        $('#teamBtn').text(constructor);
        return constructor;
}

function renderDrivers() {
    let teamAndYear = teamData.MRData.RaceTable.Races[0]
    $driverA.text(teamAndYear.Results[0].Driver.givenName + " " + teamAndYear.Results[0].Driver.familyName);
    $driverB.text(teamAndYear.Results[1].Driver.givenName + " " + teamAndYear.Results[1].Driver.familyName);    
}

function renderRaceResults() {
    //iterate through the races and create rows in the table for each race
    let races = teamData.MRData.RaceTable.Races
    for (let i = 0; i < races.length; i++){
        // debugger
        
        if (`${races[i].Results[0].Driver.givenName} ${races[i].Results[0].Driver.familyName}` === $driverA.text()){
            let $newRow = $(`<tr class='rounds'>
                <td>${i+1}</td>
                <td>${races[i].raceName}</td>
                <td class='green result'>${races[i].Results[0].positionText}</td>
                <td class='red result'>${races[i].Results[1].positionText}</td>
                </tr>`)
            $('tbody').append($newRow);
        } else {
            let $newRow = $(`<tr class='rounds'>
                <td>${i+1}</td>
                <td>${races[i].raceName}</td>
                <td class='red result'>${races[i].Results[1].positionText}</td>
                <td class='green result'>${races[i].Results[0].positionText}</td>
                </tr>`)
            $('tbody').append($newRow);
        }
    }
    
  }

function renderHeading () {
   $heading.text(`${teamData.MRData.RaceTable.Races[0].Results[0].Constructor.name}: ${teamData.MRData.RaceTable.season}`) 
  }

function renderPhotos () {
    const picA = {
        "async": true,
        "crossDomain": true,
        "url": `https://api-formula-1.p.rapidapi.com/drivers?search=${$driverA.text().replace(' ', '%20').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "ca04c4f827msh3772741c158fadcp18709ajsn877af2764e0a",
            "X-RapidAPI-Host": "api-formula-1.p.rapidapi.com"
        }
    };

    $.ajax(picA).done(function (data) {
        //debugger;
        if (data.response[0] === undefined){
            $picA.attr('src', '').attr('alt', '');
            return;
        } else {
        $picA.attr('src', data.response[0].image).attr('alt', $driverA.text());
        }
    });
    
    const picB = {
        "async": true,
        "crossDomain": true,
        "url": `https://api-formula-1.p.rapidapi.com/drivers?search=${$driverB.text().replace(' ', '%20').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "ca04c4f827msh3772741c158fadcp18709ajsn877af2764e0a",
            "X-RapidAPI-Host": "api-formula-1.p.rapidapi.com"
        }
    };
    
    $.ajax(picB).done(function (data) {
        //debugger;
        if (data.response[0] === undefined){
            $picB.attr('src', '').attr('alt', '');
            return;
        } else {
        $picB.attr('src', data.response[0].image).attr('alt', $driverB.text());
        }
    });
}

// code to figure out who are the main drivers for each team in the event that the team had subs

// function searchForMainDrivers () {
//     //debugger
//     teamData.MRData.DriverTable.Drivers.forEach(function (elem){
//         let driverCheck = elem.driverId
//         $.ajax({
//             url: `https://ergast.com/api/f1/${$year.val()}/drivers/${driverCheck}/results.json?limit=30`
//           }).then(
//             (data) => {
//                //debugger
//             }),
//             (error) => {
//               console.log("bad request", error)
//             }
//     })
// }


//     // $.ajax({
//     //     url: `https://ergast.com/api/f1/${$year.val()}/constructors/${$team.val().replace(' ','_')}/drivers.json?limit=10`
//     //   }).then(
//     //     (data) => {
//     //        teamData = data;
//     //        if (teamData.MRData.DriverTable.Drivers.length > 2){
//     //         searchForMainDrivers();
//     //        } else {
//     //         return;}
//     //     },
//     //     (error) => {
//     //       console.log("bad request", error)
//     //     }
//     //   )