import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "bpi3s64e",
  api_key: process.env.CLOUDINARY_API_KEY || "223898674186319",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5a-GEF8ujc8zLzR_o0FtoNWt8ho",
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "ne_dhaniya_tours";

    if (!file) {
      // Check if image data is passed as base64 or URL string
      const imageStr = formData.get("image") as string | null;
      if (imageStr) {
        const uploadResult = await cloudinary.uploader.upload(imageStr, {
          folder: folder,
          resource_type: "image",
        });
        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        });
      }

      return NextResponse.json(
        { success: false, error: "No image file or image data provided" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload via stream
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to get upload result from Cloudinary"));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to upload image to Cloudinary",
      },
      { status: 500 }
    );
  }
}
