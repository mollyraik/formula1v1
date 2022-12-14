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
       teamData = data
       debugger
       render()
    },
    (error) => {
      console.log("bad request", error)
    }
  )
  $year.val('');
  $team.val('');
}

function render() {
    $driverA.text(teamData.MRData.RaceTable.Races[0].Results[0].Driver.givenName + " " + teamData.MRData.RaceTable.Races[0].Results[0].Driver.familyName);
    $driverB.text(teamData.MRData.RaceTable.Races[0].Results[1].Driver.givenName + " " + teamData.MRData.RaceTable.Races[0].Results[1].Driver.familyName);
    $a1.text(teamData.MRData.RaceTable.Races[0].Results[0].position);
    $b1.text(teamData.MRData.RaceTable.Races[0].Results[1].position);
  }