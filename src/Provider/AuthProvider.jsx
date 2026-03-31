import React, { useEffect, useState } from 'react';
import { AuthContext } from './Context';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';


const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true)
    console.log(user);

// register
    const registerUser =(email,password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password)
    }

// observer
useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        })
        return ()=>{
            unsubscribe();
        }
    },[])

// signIn
const signInUser =(email ,password) =>{
    setLoading(true);
    return signInWithEmailAndPassword(auth, email ,password)
}


// signOut
const signOutUser = ()=>{
    setLoading(true);
    return signOut(auth)
}

// googleSign
const googleSignIn =()=> {
    setLoading(true);
    return signInWithPopup(auth ,googleProvider)}
    


    const authinfo = {
        registerUser,
        signInUser,
        signOutUser,
        user,
        setUser,
        googleSignIn,
        loading,
        setLoading,
    }


    return <AuthContext value={authinfo}>
        {children}
    </AuthContext>
};

export default AuthProvider;