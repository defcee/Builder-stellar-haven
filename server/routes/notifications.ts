import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";
import { requireUser } from "./auth.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireUser, async (_request, response) => {
  const user = response.locals.user as { id: string };
  const { rows } = await getPool().query(
    `SELECT id, notification_type, title, body, destination_path, read_at, created_at
       FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50`,
    [user.id],
  );
  response.json({ success: true, data: { notifications: rows }, message: "Notifications retrieved" });
});

notificationsRouter.patch("/:id/read", requireUser, async (request, response) => {
  const id = z.string().uuid().safeParse(request.params.id);
  if (!id.success) throw new HttpError(400, "Notification was not found");
  const user = response.locals.user as { id: string };
  const { rows } = await getPool().query(
    "UPDATE notifications SET read_at = COALESCE(read_at, now()) WHERE id = $1 AND user_id = $2 RETURNING id",
    [id.data, user.id],
  );
  if (!rows[0]) throw new HttpError(404, "Notification was not found");
  response.json({ success: true, data: null, message: "Notification marked as read" });
});

notificationsRouter.post("/read-all", requireUser, async (_request, response) => {
  const user = response.locals.user as { id: string };
  await getPool().query(
    "UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL",
    [user.id],
  );
  response.json({ success: true, data: null, message: "Notifications marked as read" });
});
