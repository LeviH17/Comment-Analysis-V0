import { redirect } from "next/navigation";

export default function Home() {
  redirect("/comment-analysis/post-comments");
}
