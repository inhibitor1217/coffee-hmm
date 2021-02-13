import firebase from 'firebase/app';
import "firebase/auth";
import { firebaseConfig } from "../../config/firebase";
import React, { useContext, useEffect } from 'react';
import { TokenCtx } from '../../../context';
import { getToken } from '../../api';


const Intro = () => {
    const { setHmmAdminTokenCtx } = useContext(TokenCtx);

    useEffect(() => {
        firebase.initializeApp(firebaseConfig);
    },[])
    
    const adminLogin = async (googleAccessToken: string) => {
        await getToken(googleAccessToken || "").then(data => {
            if(data) {
                setHmmAdminTokenCtx(data.token)
            }else {
                alert('로그인 실패')
            }   
        })
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    
    const firebaseLogin = () => {
        firebase.auth()
                .signInWithPopup(provider)
                .then(async () => {
                    // const credential = result.credential as firebase.auth.OAuthCredential;
                    // const token = credential.idToken; // This gives you a Google Access Token. You can use it to access the Google API.
                    // var user = result.user; // The signed-in user info.
                    const token = await firebase.auth().currentUser?.getIdToken();

                    if(token) {
                        adminLogin(token)
                    }       
                }).catch((error) => {
                    alert(error)
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    // var email = error.email; // The email of the user's account used.
                    // var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
                });
    }
    return(
        <div>
            <button onClick={firebaseLogin} style={{width: "100px", height:"100px"}}>login</button>
        </div>
    )
}

export default Intro;