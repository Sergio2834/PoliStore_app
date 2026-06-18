import {create} from "zustand"; //Zustand è una libreria per la gestione dello stato globale in React; create è una funzione che permette di creare uno store, ovvero un oggetto che contiene lo stato e le funzioni per modificarlo//
import axios from "axios"; //Axios è una libreria che permette di fare richieste HTTP; in questo caso, viene utilizzata per fare richieste al server per registrare un nuovo utente//


axios.defaults.withCredentials = true; //per permettere a axios di inviare cookie insieme alle richieste, altrimenti il server non riceverebbe i cookie e non potrebbe autenticare l'utente//
export const useAuthStore = create((set) => ({ //useAuthStore è un hook che permette di accedere allo store; set è una funzione che permette di aggiornare lo stato dello store//
    // initial state

    user: null, //user è lo stato che contiene le informazioni dell'utente; inizialmente è null perché l'utente non è loggato//
    isLoading: false, //isLoading è lo stato che indica se l'applicazione sta caricando; inizialmente è false perché l'applicazione non sta caricando//
    error: null, //error è lo stato che contiene eventuali errori; inizialmente è null perché non ci sono errori//
    message: null, //message è lo stato che contiene eventuali messaggi; inizialmente è null perché non ci sono messaggi//
    fetchingUser: true, //fetchingUser è lo stato che indica se l'applicazione sta cercando di recuperare le informazioni dell'utente; inizialmente è true perché l'applicazione sta cercando di recuperare le informazioni dell'utente//

    // functions

    signup: async (username, email, password) => { //signup è una funzione che permette di registrare un nuovo utente; è asincrona perché deve fare una richiesta al server//
        set({ isLoading: true, message: null }) //setta lo stato isLoading a true e message a null; in questo modo, l'applicazione sa che sta caricando e che non ci sono errori o messaggi//

        try {

            const response = await axios.post("http://localhost:5000/api/signup", { 
                username, email, password 
            }); //fa una richiesta POST al server per registrare un nuovo utente; passa come body della richiesta le informazioni dell'utente//

            set({ user: response.data.user, isLoading: false}) //setta lo stato user con le informazioni dell'utente, isLoading a false e message con il messaggio di successo del server//
        }

            catch (error) {
                set({isLoading: false, 
                    error: error.response.data.message || "C'è stato un errore durante la registrazione"}) //setta lo stato isLoading a false e error con il messaggio di errore del server//

                throw error; //lancia l'errore in modo che possa essere gestito dal componente che ha chiamato la funzione signup//    
            }
    } 
}))