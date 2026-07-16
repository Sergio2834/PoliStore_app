import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'; 
import jwt from 'jsonwebtoken';

// Registra un nuovo utente: valida i dati, controlla username/email univoci,
// salva la password cifrata e autentica subito tramite cookie JWT.
export const registrati = async (req, res) => {
    const {username, email, password } = req.body;
    try{
        if(!username || !email || !password){
            throw new Error("tutti i campi sono obbligatori");
        }

        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Utente già esistente"});
        }

        const usernameExists = await User.findOne({username});
        if(usernameExists){
            return res.status(400).json({message: "Questo username è già in uso, scegline un altro"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10); 
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", 
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict", //con strict il deployment con Render non funzionava
            });
        } 
        return res.status(200).json({user: userDoc, message: "Utente creato correttamente!"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
};

// Login: verifica username e password e, se corrette, imposta il cookie JWT
export const accedi = async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.findOne({username});
        if(!userDoc){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        const isPasswordValid = await bcryptjs.compareSync(password, userDoc.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", 
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
        } 
        return res.status(200).json({user: userDoc, message: "Accesso effettuato correttamente!"})
    }catch(error){
        console.log("Errore nell'accesso", error.message);
        res.status(400).json({message: error.message})
    }
};

// Restituisce l'utente loggato leggendo il token JWT dal cookie di sessione
export const fetchUser = async (req, res) => {
    const { token } = req.cookies; 

    if(!token){
        return res.status(401).json({message: "Non autorizzato, token mancante."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if(!decoded){
            return res.status(401).json({message: "Non autorizzato, token non valido."});
        }

        const userDoc = await User.findById(decoded.id).select("-password"); 
        if(!userDoc){
            return res.status(400).json({message: "Utente non trovato."});
        }

        res.status(200).json({user: userDoc});
    }catch (error){
        console.log("Errore nel recupero dell'utente", error.message);
        res.status(400).json({message: error.message});
    }     
};

// Logout: cancella il cookie di sessione
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logout effettuato correttamente!"});
};