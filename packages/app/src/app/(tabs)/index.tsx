import * as SQLite from "expo-sqlite";
import { Button, FlatList, Pressable, SafeAreaView, View } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import {
  useCreateMergeableStore,
  useCreatePersister,
  useCreateSynchronizer,
  useProvideStore,
  useRowIds,
  useSortedRowIds,
  useStore,
} from "tinybase/ui-react";
import { createMergeableStore } from "tinybase/mergeable-store";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client";

const TABLE_NAME = "tasks";

const TEXT_CELL = "text";
const DONE_CELL = "done";

function AddTask() {
  const store = useStore(TABLE_NAME);

  const handleAddTask = () => {
    store?.addRow(TABLE_NAME, {
      [TEXT_CELL]: getRandomTask(),
      [DONE_CELL]: false,
    });
  };

  return <Button title="Add task" onPress={handleAddTask} />;
}

function TaskList() {
  const store = useStore(TABLE_NAME);
  const sortedRowIds = useRowIds(TABLE_NAME, store);
  return (
    <FlatList
      data={sortedRowIds}
      renderItem={({ item: id }) => {
        const task = store?.getRow(TABLE_NAME, id);
        return (
          <Pressable onPress={() => store?.delRow(TABLE_NAME, id)}>
            <ThemedText>
              {id} {task?.[TEXT_CELL]}
            </ThemedText>
          </Pressable>
        );
      }}
    />
  );
}
export default function HomeScreen() {
  const store = useCreateMergeableStore(() => createMergeableStore());
  useCreatePersister(
    store,
    (store) =>
      createExpoSqlitePersister(store, SQLite.openDatabaseSync("tasks.db")),
    [],
    // @ts-ignore
    (persister) => persister.load().then(persister.startAutoSave),
  );
  useCreateSynchronizer(store, async (store) => {
    const sync = await createWsSynchronizer(
      store,
      // new WebSocket("wss://sheett-cf-worker.jano-b33.workers.dev"),
      new WebSocket("ws://localhost:8787/tasks"),
    );

    await sync.startSync();

    sync.getWebSocket().addEventListener("open", () => {
      sync.load().then(() => sync.save());
    });

    return sync;
  });

  useProvideStore(TABLE_NAME, store);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="title">Tasks</ThemedText>
        <AddTask />
        <TaskList />
      </View>
    </SafeAreaView>
  );
}

const generateRandomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getRandomTask = () => {
  const tasks = [
    "🏃 Go for a run",
    "📚 Read a book",
    "🧹 Clean the house",
    "🥗 Make a healthy meal",
    "💻 Code something cool",
    "🎨 Draw something",
    "🎵 Practice an instrument",
    "🌱 Water the plants",
    "✍️ Write in journal",
    "🧘 Meditate",
  ];
  return tasks[Math.floor(Math.random() * tasks.length)];
};

// import { Image } from "expo-image";
// import { Platform, StyleSheet } from "react-native";
//
// import { HelloWave } from "@/src/components/HelloWave";
// import ParallaxScrollView from "@/src/components/ParallaxScrollView";
// import { ThemedText } from "@/src/components/ThemedText";
// import { ThemedView } from "@/src/components/ThemedView";
//
// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
//           to see changes. Press{" "}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: "cmd + d",
//               android: "cmd + m",
//               web: "F12",
//             })}
//           </ThemedText>{" "}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">
//             npm run reset-project
//           </ThemedText>{" "}
//           to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
//           directory. This will move the current{" "}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }
//
// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
