import { inngest } from "../client";
import User, { type IUser } from "../../models/user";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = (await step.run("get-user-email", async () => {
        const dbUser = await User.findOne({ email });
        if (!dbUser) {
          throw new NonRetriableError(`User with email ${email} not found`);
        }
        return dbUser;
      })) as IUser;

      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to our ticketing system!`;
        const message = `Hi!
          \n\n
          Thank you for signing up! We're excited to have you on board.
          `;

        await sendMail(user.email, subject, message);
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error running step: " + error.message);
      return { success: false };
    }
  },
);
