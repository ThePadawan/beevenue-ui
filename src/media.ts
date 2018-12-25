
type ImageMimeType = "image/gif" | "image/png" | "image/jpeg" | "image/jpg";

type VideoMimeType = "video/mp4" | "video/webm";

export type MimeType = ImageMimeType | VideoMimeType;

export type Extension = string;

export const MimeTypeToExtension = (id: MimeType): Extension => {
    const dict = {
        "image/png": ".png",
        "image/gif": ".gif",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "video/mp4": ".mp4",
        "video/webm": ".webm"
    }

    return dict[id];
};