import  { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,signInWithPopup, GoogleAuthProvider,updateProfile  } from "firebase/auth";
import firebaseInitialize from '../pages/login/Firebase/firebase.init';

firebaseInitialize();

const useFirebase = () => {
    const [user,setUser]=useState({});
    const [error,setError]=useState('');

    const [isLoading,setLoding]=useState(true);

    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();



    const googleSingIn=(history,location)=>{
        const redirect_uri=location?.state?.from || '/';
        setLoding(true);
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            history.push(redirect_uri);
           const user=result.user; 
           setUser(user);
          
           saveUser(user.email, user.displayName, "PUT");   
           
           setError('');

           
        }).catch((error) => {
            
            setError(error.message);
   
        }).finally(()=>setLoding(false));



    }





    const userRegistation=(email,password,name,history,location)=>{
        const redirect_uri=location?.state?.from || '/';

        setLoding(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {

         history.push(redirect_uri);
            
            // setUser(result.user);
            const newUser={email:email,displayName:name}
            setUser(newUser);
            saveUser(email,name,"POST");


            updateProfile(auth.currentUser, {
                displayName: name
              }).then(() => {
                
              }).catch((error) => {
                
              });
            

            
            
        })
        .catch((error) => {
            
            setError(error.message);
            
        }).finally(()=>setLoding(false));
    }

    const userLogin=(email,password,history,location)=>{
        const redirect_uri=location?.state?.from || '/';

        setLoding(true);
        signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            history.push(redirect_uri);
            setUser(result.user);
           

            
        })
        .catch((error) => {
            setError(error.message);
            
        }).finally(()=>setLoding(false));

    }

    // observe user state
    useEffect(()=>{      
        const unsubscribed=onAuthStateChanged(auth, (user) =>{
              if (user) {         
                   setUser(user)
                   
                 } else {
                     setUser({})      
                 }
                 setLoding(false);
               });
               return ()=>unsubscribed;
 
     },[auth]);

    

    const logOut=()=>{
        setLoding(true);
        signOut(auth).then(() => {
            setUser({})
          }).catch((error) => {
            setError(error.message);
          }).finally(()=>setLoding(false));
    }

    const saveUser=(email,displayName,methodname)=>{
        const user={email,displayName};
        fetch('http://localhost:5000/users',{
            method:methodname,
            headers:{
                'content-type':'application/json',
            },
            body:JSON.stringify(user)
        })
        .then(result=>{
            console.log(result);
        })

      


    }




    return {user,error,setError,isLoading,userRegistation,userLogin,googleSingIn,logOut};
};

export default useFirebase;