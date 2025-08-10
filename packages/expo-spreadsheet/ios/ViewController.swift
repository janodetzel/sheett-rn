//
//  ViewController.swift
//  ExpoSpreadsheet
//
//  Created by Jano Detzel on 10.08.25.
//

import Foundation
import SpreadsheetView


import UIKit

class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    func numberOfColumns(in spreadsheetView: SpreadsheetView) -> Int {
        return 200
    }
    
    func numberOfRows(in spreadsheetView: SpreadsheetView) -> Int {
        return 400
    }
    
    func spreadsheetView(_ spreadsheetView: SpreadsheetView, widthForColumn column: Int) -> CGFloat {
        return 80
    }
    
    func spreadsheetView(_ spreadsheetView: SpreadsheetView, heightForRow row: Int) -> CGFloat {
        return 40
    }
}
