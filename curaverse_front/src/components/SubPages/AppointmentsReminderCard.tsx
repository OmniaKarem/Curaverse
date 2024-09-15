import React, { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import "./AppointmentsReminderCard.css";

type AppointmentReminder = {
  reminder_id: number;
  appointment_id: number;
  reminder_time: string;
  message: string;
  sent: boolean;
};

function AppointmentsReminderCard() {
  const [appointmentsReminders, setAppointmentsReminders] = useState<
    AppointmentReminder[]
  >([]);
  const [editingReminder, setEditingReminder] =
    useState<AppointmentReminder | null>(null);

  const fetchAppointmentReminders = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/reminders`,
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
        console.log("data fetched ", data);
        setAppointmentsReminders(data);
      } else {
        console.error("Error fetching reminders:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointmentReminders();
  }, [fetchAppointmentReminders]);

  const deleteAppointmentReminder = useCallback(
    async (reminder_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/appointments/reminders/${reminder_id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          fetchAppointmentReminders();
        } else {
          console.error("Error deleting reminder:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    },
    [fetchAppointmentReminders]
  );

  const handleEditClick = (reminder: AppointmentReminder) => {
    setEditingReminder({ ...reminder });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder) return;

    const currentTime = new Date().toISOString();
    const isSent =
      new Date(editingReminder.reminder_time) < new Date(currentTime);

    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/reminders/${editingReminder.reminder_id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reminder_time: editingReminder.reminder_time,
            sent: isSent,
          }),
        }
      );
      if (response.ok) {
        setEditingReminder(null);
        fetchAppointmentReminders();
      } else {
        console.error("Error updating reminder:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingReminder) {
      setEditingReminder({ ...editingReminder, reminder_time: e.target.value });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy, hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="container">
      {editingReminder && (
        <form onSubmit={handleEditSubmit} className="mb-4">
          <h4>Edit Reminder</h4>
          <div className="mb-3">
            <label htmlFor="reminderTime" className="form-label">
              Reminder Time
            </label>
            <input
              id="reminderTime"
              type="datetime-local"
              className="form-control"
              value={
                editingReminder.reminder_time
                  ? new Date(editingReminder.reminder_time)
                      .toISOString()
                      .slice(0, -8)
                  : ""
              }
              onChange={handleReminderTimeChange}
              required
            />
          </div>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}
      <ul className="scrollable-list-group">
        {appointmentsReminders.map((reminder) => (
          <li
            key={reminder.reminder_id}
            className={`list-group-item ${reminder.sent ? "sent" : "not-sent"}`}
          >
            <strong>{formatDate(reminder.reminder_time)}</strong> <br />
            <p>Message: {reminder.message}</p>
            <button
              onClick={() => handleEditClick(reminder)}
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => deleteAppointmentReminder(reminder.reminder_id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentsReminderCard;
