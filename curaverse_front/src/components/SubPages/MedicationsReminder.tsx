import React, { useState } from "react";
import "./MedicationsReminder.css";

interface MedicationsReminderProps {
  medicationID: number;
  onClose: () => void;
}

function MedicationsReminder({
  medicationID,
  onClose,
}: MedicationsReminderProps) {
  const [reminderTime, setreminderTime] = useState("");

  const handlereminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setreminderTime(e.target.value);
  };

  const handleAddReminder = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/medications/${medicationID}/reminder`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reminder_time: reminderTime }),
        }
      );
      if (response.ok) {
        alert("Reminder added successfully!");
        onClose();
      } else {
        console.error("Error adding reminder:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>Add Reminder</h4>
        <div className="mb-3">
          <label htmlFor="reminder_time" className="form-label">
            Reminder Date
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="reminder_time"
            value={reminderTime}
            onChange={handlereminderTimeChange}
            required
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddReminder}>
          Add Reminder
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MedicationsReminder;
