import { MimeType } from "./media";
import { PartialShowViewModel } from "../api/show";

export interface MediumProps {
  hash: string;
  mime_type: MimeType;
  similar: PartialShowViewModel[];
}
