import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  body: string | null;
  destination_path: string | null;
  read_at: string | null;
  created_at: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiRequest<{ notifications: Notification[] }>("/notifications"),
    refetchInterval: 30_000,
  });
  const markRead = useMutation({
    mutationFn: (id: string) => apiRequest<null>(`/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const markAllRead = useMutation({
    mutationFn: () => apiRequest<null>("/notifications/read-all", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const unreadCount = notifications.data?.notifications.filter((notification) => !notification.read_at).length ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="notification-panel"
        onClick={() => setIsOpen((open) => !open)}
        className="relative text-ink hover:text-brand"
      >
        Notifications
        {unreadCount > 0 && <span className="ml-1 rounded-full bg-brand px-1.5 py-0.5 text-[10px] text-white">{unreadCount}</span>}
      </button>
      {isOpen && (
        <section id="notification-panel" className="absolute right-0 top-full z-30 mt-3 w-[min(90vw,24rem)] rounded-xl border border-line bg-white p-3 shadow-card">
          <div className="flex items-center justify-between gap-3 px-2 py-1">
            <h2 className="font-semibold text-ink">Notifications</h2>
            {unreadCount > 0 && (
              <button type="button" disabled={markAllRead.isPending} onClick={() => markAllRead.mutate()} className="text-xs font-semibold text-brand disabled:opacity-60">
                Mark all read
              </button>
            )}
          </div>
          {markRead.isError && <p role="alert" className="px-2 py-2 text-xs text-danger">{markRead.error.message}</p>}
          {markAllRead.isError && <p role="alert" className="px-2 py-2 text-xs text-danger">{markAllRead.error.message}</p>}
          {notifications.isPending && <p className="px-2 py-4 text-sm text-ink-muted">Loading notifications...</p>}
          {notifications.isError && (
            <div className="px-2 py-3 text-sm text-danger">
              <p>{notifications.error.message}</p>
              <button type="button" onClick={() => notifications.refetch()} className="mt-2 font-semibold underline">Try again</button>
            </div>
          )}
          {notifications.isSuccess && notifications.data.notifications.length === 0 && <p className="px-2 py-4 text-sm text-ink-muted">You have no notifications.</p>}
          <ul className="mt-2 max-h-80 overflow-y-auto">
            {notifications.data?.notifications.map((notification) => {
              const content = (
                <>
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-ink">{notification.title}</span>
                    {!notification.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                  </span>
                  {notification.body && <span className="mt-1 block line-clamp-2 text-xs text-ink-muted">{notification.body}</span>}
                  <time className="mt-2 block text-[11px] text-ink-muted" dateTime={notification.created_at}>{new Date(notification.created_at).toLocaleString()}</time>
                </>
              );
              return (
                <li key={notification.id} className="border-t border-line">
                  {notification.destination_path ? (
                    <Link to={notification.destination_path} onClick={() => { if (!notification.read_at) markRead.mutate(notification.id); setIsOpen(false); }} className="block rounded-lg px-2 py-3 hover:bg-surface">
                      {content}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => { if (!notification.read_at) markRead.mutate(notification.id); }} className="block w-full px-2 py-3 text-left hover:bg-surface">
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
