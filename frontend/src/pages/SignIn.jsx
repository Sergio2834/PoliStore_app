import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {useAuthStore} from "../store/authStore";
import toast from 'react-hot-toast';

const SignIn = () => {
     const navigate = useNavigate(); //Ti porta da Signin a Signup e viceversa//
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState(""); //useState è un hook che permette di creare uno stato locale all'interno di un componente funzionale; in questo caso, username è lo stato che contiene il valore dell'input e setUsername è la funzione che permette di aggiornare questo stato; inizialmente, lo stato è una stringa vuota//
     const {login, isLoading, error} = useAuthStore();
     
     const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const {message} = await login(username, password) //estraiamo il messaggio di login avvenuto correttamente
            toast.success(message); //mostra il messaggio di login avvenuto correttamente estratto alla riga prima 
            navigate("/")
        } catch(error){
            console.log(error)
        }
     }
 
     return (
     <div
     className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
      style={{
          backgroundImage: 
          "linear-gradient(rgba(255,250,240,0.3), rgba(255,250,240,0.3)), url(/background2.png)",
       }}> {/*La logica flex serve per centrare il form, importa l'immagine di sfondo*/}

        
        <div className='max-w-[450px] w-full bg-[#FAF0E6] bg-opacity-75 rounded px-8 py-14 mx-auto'>
            <h1 className='text-3xl font-medium text-black mb-7'>Accesso</h1>
            <form onSubmit = {handleLogin} className='flex flex-col space-y-4'>
                <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Utente" 
                className='w-full h-[50px] bg-gray-300 text-black rounded px-5 text-base'/> {/* onChange è un evento che si attiva ogni volta che il valore dell'input cambia; in questo caso, quando l'utente digita qualcosa nell'input, la funzione setUsername viene chiamata con il nuovo valore dell'input, aggiornando così lo stato username*/}

                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className='w-full h-[50px] bg-gray-300 text-black rounded px-5 text-base'/>

                {error && <p className="text-red-500">{error}</p>}

                <button 
                type='submit'
                disabled={isLoading} 
                className='w-full bg-[#191970] text-[#FAF0E6] py-2 rounded text-base hover:opacity-90 cursor-pointer'
                >
                    Accedi
                </button>
            </form>

            <div className='mt-10 text-[#737373] text-sm'>
                <p> Prima volta? 
                    <span onClick={() => navigate("/signup")} 
                    className='text-black font-medium cursor-pointer ml-2 hover:underline'
                    > {/*onClick è un evento che si attiva quando l'utente clicca sull'elemento; in questo caso, quando l'utente clicca sullo span, la funzione navigate viene chiamata con il percorso "/signup", portando così l'utente alla pagina di registrazione*/}
                        
                        Registrati adesso
                    </span> 
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignIn