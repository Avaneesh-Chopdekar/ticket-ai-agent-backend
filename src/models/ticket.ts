import mongoose from "mongoose";

export interface ITicket {
  title: string;
  description: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId | null;
  priority: string;
  deadline: Date | null;
  helpfulNotes: string | null;
  relatedSkills: string[];
}

const TicketSchema = new mongoose.Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: {
      type: Date,
      required: false,
      default: null,
    },
    helpfulNotes: {
      type: String,
      required: false,
      default: null,
    },
    relatedSkills: {
      type: [String],
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
