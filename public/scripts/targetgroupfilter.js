// document.getElementById('filter-button').hidden = true;
// document.getElementById('targetgroup-select').addEventListener('change', function () { this.form.submit() });
// document.getElementById('sort-select').addEventListener('change', function () { this.form.submit() })


async function getTeams() {
    const teamResponse = await fetch('https://fdnd.directus.app/items/person/?fields=team&filter[team][_neq]=null&sort=team&groupBy=team')
    const teamResponseJSON = await teamResponse.json()
    console.log(teamResponseJSON)
}

getTeams()