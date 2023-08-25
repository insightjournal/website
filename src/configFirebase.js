import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDSMDJA1HECLUdlrpbeXmnc4NDqZZh7RUc",
    authDomain: "insight-journal-website.firebaseapp.com",
    projectId: "insight-journal-website",
    storageBucket: "insight-journal-website.appspot.com",
    messagingSenderId: "94825169288",
    appId: "1:94825169288:web:d3fa43bcb4b268d7d0fa3d",
    measurementId: "G-PDBJFBFJS0"
}

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export var database = getFirestore(app)
export var storage = getStorage(app)