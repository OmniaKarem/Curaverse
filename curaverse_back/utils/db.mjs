import { Sequelize, DataTypes, Model } from "sequelize";

const sql = new Sequelize(
  "k9l9wjd9icxa4ut6",
  "y9wsfxlhb7a9mrad",
  "q5je5r2lttg1sirk",
  {
    host: "jfrpocyduwfg38kq.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    dialect: "mysql",
  }
);

const User = sql.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Female", "Male"),
    allowNull: false,
  },
});

const Diagnoses = sql.define("diagnoses", {
  diagnosis_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diagnosis_date: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.STRING,
  },
});

const Doctors = sql.define(
  "doctors",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_info: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user_id", "name", "speciality", "contact_info"],
      },
    ],
  }
);

const Medications = sql.define("medications", {
  medication_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
  },
});

const Appointments = sql.define("appointments", {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctors,
      key: "doctor_id",
    },
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
  },
});

const Reviews = sql.define("reviews", {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctors,
      key: "doctor_id",
    },
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  review: {
    type: DataTypes.STRING,
  },
});

const MedicationsReminders = sql.define("medications_reminders", {
  reminder_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  medication_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medications,
      key: "medication_id",
    },
  },
  reminder_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const AppointmentsReminders = sql.define("appointments_reminders", {
  reminder_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Appointments,
      key: "appointment_id",
    },
  },
  reminder_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Agreements = sql.define("agreements", {
  agreement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Reviews,
      key: "review_id",
    },
  },
  agreement_type: {
    type: DataTypes.ENUM("Agree", "Disagree"),
    allowNull: false,
  },
});

const Files = sql.define("files", {
  file_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.ENUM("Tests", "X-ray", "Prescription"),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Diagnoses, { foreignKey: "user_id" });
Diagnoses.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Doctors, { foreignKey: "user_id" });
Doctors.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Medications, { foreignKey: "user_id" });
Medications.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Appointments, { foreignKey: "user_id" });
Appointments.belongsTo(User, { foreignKey: "user_id" });

Doctors.hasMany(Appointments, { foreignKey: "doctor_id" });
Appointments.belongsTo(Doctors, {
  foreignKey: "doctor_id",
  as: "doctor_details",
});

User.hasMany(Reviews, { foreignKey: "user_id" });
Reviews.belongsTo(User, { foreignKey: "user_id", as: "user" });

Doctors.hasMany(Reviews, { foreignKey: "doctor_id", as: "doctor_reviews" });
Reviews.belongsTo(Doctors, { foreignKey: "doctor_id", as: "doctor" });

User.hasMany(MedicationsReminders, { foreignKey: "user_id" });
MedicationsReminders.belongsTo(User, { foreignKey: "user_id" });

Medications.hasMany(MedicationsReminders, { foreignKey: "medication_id" });
MedicationsReminders.belongsTo(Medications, { foreignKey: "medication_id" });

User.hasMany(AppointmentsReminders, { foreignKey: "user_id" });
AppointmentsReminders.belongsTo(User, { foreignKey: "user_id" });

Appointments.hasMany(AppointmentsReminders, { foreignKey: "appointment_id" });
AppointmentsReminders.belongsTo(Appointments, {
  foreignKey: "appointment_id",
  as: "appointment_details",
});

User.hasMany(Agreements, { foreignKey: "user_id" });
Agreements.belongsTo(User, { foreignKey: "user_id" });

Reviews.hasMany(Agreements, { foreignKey: "review_id" });
Agreements.belongsTo(Reviews, { foreignKey: "review_id" });

User.hasMany(Files, { foreignKey: "user_id" });
Files.belongsTo(User, { foreignKey: "user_id" });

sql.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

export {
  sql,
  User,
  Diagnoses,
  Doctors,
  Medications,
  Appointments,
  Reviews,
  MedicationsReminders,
  AppointmentsReminders,
  Agreements,
  Files,
};
