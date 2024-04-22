import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

export default async function handler(req, res) {
  const { message } = req.body;
  const notificationId = uuidv4();
  const response = await pusher.trigger("orders", "newOrder", {
    id: notificationId,
    message,
  });

  res.json({ message: "completed" });
}
