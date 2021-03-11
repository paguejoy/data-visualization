import {useState, useEffect} from 'react'
import {Pie} from 'react-chartjs-2'

import {colorRandomizer} from '../helpers/colorRandomizer'

import randomcolor from 'randomcolor'

export default function PieChart({carData}){

	console.log(colorRandomizer())

	// console.log(carData)

	const [brands, setBrands] = useState([])
	const [sales, setSales] = useState([])
	const[randomBGColors, setRandomBGColors] = useState([])

	useEffect(()=>{

		setBrands(carData.map(element => element.brand))
		setSales(carData.map(element => element.sales))

		setRandomBGColors(carData.map(() => randomcolor()))


	},[carData])

	// console.log(brands)
	// console.log(sales)

	const data = {

		labels: brands,
		datasets: [{

			data: sales,
			backgroundColor: randomBGColors
		}]

	}

	return(

		<Pie data={data}/>

		)
}