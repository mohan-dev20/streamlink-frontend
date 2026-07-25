import { signInWithPopup } from "firebase/auth";
import {auth, provider} from "../lib/firebase"
export default function GoogleLogin(){
    const handleGoogleLogin =async()=>{
        try{
            const result =await signInWithPopup(auth,provider);
            console.log("User:",result.user);
            alert(`Welcome ${result.user.displayName}`);

        }catch(error){
            console.error(error);

        }
    };
    return(
        <button onClick={handleGoogleLogin}>
            sing in with google
        </button>
    );
} 