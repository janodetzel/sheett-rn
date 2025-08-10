import ExpoModulesCore
import UIKit
import SpreadsheetView

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class ExpoSpreadsheetView: ExpoView, SpreadsheetViewDataSource, SpreadsheetViewDelegate {
  let onCellEdited = EventDispatcher()

  // Underlying spreadsheet view
  private let spreadsheetView = SpreadsheetView()

  // Props
  var numberOfRows: Int = 0 { didSet { spreadsheetView.reloadData() } }
  var numberOfColumns: Int = 0 { didSet { spreadsheetView.reloadData() } }
  var cellWidth: CGFloat = 80 { didSet { spreadsheetView.reloadData() } }
  var cellHeight: CGFloat = 40 { didSet { spreadsheetView.reloadData() } }
  var showHeaders: Bool = false { didSet { spreadsheetView.reloadData() } }
  var infiniteScrollHorizontal: Bool = false { didSet { applyCircularScrolling() } }
  var infiniteScrollVertical: Bool = false { didSet { applyCircularScrolling() } }

  // Styles
  private var headerTextColor: UIColor = .darkGray
  private var headerBackgroundColor: UIColor = .systemGray6
  private var headerFontSize: CGFloat = 12
  private var cellTextColor: UIColor = .label
  private var cellBackgroundColor: UIColor = .clear
  private var cellFontSize: CGFloat = 14

  // Data mapping: "row-col" -> value
  private var initialValues: [String: String] = [:] { didSet { spreadsheetView.reloadData() } }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true

    spreadsheetView.dataSource = self
    spreadsheetView.delegate = self
    spreadsheetView.gridStyle = .solid(width: 1, color: .lightGray)
    spreadsheetView.intercellSpacing = .init(width: 1, height: 1)
    spreadsheetView.bounces = true
    spreadsheetView.alwaysBounceHorizontal = true
    spreadsheetView.alwaysBounceVertical = true

    spreadsheetView.register(EditableTextCell.self, forCellWithReuseIdentifier: EditableTextCell.reuseIdentifier)
    spreadsheetView.register(HeaderCell.self, forCellWithReuseIdentifier: HeaderCell.reuseIdentifier)

    addSubview(spreadsheetView)
    applyCircularScrolling()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    spreadsheetView.frame = bounds
  }

  func setInitialValues(_ values: [[String: Any]]) {
    var map: [String: String] = [:]
    for item in values {
      let rowId = String(describing: item["rowId"] ?? "")
      let columnId = String(describing: item["columnId"] ?? "")
      let value = String(describing: item["value"] ?? "")
      let key = "\(rowId)-\(columnId)"
      map[key] = value
    }
    initialValues = map
  }

  // MARK: - Styling from props

  func applyGridStyle(_ style: [String: Any]) {
    let colorHex = style["color"] as? String
    let width = CGFloat(style["width"] as? Double ?? 1.0)
    let color = colorHex.flatMap { UIColor(fromHexString: $0) } ?? .lightGray
    spreadsheetView.gridStyle = .solid(width: width, color: color)
  }

  func applyIntercellSpacing(_ spacing: [String: Any]) {
    let w = CGFloat(spacing["width"] as? Double ?? 1.0)
    let h = CGFloat(spacing["height"] as? Double ?? 1.0)
    spreadsheetView.intercellSpacing = .init(width: w, height: h)
  }

  func applyHeaderStyle(_ style: [String: Any]) {
    if let bg = style["backgroundColor"] as? String, let c = UIColor(fromHexString: bg) {
      headerBackgroundColor = c
    }
    if let tc = style["textColor"] as? String, let c = UIColor(fromHexString: tc) {
      headerTextColor = c
    }
    if let fs = style["fontSize"] as? Double { headerFontSize = CGFloat(fs) }
    spreadsheetView.reloadData()
  }

  func applyCellStyle(_ style: [String: Any]) {
    if let bg = style["backgroundColor"] as? String, let c = UIColor(fromHexString: bg) {
      cellBackgroundColor = c
    }
    if let tc = style["textColor"] as? String, let c = UIColor(fromHexString: tc) {
      cellTextColor = c
    }
    if let fs = style["fontSize"] as? Double { cellFontSize = CGFloat(fs) }
    spreadsheetView.reloadData()
  }

  private func applyCircularScrolling() {
    if infiniteScrollHorizontal && infiniteScrollVertical {
      spreadsheetView.circularScrolling = CircularScrolling.Configuration.both
    } else if infiniteScrollHorizontal {
      spreadsheetView.circularScrolling = CircularScrolling.Configuration.horizontally
    } else if infiniteScrollVertical {
      spreadsheetView.circularScrolling = CircularScrolling.Configuration.vertically
    } else {
      spreadsheetView.circularScrolling = CircularScrolling.Configuration.none
    }
  }

  // MARK: - SpreadsheetViewDataSource

  func numberOfColumns(in spreadsheetView: SpreadsheetView) -> Int {
    return max(0, numberOfColumns + (showHeaders ? 1 : 0))
  }

  func numberOfRows(in spreadsheetView: SpreadsheetView) -> Int {
    return max(0, numberOfRows + (showHeaders ? 1 : 0))
  }

  func frozenColumns(in spreadsheetView: SpreadsheetView) -> Int {
    return showHeaders ? 1 : 0
  }

  func frozenRows(in spreadsheetView: SpreadsheetView) -> Int {
    return showHeaders ? 1 : 0
  }

  func spreadsheetView(_ spreadsheetView: SpreadsheetView, widthForColumn column: Int) -> CGFloat {
    return max(1, cellWidth)
  }

  func spreadsheetView(_ spreadsheetView: SpreadsheetView, heightForRow row: Int) -> CGFloat {
    return max(1, cellHeight)
  }

  func spreadsheetView(_ spreadsheetView: SpreadsheetView, cellForItemAt indexPath: IndexPath) -> Cell? {
    let isHeaderRow = showHeaders && indexPath.row == 0
    let isHeaderCol = showHeaders && indexPath.column == 0

    if isHeaderRow || isHeaderCol {
      let cell = spreadsheetView.dequeueReusableCell(withReuseIdentifier: HeaderCell.reuseIdentifier, for: indexPath) as? HeaderCell ?? HeaderCell()
      cell.applyStyle(textColor: headerTextColor, backgroundColor: headerBackgroundColor, fontSize: headerFontSize)
      if isHeaderRow && isHeaderCol {
        cell.configure(text: "")
      } else if isHeaderRow {
        let label = columnLabel(for: indexPath.column - 1)
        cell.configure(text: label)
      } else {
        cell.configure(text: String(indexPath.row))
      }
      return cell
    }

    let dataRow = showHeaders ? indexPath.row - 1 : indexPath.row
    let dataCol = showHeaders ? indexPath.column - 1 : indexPath.column

    let cell = spreadsheetView.dequeueReusableCell(withReuseIdentifier: EditableTextCell.reuseIdentifier, for: indexPath) as? EditableTextCell ?? EditableTextCell()

    let cellId = "\(dataRow)-\(dataCol)"
    let text = initialValues[cellId] ?? ""

    cell.configure(text: text, cellId: cellId)
    cell.applyStyle(textColor: cellTextColor, backgroundColor: cellBackgroundColor, fontSize: cellFontSize)

    cell.onCommit = { [weak self] newText in
      self?.onCellEdited(["cellId": cellId, "value": newText])
    }

    return cell
  }

  private func columnLabel(for index: Int) -> String {
    var result = ""
    var num = index
    while num >= 0 {
      guard let scalar = UnicodeScalar(65 + (num % 26)) else { break }
      result.insert(Character(scalar), at: result.startIndex)
      num = (num / 26) - 1
      if num < 0 { break }
    }
    return result
  }
}

