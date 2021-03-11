import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'

import {Container} from 'react-bootstrap'

function MyApp({ Component, pageProps }) {
  return(

  	<Container>
  		<Component {...pageProps} />
  	</Container>

  	)
}

export default MyApp
