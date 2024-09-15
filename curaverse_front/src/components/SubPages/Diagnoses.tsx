import React, { useState, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Search from "./Search";
import "./Diagnoses.css";

type Diagnosis = {
  diagnosis_id: number;
  name: string;
  diagnosis_date?: string;
  notes?: string;
};

function Diagnoses() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState<Partial<Diagnosis>>({
    name: "",
    diagnosis_date: "",
    notes: "",
  });
  const [editDiagnosis, setEditDiagnosis] = useState<Partial<Diagnosis> | null>(
    null
  );

  const fetchDiagnoses = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/diagnoses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDiagnoses(data);
      } else {
        console.error("Error fetching diagnoses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
    }
  }, []);

  const searchDiagnoses = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/diagnoses/search?search=${encodeURIComponent(
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
        setDiagnoses(data);
      } else {
        console.error("Error searching diagnoses:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching diagnoses:", error);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, [fetchDiagnoses]);

  const addDiagnosis = useCallback(async () => {
    const payload = {
      ...newDiagnosis,
      diagnosis_date: newDiagnosis.diagnosis_date || null,
      notes: newDiagnosis.notes || null,
    };

    try {
      const response = await fetch("http://localhost:3000/api/diagnoses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const addedDiagnosis = await response.json();
        console.log("Diagnosis added successfully:", addedDiagnosis);
        fetchDiagnoses();
        setNewDiagnosis({ name: "", diagnosis_date: "", notes: "" });
      } else {
        console.error("Error adding diagnosis:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding Diagnosis:", error);
    }
  }, [newDiagnosis, fetchDiagnoses]);

  const saveEditDiagnosis = useCallback(async () => {
    if (!editDiagnosis?.diagnosis_id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/diagnoses/${editDiagnosis.diagnosis_id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editDiagnosis),
        }
      );
      if (response.ok) {
        const savedDiagnosis = await response.json();
        console.log("Diagnosis edited successfully:", savedDiagnosis);
        fetchDiagnoses();
        setEditDiagnosis(null);
      } else {
        console.error("Error editing diagnosis:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing diagnosis:", error);
    }
  }, [editDiagnosis, fetchDiagnoses]);

  const deleteDiagnosis = useCallback(
    async (diagnosis_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/diagnoses/${diagnosis_id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Diagnosis deleted successfully");
          fetchDiagnoses();
        } else {
          console.error("Error deleting diagnosis:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting diagnosis:", error);
      }
    },
    [fetchDiagnoses]
  );

  const handleNewDiagnosisInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDiagnosis({
      ...newDiagnosis,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditDiagnosisInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditDiagnosis({
      ...editDiagnosis,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDiagnosisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDiagnosis();
  };

  const handleEditDiagnosisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEditDiagnosis();
  };

  const handleEdit = (diagnosis: Diagnosis) => {
    setEditDiagnosis(diagnosis);
  };

  const handleSearch = (term: string) => {
    searchDiagnoses(term);
    fetchDiagnoses();
  };

  return (
    <div className="container">
      <Search placeholder="Search for diagnoses..." onSearch={handleSearch} />

      {/* Add Diagnosis Form */}
      <form onSubmit={handleAddDiagnosisSubmit} className="mb-4">
        <h4>Add Diagnosis</h4>
        <div className="mb-3">
          <label htmlFor="name" className="label">
            Diagnosis Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newDiagnosis.name}
            onChange={handleNewDiagnosisInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="diagnosis_date" className="label">
            Diagnosis date
          </label>
          <input
            type="date"
            className="form-control"
            id="diagnosis_date"
            name="diagnosis_date"
            value={newDiagnosis.diagnosis_date}
            onChange={handleNewDiagnosisInputChange}
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
            value={newDiagnosis.notes}
            onChange={handleNewDiagnosisInputChange}
          />
        </div>
        <button type="submit" className="add-btn">
          Add Diagnosis
        </button>
      </form>

      {/* Edit Diagnosis Form */}
      {editDiagnosis && (
        <form onSubmit={handleEditDiagnosisSubmit} className="mb-4">
          <h4>Edit Diagnosis</h4>
          <div className="mb-3">
            <label htmlFor="name" className="label">
              Diagnosis Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={editDiagnosis.name || ""}
              onChange={handleEditDiagnosisInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="diagnosis_date" className="label">
              Diagnosis date
            </label>
            <input
              type="date"
              className="form-control"
              id="diagnosis_date"
              name="diagnosis_date"
              value={editDiagnosis.diagnosis_date || ""}
              onChange={handleEditDiagnosisInputChange}
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
              value={editDiagnosis.notes || ""}
              onChange={handleEditDiagnosisInputChange}
            />
          </div>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}

      <ul className="list-group scrollable-list-group">
        {diagnoses.map((diagnosis) => (
          <li key={diagnosis.diagnosis_id} className="list-group-item">
            {diagnosis.name}, {diagnosis.diagnosis_date || "No date."},{" "}
            {diagnosis.notes || "No Notes."}
            <div>
              <button
                type="button"
                className="edit-btn"
                onClick={() => handleEdit(diagnosis)}
              >
                Edit
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteDiagnosis(diagnosis.diagnosis_id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Diagnoses;
