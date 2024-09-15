import img from "/img.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUpPage.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();

    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGenderError("");

    let hasError = false;

    if (email.trim() === "") {
      setEmailError("Email can't be empty");
      hasError = true;
    }
    if (username.trim() === "") {
      setUsernameError("Username can't be empty");
      hasError = true;
    }
    if (password.length === 0) {
      setPasswordError("Password can't be empty");
      hasError = true;
    }
    if (confirmPassword.length === 0) {
      setConfirmPasswordError("Confirm password can't be empty");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }
    if (gender === "") {
      setGenderError("Please select a gender");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: username,
          password: password,
          confirmPassword: confirmPassword,
          gender,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data);
        navigate("/home");
      } else {
        const errorResponse = await response.json();
        if (response.status === 409) {
          console.error("Conflict error:", errorResponse.message);
          setEmailError(errorResponse.message);
        } else if (response.status === 400) {
          console.error("Validation error:", errorResponse);
          for (let i = 0; i < errorResponse.length; i++) {
            if (errorResponse[i].msg === "Name must be at least 4 characters") {
              setUsernameError("Name must be at least 4 characters");
            }
            if (errorResponse[i].msg === "Please enter a valid email address") {
              setEmailError("Please enter a valid email address");
            }
            if (
              errorResponse[i].msg === "Password must be at least 6 characters"
            ) {
              setPasswordError("Password must be at least 6 characters");
            }
          }

          errorResponse.forEach((error: { param: string; msg: string }) => {
            if (error.param === "email") setEmailError(error.msg);
            if (error.param === "name") setUsernameError(error.msg);
            if (error.param === "password") setPasswordError(error.msg);
            if (error.param === "confirmPassword")
              setConfirmPasswordError(error.msg);
            if (error.param === "gender") setGenderError(error.msg);
          });
        } else {
          console.error("Unexpected error response:", errorResponse);
          setConfirmPasswordError("An error occurred during sign up");
        }
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      setConfirmPasswordError("An error occurred during sign up");
    }
  }
  
  return (
    <div className="signInContainer">
      <div className="leftSection">
        <div className="welcomeText">
          <h1>
            Welcome to <span className="websiteName">Curaverse!</span>
          </h1>
        </div>
        <div className="welcomeImg">
          <img src={img} alt="Welcome to Curaverse" />
        </div>
        <div className="buttons">
          <Link to="/">
            <button className="signUpButton">Sign Up</button>
          </Link>
          <Link to="/signin">
            <button className="signInButton">Sign In</button>
          </Link>
        </div>
      </div>

      <div className="rightSection">
        <div className="signUpForm">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div className="inputBox">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <FontAwesomeIcon
                  className="errorIcon"
                  icon={faCircleExclamation}
                />
              )}
              {emailError && <div className="errorMessage">{emailError}</div>}
            </div>
            <div className="inputBox">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <FontAwesomeIcon
                  className="errorIcon"
                  icon={faCircleExclamation}
                />
              )}
              {usernameError && (
                <div className="errorMessage">{usernameError}</div>
              )}
            </div>
            <div className="inputBox">
              <label>Password</label>
              <div className="wrapper">
                <input
                  className="passwordInput"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  className="eyeIcon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {passwordError && (
                <FontAwesomeIcon
                  className="errorIcon"
                  icon={faCircleExclamation}
                />
              )}
              {passwordError && (
                <div className="errorMessage">{passwordError}</div>
              )}
            </div>
            <div className="inputBox">
              <label>Confirm Password</label>
              <div className="wrapper">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={isConfirmPasswordVisible ? faEye : faEyeSlash}
                  className="eyeIcon"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              {confirmPasswordError && (
                <FontAwesomeIcon
                  className="errorIcon"
                  icon={faCircleExclamation}
                />
              )}
              {confirmPasswordError && (
                <div className="errorMessage">{confirmPasswordError}</div>
              )}
            </div>
            <div className="gender">
              <input
                type="radio"
                name="gender"
                value="female"
                className="femaleBox"
                onChange={(e) => setGender(e.target.value)}
              ></input>
              <label>Female</label>
              <input
                type="radio"
                name="gender"
                value="Male"
                className="maleBox"
                onChange={(e) => setGender(e.target.value)}
              ></input>
              <label>Male</label>
              <div className="genderError">
                {genderError && (
                  <FontAwesomeIcon
                    className="genderErrorIcon"
                    icon={faCircleExclamation}
                  />
                )}
                {genderError && (
                  <div className="genderErrorMessage">{genderError}</div>
                )}
              </div>
            </div>
            <button type="submit" className="submitButton">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
