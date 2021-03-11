import React from 'react' // We need to import React so we  can use createRef()
import {useState, useEffect,Fragment} from 'react'

import{Form,Button} from 'react-bootstrap'

import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'

import Head from 'next/head' // allows us to add a head tag into this page's HTML.
export default function Home() {

  //Create a reference for the input file form element. This is so we can locate the file later. Works almost like querySelector() back in JS/DOM
  const fileRef = React.createRef()

  //Create states for containing the values that we need to process the data to be visualized in our charts later.

  //State which will contain the JSON response from the API
  const [csvData, setCsvData] = useState([])

  // State for containing the distinct and specific bands with their respective sales totals.
  const [brands,setBrands] = useState([])

  //State for associating the distinct brands with their respectice sales totals
  const [salesByBrand, setSalesByBrand] = useState([])

  const toBase64 = (file)=> new Promise((resolve,reject)=>{

    // console.log(file)

    //the FileReader object allows to have our application read the context of files or raw data stored in the user's computer.
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>{

      console.log(reader.result) // expected result is the base64 string of the file. I uploaded a jpg, => image as a string
      return resolve(reader.result)
    }

    reader.onerror = () => {

      return reject(error)
    } 

  })

  /*
  fileUpload => convert to base64 => encoded base64 string passed to backend (API) using fetch => base64 string is rebuilt to csv => cs converted to json() => returned as response of the server 

  */

  function uploadCsv(e){

    e.preventDefault()

    //fileRef is a reference object we created from React to refer back to the input element where we uploaded a file. 
    //kapag file type yung input, you need tpo reference it, para makuha yung file using 'fileRef'. 
    //console.log(fileRef.current.files[0])// This will act as an array; accessing the [0] index will give you the File


    //toBase64 function to translate or convert our file into a base64 string, which we will be using to pass into our backend(API). Kapag nagpapasa ka sa backend, daat string. Kaya dapat convert muna.

    toBase64(fileRef.current.files[0])      
    .then(encodedFile=> {

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URI}/api/cars`,{
        method: 'POST',
        headers: {

          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({

          csvData: encodedFile
        })
      })

        .then(res => res.json())
        .then(data => {
       // console.log(data)

        // the server returns a jsonArray that is not empty, we will set/update our csvData state with the array of json
        if(data.jsonArray.length > 0){

            setCsvData(data.jsonArray)
        }
     })
    
   })

  }

  //console.log(csvData)

  //useEffect() which will run on initoal render and if there are changes in the values of the optional dependency array. We will include the csvData state into the dependencyy array so that the useEffect will run on initial render and whenever the csvData stae changes values.

  useEffect(()=>{

    //This useEffect will filter through array and record or save only the distinct brands that were sold. 

    // makes will be the temporary array where we will put the distinct brands
   let makes = []
   csvData.forEach(element =>{

    //iterate over all the items /objects in the csvData
    //This IF statement will run a find method to determine if there is no duplicate brand in the makes array. IF there is a duplicate brand, we will skip, but if there is no duplicate brand, e will push the brand into the makes array

    if(!makes.find(make => make === element.make)){

      makes.push(element.make)
    }

   })

   //console.log(makes)// should contain  only distinct brands

   setBrands(makes)//update the brands state with the temporary makes array which contains all distinct car brands that were sold.

  },[csvData])

  /*
    This useEffect will run on initial render and when the brands state changes value.


  */

  useEffect(()=>{

      //compute for the total sales per brand.
      //map the brands array into the salesByBrand state
      setSalesByBrand(brands.map(brand =>{
        //brands[0] => finish/accomplish forEach => iterate for brands[1] => finish/accomplish forEach()
        let sales = 0//variable to store the total sales of a particular brand

          //iterates over the csvData
          csvData.forEach(element => {

            //console.log(element.make)

            //for each elemnt of the same brand we will accumulate sales.
            if(element.make === brand){

              //accumulatethe sales
              sales += parseInt(element.sales)
            }
          })

          // returns the brand and its accumulated sales into the salesByBrand state which is an array
          return{

              brand: brand,
              sales: sales
          }

      }))
  },[brands])

    // console.log(salesByBrand)

  return (

      <Fragment>
        <Head>
          <title>
            CSV Visualization
          </title>
        </Head>
        <h1>Welcome to CSV Visualization</h1>
        <Form onSubmit={e=> uploadCsv(e)}>
          <Form.Group controlId ="csvUploadForm">
            <Form.Label>Upload CSV</Form.Label>
            <Form.Control type="file" ref={fileRef} accept="csv"  />     
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
        <BarChart rawData={csvData}/>
        <PieChart carData={salesByBrand}/>
      </Fragment>
    
  )
}



/*



Note: toBase64() is an alogorithm to change a file to a string. It is pre defined. It is an encoding string(scheme? not sure). But there are also other methods that you can use to convert files to string and pass it to the backend (API). Backend only accepts string.

//STEPS
Created a fileReader() 
readAsDataURL- method for the FilreReader is used to read the contents the file. When done, the resultattribute for yout reader will now contain the base64 enclosed string
If the conversion was successful, the onload property of the reader runs an event when the result from readDataURL is available.
If the conversion was unsuccessful, the onerror will run and reject.

*/