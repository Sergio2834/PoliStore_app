import {create} from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({ 

    user: null, 
    isLoading: false, 
    error: null, 
    message: null,
    fetchingUser: true,

    // functions

    signup: async (username, email, password) => {
        set({ isLoading: true, message: null })

        try {

            const response = await axios.post(`${API_URL}/signup`, { 
                username, email, password, 
            }); 

            set({ user: response.data.user, isLoading: false})
        }

            catch (error) {
                set({isLoading: false, 
                    error: error.response.data.message || "C'è stato un errore durante la registrazione"})

                throw error;    
            }
    },

    login: async (username, password) => {
        set({isLoading: true, message: null, error: null });

        try{
            const response = await axios.post(`${API_URL}/login`, {
                username, 
                password,
            });

            const {user, message} = response.data;

            set({
                user,
                message,
                isLoading: false,
            });

            return {user, message};
        }catch (error){
            set({
                isLoading: false, 
                error: error.response.data.message || "C'è stato un errore durante l'accesso"
            }); 

            throw error;
        }
    }, 

    fetchUser: async () => {
        set({ fetchingUser: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/fetch-user`);
            set({ user: response.data.user, fetchingUser: false });
        } catch (error) {
            // Se l'errore è 401, significa solo che l'utente non è loggato (è un ospite).
            const isUnauthorized = error.response && error.response.status === 401;
            
            set({
                user: null,
                fetchingUser: false, // Corretto: prima c'era isLoading: false
                error: isUnauthorized ? null : (error.response?.data?.message || "C'è stato un errore nel prelevare le informazioni relative all'utente")
            }); 

            // RIMOSSO: throw error; <- Era questo a causare l'errore "Uncaught" in console!
        }
    },

    logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_URL}/logout`);
      const { message } = response.data;
      set({
        message,
        isLoading: false,
        user: null,
        error: null,
      });

      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "C'è stato un errore durante il logout",
      });

      throw error;
    }
    },

    setUser: (userData) => set({ user: userData })
}));