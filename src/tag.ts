import { Rating } from "./api/show";

export interface Tag {
  rating: Rating;
  tag: string;
  impliedByThisCount: number;
  implyingThisCount: number;
  mediaCount: number;
}
