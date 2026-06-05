import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import SignUp from './pages/SignUp' 
import SignIn from './pages/SignIn' 
import { Route, Routes } from 'react-router'

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/libro/:id"} element={<p>Questo è una pagina di libro</p>} /> {/*route dinamica che mostra una pagina di libro specifico in base all'id passato nell'url*/}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/carrello' element={<p>Questo è il carrello</p>} />
      </Routes>
      
    </div>
  )
}

export default App