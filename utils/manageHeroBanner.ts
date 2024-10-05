import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getBanner() {
  const { data, error } = await supabase
    .from("hero_banner_table")
    .select("banner_image_link");
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching products");
  }

  return data;
}

export async function createBanner(newProduct, id: any) {
  let imageUrls = [];

  // Handle new images
  if (newProduct.image && newProduct.image.length > 0) {
    if (newProduct.image.length > 6) {
      throw new Error("You can upload a maximum of 6 images.");
    }

    for (const image of newProduct.image) {
      const hasImagePath = image?.startsWith?.(supabaseUrl);

      const imageName = hasImagePath
        ? image.split("/").pop()
        : `${Math.floor(Math.random() * 1000)}-${image.name}`.replaceAll(
            "/",
            ""
          );

      const imagePath = hasImagePath
        ? image
        : `${supabaseUrl}/storage/v1/object/public/banner_image/${imageName}`;

      imageUrls.push(imagePath);

      if (!hasImagePath) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("banner_image")
          .upload(imageName, image);

        if (uploadError) {
          console.error(uploadError);
          throw new Error("An error occurred while uploading the image");
        }
      }
    }
  }

  // Fetch the existing row from the table (assuming only one row)
  const { data: existingRow, error: fetchError } = await supabase
    .from("hero_banner_table")
    .select("id, banner_image_link") // Fetch image link
    .single(); // Fetch only the first row

  if (fetchError) {
    console.error(fetchError);
    throw new Error("An error occurred while fetching the existing banner");
  }

  // If there are previous images, delete the ones that are not in the new list
  const existingImageUrls = existingRow?.banner_image_link?.split(",") || [];

  // Find images that are in the existing list but not in the new list (to be deleted)
  const imagesToDelete = existingImageUrls.filter(
    (existingImage) => !imageUrls.includes(existingImage)
  );

  // Delete these images from Supabase bucket
  if (imagesToDelete.length > 0) {
    for (const imageToDelete of imagesToDelete) {
      const imageName = imageToDelete.split("/").pop(); // Extract image name from the URL

      const { error: deleteError } = await supabase.storage
        .from("banner_image")
        .remove([imageName]); // Delete the image from the bucket

      if (deleteError) {
        console.error(deleteError);
        throw new Error(
          `An error occurred while deleting the image: ${imageName}`
        );
      }
    }
  }

  // Update the existing row with new image URLs
  let query = supabase.from("hero_banner_table");
  let data, error;

  if (existingRow) {
    // Update the existing row
    ({ data, error } = await query
      .update({ banner_image_link: imageUrls.join(",") })
      .eq("id", existingRow.id)
      .select()
      .single());
  } else {
    throw new Error("No existing banner found to update.");
  }

  if (error) {
    console.error(error);
    throw new Error("An error occurred while updating the banner");
  }

  return data;
}
