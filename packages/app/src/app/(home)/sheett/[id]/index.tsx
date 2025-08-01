import { useSpreadsheetValue } from "@/src/utils/store/spreadsheet";
import { useSheettRouteParams } from "./_layout";

export default function Sheett() {
  const { id } = useSheettRouteParams();

  const [name, setName] = useSpreadsheetValue(id, "name");

  return null;
}
