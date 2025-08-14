import React, { useRef, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useUnistyles } from "react-native-unistyles";
import { useStore } from "tinybase/ui-react";
import { useSession } from "@/src/utils/supabase";
import {
  transformStoreToXSpreadsheet,
  XSpreadsheetData,
} from "./SpreadsheetDataTransformer";

interface SpreadsheetWebViewProps {
  spreadsheetId: string;
  onCellChange?: (rowId: string, colId: string, value: string) => void;
  onCellSelect?: (rowId: string, colId: string) => void;
}

interface WebViewMessage {
  type:
    | "SPREADSHEET_READY"
    | "CELL_CHANGE"
    | "CELL_SELECTED"
    | "DATA_EXPORT"
    | "ERROR";
  data?: any;
  cell?: { row: number; col: number; value: string };
  error?: string;
}

const SpreadsheetWebView: React.FC<SpreadsheetWebViewProps> = ({
  spreadsheetId,
  onCellChange,
  onCellSelect,
}) => {
  const webViewRef = useRef<WebView>(null);
  const { theme } = useUnistyles();
  const session = useSession();
  const currentUserId = session?.user.id ?? "";

  // Get the store for this spreadsheet
  const storeId = `spreadsheetStore-${spreadsheetId}`;
  const store = useStore(storeId);

  // Generate HTML content with x-spreadsheet
  const htmlContent = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <title>Spreadsheet</title>
      <link rel="stylesheet" href="https://unpkg.com/x-data-spreadsheet@1.1.9/dist/xspreadsheet.css">
      <script src="https://unpkg.com/x-data-spreadsheet@1.1.9/dist/xspreadsheet.js"></script>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${theme.colors.background};
          overflow: hidden;
        }
        
        #x-spreadsheet {
          width: 100vw;
          height: 100vh;
        }
        
        /* Customize x-spreadsheet theme to match your app */
        .x-spreadsheet {
          --primary-color: ${theme.colors.accent};
          --border-color: ${theme.colors.border.primary};
          --background-color: ${theme.colors.background};
          --text-color: ${theme.colors.text.primary};
        }
        
        /* Hide toolbar for mobile optimization */
        .x-spreadsheet-toolbar {
          display: none;
        }
        
        /* Optimize for mobile touch */
        .x-spreadsheet-sheet {
          touch-action: pan-x pan-y;
        }
        
        /* Custom scrollbar */
        .x-spreadsheet-scrollbar {
          background-color: ${theme.colors.surface};
        }
      </style>
    </head>
    <body>
      <div id="x-spreadsheet"></div>
      <script>
        let xs;
        let isReady = false;
        
        try {
          // Initialize x-spreadsheet
          xs = x_spreadsheet('#x-spreadsheet', {
            mode: 'edit',
            showToolbar: false,
            showGrid: true,
            showContextmenu: false, // Disable for mobile
            view: {
              height: () => window.innerHeight,
              width: () => window.innerWidth,
            },
            row: {
              len: 100,
              height: 40,
            },
            col: {
              len: 26,
              width: 80,
              indexWidth: 48,
              minWidth: 60,
            },
            style: {
              bgcolor: '${theme.colors.background}',
              align: 'left',
              valign: 'middle',
              textwrap: false,
              strike: false,
              underline: false,
              color: '${theme.colors.text.primary}',
              font: {
                name: 'Arial',
                size: 13,
                bold: false,
                italic: false,
              },
            }
          });

          // Handle cell changes
          xs.on('cell-edited', (text, ri, ci) => {
            if (isReady) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'CELL_CHANGE',
                data: {
                  row: ri,
                  col: ci,
                  value: text,
                  cellId: ri + '_' + ci
                }
              }));
            }
          });

          // Handle cell selection
          xs.on('cell-selected', (cell, ri, ci) => {
            if (isReady) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'CELL_SELECTED',
                cell: {
                  row: ri,
                  col: ci,
                  value: cell?.text || ''
                }
              }));
            }
          });

          // Function to load data from React Native
          window.loadSpreadsheetData = (data) => {
            try {
              if (xs && data) {
                xs.loadData(data);
              }
            } catch (error) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'ERROR',
                error: 'Failed to load data: ' + error.message
              }));
            }
          };

          // Function to update a specific cell
          window.updateCell = (row, col, value) => {
            try {
              if (xs) {
                xs.cellText(row, col, value);
              }
            } catch (error) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'ERROR',
                error: 'Failed to update cell: ' + error.message
              }));
            }
          };

          // Function to get current data
          window.exportData = () => {
            try {
              if (xs) {
                const data = xs.getData();
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                  type: 'DATA_EXPORT',
                  data: data
                }));
              }
            } catch (error) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'ERROR',
                error: 'Failed to export data: ' + error.message
              }));
            }
          };

          // Listen for window resize
          window.addEventListener('resize', () => {
            if (xs) {
              xs.resize();
            }
          });

          // Ready signal
          isReady = true;
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'SPREADSHEET_READY'
          }));

        } catch (error) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'ERROR',
            error: 'Failed to initialize spreadsheet: ' + error.message
          }));
        }

        // Handle messages from React Native
        window.addEventListener('message', (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case 'LOAD_DATA':
                window.loadSpreadsheetData(message.data);
                break;
              case 'UPDATE_CELL':
                window.updateCell(message.row, message.col, message.value);
                break;
              case 'EXPORT_DATA':
                window.exportData();
                break;
            }
          } catch (error) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'ERROR',
              error: 'Failed to handle message: ' + error.message
            }));
          }
        });
      </script>
    </body>
    </html>
  `,
    [theme]
  );

  // Data transformation helper
  const transformStoreDataToXSpreadsheet = useCallback((): XSpreadsheetData => {
    if (!store) {
      return { name: "Sheet1", rows: {} };
    }

    return transformStoreToXSpreadsheet(store, spreadsheetId);
  }, [store, spreadsheetId]);

  // Load initial data from your store
  const loadInitialData = useCallback(() => {
    // Transform your store data to x-spreadsheet format
    const xsData = transformStoreDataToXSpreadsheet();

    // Send to WebView
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: "LOAD_DATA",
          data: xsData,
        })
      );
    }
  }, [transformStoreDataToXSpreadsheet]);

  // Handle messages from WebView
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        switch (message.type) {
          case "SPREADSHEET_READY":
            console.log("📊 Spreadsheet WebView ready");
            loadInitialData();
            break;

          case "CELL_CHANGE":
            if (message.data) {
              const { row, col, value } = message.data;

              // Update the store directly
              if (store) {
                const cellId = `${row}_${col}`;
                const now = new Date().toISOString();

                store.setRow("cells", cellId, {
                  rowId: String(row),
                  columnId: String(col),
                  value: value,
                  createdBy: currentUserId,
                  updatedAt: now,
                  ...(store.getRow("cells", cellId) || { createdAt: now }),
                });
              }

              // Also call the callback if provided
              if (onCellChange) {
                onCellChange(String(row), String(col), value);
              }
            }
            break;

          case "CELL_SELECTED":
            if (message.cell && onCellSelect) {
              const { row, col } = message.cell;
              onCellSelect(String(row), String(col));
            }
            break;

          case "DATA_EXPORT":
            console.log("📤 Data exported:", message.data);
            break;

          case "ERROR":
            console.error("❌ WebView error:", message.error);
            break;

          default:
            console.log("📨 Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("❌ Error parsing WebView message:", error);
      }
    },
    [onCellChange, onCellSelect, loadInitialData, store, currentUserId]
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <View style={styles.loading} />}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("❌ WebView error:", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("❌ WebView HTTP error:", nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default SpreadsheetWebView;
