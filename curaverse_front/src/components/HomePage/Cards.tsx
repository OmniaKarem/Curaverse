import "bootstrap/dist/css/bootstrap.min.css";
import styles1 from "./Doctors.module.css";
import styles2 from "./Diagnoses.module.css";
import styles3 from "./Medications.module.css";
import styles4 from "./Appointments.module.css";
import styles5 from "./AppointmentsReminder.module.css";
import styles6 from "./MedicationsReminder.module.css";
import doctor from "/doctor.png";
import DiagnosesImage from "/Diagnoses.png";
import MedicationsImage from "/Medications.png";
import Appointment from "/Appointment.png";
import AppointmentsReminderImage from "/AppointmentsReminder.png";
import MedicationsReminderImage from "/MedicationsReminder.png";

function Doctors() {
  return (
    <div className={styles1.card}>
      <img src={doctor} className={styles1["card-img-top"]} alt="..." />
      <div className={styles1["card-body"]}>
        <a href="doctors" className={styles1["btn-primary"]}>
          Doctors
        </a>
      </div>
    </div>
  );
}

function Diagnoses() {
  return (
    <div className={styles2.card}>
      <img src={DiagnosesImage} className={styles2["card-img-top"]} alt="..." />
      <div className={styles2["card-body"]}>
        <a href="diagnoses" className={styles2["btn-primary"]}>
          Diagnoses
        </a>
      </div>
    </div>
  );
}

function Medications() {
  return (
    <div className={styles3.card}>
      <img
        src={MedicationsImage}
        className={styles3["card-img-top"]}
        alt="..."
      />
      <div className={styles3["card-body"]}>
        <a href="medications" className={styles3["btn-primary"]}>
          Medications
        </a>
      </div>
    </div>
  );
}

function Appointments() {
  return (
    <div className={styles4.card}>
      <img src={Appointment} className={styles4["card-img-top"]} alt="..." />
      <div className={styles4["card-body"]}>
        <a href="appointments" className={styles4["btn-primary"]}>
          Appointments
        </a>
      </div>
    </div>
  );
}

function AppointmentsReminder() {
  return (
    <div className={styles5.card}>
      <img
        src={AppointmentsReminderImage}
        className={styles5["card-img-top"]}
        alt="..."
      />
      <div className={styles5["card-body"]}>
        <a
          href="appointments/reminders"
          className={styles5["btn-primary"]}
        >
          Appointment Reminders
        </a>
      </div>
    </div>
  );
}

function MedicationsReminder() {
  return (
    <div className={styles6.card}>
      <img
        src={MedicationsReminderImage}
        className={styles6["card-img-top"]}
        alt="..."
      />
      <div className={styles6["card-body"]}>
        <a href="medications/reminders" className={styles6["btn-primary"]}>
          Medication Reminders
        </a>
      </div>
    </div>
  );
}

export {
  Doctors,
  Diagnoses,
  Medications,
  Appointments,
  AppointmentsReminder,
  MedicationsReminder,
};
