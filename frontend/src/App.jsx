import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import SignUp from './pages/SignUp' 
import SignIn from './pages/SignIn' 
import { Route, Routes } from 'react-router'
import {Toaster} from "react-hot-toast" //ovviamente ti basta fare npm intsall e installa automaticamente questo che serve per poi mostare il messaggio di accesso effettuato correttamente
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  if(fetchingUser){
    return <p>Loading...</p>
  }
  return (
    <div>
      <Toaster />
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