import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore'; //useAuthStore è un hook che permette di accedere allo store; in questo caso, stiamo importando lo store che contiene le informazioni dell'utente e le funzioni per modificarle//


const SignUp = () => {
   const navigate = useNavigate(); //Ti porta da Signin a Signup e viceversa//
   const [username, setUsername] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const {signup, isLoading, error} = useAuthStore()
   
   const handleSignUp = async (e) => {
    e.preventDefault() //previene il comportamento predefinito del form, che è quello di ricaricare la pagina quando viene inviato;
    
    try {
      await signup(username, email, password) //chiama la funzione signup dello store passando come argomenti i valori degli input;
      navigate("/");

    }catch (error) {
      console.log(error);
    }
   }
   
   console.log("Username: ", username, "\nEmail: ", email, "\nPassword: ", password)
  
   return (
    <div 
     className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5" 
      style={{
          backgroundImage: "linear-gradient(rgba(255,250,240,0.3), rgba(255,250,240,0.3)), url(/background2.png)",
       }}>

        
        <div className='max-w-[450px] w-full bg-[#FAF0E6] bg-opacity-75 rounded px-8 py-14 mx-auto'>
            <h1 className='text-3xl font-medium text-black mb-7'>Registrazione</h1>
            <form onSubmit={handleSignUp} className='flex flex-col space-y-4'>
                <input 
                  type="text" 
                  value={username} onChange={(e) => setUsername(e.target.value)}  
                  placeholder="Utente" 
                  className='w-full h-[50px] bg-gray-300 text-black rounded px-5 text-base'/>

                <input 
                  type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email" 
                  className='w-full h-[50px] bg-gray-300 text-black rounded px-5 text-base'/>

                <input 
                  type="password" 
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password" 
                  className='w-full h-[50px] bg-gray-300 text-black rounded px-5 text-base'/>

                  {error && <p className='text-red-500'>{error}</p>}

                <button 
                  type='submit'
                  disabled={isLoading} //disabilita il pulsante quando isLoading è true, impedendo all'utente di inviare più volte il form mentre la richiesta è in corso
                  className='w-full bg-[#191970] text-[#FAF0E6] py-2 rounded text-base hover:opacity-90 cursor-pointer'
                  >
                    Registrati
                </button>
            </form>

            <div className='mt-10 text-[#737373] text-sm'>
                <p> Hai già un account? <span onClick={() => navigate("/signin")} className='text-black font-medium cursor-pointer ml-2 hover:underline'>Accedi</span> </p>
            </div>
        </div>
    </div>
  )
}

export default SignUp