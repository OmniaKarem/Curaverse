import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import Search from "./Search";
import "./Appointments.css";
import AppointmentsReminder from "./AppointmentsReminder";

type Appointment = {
  appointment_id: number;
  doctor_name: string;
  appointment_date: string;
  notes?: string;
  doctor_details: {
    name: string;
    speciality: string;
    contact_info?: string;
  };
};

function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    doctor_name: "",
    appointment_date: "",
    notes: "",
  });
  const [editAppointment, setEditAppointment] =
    useState<Partial<Appointment> | null>(null);
  const [doctorNameError, setDoctorNameError] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Error fetching appointments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, []);

  const searchAppointments = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/search?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Error searching appointments:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = useCallback(async () => {
    setDoctorNameError("");

    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });
      if (response.ok) {
        fetchAppointments();
        setNewAppointment({ doctor_name: "", appointment_date: "", notes: "" });
      } else {
        const data = await response.json();
        if (
          data.message === "Doctor not found. Please create this doctor first."
        ) {
          setDoctorNameError(data.message);
        }
        console.error("Error adding appointment:", response.statusText);
      }
    } catch (error) {
      setDoctorNameError("An error occurred while adding the appointment.");
      console.error("Error adding appointment:", error);
    }
  }, [newAppointment, fetchAppointments]);

  const saveEditAppointment = useCallback(async () => {
    setDoctorNameError("");

    if (!editAppointment?.appointment_id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/${editAppointment.appointment_id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editAppointment),
        }
      );
      if (response.ok) {
        fetchAppointments();
        setEditAppointment(null);
      } else {
        console.error("Error editing appointment:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing appointment:", error);
    }
  }, [editAppointment, fetchAppointments]);

  const deleteAppointment = useCallback(
    async (appointment_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/appointments/${appointment_id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          fetchAppointments();
        } else {
          console.error("Error deleting appointment:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    },
    [fetchAppointments]
  );

  const handleNewAppointmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewAppointment({
      ...newAppointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditAppointmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditAppointment({
      ...editAppointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment();
  };

  const handleEditAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEditAppointment();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditAppointment({
      ...appointment,
      doctor_name: appointment.doctor_details.name,
      appointment_date: formatDate(appointment.appointment_date),
    });
  };

  const handleSearch = (term: string) => {
    searchAppointments(term);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy, hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleReminder = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment.appointment_id);
    setShowReminder(true);
  };

  const closeReminder = () => {
    setShowReminder(false);
    setSelectedAppointmentId(null);
  };

  return (
    <div className="container">
      <Search
        placeholder="Search for appointments..."
        onSearch={handleSearch}
      />

      <form onSubmit={handleAddAppointmentSubmit} className="mb-4">
        <h4 className="h4">Add Appointment</h4>
        <div className="mb-3">
          <label htmlFor="doctor_name" className="label">
            Doctor Name
          </label>
          <input
            type="text"
            className="form-control"
            id="doctor_name"
            name="doctor_name"
            value={newAppointment.doctor_name}
            onChange={handleNewAppointmentInputChange}
            required
          />
          {doctorNameError && (
            <div className="errorIcon">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </div>
          )}
          {doctorNameError && (
            <div className="errorMessage">{doctorNameError}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="appointment_date" className="label">
            Appointment Date
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="appointment_date"
            name="appointment_date"
            value={newAppointment.appointment_date}
            onChange={handleNewAppointmentInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <input
            type="text"
            className="form-control"
            id="notes"
            name="notes"
            value={newAppointment.notes}
            onChange={handleNewAppointmentInputChange}
          />
        </div>
        <button type="submit" className="add-btn">
          Add Appointment
        </button>
      </form>

      {editAppointment && (
        <form onSubmit={handleEditAppointmentSubmit} className="mb-4">
          <h4 className="h4">Edit Appointment</h4>
          <div className="mb-3">
            <label htmlFor="doctor_name" className="label">
              Doctor Name
            </label>
            <input
              type="text"
              className="form-control"
              id="doctor_name"
              name="doctor_name"
              value={editAppointment.doctor_name || ""}
              onChange={handleEditAppointmentInputChange}
              required
            />
            {doctorNameError && (
              <div className="errorIcon">
                <FontAwesomeIcon icon={faCircleExclamation} />
              </div>
            )}
            {doctorNameError && (
              <div className="errorMessage">{doctorNameError}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="appointment_date" className="label">
              Appointment Date
            </label>
            <input
              type="datetime-local"
              className="form-control"
              id="appointment_date"
              name="appointment_date"
              value={
                editAppointment.appointment_date
                  ? new Date(editAppointment.appointment_date)
                      .toISOString()
                      .slice(0, -8)
                  : ""
              }
              onChange={handleEditAppointmentInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="notes" className="label">
              Notes
            </label>
            <input
              type="text"
              className="form-control"
              id="notes"
              name="notes"
              value={editAppointment.notes || ""}
              onChange={handleEditAppointmentInputChange}
            />
          </div>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}

      <ul className="list-group scrollable-list-group">
        {appointments.map((appointment) => (
          <li key={appointment.appointment_id} className="list-group-item">
            <strong className="dr">
              <em>Dr. </em>
              {appointment.doctor_details.name}
            </strong>{" "}
            {formatDate(appointment.appointment_date)}
            <em className="specialty">Specialty:</em>{" "}
            <div className="specialty2">
              {appointment.doctor_details.speciality}
            </div>
            <em className="contact">Contact:</em>
            <div className="contact2">
              {" "}
              {appointment.doctor_details?.contact_info ||
                "No Contact Info"}{" "}
            </div>
            {appointment.notes && <p>Notes: {appointment.notes}</p>}
            <div className="mt-1">
              <button
                className="edit-btn"
                onClick={() => handleEdit(appointment)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteAppointment(appointment.appointment_id)}
              >
                Delete
              </button>
              <button
                className="reminder-btn"
                onClick={() => handleReminder(appointment)}
              >
                Add Reminder
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showReminder && selectedAppointmentId && (
        <AppointmentsReminder
          appointmentId={selectedAppointmentId}
          onClose={closeReminder}
        />
      )}
    </div>
  );
}

export default Appointments;
