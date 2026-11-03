import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";
import { logger } from "../lib/logger.js";
import { requireUser } from "./auth.js";

export const messagingRouter = Router();

const conversationSchema = z.object({ listingId: z.string().uuid() });
const messageSchema = z.object({ message: z.string().trim().min(1).max(5000) });

messagingRouter.get("/conversations", requireUser, async (_request, response) => {
  const user = response.locals.user as { id: string };
  const { rows } = await getPool().query(
    `SELECT c.id, c.listing_id, l.title AS listing_title, l.slug AS listing_slug,
            other.id AS other_user_id, other.full_name AS other_user_name,
            latest.message_body AS latest_message, latest.created_at AS latest_message_at,
            (SELECT count(*)::int
               FROM messages unread
              WHERE unread.conversation_id = c.id
                AND unread.sender_id <> $1
                AND unread.deleted_at IS NULL
                AND (self.last_read_at IS NULL OR unread.created_at > self.last_read_at)) AS unread_count
       FROM conversation_participants self
       JOIN conversations c ON c.id = self.conversation_id
       JOIN conversation_participants peer ON peer.conversation_id = c.id AND peer.user_id <> $1
       JOIN users other ON other.id = peer.user_id
       LEFT JOIN listings l ON l.id = c.listing_id
       LEFT JOIN LATERAL (
         SELECT message_body, created_at
           FROM messages
          WHERE conversation_id = c.id AND deleted_at IS NULL
          ORDER BY created_at DESC
          LIMIT 1
       ) latest ON true
      WHERE self.user_id = $1
      ORDER BY latest.created_at DESC NULLS LAST, c.created_at DESC`,
    [user.id],
  );
  response.json({ success: true, data: { conversations: rows }, message: "Conversations retrieved" });
});

messagingRouter.post("/conversations", requireUser, async (request, response) => {
  const parsed = conversationSchema.safeParse(request.body);
  if (!parsed.success) throw new HttpError(400, "A valid listing is required");
  const user = response.locals.user as { id: string };
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const { rows: listingRows } = await client.query(
      "SELECT id, owner_id FROM listings WHERE id = $1 AND publication_status = 'published'",
      [parsed.data.listingId],
    );
    const listing = listingRows[0];
    if (!listing) throw new HttpError(404, "This listing is no longer available");
    if (listing.owner_id === user.id) throw new HttpError(400, "You cannot message yourself about your listing");

    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`${listing.id}:${user.id}`]);
    const { rows: existing } = await client.query(
      `SELECT c.id
         FROM conversations c
         JOIN conversation_participants buyer ON buyer.conversation_id = c.id AND buyer.user_id = $2
         JOIN conversation_participants seller ON seller.conversation_id = c.id AND seller.user_id = $3
        WHERE c.listing_id = $1 AND c.created_by_user_id = $2
        LIMIT 1`,
      [listing.id, user.id, listing.owner_id],
    );

    let conversationId = existing[0]?.id as string | undefined;
    if (!conversationId) {
      const { rows } = await client.query(
        "INSERT INTO conversations (created_by_user_id, listing_id) VALUES ($1, $2) RETURNING id",
        [user.id, listing.id],
      );
      conversationId = rows[0].id as string;
      await client.query(
        "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
        [conversationId, user.id, listing.owner_id],
      );
    }

    await client.query("COMMIT");
    response.status(existing[0] ? 200 : 201).json({
      success: true,
      data: { conversationId },
      message: existing[0] ? "Conversation retrieved" : "Conversation started",
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      logger.error(
        { requestId: response.locals.requestId, err: rollbackError },
        "Conversation creation rollback failed",
      );
    }
    if (error instanceof HttpError) throw error;
    logger.error({ requestId: response.locals.requestId, err: error }, "Conversation creation failed");
    throw new HttpError(503, "We could not start this conversation");
  } finally {
    client.release();
  }
});

messagingRouter.get("/conversations/:id/messages", requireUser, async (request, response) => {
  const parsedId = z.string().uuid().safeParse(request.params.id);
  if (!parsedId.success) throw new HttpError(400, "Conversation was not found");
  const user = response.locals.user as { id: string };
  const { rows: membership } = await getPool().query(
    "SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
    [parsedId.data, user.id],
  );
  if (!membership.length) throw new HttpError(404, "Conversation was not found");

  const { rows } = await getPool().query(
    `SELECT m.id, m.sender_id, u.full_name AS sender_name, m.message_body, m.created_at
       FROM messages m
       JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1 AND m.deleted_at IS NULL
      ORDER BY m.created_at DESC
      LIMIT 100`,
    [parsedId.data],
  );
  response.json({ success: true, data: { messages: rows.reverse() }, message: "Messages retrieved" });
});

messagingRouter.post("/conversations/:id/messages", requireUser, async (request, response) => {
  const parsedId = z.string().uuid().safeParse(request.params.id);
  const parsedMessage = messageSchema.safeParse(request.body);
  if (!parsedId.success || !parsedMessage.success) throw new HttpError(400, "Message is invalid");
  const user = response.locals.user as { id: string };
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const { rows: participants } = await client.query(
      `SELECT cp.user_id, u.full_name
         FROM conversation_participants cp
         JOIN users u ON u.id = cp.user_id
        WHERE cp.conversation_id = $1`,
      [parsedId.data],
    );
    if (!participants.some((participant) => participant.user_id === user.id)) {
      throw new HttpError(404, "Conversation was not found");
    }
    const recipient = participants.find((participant) => participant.user_id !== user.id);
    if (!recipient) throw new HttpError(409, "Conversation recipient is not available");

    const { rows } = await client.query(
      `INSERT INTO messages (conversation_id, sender_id, message_body)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, message_body, created_at`,
      [parsedId.data, user.id, parsedMessage.data.message],
    );
    await client.query(
      `INSERT INTO notifications (user_id, notification_type, title, body, destination_path)
       VALUES ($1, 'message', $2, $3, $4)`,
      [recipient.user_id, `New message from ${participants.find((participant) => participant.user_id === user.id)?.full_name ?? "a user"}`,
        parsedMessage.data.message.slice(0, 1000), `/messages?conversation=${parsedId.data}`],
    );
    await client.query("COMMIT");
    response.status(201).json({ success: true, data: { message: rows[0] }, message: "Message sent" });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      logger.error(
        { requestId: response.locals.requestId, err: rollbackError },
        "Message send rollback failed",
      );
    }
    if (error instanceof HttpError) throw error;
    logger.error({ requestId: response.locals.requestId, err: error }, "Message send failed");
    throw new HttpError(503, "We could not send your message");
  } finally {
    client.release();
  }
});

messagingRouter.patch("/conversations/:id/read", requireUser, async (request, response) => {
  const parsedId = z.string().uuid().safeParse(request.params.id);
  if (!parsedId.success) throw new HttpError(400, "Conversation was not found");
  const user = response.locals.user as { id: string };
  const { rowCount } = await getPool().query(
    "UPDATE conversation_participants SET last_read_at = now() WHERE conversation_id = $1 AND user_id = $2",
    [parsedId.data, user.id],
  );
  if (!rowCount) throw new HttpError(404, "Conversation was not found");
  response.json({ success: true, data: null, message: "Conversation marked as read" });
});
