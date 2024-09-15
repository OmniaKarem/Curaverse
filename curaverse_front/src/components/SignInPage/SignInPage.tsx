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
import "./SignInPage.css";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (email.trim() === "") {
      setEmailError("Email can't be empty");
      hasError = true;
    }
    if (password.length === 0) {
      setPasswordError("Password can't be empty");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data);
        setEmailError("");
        setPasswordError("");
        navigate("/home");
      } else {
        const data = await response.json();
        if (data.message === "Email is not correct") {
          setEmailError(data.message);
          setPasswordError("");
        } else if (data.message === "Password is not correct") {
          setEmailError("");
          setPasswordError(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      setEmailError("");
      setPasswordError("An error occurred during sign in");
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
        <div className="signInForm">
          <h2>Sign In</h2>
          <form onSubmit={handleSignIn}>
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
              <label>Password</label>
              <div className="wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  className="eyeIcon"
                  icon={isPasswordVisible ? faEye : faEyeSlash}
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
            <button type="submit" className="submitButton">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
