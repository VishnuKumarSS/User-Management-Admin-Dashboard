// this update user.js is a replica or duplicate of createuser.js...Just altered some of the things that are required for the update user.
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/createAndUpdateUser.css"; // here we have used the same styling in both create and update form page

function UpdateUser() {
  let navigate = useNavigate();

  const [users, setUsers] = useState(null);
  const [userDataJSON, setUserDataJSON] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [userData, setUserData] = useState([]);

  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState(null);
  const [usercity, setUsercity] = useState("");
  const [usertype, setUsertype] = useState("normal");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  // const [ password, setPassword ] = useState("");

  const [updateUsername, setUpdateUsername] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updated, setUpdated] = useState(false); // to show the user is updated message on the screen.

  const [error, setError] = useState(null); // to show the error message
  const [confirm, setConfirm] = useState(false);

  const [validated, setValidated] = useState(false);
  const [specialChar, setSpecialChar] = useState(null);
  const [usernameAlreadyExist, setUsernameAlreadyExist] = useState(null);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(null);

  useEffect(() => {
    axios
      .get("/current_user")
      .then((res) => {
        setUsers(res.data[0]);
        setUserDataJSON(res.data[1]);
        // setUser(res.data[0]);
        // setResponseData(res)
        setLoggedIn(true);
        console.log(res);
      })
      .catch((err) => {
        console.log("error:", err);
        // setResponseData(err.response.status)
        setUserDataJSON(null);
        setLoggedIn(false);
        console.log("Currently no users logged in.");
      });
    axios
      .get("/allusers")
      .then((getData) => {
        console.log("allusers : ", getData);
        setUserData(getData.data); // if we give 0 instead of one we will get all the user details json as an object. 1 is to get all the usernames array from the backend.
      })
      .catch((err) => {
        console.log(err);
        console.log(err);
        setError(err);
      });
  }, []);

  let special_chars = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "+",
    "=",
    "-",
    "[",
    "]",
    "'",
    ";",
    ",",
    ".",
    "/",
    "{",
    "}",
    "|",
    '"',
    ":",
    "<",
    ">",
    "?",
    " ",
  ];

  const sendDataToAPI = () => {
    // eventt.preventDefault()// to remove the warning error while submitting the form , and the error is "Form submission cancelled because the form is not connected"
    axios
      .put(`/${updateUsername}`, {
        username,
        userage,
        usercity,
        usertype,
        email,
        fullname,
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
        setError(error);
      });

    setUpdated(true);

    console.log("USER Updated: ", {
      name: username,
      age: userage,
      city: usercity,
      type: usertype,
      email: email,
      fullname: fullname,
      // "password": password
    });
  };

  useEffect(() => {
    setUpdateUsername(localStorage.getItem("LocalStorageUserName")); // this is gonna be that particular username that we have selected to update. And this will be in the url endpoint in the backend
    setUpdateEmail(localStorage.getItem("LocalStorageEmail"));

    setUsername(localStorage.getItem("LocalStorageUserName")); // here we are getting that LocalStorageUserName that we set while setting the username in the getUser.js
    setUserage(localStorage.getItem("LocalStorageUserAge"));
    setUsercity(localStorage.getItem("LocalStorageUserCity"));
    setUsertype(localStorage.getItem("LocalStorageUserType"));
    setEmail(localStorage.getItem("LocalStorageEmail"));
    setFullname(localStorage.getItem("LocalStorageFullName"));
    // setPassword(localStorage.getItem('LocalStoragePassword'));
  }, []);

  // for toggling the popup message
  const toggleButton = () => {
    setConfirm(!confirm)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true)
  };

  return (
    <>
      {loggedIn ?
        userDataJSON.usertype === 'admin' || userDataJSON.usertype === 'superuser'?
          // ------------------------------------
          <div className='updateUser'>
            {
        error
        ?
              <div onClick={()=>{
                  return(
                toggleButton,
                navigate("/allusers")
                )}}
                className="overlay">
                <div className='innerOverlay'>
                  {error.response.status === 409
          ?
                    <h1>{error.response.data.message}.<br/>Try again with different name.</h1>
                  :
          error.response.status === 405
          ?
                    <h1>{error.response.data.message}.<br/>Try Again</h1>
                  :
                    <h1>Something Went Wrong.<br/>Try connecting with Backend.</h1>
                  }
                  <button onClick={toggleButton}
                    style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                    Go Back
                  </button>
                </div>
              </div>
            :
              <>
                { 
        updated
        ?
                  <div className='updated' style={{ textAlign: 'center', padding:"2rem" }}>
                    <h1 style={{backgroundColor: "#c7ffe5", border:"3px solid #fff"}}>
                      User UPDATED Successfully!
                    </h1>
                    <button onClick={(e)=>{
                        return(
                              e.preventDefault(),
                              navigate("/allusers")
                            )}}
                      style={{
                        fontSize: 16,
                        backgroundColor: "#C6C9E6",
                        borderRadius: 10,
                        marginTop: 10,
                        border: "2px solid #fff",
                      }}
                    >
                      Go to Users Page
                    </button>
                  </div>
                :
                  <>
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                      Update User{" "}
                      <span style={{ color: "#C6C9E6", padding: 2 }}>
                        Information
                      </span>
                    </h1>
                    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Form.Label style={{ marginLeft:5 }}>Email : </Form.Label>
                        {/* <Form.Control name="username" maxLength="16" onChange={(e)=> setUsername(e.target.value.trim())} placeholder="Enter your name here" style={{borderRadius: 16 }} /> */}
                        <Form.Control type="email" required value={email || ""} name="email" maxLength="24"
                          onBlur={(eve)=> setEmail(eve.target.value.trim())}
                          onChange={(e)=>{
                            setEmail(e.target.value)
                          }}
                          placeholder="Enter your Email here" style={{borderRadius: 16 }} />

                        {
                          // specialChar ?
                          // <Form.Control.Feedback type="valid" style={{ marginLeft:5, color:"#EF5350" }}>
                          //   Enter valid Email without any spaces.
                          // </Form.Control.Feedback>
                          // :
                          emailAlreadyExist ?
                            <Form.Control.Feedback type="valid" style={{ marginLeft:5, color:"#EF5350" }}>
                              Email Already Exist.
                            </Form.Control.Feedback>
                          :
                            <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                              Please provide your Valid Email.
                            </Form.Control.Feedback>
                                                  }

                        {/* remove className text-muted to change the color of the text. */}
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicFullname">
                        <Form.Label style={{ marginLeft:5 }}>Fullname : </Form.Label>
                        <Form.Control required name="fullname" value={fullname || ""} maxLength="20" onBlur={(eve)=> setFullname(eve.target.value.trim())} onChange={(e)=> setFullname(e.target.value)}  placeholder="Enter your fullname here" style={{borderRadius: 16 }} />
                        <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                          Please provide a valid fullname.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label style={{ marginLeft:5 }}>Username : </Form.Label>

                        <Form.Control required value={username || ""} name="username" maxLength="20"
                          onBlur={(eve)=> setUsername(eve.target.value.trim())}
                          onChange={(e)=>{
                            setUsername(e.target.value)
                          }}
                          placeholder="Enter your name here" style={{borderRadius: 16 }} />

                        {
                specialChar ?
                          <Form.Control.Feedback type="valid" style={{ marginLeft:5, color:"#EF5350" }}>
                            Enter without any special characters.
                          </Form.Control.Feedback>
                        :
                usernameAlreadyExist ?
                          <Form.Control.Feedback type="valid" style={{ marginLeft:5, color:"#EF5350" }}>
                            Username Already Exist.
                          </Form.Control.Feedback>
                        :
                          <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                            Please provide a valid User Name.
                          </Form.Control.Feedback>
                        }

                        {/* remove className text-muted to change the color of the text. */}
                        <Form.Text className="text-muted" style={{marginLeft:5, color:"#fff"}}>
                          Type without any SPECIAL CHAR'S or SPACES.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicUserage">
                        <Form.Label style={{ marginLeft:5 }}>Age : </Form.Label>
                        <Form.Control required type="number" value={userage || ""} name="userage"
                          onChange={(e)=> {
                            return(
                setUserage(e.target.value.slice(0,3))
                )
                          }}
                          placeholder="Enter your age here" style={{borderRadius: 16 }} />
                        <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                          Please provide your Age.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label style={{ marginLeft:5 }}>City : </Form.Label>
                        <Form.Control required name="usercity" value={usercity || ""} maxLength="20" onBlur={(eve)=> setUsercity(eve.target.value.trim())} onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
                        <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                          Please provide a valid city.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ marginLeft:5 }}>Usertype: </Form.Label>
                        <Form.Control as="select" value={usertype}
                          onChange={(e)=> {
                            console.log(e.target.value)
                            setUsertype(e.target.value)}
                    }
                          style={{borderRadius: 16 }}>
                          <option value="normal" >Normal</option>
                          <option value="admin" >Admin</option>
                        </Form.Control>
                      </Form.Group>

                      { (username && userage && usercity && usertype && email && fullname)
                        // { (username && userage && usercity && !specialChar)

                        ? 
                <Button variant="primary" type="submit"
                          onSubmit={(e)=>{e.preventDefault()}}
                          onClick={(e)=>{
                            // to check whether the special character is found or not
                            let charCount = 0
                            for (let i of special_chars){
                              if (username.includes(i)){
                                setSpecialChar(true)
                                charCount = charCount + 1;
                              }
                            }
                            if (charCount === 0 ){
                              setSpecialChar(false)
                            }

                            // to check whether the username already exist or not
                            let usernameCount = 0
                            let emailCount = 0

                            
                    for ( let i in userData[0]){
                              // we are skipping the current username to make it work properly.
                              if (updateUsername === username){
                                continue
                              }
                              if (updateEmail === email){
                                continue
                              }
                              console.log(userData[1][i]['username'])
                              console.log(userData[0][i]['email'])
                              if (userData[1][i]['username'].toLowerCase() === username.toLowerCase()){
                                setUsernameAlreadyExist(true)
                                usernameCount += 1
                              }
                              if (userData[0][i]['email'].toLowerCase() === email){
                                setEmailAlreadyExist(true)
                                usernameCount += 1
                              }
                            }
                            if ( usernameCount === 0 ){
                              setUsernameAlreadyExist(false)
                            }
                            if ( emailCount === 0){
                              setEmailAlreadyExist(false)
                            }
                          }}
                          style={{
                            color: "black",
                            border: "2px solid #fff",
                            backgroundColor: "#C6C9E6",
                            marginLeft: 180,
                            marginTop: 16,
                            borderRadius: 16,
                          }}
                        >
                          Submit
                        </Button>
                      :
                        <Button type='submit' style={{color: "black", border: "2px solid #fff", marginLeft: 180 ,backgroundColor: "#F5F5F5", marginTop: 16, borderRadius:16}}>
                          Submit
                        </Button>
                      
              }

                      {/* In the below line it should be " === flase "...shouldn't be like this " ! "... Because the default one is null  */}
                      {specialChar===false && usernameAlreadyExist===false && emailAlreadyExist===false && sendDataToAPI()}

                    </Form>
                  </>
                }
              </>
            }
          </div>
                  // ------------------------------------
:
          <h1>You are not allowed to view this page</h1>
        :
        <h1>No Users LOGGED IN. Cannot View This Page</h1>
      }
    </>
  );
}

export default UpdateUser;
