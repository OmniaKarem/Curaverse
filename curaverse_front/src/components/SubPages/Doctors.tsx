import React, { useState, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Search from "./Search";
import Reviews from "./Reviews";
import "./Doctors.css";

type Doctor = {
  doctor_id: number;
  name: string;
  speciality: string;
  contact_info: string;
};

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: "",
    speciality: "",
    contact_info: "",
  });
  const [editDoctor, setEditDoctor] = useState<Partial<Doctor> | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/doctors", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error("Error fetching doctors:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, []);

  const searchDoctors = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/doctors/search?search=${encodeURIComponent(
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
        setDoctors(data);
      } else {
        console.error("Error searching doctors:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const addDoctor = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/doctors", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor),
      });
      if (response.ok) {
        const addedDoctor = await response.json();
        console.log("Doctor added successfully:", addedDoctor);
        fetchDoctors();
        setNewDoctor({ name: "", speciality: "", contact_info: "" });
      } else {
        console.error("Error adding doctor:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  }, [newDoctor, fetchDoctors]);

  const saveEditDoctor = useCallback(async () => {
    if (!editDoctor?.doctor_id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/doctors/${editDoctor.doctor_id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editDoctor),
        }
      );
      if (response.ok) {
        const savedDoctor = await response.json();
        console.log("Doctor edited successfully:", savedDoctor);
        fetchDoctors();
        setEditDoctor(null);
      } else {
        console.error("Error editing doctor:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing doctor:", error);
    }
  }, [editDoctor, fetchDoctors]);

  const deleteDoctor = useCallback(
    async (doctor_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/doctors/${doctor_id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Doctor deleted successfully");
          fetchDoctors();
        } else {
          console.error("Error deleting doctor:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    },
    [fetchDoctors]
  );

  const handleNewDoctorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDoctor({
      ...newDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditDoctorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditDoctor({
      ...editDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor();
  };

  const handleEditDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEditDoctor();
  };

  const handleEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
  };

  const handleSearch = (term: string) => {
    searchDoctors(term);
  };

  return (
    <div className="container">
      <Search
        placeholder="Search for your doctors..."
        onSearch={handleSearch}
      />

      {/* Add Doctor Form */}
      <form onSubmit={handleAddDoctorSubmit} className="mb-4">
        <h4>Add Doctor</h4>
        <div className="mb-3">
          <label htmlFor="name" className="label">
            Doctor's Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newDoctor.name}
            onChange={handleNewDoctorInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="speciality" className="label">
            Specialty
          </label>
          <input
            type="text"
            className="form-control"
            id="speciality"
            name="speciality"
            value={newDoctor.speciality}
            onChange={handleNewDoctorInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact_info" className="label">
            Contact Info
          </label>
          <input
            type="text"
            className="form-control"
            id="contact_info"
            name="contact_info"
            value={newDoctor.contact_info}
            onChange={handleNewDoctorInputChange}
          />
        </div>
        <button type="submit" className="add-btn">
          Add Doctor
        </button>
      </form>

      {/* Edit Doctor Form */}
      {editDoctor && (
        <form onSubmit={handleEditDoctorSubmit} className="mb-4">
          <h4>Edit Doctor</h4>
          <div className="mb-3">
            <label htmlFor="name" className="label">
              Doctor's Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={editDoctor.name || ""}
              onChange={handleEditDoctorInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="speciality" className="label">
              Specialty
            </label>
            <input
              type="text"
              className="form-control"
              id="speciality"
              name="speciality"
              value={editDoctor.speciality || ""}
              onChange={handleEditDoctorInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact_info" className="label">
              Contact Info
            </label>
            <input
              type="text"
              className="form-control"
              id="contact_info"
              name="contact_info"
              value={editDoctor.contact_info || ""}
              onChange={handleEditDoctorInputChange}
            />
          </div>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}

      <ul className="list-group scrollable-list-group">
        {doctors.map((doctor) => (
          <li
            key={doctor.doctor_id}
            className={`list-group-item ${
              selectedDoctorId === doctor.doctor_id ? "selected" : ""
            }`}
            onClick={() => setSelectedDoctorId(doctor.doctor_id)}
          >
            {doctor.name}, {doctor.speciality},{" "}
            {doctor.contact_info || "No Contact Info."}
            <div className="buttons_cont">
              <button
                type="button"
                className="edit-btn"
                onClick={() => handleEdit(doctor)}
              >
                Edit
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteDoctor(doctor.doctor_id)}
              >
                Delete
              </button>
            </div>
            <Reviews doctorId={doctor.doctor_id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
