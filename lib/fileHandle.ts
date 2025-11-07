import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function uploadFile(file: File, id: string) {
  const filePath = `${id}/reportFiles/${file.name}`;
  console.log("Uploading file to path:", filePath);
  const { data, error } = await supabaseAdmin.storage
    .from("Complaints")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  // console.log("Upload data:", data, "Error:", error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // const { data: publicUrlData } = supabaseAdmin.storage
  //   .from("Complaints")
  //   .getPublicUrl(filePath);
}

export async function getFiles(trackingId: string) {
  const { data, error } = await supabaseAdmin.storage
    .from("Complaints")
    .list(`${trackingId}/reportFiles/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
  if (error) {
    console.log("Supabase list error:", error);
  }
  const filesFromSupabase = (data || []).map((f, idx) => {
    const path = `${trackingId}/${f.name}`;
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("Complaints")
      .getPublicUrl(path);
    return {
      id: idx + 1,
      name: f.name,
      filePath: publicUrlData?.publicUrl ?? path,
    };
  });
  return filesFromSupabase;
}
