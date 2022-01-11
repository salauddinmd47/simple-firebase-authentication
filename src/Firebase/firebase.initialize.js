import firebaseConfig from "./firebase.config";
import { initializeApp } from "firebase/app";
const initialAuthentication = ()=>{
    initializeApp(firebaseConfig);
}
export default initialAuthentication;