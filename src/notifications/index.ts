import { makeNotificationContent } from "./impl";

export type BeevenueNotificationId = string;

export type BeevenueNotificationLevel = "error" | "warning" | "info";

export interface BeevenueNotificationTemplate {
  level: BeevenueNotificationLevel;
  contents: NotificationContentModel[];
}

export interface BeevenueNotification {
  id: BeevenueNotificationId;

  level: BeevenueNotificationLevel;

  timestamp: Date;

  content: JSX.Element;
}

export interface BeevenueNotificationMap {
  [K: string]: BeevenueNotification;
}

type FlatTextModel = string;

export type NotificationContentModel = TextModel | FlatTextModel | LinkModel;

export interface TextModel {
  type: "text";
  data: string;
}

export interface LinkData {
  location: string;
  text: string;
}

export interface LinkModel {
  type: "link";
  data: LinkData;
}

export const makeNotificationFromTemplate = (
  t: BeevenueNotificationTemplate
): BeevenueNotification => {
  return {
    id: "TODO: Random ID here",
    level: t.level,
    content: makeNotificationContent(t.contents),
    timestamp: new Date()
  };
};

export const makeNotification = (
  id: BeevenueNotificationId,
  level: BeevenueNotificationLevel,
  contents: NotificationContentModel[]
) => {
  return { id: id, level: level, content: makeNotificationContent(contents) };
};

export const makeNotificationExampleTemplate = (): BeevenueNotificationTemplate => {
  const example: NotificationContentModel[] = [
    "foobar",
    {
      type: "link",
      data: {
        location: "/foo",
        text: "click here"
      }
    }
  ];

  return { level: "error", contents: example };
};
