import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import SignInPage from "./components/SignInPage/SignInPage";
import HomePage from "./components/HomePage/HomePage";
import Doctors from "./components/SubPages/Doctors";
import Diagnoses from "./components/SubPages/Diagnoses";
import Medications from "./components/SubPages/Medications";
import Appointments from "./components/SubPages/Appointments";
import AppointmentsReminderCard from "./components/SubPages/AppointmentsReminderCard";
import MedicationsReminderCard from "./components/SubPages/MedicationsReminderCard";
import ReviewsPage from "./components/HomePage/Reviews";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={SignUpPage} />
        <Route path="/signin" Component={SignInPage} />
        <Route path="/home" Component={HomePage} />
        <Route path="/doctors" Component={Doctors} />
        <Route path="/diagnoses" Component={Diagnoses} />
        <Route path="/medications" Component={Medications} />
        <Route path="/appointments" Component={Appointments} />
        <Route
          path="/appointments/reminders"
          Component={AppointmentsReminderCard}
        />
        <Route
          path="/medications/reminders"
          Component={MedicationsReminderCard}
        />
        <Route path="/reviews/:doctor_id" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
