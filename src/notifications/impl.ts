import { NotificationContentModel, LinkModel, TextModel } from ".";
import { BeevenueNotificationVisitorImpl } from "./beevenueNotificationVisitorImpl";

export interface BeevenueNotificationVisitor {
  visitText(c: TextContent): void;
  visitLink(c: LinkContent): void;

  visitComposite(c: CompositeContent): void;
}

export interface BeevenueNotificationContent {
  visit(v: BeevenueNotificationVisitor): void;
}

export class CompositeContent implements BeevenueNotificationContent {
  public constructor(public readonly contents: BeevenueNotificationContent[]) {}

  visit(v: BeevenueNotificationVisitor) {
    v.visitComposite(this);
  }
}

export class TextContent implements BeevenueNotificationContent {
  public constructor(public readonly text: string) {}

  visit(v: BeevenueNotificationVisitor) {
    v.visitText(this);
  }
}

export class LinkContent implements BeevenueNotificationContent {
  public constructor(
    public readonly location: string,
    public readonly text: string
  ) {}

  visit(v: BeevenueNotificationVisitor) {
    v.visitLink(this);
  }
}

const convertNotificationContents = (
  models: NotificationContentModel[]
): BeevenueNotificationContent => {
  const contents = models.map(model => {
    if (typeof model === "string") {
      return new TextContent(model);
    } else if (model.type == "link") {
      const l = model as LinkModel;
      return new LinkContent(l.data.location, l.data.text);
    } else if (model.type == "text") {
      return new TextContent((model as TextModel).data);
    }
    throw Error(`Unknown tag ${model}`);
  });

  return new CompositeContent(contents);
};

export const makeNotificationContent = (
  contents: NotificationContentModel[]
): JSX.Element => {
  const compositeContent = convertNotificationContents(contents);
  const v = new BeevenueNotificationVisitorImpl();
  compositeContent.visit(v);
  return v.asElement();
};
