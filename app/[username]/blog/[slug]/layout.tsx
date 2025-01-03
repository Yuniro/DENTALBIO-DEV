import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

// Function to fetch blog data based on the slug
async function fetchBlog(slug: string) {
  const supabase = createClient();

  // Fetch the blog by slug
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    throw new Error("Blog not found");
  }

  return {
    meta_title: blog.meta_title,
    meta_description: blog.meta_description,
    meta_image: blog.meta_image,  // Assuming there's a `meta_image` column
    content: blog.content,
  };
}

export async function generateMetadata({
  params: { username, slug },
}: {
  params: { username: string, slug: string };
}): Promise<Metadata> {
  const { meta_title, meta_description, meta_image, content } = await fetchBlog(slug);

  // Set default values for the title and description
  const title = meta_title || username;
  const authors = [username] as Author[];
  const description = meta_description || content.slice(0, 200);

  // Set Open Graph and Twitter metadata
  const imageUrl = meta_image || "https://yourdefaultimage.com/default.jpg"; // Default image if no meta_image is provided

  return {
    title,
    authors,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourwebsite.com/${slug}`,
      images: [{ url: imageUrl }],
      type: "article",  // Assuming it's a blog post, change as needed
    },
    twitter: {
      card: "summary_large_image",  // Large image card
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: any;
}>) {
  return <>{children}</>;
}
