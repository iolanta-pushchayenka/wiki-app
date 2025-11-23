import { transliterate as tr } from "transliteration";

export function makeSafeFilename(title) {
    const base = tr(title || "")
        .toLowerCase()
        .replace(/[/\\?%*:|"<>]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "")
        .replace(/^[-.]+|[-.]+$/g, "")
        .slice(0, 50);

    return (base || "file") + "_" + Date.now();
}

