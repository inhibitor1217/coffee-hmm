import firebase from 'firebase/app';
import "firebase/auth";
import { firebaseConfig } from "../../config/firebase";
import React, { useEffect } from 'react';


const Intro = () => {
    useEffect(() => {
        firebase.initializeApp(firebaseConfig);
    },[])

    const provider = new firebase.auth.GoogleAuthProvider();
    
    const firebaseLogin = () => {
        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult().then((result) => {
            if (result.credential) {
                var token = result.credential; // This gives you a Google Access Token. You can use it to access the Google API.
            }
           
            var user = result.user; // The signed-in user info.
        }).catch((error) => {
            /*
            var errorCode = error.code; // Handle Errors here.
         
            var email = error.email; // The email of the user's account used.
           
            var credential = error.credential; // The firebase.auth.AuthCredential type that was used.
            */
            alert(error.message)
        })
    }
    return(
        <div>
            <button onClick={firebaseLogin} style={{width: "100px", height:"100px"}}>login</button>
        </div>
    )
}

export default Intro;