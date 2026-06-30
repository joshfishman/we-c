import { OneDay } from "../../components/oneday/OneDay";
import { getOneDay, getSettings } from "../../lib/content";

export default function OneDayPage() {
  const oneDay = getOneDay();
  const settings = getSettings();
  return (
    <OneDay
      page={{ data: { oneDay }, query: "", variables: {} }}
      settings={{ data: { settings }, query: "", variables: {} }}
    />
  );
}
