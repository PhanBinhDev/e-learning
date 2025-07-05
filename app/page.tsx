import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to default grade
  redirect("/grade/mau-giao/tieng-anh");
}
