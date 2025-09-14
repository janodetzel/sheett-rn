import { Spreadsheet } from "@/src/components/spreadsheet";
import Screen from "@/src/components/ui/Screen";
import { SpreadsheetStore } from "@/src/utils/store/spreadsheet";
import React from "react";
import { useSheettRouteParams } from "./_layout";

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

  return (
    <>
      <SpreadsheetStore id={spreadsheetId} />
      <Screen padding="none" insets="none" scrollable={false}>
        <Spreadsheet rows={50} cols={26} spreadsheetId={spreadsheetId} />
      </Screen>
    </>
  );
}