// MARK: - Editable Cell

private final class EditableTextCell: Cell, UITextFieldDelegate {
  static let reuseIdentifier = "EditableTextCell"

  private let textField = UITextField()
  var onCommit: ((String) -> Void)?
  private(set) var cellId: String = ""

  override init(frame: CGRect) {
    super.init(frame: frame)
    commonInit()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    commonInit()
  }

  private func commonInit() {
    textField.borderStyle = .roundedRect
    textField.font = .systemFont(ofSize: 14)
    textField.autocorrectionType = .no
    textField.autocapitalizationType = .none
    textField.clearButtonMode = .never
    textField.returnKeyType = .done
    textField.delegate = self
    contentView.addSubview(textField)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    textField.frame = contentView.bounds.insetBy(dx: 1, dy: 1)
  }

  func configure(text: String, cellId: String) {
    self.cellId = cellId
    accessibilityIdentifier = cellId
    textField.text = text
  }

  func applyStyle(textColor: UIColor, backgroundColor: UIColor, fontSize: CGFloat) {
    textField.textColor = textColor
    textField.backgroundColor = backgroundColor
    textField.font = .systemFont(ofSize: fontSize)
  }

  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    textField.resignFirstResponder()
    return true
  }

  func textFieldDidEndEditing(_ textField: UITextField) {
    onCommit?(textField.text ?? "")
  }
}

// MARK: - Header Cell

private final class HeaderCell: Cell {
  static let reuseIdentifier = "HeaderCell"
  private let label = UILabel()

  override init(frame: CGRect) {
    super.init(frame: frame)
    commonInit()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    commonInit()
  }

  private func commonInit() {
    label.font = .systemFont(ofSize: 12, weight: .semibold)
    label.textAlignment = .center
    label.textColor = .darkGray
    contentView.addSubview(label)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    label.frame = contentView.bounds.insetBy(dx: 2, dy: 2)
  }

  func applyStyle(textColor: UIColor, backgroundColor: UIColor, fontSize: CGFloat) {
    label.textColor = textColor
    label.backgroundColor = backgroundColor
    label.font = .systemFont(ofSize: fontSize, weight: .semibold)
  }

  func configure(text: String) {
    label.text = text
  }
}

// MARK: - Helpers

private extension UIColor {
  convenience init?(fromHexString hex: String) {
    var cleaned = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    if cleaned.hasPrefix("#") { cleaned.removeFirst() }
    if cleaned.count == 3 {
      let r = cleaned[0]
      let g = cleaned[1]
      let b = cleaned[2]
      cleaned = "\(r)\(r)\(g)\(g)\(b)\(b)"
    }
    guard cleaned.count == 6 || cleaned.count == 8 else { return nil }
    var rgba: UInt64 = 0
    guard Scanner(string: cleaned).scanHexInt64(&rgba) else { return nil }
    let hasAlpha = cleaned.count == 8
    let r = CGFloat((rgba >> (hasAlpha ? 24 : 16)) & 0xFF) / 255.0
    let g = CGFloat((rgba >> (hasAlpha ? 16 : 8)) & 0xFF) / 255.0
    let b = CGFloat((rgba >> (hasAlpha ? 8 : 0)) & 0xFF) / 255.0
    let a = hasAlpha ? CGFloat(rgba & 0xFF) / 255.0 : 1.0
    self.init(red: r, green: g, blue: b, alpha: a)
  }
}

private extension String {
  subscript(i: Int) -> Character {
    return self[index(startIndex, offsetBy: i)]
  }
}
