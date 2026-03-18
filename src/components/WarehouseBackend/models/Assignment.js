const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in_transit", "delivered"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);