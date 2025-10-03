import { inngest } from "../client";
import User, { type IUser } from "../../models/user";
import Ticket, { type ITicket } from "../../models/ticket";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";
import analyzeTicket from "../../utils/ai";
import { AIResponse } from "../../types/ai-response";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      const ticket = (await step.run("fetch-ticket", async () => {
        const dbTicket = await Ticket.findById(ticketId);
        if (!dbTicket) {
          throw new NonRetriableError("Ticket not found");
        }
        return dbTicket;
      })) as ITicket;

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "open" });
      });

      const aiResponse: AIResponse | null = await analyzeTicket(ticket);

      const relatedSkills = await step.run("ai-processing", async () => {
        let skills: string[] = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            status: "in-progress",
            summary: aiResponse.summary,
            helpfulNotes: aiResponse.helpfulNotes,
            relatedSkills: aiResponse.relatedSkills,
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
          });

          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = (await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });

        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        return user;
      })) as IUser | null;

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = (await Ticket.findById(ticket._id)) as ITicket;
          await sendMail(
            moderator.email,
            `New Ticket Assigned`,
            `You have been assigned a new ticket: ${finalTicket.title}`,
          );
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error("Error running the step:", error.message);
      return { success: false }; 
    }
  },
);
