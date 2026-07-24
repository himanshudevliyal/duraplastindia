import fs from "fs";
import path from "path";

// S3 imports - only loaded when needed
let S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  getSignedUrl,
  GetObjectCommand;
let s3Client = null;

// Configuration
const USE_S3 = process.env.USE_S3 === "true";
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Initialize S3 client only when needed
const initS3 = async () => {
  if (s3Client || !USE_S3) return s3Client;

  try {
    const s3Module = await import("@aws-sdk/client-s3");
    const presignerModule = await import("@aws-sdk/s3-request-presigner");

    S3Client = s3Module.S3Client;
    PutObjectCommand = s3Module.PutObjectCommand;
    DeleteObjectCommand = s3Module.DeleteObjectCommand;
    getSignedUrl = presignerModule.getSignedUrl;
    GetObjectCommand = s3Module.GetObjectCommand;

    s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    return s3Client;
  } catch (error) {
    console.error("Failed to initialize S3:", error);
    throw error;
  }
};

export const saveFile = async (file) => {
  const mime = file.mimetype.split("/").pop();

  const imageMime = ["jpeg", "jpg", "png", "gif", "webp"];
  const videoMime = ["mp4", "avi", "mov"];
  const docsMime = ["pdf", "docx", "xlsx"];

  let folder;

  if (imageMime.includes(mime)) {
    folder = USE_S3 ? "images/" : "public/images/";
  } else if (videoMime.includes(mime)) {
    folder = USE_S3 ? "videos/" : "public/videos/";
  } else if (docsMime.includes(mime)) {
    folder = USE_S3 ? "docs/" : "public/docs/";
  } else {
    folder = USE_S3 ? "files/" : "public/";
  }

  const filename = `${Date.now()}_${file.filename.replace(/[\s'/]/g, "_").toLowerCase()}`;

  if (USE_S3) {
    // S3 Upload
    const s3Key = `${folder}${filename}`;

    try {
      await initS3();
      const buffer = await file.toBuffer();

      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: file.mimetype,
        CacheControl: "max-age=31536000",
        Metadata: {
          originalName: file.filename,
          uploadedAt: new Date().toISOString(),
        },
      });

      await s3Client.send(uploadCommand);
      return s3Key;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  } else {
    // Local Storage (Original Code)
    fs.mkdirSync(folder, { recursive: true });
    const filepath = path.join(folder, filename);

    await file
      .toBuffer()
      .then((buffer) => fs.promises.writeFile(filepath, buffer));

    return filepath;
  }
};

export const deleteFile = async (filePath) => {
  console.log({ filePath });

  if (USE_S3) {
    // S3 Delete
    try {
      await initS3();

      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath, // filePath is actually s3Key when using S3
      });

      await s3Client.send(deleteCommand);
      console.log(`File deleted from S3: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file from S3: ${filePath}`, error);
      throw error;
    }
  } else {
    // Local Delete (Original Code)
    const fullPath = path.resolve(filePath);

    try {
      await fs.promises.unlink(fullPath);
      console.log(`File deleted: ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
      throw err;
    }
  }
};

// Helper function to get file URL
export const getFileUrl = async (filePath, expiresIn = 3600) => {
  if (USE_S3) {
    // Generate signed URL for S3
    try {
      await initS3();

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  } else {
    // Return local file path/URL
    return `/${filePath.replace(/\\/g, "/")}`; // Normalize path separators
  }
};

// Helper to get public URL (S3 only)
export const getPublicUrl = (s3Key) => {
  if (!USE_S3) {
    throw new Error("Public URLs are only available when using S3");
  }

  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${s3Key}`;
};
