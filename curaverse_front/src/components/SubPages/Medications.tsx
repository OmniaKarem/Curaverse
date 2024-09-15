import React, { useState, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Search from "./Search";
import "./Medications.css";
import MedicationsReminder from "./MedicationsReminder";

type Medication = {
  medication_id: number;
  name: string;
  dosage: string;
  notes: string;
};

function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    notes: "",
  });
  const [editMedication, setEditMedication] =
    useState<Partial<Medication> | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    number | null
  >(null);

  const fetchMedications = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/medications", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMedications(data);
      } else {
        console.error("Error fetching medications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  }, []);

  const searchMedications = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/medications/search?search=${encodeURIComponent(
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
        setMedications(data);
      } else {
        console.error("Error searching medications:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching medications:", error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const addMedication = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/medications", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMedication),
      });
      if (response.ok) {
        const addedMedication = await response.json();
        console.log("Medication added successfully:", addedMedication);
        fetchMedications();
        setNewMedication({ name: "", dosage: "", notes: "" });
      } else {
        console.error("Error adding medication:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  }, [newMedication, fetchMedications]);

  const saveEditMedication = useCallback(async () => {
    if (!editMedication?.medication_id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/medications/${editMedication.medication_id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editMedication),
        }
      );
      if (response.ok) {
        const savedMedication = await response.json();
        console.log("Medication edited successfully:", savedMedication);
        fetchMedications();
        setEditMedication(null);
      } else {
        console.error("Error editing medication:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing medication:", error);
    }
  }, [editMedication, fetchMedications]);

  const deleteMedication = useCallback(
    async (medication_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/medications/${medication_id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Medication deleted successfully");
          fetchMedications();
        } else {
          console.error("Error deleting medication:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting medication:", error);
      }
    },
    [fetchMedications]
  );

  const handleNewMedicationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMedication({
      ...newMedication,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditMedicationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditMedication({
      ...editMedication,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedication();
  };

  const handleEditMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEditMedication();
  };

  const handleEdit = (medication: Medication) => {
    setEditMedication(medication);
  };

  const handleSearch = (term: string) => {
    searchMedications(term);
  };

  const handleReminder = (medication: Medication) => {
    setSelectedMedicationId(medication.medication_id);
    setShowReminder(true);
  };

  const closeReminder = () => {
    setShowReminder(false);
    setSelectedMedicationId(null);
  };

  return (
    <div className="container">
      <Search placeholder="Search for medications..." onSearch={handleSearch} />

      {/* Add Medication Form */}
      <form onSubmit={handleAddMedicationSubmit} className="mb-4">
        <h4 className="h4">Add Medication</h4>
        <div className="mb-3">
          <label htmlFor="name" className="label">
            Medication Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newMedication.name}
            onChange={handleNewMedicationInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dosage" className="label">
            Dosage
          </label>
          <input
            type="text"
            className="form-control"
            id="dosage"
            name="dosage"
            value={newMedication.dosage}
            onChange={handleNewMedicationInputChange}
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
            value={newMedication.notes}
            onChange={handleNewMedicationInputChange}
          />
        </div>
        <button type="submit" className="add-btn">
          Add Medication
        </button>
      </form>

      {/* Edit Medication Form */}
      {editMedication && (
        <form onSubmit={handleEditMedicationSubmit} className="mb-4">
          <h4 className="h4">Edit Medication</h4>
          <div className="mb-3">
            <label htmlFor="name" className="label">
              Medication Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={editMedication.name || ""}
              onChange={handleEditMedicationInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dosage" className="label">
              Dosage
            </label>
            <input
              type="text"
              className="form-control"
              id="dosage"
              name="dosage"
              value={editMedication.dosage || ""}
              onChange={handleEditMedicationInputChange}
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
              value={editMedication.notes || ""}
              onChange={handleEditMedicationInputChange}
            />
          </div>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}

      <ul className="list-group scrollable-list-group">
        {medications.map((medication) => (
          <li key={medication.medication_id} className="list-group-item">
            {medication.name}, {medication.dosage},{" "}
            {medication.notes || "No Notes."}
            <div>
              <button
                type="button"
                className="edit-btn"
                onClick={() => handleEdit(medication)}
              >
                Edit
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteMedication(medication.medication_id)}
              >
                Delete
              </button>
              <button
                className="reminder-btn"
                onClick={() => handleReminder(medication)}
              >
                Add Reminder
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showReminder && selectedMedicationId && (
        <MedicationsReminder
          medicationID={selectedMedicationId}
          onClose={closeReminder}
        />
      )}
    </div>
  );
}

export default Medications;
