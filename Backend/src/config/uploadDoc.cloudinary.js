import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadDocuments = async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents || documents.length === 0) {
      return res.status(400).json({ message: "No documents provided" });
    }

    const uploadedUrls = await Promise.all(
      documents.map(async (doc) => {
        const result = await cloudinary.v2.uploader.upload(doc.file, {
          folder: "tasks/documents",
          resource_type: "auto",
          public_id: doc.fileName.split(".")[0],
        });
        return result.secure_url;
      })
    );

    console.log("uploadedUrls:", uploadedUrls);
    

    res.status(200).json({ documentUrls: uploadedUrls });
  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({ message: "Failed to upload documents" });
  }
};
