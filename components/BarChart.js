
import {useState, useEffect} from 'react'
import {Bar} from 'react-chartjs-2'

import moment from 'moment'

export default function BarChart({rawData}){
	// console.log(rawData)

	const [months, setMonths] = useState([])
	const [monthlySales, setMonthlySales] = useState([])

	useEffect(()=> {

		if(rawData.length > 0){

			let tempMonths = []

			rawData.forEach(element => {

				// moment(element.sale_date).format('MMM')
				// console.log(moment(element.sale_date).format('MMM'))

				if(!tempMonths.find(month => month === moment(element.sale_date).format('MMMM'))){

					tempMonths.push(moment(element.sale_date).format('MMMM'))
				}
			})
			// console.log(tempMonths)

			const monthsRef = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

			tempMonths.sort((a,b) => {

				if(monthsRef.indexOf(a) !== -1 && monthsRef.indexOf(b) !== -1){

					return monthsRef.indexOf(a) - monthsRef.indexOf(b)
				}
			})
			// console.log(tempMonths)
			setMonths(tempMonths)
		}

	}, [rawData])

	useEffect(()=>{

		setMonthlySales(months.map(month =>{

			let sales = 0
			rawData.forEach(element => {

				if(moment(element.sale_date).format("MMMM") === month){

					sales += parseInt(element.sales)

					// console.log(month,sales)
				}
			})

			return sales
		}))


	},[months])
	// console.log(months)
	// console.log(monthlySales)

	const data = {

		labels: months,
		datasets: [{

			label: 'Monthly Sales for the Year 2020',
			backgroundColor: 'lightblue',
			borderColor: 'white',
			borderWidth: 1,
			hoverBackgroundColor: 'blue',
			hoverBorderColor: 'black',
			data: monthlySales
		}]
	}


	const options = {

		scales: {
			yAxes: [
				{

					ticks: {

						beginAtZero: true
					}
				}
			]
		}
	}
	return (

		<Bar data={data} options={options} />

		)
}
