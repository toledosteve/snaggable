//
//  Item.swift
//  Snaggable
//
//  Created by Steve Livingston on 1/10/25.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
