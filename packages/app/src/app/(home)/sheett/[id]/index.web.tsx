import { Spreadsheet } from "@/src/components/spreadsheet/Spreadsheet.web";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useSheettRouteParams } from "./_layout";
import Screen from "@/src/components/ui/Screen";
import { useSpreadsheetTable } from "@/src/utils/store/spreadsheet";
import { Inspector } from "tinybase/ui-react-inspector";

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

  const [spreadsheetTable, setSpreadsheetTable] =
    useSpreadsheetTable(spreadsheetId);

  setSpreadsheetTable({});
  console.log(spreadsheetTable);

  // const table = useReactTable({
  //   data: spreadsheetTable ?? [],
  //   columns: [],
  //   getCoreRowModel: getCoreRowModel(),
  // });

  return (
    <Screen padding="none" insets="none" scrollable={false}>
      <Inspector />
      {/* <Spreadsheet table={table} />; */}
    </Screen>
  );
}
