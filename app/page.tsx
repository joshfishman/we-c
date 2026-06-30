import { SiteRenderer } from "../components/site/SiteRenderer";
import { getPage, getSettings } from "../lib/content";

export default function Home() {
  const page = getPage("home.json");
  const settings = getSettings();

  return (
    <SiteRenderer
      page={{ data: { page }, query: "", variables: {} }}
      settings={{ data: { settings }, query: "", variables: {} }}
    />
  );
}
