import { Spreadsheet } from "@/src/components/spreadsheet";
import { useSheettRouteParams } from "./_layout";
import Screen from "@/src/components/ui/Screen";
import { SpreadsheetStore } from "@/src/utils/store/spreadsheet";

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

  return (
    <>
      <SpreadsheetStore id={spreadsheetId} />
      <Screen padding="none" insets="none" scrollable={false}>
        <Spreadsheet rows={40} cols={26} spreadsheetId={spreadsheetId} />
      </Screen>
    </>
  );
}
