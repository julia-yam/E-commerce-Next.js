import type {Metadata} from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your personal account information",
};

export default function ProfilePage() {
  return (
    <main>
      <ProfilePageClient />
    </main>
  );
}
