import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { saveFile } from "../../utils/file.js";

export const multipartPreHandler = async (
  req,
  reply,
  checkForArrayElements = [],
) => {
  const parts = req.parts();
  const body = {};
  const filePaths = [];

  try {
    for await (const part of parts) {
      if (part.file) {
        const filePath = await saveFile(part);

        if (body[part.fieldname]) {
          body[part.fieldname].push(filePath);
        } else {
          body[part.fieldname] = [filePath];
        }

        filePaths.push(filePath);
      } else {
        let value = part.value;

        // Normalize
        if (value === "null") value = null;
        else if (value === "undefined") value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;

        // Parse JSON fields
        if (
          checkForArrayElements.includes(part.fieldname) ||
          part.fieldname.startsWith("variant_picture_urls_") ||
          part.fieldname.startsWith("applications_image_urls_") ||
          part.fieldname.startsWith("benefits_image_urls_")
        ) {
          try {
            value = JSON.parse(value);
          } catch (e) {}
        }

        body[part.fieldname] = value;
      }
    }

    req.body = body;
    req.filePaths = filePaths;

    // console.log("BODY =>", body);
    // console.log("FILES =>", filePaths);
  } catch (error) {
    if (filePaths.length) {
      await cleanupFiles(filePaths);
    }
    throw error;
  }
};
