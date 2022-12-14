const $year = $('#year')
const $team = $('#team')

const $driverA = $('#driverA')
const $driverB = $('#driverB')

const $a1 = $('#a1')
const $b1 = $('#b1')

let weatherData, userInput;

$("form").on("submit", handleGetData)


function handleGetData(event) {
 
    event.preventDefault()
  
  $.ajax({
    url: `https://ergast.com/api/f1/${$year.val()}/constructors/${$team.val().replace(' ','_')}/results.json`
  }).then(
    (data) => {
       teamData = data;
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

        let $newRow = $(`<tr>
        <td>Round ${i+1}</td>
        <td class=${i+1}>${races[i].Results[0].position}</td>
        <td class=${i+1}>${races[i].Results[1].position}</td>
        </tr>`)

        $('tbody').append($newRow);
    }
  }
