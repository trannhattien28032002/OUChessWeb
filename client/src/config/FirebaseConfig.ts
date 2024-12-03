import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAppDispatch } from "src/app/hooks";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import { AppDispatch } from "src/app/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import Cookies from "js-cookie";
import { error } from "console";

const firebaseConfig = {
    apiKey: "AIzaSyCdnPJoQ0mlSTVQb3XR_Y3zSRBCtC7KtRU",
    authDomain: "ouchess.firebaseapp.com",
    projectId: "ouchess",
    storageBucket: "ouchess.appspot.com",
    messagingSenderId: "748905092392",
    appId: "1:748905092392:web:b8d94269e7c386170eec1d",
    measurementId: "G-3JLS882YKX",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const { email } = result.user;
        
        const response = await fetch(`http://localhost:8080/auth/authapi-google-auth`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log(data);
            return data.data;
        } else {
            return {
                token: "",
                refreshToken: "",
            };
        }
    } catch (error) {
        return {
            token: "",
            refreshToken: "",
        };
    }
};