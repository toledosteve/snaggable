//
//  SnaggableApp.swift
//  Snaggable
//
//  Created by Steve Livingston on 1/10/25.
//
//
//import SwiftUI
//import SwiftData
//
//@main
//struct SnaggableApp: App {
//    var sharedModelContainer: ModelContainer = {
//        let schema = Schema([
//            Item.self,
//        ])
//        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
//
//        do {
//            return try ModelContainer(for: schema, configurations: [modelConfiguration])
//        } catch {
//            fatalError("Could not create ModelContainer: \(error)")
//        }
//    }()
//
//    var body: some Scene {
//        WindowGroup {
//            ContentView()
//        }
//        .modelContainer(sharedModelContainer)
//    }
//}

import SwiftUI

@main
struct SnaggableApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
