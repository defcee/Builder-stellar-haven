import { createHash } from "node:crypto";
import { Router, raw } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../middleware/errors.js";
import { requireUser } from "./auth.js";

export const mediaRouter = Router();

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function isValidImage(type: string, image: Buffer): boolean {
  if (type === "image/jpeg") return image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  if (type === "image/png") return image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/webp") return image.toString("ascii", 0, 4) === "RIFF" && image.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return image.toString("ascii", 4, 12).startsWith("ftypavif") || image.toString("ascii", 4, 12).startsWith("ftypavis");
  return false;
}

mediaRouter.post(
  "/upload",
  requireUser,
  raw({ type: Array.from(acceptedImageTypes), limit: "5mb" }),
  async (request, response) => {
    const user = response.locals.user as { role: string };
    if (user.role !== "farmer" && user.role !== "business") {
      throw new HttpError(403, "Only farmers and business owners can upload listing images");
    }

    const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new HttpError(503, "Image uploads are not configured. Contact the site administrator.");
    }

    const contentType = request.headers["content-type"]?.split(";")[0]?.trim() ?? "";
    const image = request.body;
    if (!acceptedImageTypes.has(contentType) || !Buffer.isBuffer(image) || !isValidImage(contentType, image)) {
      throw new HttpError(400, "Upload a valid JPEG, PNG, WebP, or AVIF image");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "bizzleap/listings";
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");
    const extension = contentType.split("/")[1];
    const formData = new FormData();
    formData.append("file", new Blob([Uint8Array.from(image)], { type: contentType }), `listing.${extension}`);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);

    let cloudinaryResponse: Response;
    try {
      cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      console.error("Cloudinary image upload request failed:", error instanceof Error ? error.message : "unknown error");
      throw new HttpError(502, "The image service could not be reached");
    }

    const uploadResult = await cloudinaryResponse.json().catch(() => null) as {
      secure_url?: string;
      error?: { message?: string };
    } | null;
    if (!cloudinaryResponse.ok || !uploadResult?.secure_url) {
      console.error("Cloudinary image upload was rejected:", uploadResult?.error?.message ?? "unknown provider response");
      throw new HttpError(502, "The image service could not save this image");
    }
    response.status(201).json({ success: true, data: { imageUrl: uploadResult.secure_url }, message: "Image uploaded" });
  },
);
