const $year = $('#year')
const $team = $('#team')

const $heading = $('.parameters')
const $driverA = $('#driverA')
const $driverB = $('#driverB')

const $a1 = $('#a1')
const $b1 = $('#b1')

let weatherData, userInput;

$("form").on("submit", handleGetData)


function handleGetData(event) {
 
    event.preventDefault();
    $('.rounds').remove();
    $('#driver').text('');
  
  $.ajax({
    url: `https://ergast.com/api/f1/${$year.val()}/constructors/${$team.val().replace(' ','_')}/results.json?limit=50`
  }).then(
    (data) => {
       teamData = data;
       renderHeading ()
       renderDrivers();
       renderRaceResults();
    },
    (error) => {
      console.log("bad request", error)
    }
  )
  $year.val('');
  $team.val('');
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
                <td>Round ${i+1}</td>
                <td>${races[i].raceName}</td>
                <td class='green'>${races[i].Results[0].position}</td>
                <td class='red'>${races[i].Results[1].position}</td>
                </tr>`)
            $('tbody').append($newRow);
        } else {
            let $newRow = $(`<tr class='rounds'>
                <td>Round ${i+1}</td>
                <td>${races[i].raceName}</td>
                <td class='red'>${races[i].Results[1].position}</td>
                <td class='green'>${races[i].Results[0].position}</td>
                </tr>`)
            $('tbody').append($newRow);
        }
    }
  }

function renderHeading () {
   $heading.text(`${teamData.MRData.RaceTable.Races[0].Results[0].Constructor.name}: ${teamData.MRData.RaceTable.season}`) 
  }
