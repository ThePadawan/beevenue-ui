import { MimeType } from "../media";

export type Rating = "u" | "s" | "q" | "e";

export interface PartialShowViewModel {
  id: number;
  hash: string;
  mime_type: MimeType;
  rating: Rating;
  tags: Array<any>;
}

export interface ShowViewModel extends PartialShowViewModel {
  similar: PartialShowViewModel[];
}
