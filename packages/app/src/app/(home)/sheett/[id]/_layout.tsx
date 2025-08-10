import CustomHeader from "@/src/components/CustomHeader";
import { SpreadsheetStore } from "@/src/utils/store/spreadsheet";
import { Stack, useLocalSearchParams } from "expo-router";

type SheettRouteParams = {
  id: string;
};

export const useSheettRouteParams = () =>
  useLocalSearchParams<SheettRouteParams>();

export default function SheettLayout() {
  // const { id } = useSheettRouteParams();

  return (
    <>
      {/* <SpreadsheetStore id={id} /> */}
      <Stack
        screenOptions={{
          headerShown: true,
          header: ({ route, options }) => (
            <CustomHeader title={options.title || route.name} showBack={true} />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Sheett",
          }}
        />
      </Stack>
    </>
  );
}
