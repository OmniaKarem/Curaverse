import cron from 'node-cron';
import { MedicationsReminders, User, Medications } from './db.mjs';
import { Op } from 'sequelize';
import { sendEmail } from './emailService.mjs';

export default function setMedicationReminder () {
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const remindersToSend = await MedicationsReminders.findAll({ where: { reminder_time: { [Op.lte]: now }, sent: false } });
        for (const reminder of remindersToSend) {
            const user = await User.findOne({ where: { user_id: reminder.user_id } });
            if(user.email.includes('@gmail.com')){
                sendEmail(user.email, "Curaverse\nMedication Reminder", reminder.message, 'gmail');
            } else if(user.email.includes('@icloud.com')){
                sendEmail(user.email, "Curaverse\nMedication Reminder", reminder.message, 'icloud');
            }
            reminder.sent = true;
            await reminder.save();
        }
    });
}



