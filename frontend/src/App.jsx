import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import SignUp from './pages/SignUp' 
import SignIn from './pages/SignIn'
import SingleBook from './pages/SingleBook' 
import { Route, Routes } from 'react-router'
import {Toaster} from "react-hot-toast" //ovviamente ti basta fare npm intsall e installa automaticamente questo che serve per poi mostare il messaggio di accesso effettuato correttamente
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import Preferiti from './pages/Preferiti';
import SearchPage from './pages/SearchPage';
import { Loader } from 'lucide-react';



const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  
  return (
    <div>
      <Toaster />
      <Navbar />
      
      {fetchingUser ? (<div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <Loader className="w-10 h-10 animate-spin text-[#191970]" />
        <p className="mt-4 text-lg font-medium text-gray-600">Avvio del server in corso, attendere...</p>
        </div>
      ) : (
        <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/libro/:id"} element={<SingleBook />} />
        <Route path={"/cerca/:query"} element={<SearchPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path="/preferiti" element={<Preferiti />} />
      </Routes>
      )}
    </div>
  )
}

export default App