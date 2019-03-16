import { MimeType } from "../media";
import { Thumbs } from "../fragments/mediumWall";

export type Rating = "u" | "s" | "q" | "e";

export interface PartialShowViewModel {
  id: number;
  hash: string;
  mime_type: MimeType;
  rating: Rating;
  thumbs: Thumbs;

  tags: Array<any>;
}

export interface ShowViewModel extends PartialShowViewModel {
  similar: PartialShowViewModel[];
}
