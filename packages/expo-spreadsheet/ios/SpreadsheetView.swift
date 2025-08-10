//
//  SpreadsheetView.swift
//  ExpoSpreadsheet
//
//  Created by Jano Detzel on 10.08.25.
//

import Foundation
import UIKit

extension SpreadsheetView {
    public override func insertSubview(_ view: UIView, at index: Int) {
        super.insertSubview(view, at: index)
    }

    public override func exchangeSubview(at index1: Int, at index2: Int) {
        super.exchangeSubview(at: index1, at: index2)
    }
    
    public override func addSubview(_ view: UIView) {
        super.addSubview(view)
    }
    
    public override func insertSubview(_ view: UIView, belowSubview siblingSubview: UIView) {
        super.insertSubview(view, belowSubview: siblingSubview)
    }
    
    public override func insertSubview(_ view: UIView, aboveSubview siblingSubview: UIView) {
        super.insertSubview(view, aboveSubview: siblingSubview)
    }
    
    public override func bringSubviewToFront(_ view: UIView) {
        super.bringSubviewToFront(view)
    }
    
    public override func sendSubviewToBack(_ view: UIView) {
        super.sendSubviewToBack(view)
    }
    
        
}
