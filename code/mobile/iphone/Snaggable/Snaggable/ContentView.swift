import SwiftUI

struct ContentView: View {
    @State private var authStatus: String = "loading"

    var body: some View {
        VStack {
            if authStatus == "loading" {
                ProgressView("Authenticating...")
            } else if authStatus == "authorized" {
                Text("Snaggable")
                    .font(.largeTitle)
                    .fontWeight(.bold)
            } else {
                Text("Client is not authorized")
                    .foregroundColor(.red)
            }
        }
        .onAppear {
            authenticateClient()
        }
    }

    func authenticateClient() {
        guard let url = URL(string: "http://localhost:3000/api/auth") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = [
            "client_id": "your-client-id",
            "client_secret": "your-client-secret"
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: [])

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let httpResponse = response as? HTTPURLResponse else { return }
            DispatchQueue.main.async {
                if httpResponse.statusCode == 200 {
                    authStatus = "authorized"
                } else {
                    authStatus = "unauthorized"
                }
            }
        }.resume()
    }
}


////
////  ContentView.swift
////  Snaggable
////
////  Created by Steve Livingston on 1/10/25.
////
//
//import SwiftUI
//import SwiftData
//
//struct ContentView: View {
//    @Environment(\.modelContext) private var modelContext
//    @Query private var items: [Item]
//
//    var body: some View {
//        NavigationSplitView {
//            List {
//                ForEach(items) { item in
//                    NavigationLink {
//                        Text("Item at \(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))")
//                    } label: {
//                        Text(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))
//                    }
//                }
//                .onDelete(perform: deleteItems)
//            }
//            .toolbar {
//                ToolbarItem(placement: .navigationBarTrailing) {
//                    EditButton()
//                }
//                ToolbarItem {
//                    Button(action: addItem) {
//                        Label("Add Item", systemImage: "plus")
//                    }
//                }
//            }
//        } detail: {
//            Text("Select an item")
//        }
//    }
//
//    private func addItem() {
//        withAnimation {
//            let newItem = Item(timestamp: Date())
//            modelContext.insert(newItem)
//        }
//    }
//
//    private func deleteItems(offsets: IndexSet) {
//        withAnimation {
//            for index in offsets {
//                modelContext.delete(items[index])
//            }
//        }
//    }
//}
//
//#Preview {
//    ContentView()
//        .modelContainer(for: Item.self, inMemory: true)
//}
