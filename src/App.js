import logo from "./logo.svg";
import "./App.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword ,
  sendEmailVerification ,
  signOut,
  sendPasswordResetEmail,
  updateProfile  
} from "firebase/auth";
import initialAuthentication from "./Firebase/firebase.initialize";
import { useState } from "react";
initialAuthentication();
function App() {
  // here is all state list 
  const [name, setName] = useState('')
  const [user, setUser] = useState({});
  const [email, setEmail]= useState('');
  const [password,  setPassword] = useState('')
  const [error , setError] = useState('')
  const [isLoggedIn , setIsLoggedIn] = useState(false);

  // All provider List here
  const googleProvider = new GoogleAuthProvider();
  const gitHubProvider = new GithubAuthProvider();

  // Initialize Auth
  const auth = getAuth();
  // Start Google SignIn
  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(loggedInUser);
      })
      .catch((error) => {
        const message = error.message;
        console.log(message);
      });
  };
  // start gitHub SignIn
  const handleGitHubSignIn = () => {
    signInWithPopup(auth, gitHubProvider).then((result) => {
      const { email, displayName, photoURL } = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(loggedInUser);
    });
  };
  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    });
  };
  // End gitHub SignIn
  // Start email and password registration system 
  const handleEmail = (e)=>{
    setEmail(e.target.value)
  
  }
  const handleName = (e)=>{
    setName(e.target.value)
     
  }
  const toggleLogin = (e)=>{
    setIsLoggedIn(e.target.checked)
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value)
  }
  const handleRegistration = (e) => {
    e.preventDefault();
    if(password.length < 6){
      setError('Password must be at least 6 characters long');
      return;
    }
    if(!/(?=(?:[^A-Z]*[A-Z]){2})/.test(password)){
      setError('Password should be at least two capital letter')
      return;
    }
    // eslint-disable-next-line no-lone-blocks
    {
      isLoggedIn? processLogin(email, password) : createNewUser(email, password)
    }
    console.log(email, password)
    
  };
  // Existing user Login
  const processLogin = (email, password)=>{
    signInWithEmailAndPassword(auth, email, password)
  .then((result) => { 
    const user = result.user;
    console.log('login user', user)
    setError('')
     
  }).catch(error=>{
    setError(error.message)
  })
  }
  // update name
  const updateUserName = ()=>{
    updateProfile (auth.currentUser, {displayName:name})
    .then(result=> { })
  }
  // Create new user
  const createNewUser = (email, password)=>{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result=>{
      const user = result.user;
      updateUserName()
      console.log(user);
      setError('')
      verifyEmailAddress()
    }).catch(error=>{
      setError(error.message)
    })
  }
  // very email address 
  const verifyEmailAddress = ()=>{
    sendEmailVerification(auth.currentUser)
    .then(result=>{
      console.log(result)
    }).catch(error=> setError(error.message))
  }
  // reset password 
  const restPassword = ()=>{
    sendPasswordResetEmail (auth, email)
    .then(result => { })
    .catch(error=> setError(error.message))
  }
  // End Registration process 
  return (
    <div className="">
      <div className="w-50 mx-auto">
        <h2 className="text-primary">Please  {isLoggedIn? "Login": 'Register'}</h2>
        <form onSubmit={handleRegistration}>
          { !isLoggedIn && <div className="row mb-3">
            <label htmlFor="inputName" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input onBlur={handleName} type="text" className="form-control"   required placeholder="your name" />
            </div>
          </div>}
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input onBlur={handleEmail} type="email" className="form-control" id="inputEmail3" required />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Password
            </label> 
            <div className="col-sm-10">
              <input onBlur={handlePassword} type="password" className="form-control" id="inputPassword3" required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                <input
                  onChange={toggleLogin}
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                />
                <label className="form-check-label" htmlFor="gridCheck1">
                   Already Register?
                </label>
              </div>
            </div>
          </div>
          <p className="text-danger">{error}</p>
        {isLoggedIn ? <button type="submit" className="btn btn-primary">
              Login</button>:<button type="submit" className="btn btn-primary">
            Register
            </button>}
            <button onClick={restPassword} className="btn btn-secondary ms-5">Forgot  Password?</button>
        </form>
      </div>
      <br />
      <br />
      <br />
      <div>---------------------</div>
      {!user.photo ? (
        <div>
          <button onClick={googleSignIn}>Google Sign In</button>
          <button onClick={handleGitHubSignIn}>SignIn with gitHub</button>
        </div>
      ) : (
        <button onClick={handleSignOut}>SignOut</button>
      )}
      <br />
      {user.photo && (
        <div>
          <h2>Welcome {user.name}</h2>
          <h4>email:{user.email}</h4>
          <img src={user.photo} alt="" />
        </div>
      )}
    </div>
  );
}

export default App;
