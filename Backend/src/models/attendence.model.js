import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      default: null, // By default null, because user hasn't checked out yet
    },
  },
  {
    timestamps: true, // createdAt & updatedAt automatically add ho jayenge
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
