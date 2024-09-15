import cron from 'node-cron';
import { AppointmentsReminders , Appointments , User , Doctors } from './db.mjs';
import { Op } from 'sequelize';
import { sendEmail } from './emailService.mjs';

export default function setAppointmentReminder() {
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const remindersToSend = await AppointmentsReminders.findAll({ where: { reminder_time: { [Op.lte]: now }, sent: false } });
        for (const reminder of remindersToSend) {
            const user = await User.findOne({ where: { user_id: reminder.user_id } });
            if (user.email.includes('@gmail.com')) {
                sendEmail(user.email, "Curaverse\nAppointment Reminder", reminder.message, 'gmail');
            } else if (user.email.includes('@icloud.com')) {
                sendEmail(user.email, "Curaverse\nAppointment Reminder", reminder.message, 'icloud');
            }
            reminder.sent = true;
            await reminder.save();
        }
    })
}