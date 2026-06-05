import { StrictMode } from 'react' //ti avvisa se stai usando codice vecchio o se ci sono potenziali problemi di logica//
import { createRoot } from 'react-dom/client' //Importa la funzione base di React 18+ che serve a creare la "radice" dell'applicazione, ovvero il punto in cui React prenderà il controllo del codice HTML//
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router' //Importa il componente BrowserRouter da react-router, che serve a gestire la navigazione tra le pagine dell'applicazione; viene rinominato come Router per comodità; BrowserRouter utilizza la History API del browser per mantenere l'interfaccia utente sincronizzata con l'URL; è necessario avvolgere l'intera applicazione con Router per poter utilizzare le funzionalità di routing in qualsiasi parte dell'applicazione//

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
