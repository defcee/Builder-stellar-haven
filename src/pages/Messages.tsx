import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import { useCurrentUser } from "../lib/auth";

interface Conversation {
  id: string;
  listing_id: string | null;
  listing_title: string | null;
  listing_slug: string | null;
  other_user_id: string;
  other_user_name: string;
  latest_message: string | null;
  latest_message_at: string | null;
  unread_count: number;
}

interface ConversationMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message_body: string;
  created_at: string;
}

export function Messages() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("conversation");
  const [draft, setDraft] = useState("");
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const conversations = useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: () => apiRequest<{ conversations: Conversation[] }>("/messages/conversations"),
    enabled: Boolean(currentUser.data?.user),
    refetchInterval: 30_000,
  });
  const messages = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: () => apiRequest<{ messages: ConversationMessage[] }>(`/messages/conversations/${selectedId}/messages`),
    enabled: Boolean(selectedId && currentUser.data?.user),
    refetchInterval: 10_000,
  });
  const markRead = useMutation({
    mutationFn: () => apiRequest<null>(`/messages/conversations/${selectedId}/read`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] }),
  });
  const sendMessage = useMutation({
    mutationFn: (message: string) =>
      apiRequest<{ message: ConversationMessage }>(`/messages/conversations/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }),
    onSuccess: async () => {
      setDraft("");
      await queryClient.invalidateQueries({ queryKey: ["messages", selectedId] });
      await queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
    },
  });

  useEffect(() => {
    if (selectedId && messages.isSuccess && !markRead.isPending) markRead.mutate();
  }, [selectedId, messages.dataUpdatedAt]);

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (message && selectedId) sendMessage.mutate(message);
  }

  const user = currentUser.data?.user;

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-ink">Messages</h1>
        {!user && currentUser.isPending && <p className="mt-6 text-ink-muted" role="status">Checking your account...</p>}
        {!user && currentUser.isError && (
          <section className="mt-6 rounded-lg border border-line bg-white p-6">
            <p className="text-ink-muted">Sign in to view and send messages.</p>
            <Link to="/sign-in" className="mt-4 inline-flex rounded-lg bg-brand px-5 py-3 font-semibold text-white">Sign in</Link>
          </section>
        )}

        {user && (
          <div className="mt-6 grid min-h-[480px] overflow-hidden rounded-xl border border-line bg-white md:grid-cols-[320px_1fr]">
            <aside className="border-b border-line md:border-b-0 md:border-r" aria-label="Conversations">
              <h2 className="px-4 py-4 font-semibold text-ink">Your conversations</h2>
              {conversations.isPending && <p className="px-4 pb-4 text-sm text-ink-muted">Loading conversations...</p>}
              {conversations.isError && (
                <div className="px-4 pb-4 text-sm text-danger">
                  <p>{conversations.error.message}</p>
                  <button type="button" onClick={() => conversations.refetch()} className="mt-2 font-semibold underline">Try again</button>
                </div>
              )}
              {conversations.isSuccess && conversations.data.conversations.length === 0 && (
                <p className="px-4 pb-4 text-sm text-ink-muted">No conversations yet. Message a seller from a listing.</p>
              )}
              <ul className="max-h-[520px] overflow-y-auto">
                {conversations.data?.conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <Link
                      to={`/messages?conversation=${conversation.id}`}
                      className={`block border-t border-line px-4 py-4 hover:bg-surface ${selectedId === conversation.id ? "bg-brand/5" : ""}`}
                    >
                      <span className="flex items-center justify-between gap-2 font-semibold text-ink">
                        {conversation.other_user_name}
                        {conversation.unread_count > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{conversation.unread_count}</span>}
                      </span>
                      <span className="mt-1 block text-xs text-ink-muted">{conversation.listing_title ?? "Marketplace conversation"}</span>
                      <span className="mt-2 block truncate text-sm text-ink-muted">{conversation.latest_message ?? "No messages yet"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="flex min-h-[480px] flex-col" aria-label="Selected conversation">
              {!selectedId && <p className="m-auto p-6 text-center text-ink-muted">Choose a conversation to view messages.</p>}
              {selectedId && messages.isPending && <p className="m-auto p-6 text-ink-muted" role="status">Loading messages...</p>}
              {selectedId && messages.isError && (
                <div className="m-auto p-6 text-center">
                  <p role="alert" className="text-danger">{messages.error.message}</p>
                  <button type="button" onClick={() => messages.refetch()} className="mt-3 font-semibold text-brand">Try again</button>
                </div>
              )}
              {selectedId && messages.isSuccess && (
                <>
                  <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
                    {messages.data.messages.map((message) => (
                      <article key={message.id} className={`max-w-[85%] rounded-xl px-4 py-3 ${message.sender_id === user.id ? "ml-auto bg-brand text-white" : "bg-surface text-ink"}`}>
                        <p className="text-xs font-semibold opacity-80">{message.sender_id === user.id ? "You" : message.sender_name}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm">{message.message_body}</p>
                        <time className="mt-2 block text-right text-[11px] opacity-75" dateTime={message.created_at}>
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </article>
                    ))}
                    {messages.data.messages.length === 0 && <p className="text-center text-sm text-ink-muted">Start the conversation with a message.</p>}
                  </div>
                  <form onSubmit={handleSend} className="border-t border-line p-4">
                    <label htmlFor="message-draft" className="sr-only">Your message</label>
                    <textarea id="message-draft" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={5000} rows={3} required className="w-full rounded-lg border border-line px-4 py-3" placeholder="Write a message..." />
                    {sendMessage.isError && <p role="alert" className="mt-2 text-sm text-danger">{sendMessage.error.message}</p>}
                    <div className="mt-3 flex justify-end">
                      <button type="submit" disabled={!draft.trim() || sendMessage.isPending} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white disabled:opacity-60">
                        {sendMessage.isPending ? "Sending..." : "Send message"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
