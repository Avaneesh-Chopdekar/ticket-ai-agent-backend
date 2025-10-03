import { inngest } from "../inngest/client";
import Ticket, { type ITicket } from "../models/ticket";
import type { Request, Response, NextFunction } from "express";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    const newTicket = (await Ticket.create({
      title,
      description,
      createdBy: req.user?._id.toString(),
    })) as ITicket;

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id?.toString(),
        title,
        description,
        createdBy: req.user?._id.toString(),
      },
    });

    res.status(201).json({
      message: "Ticket created and processing started successfully",
      ticket: newTicket,
    });
  } catch (error: any) {
    console.error("Error creating ticket:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let tickets: ITicket[] = [];
    if (user.role !== "admin") {
      tickets = (await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 })) as ITicket[];
    } else {
      tickets = (await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 })) as ITicket[];
    }
    return res.status(200).json(tickets);
  } catch (error: any) {
    console.error("Error fetching tickets:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = (await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ])) as ITicket;
    } else {
      ticket = (await Ticket.findOne({
        _id: req.params.id,
        createdBy: user._id,
      }).select("title description status createdAt")) as ITicket;
    }
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error: any) {
    console.error("Error fetching tickets:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
