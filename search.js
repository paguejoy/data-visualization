import { useEffect, useState } from 'react'
import { Jumbotron, Form, Button } from 'react-bootstrap'

import DoughnutChart from '../components/DoughnutChart'

import toNum from '../helpers/toNum'

export default function searchPage({ countriesStat }) {

    console.log(countriesStat)

    const [country, setCountry] = useState("")

    const [countryMatch, setCountryMatch] = useState("")

    const [stats, setStats] = useState("")

    const [isActive, setIsActive] = useState(true)

    useEffect(() => {

        if (country !== "") {

            setIsActive(true)
        } else {

            setIsActive(false)
        }
    }, [country])

    function search(e) {

        e.preventDefault()

        // console.log(country)

        const match = countriesStat.find(countryName => {

            return (countryName.country_name === country)

        })

        console.log(match)

        if (match) {

            setCountryMatch(match)

            const stats = {
                cases: toNum(match.cases),
                criticals: toNum(match.serious_critical),
                deaths: toNum(match.deaths),
                recovered: toNum(match.total_recovered)
            }

            setStats(stats)

        } else {

            console.log("Invalid Country!")
        }

    }

    return (
        <>
            <h1>Search Infected Country</h1>
            <Form onSubmit={e => search(e)}>
                <Form.Group controlId="country">
                    <Form.Label>Country: </Form.Label>
                    <Form.Control type="country" placeholder="Enter Country" value={country} onChange={e => setCountry(e.target.value)} required />
                </Form.Group>
                {
                    isActive
                        ?
                        <Button variant="primary" type="submit" className="btn-block">Search</Button>
                        :
                        <Button variant="primary" className="btn-block" disabled>Search</Button>
                }
            </Form>
            <>
                <Jumbotron>
                    <h1>{countryMatch.country_name}</h1>
                    <p>Total Cases: {countryMatch.cases}</p>
                    <p>Deaths: {countryMatch.deaths}</p>
                    <p>Recoveries: {countryMatch.total_recovered}</p>
                </Jumbotron>
                <DoughnutChart stats={stats} />
            </>
        </>
    )
}

export async function getStaticProps() {

    const res = await fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', {

        "method": "GET",
        "headers": {

            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "6085b628a5msh12b4765569d1427p1188bbjsnd3c4dc348539"
        }
    })

    const data = await res.json()

    const countriesStat = data.countries_stat

    return {
        props: {
            countriesStat
        }
    }
}