import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore'; //useAuthStore è un hook che permette di accedere allo store; in questo caso, stiamo importando lo store che contiene le informazioni dell'utente e le funzioni per modificarle//


const SignUp = () => {
   const navigate = useNavigate(); //Ti porta da Signin a Signup e viceversa//
   const [username, setUsername] = useState("") //useState è un hook che permette di creare uno stato locale all'interno di un componente funzionale; in questo caso, username è lo stato che contiene il valore dell'input e setUsername è la funzione che permette di aggiornare questo stato; inizialmente, lo stato è una stringa vuota//
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const {signup, isLoading, error} = useAuthStore() //useAuthStore è un hook che permette di accedere allo store; in questo caso, stiamo estraendo le funzioni signup, isLoading e error dallo store//
   
   const handleSignUp = async (e) => {
    e.preventDefault() //previene il comportamento predefinito del form, che è quello di ricaricare la pagina quando viene inviato; in questo modo, possiamo gestire l'invio del form in modo personalizzato senza dover ricaricare la pagina//
    
    try {
      await signup(username, email, password) //chiama la funzione signup dello store passando come argomenti i valori degli input; questa funzione fa una richiesta al server per registrare un nuovo utente e aggiorna lo stato dello store con le informazioni dell'utente e eventuali messaggi di errore o successo//
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
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/background_signin.jpg)",
       }}> {/*La logica flex serve per centrare il form*/}

        
        <div className='max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto'>
            <h1 className='text-3xl font-medium text-white mb-7'>Registrazione</h1>
            <form onSubmit={handleSignUp} className='flex flex-col space-y-4'>
                <input 
                  type="text" 
                  value={username} onChange={(e) => setUsername(e.target.value)}  
                  placeholder="Mario Rossi" 
                  className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/> {/* onChange è un evento che si attiva ogni volta che il valore dell'input cambia; in questo caso, quando l'utente digita qualcosa nell'input, la funzione setUsername viene chiamata con il nuovo valore dell'input, aggiornando così lo stato username*/}

                <input 
                  type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                  placeholder="mariorossi@gmail.com" 
                  className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/>

                <input 
                  type="password" 
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Inserisci la tua password" 
                  className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base'/>

                  {error && <p className='text-red-500'>{error}</p>} //se c'è un errore, viene mostrato un messaggio di errore sotto il form; error è lo stato che contiene eventuali messaggi di errore dello store//

                <button 
                  type='submit'
                  disabled={isLoading} //disabilita il pulsante quando isLoading è true, impedendo all'utente di inviare più volte il form mentre la richiesta è in corso// 
                  className='w-full bg-[#e50914] text-white py-2 rounded text-base hover:opacity-90 cursor pointer'
                  >
                    Registrati
                </button>
            </form>

            <div className='mt-10 text-[#737373] text-sm'>
                <p> Hai già un account? <span onClick={() => navigate("/signin")} className='text-white font-medium cursor-pointer ml-2 hover:underline'>Accedi</span> </p>
            </div>
        </div>
    </div>
  )
}

export default SignUp