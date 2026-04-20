import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());

app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {

    const district = request.params.district
    const slug = request.params.slug

    const params = {
        // Sorteren op datum, van nieuw naar oud (dus met een minteken ervoor)
        'sort': '-date',

        // Alleen de volgende velden tonen, zodat we niet onnodig veel data ophalen
        'fields': 'cover, date, title, intro, status, district, slug',
    }

    const apiStoriesResponse = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params))
    const apiStoriesResponseJSON = await apiStoriesResponse.json()

    response.render('index.liquid', { stories: apiStoriesResponseJSON.data, district: district, slug: slug })
})

// ZOEKRESULTATEB
app.get('/search', async function (request, response) {
    const search = request.query.search || ''

    const params = {
        'fields': 'cover, date, title, intro, status, district, slug',
        ...(search && { 'filter[title][_icontains]': search }),
        'filter[status][_eq]': 'published',
        limit: -1,
    }

    const apiStoriesResponse = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params))
    const apiStoriesResponseJSON = await apiStoriesResponse.json()

    response.render('search.liquid', { stories: apiStoriesResponseJSON.data, search })
})

// DISTRICTPAGINA, MET OPTIES VOOR SORTEREN EN FILTEREN OP DOELGROEP
app.get('/:district', async function (request, response) {
    const params = new URLSearchParams()

    const target_group = request.query.target_group || ''
    const date = request.query.date || ''
    const district = request.params.district


    if (date === 'oud-nieuw') {
        params.set('sort', 'date')
    } else if (date === 'nieuw-oud') {
        params.set('sort', '-date')
    } else {
        params.set('sort', 'title')
    }

    params.set('filter[district][_eq]', district)

    if (target_group) {
        params.set('filter[target_group][_eq]', target_group)
    }

    const apiStoriesResponse = await fetch(
        'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + params.toString()
    )

    const apiStoriesResponseJSON = await apiStoriesResponse.json()

    response.render('district.liquid', {
        // selectedTargetGroup: target_group,
        // selectedSort: date,
        // stories: apiStoriesResponseJSON,
        // district: district,
        // selectedTargetGroup: request.query.target_group || ''
        // meta: pizzasJSON.meta

        stories: apiStoriesResponseJSON.data,
        district: district,
        selectedTargetGroup: request.query.target_group || ''
    })
})

// LOCATIEPAGINA MET NIEUW > OUD
app.get('/:district/nieuw-oud', async function (request, response) {

    const district = request.params.district
    const slug = request.params.slug

    const params = {
        'sort': '-date',

        'filter[district]': district,

        'fields': 'cover, date, title, intro, status, district, slug',
    }

    const apiStoriesResponse = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params))
    const apiStoriesResponseJSON = await apiStoriesResponse.json()


    response.render('district.liquid', { stories: apiStoriesResponseJSON.data, district: district, slug: slug })
})

// LOCATIEPAGINA MET OUD > NIEUW
app.get('/:district/oud-nieuw', async function (request, response) {

    const district = request.params.district
    const slug = request.params.slug

    const params = {
        // Sorteren op datum, van nieuw naar oud (dus met een minteken ervoor)
        'sort': 'date',

        // alleen locatie algemeen tonen
        'filter[district]': district,

        // Alleen de volgende velden tonen, zodat we niet onnodig veel data ophalen
        'fields': 'cover, date, title, intro, status, district, slug',
    }

    const apiStoriesResponse = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params))
    const apiStoriesResponseJSON = await apiStoriesResponse.json()

    response.render('district.liquid', { stories: apiStoriesResponseJSON.data, district: district, slug: slug })
})

// SINGLE ARTIKEL/STORY PAGINA
app.get('/:district/:slug', async function (request, response) {

    const district = request.params.district
    const slug = request.params.slug
    const story = request.params.story


    const params = {
        // Sorteren op datum, van nieuw naar oud (dus met een minteken ervoor)
        'sort': '-date',

        'filter[district]': district,
        'filter[slug]': slug,
        // 'filter[story]': story,

        // Alleen de volgende velden tonen, zodat we niet onnodig veel data ophalen
        'fields': 'id, cover, date, title, intro, status, district, slug, body, comments.*',
    }

    const apiStoriesResponse = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params))
    const apiStoriesResponseJSON = await apiStoriesResponse.json()

    // Featured artikelen (zelfde district)
    const featuredParams = {
        'sort': '-date',
        'filter[district]': district,
        'filter[slug][_neq]': slug,
        'fields': 'id, cover, date, title, intro, status, district, slug, body, comments.*',
    }

    const featuredResponse = await fetch(
        'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' +
        new URLSearchParams(featuredParams)
    )

    const featuredJSON = await featuredResponse.json()

    response.render('details.liquid', { story: apiStoriesResponseJSON.data[0], stories: featuredJSON.data, district: district, slug: slug })
})

// COMMENTAAR TOEVOEGEN AAN EEN ARTIKEL
app.post('/:district/:slug/comment', async function (request, response) {

    await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories_comments', {
        method: 'POST',

        body: JSON.stringify({
            name: request.body.name,
            comment: request.body.comment,
            story: request.body.story,
        }),

        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });

    response.redirect(303, `/${request.params.district}/${request.params.slug}/`);
})

app.use((req, res, next) => {
    res.status(404).send("Deze pagina bestaat niet")
})

app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})