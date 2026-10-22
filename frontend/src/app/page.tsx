import { Landing } from "@/components/landing/Landing";
import { RemoteScreen } from "@/components/remote/RemoteScreen";
import { IS_SITE } from "@/lib/site";

export default function HomePage() {
  return IS_SITE ? <Landing /> : <RemoteScreen />;
}
