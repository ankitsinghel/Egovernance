import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function uploadFile(file: File, id: string) {
  const filePath = `${id}/${file.name}`;
  console.log("Uploading file to path:", filePath);
  const { data, error } = await supabaseAdmin.storage
    .from("Complaints")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
    console.log("Upload data:", data, "Error:", error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("Complaints")
    .getPublicUrl(filePath);

}
