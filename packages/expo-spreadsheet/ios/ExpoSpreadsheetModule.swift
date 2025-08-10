import ExpoModulesCore

public class ExpoSpreadsheetModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoSpreadsheet')` in JavaScript.
    Name("ExpoSpreadsheet")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! This is a test"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoSpreadsheetView.self) {
      Prop("rows") { (view: ExpoSpreadsheetView, rows: Int) in
        view.numberOfRows = max(0, rows)
      }

      Prop("columns") { (view: ExpoSpreadsheetView, columns: Int) in
        view.numberOfColumns = max(0, columns)
      }

      Prop("cellWidth") { (view: ExpoSpreadsheetView, width: Double) in
        view.cellWidth = max(1.0, CGFloat(width))
      }

      Prop("cellHeight") { (view: ExpoSpreadsheetView, height: Double) in
        view.cellHeight = max(1.0, CGFloat(height))
      }

      Prop("value") { (view: ExpoSpreadsheetView, value: [[String: Any]]) in
        view.setInitialValues(value)
      }

      Prop("showHeaders") { (view: ExpoSpreadsheetView, show: Bool) in
        view.showHeaders = show
      }

      Prop("infiniteScrollHorizontal") { (view: ExpoSpreadsheetView, enabled: Bool) in
        view.infiniteScrollHorizontal = enabled
      }

      Prop("infiniteScrollVertical") { (view: ExpoSpreadsheetView, enabled: Bool) in
        view.infiniteScrollVertical = enabled
      }

      Prop("gridStyle") { (view: ExpoSpreadsheetView, style: [String: Any]) in
        view.applyGridStyle(style)
      }

      Prop("intercellSpacing") { (view: ExpoSpreadsheetView, spacing: [String: Any]) in
        view.applyIntercellSpacing(spacing)
      }

      Prop("headerStyle") { (view: ExpoSpreadsheetView, style: [String: Any]) in
        view.applyHeaderStyle(style)
      }

      Prop("cellStyle") { (view: ExpoSpreadsheetView, style: [String: Any]) in
        view.applyCellStyle(style)
      }

      Events("onCellEdited")
    }
  }
}
