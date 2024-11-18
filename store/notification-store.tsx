import { Notifications, User } from "@/lib/types";
import { produce } from "immer";
import { createContext, useContext } from "react";
import { createStore } from "zustand";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";

type State = {
  notifications: Notifications;
};

type Action = {
  removeNotification: (notificationId: string) => void;
};

export type NotificationStore = ReturnType<typeof createNotificationStore>;

export const createNotificationStore = (notifications: Notifications) => {
  return createStore<Action & State>()((set) => ({
    notifications: notifications,
    removeNotification: (notificationId: string) =>
      set(
        produce((state: State) => {
          state.notifications = state.notifications.filter(
            (notification) => notification.notificationId !== notificationId,
          );
        }),
      ),
  }));
};

export const NotificationStoreContext = createContext<NotificationStore | null>(
  null,
);

export default function useNotificationStore<T>(
  selector: (state: Action & State) => T,
): T {
  const store = useContext(NotificationStoreContext);
  if (!store)
    throw new Error("Missing NotificationStoreContext.Provider in the tree");
  return useStoreWithEqualityFn(store, selector, shallow);
}