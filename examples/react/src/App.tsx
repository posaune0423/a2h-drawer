import { useState } from 'react'
import { A2HDrawer } from '../../../src'
import '../../../src/styles.css'
import './App.css'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleShowDrawer = () => {
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleInstall = () => {
    console.log('App installation triggered!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A2H</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            A2H Drawer Demo
          </h1>
          <p className="text-gray-600">
            A React component library for PWA "Add to Home Screen" flows
          </p>
        </div>

        <div className="space-y-4">
          <A2HDrawer
            appName="A2H Drawer Demo"
            autoDetectIcon={true}
            showDemoVideo={false}
            theme="ios"
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            onInstall={handleInstall}
          />
          <button
            onClick={handleShowDrawer}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-3xl font-semibold hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Show Add to Home Screen
          </button>

          <div className="text-sm text-gray-500">
            <p>Try this demo on a mobile device for the best experience!</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>iOS-native UI design</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Auto icon detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>shadcn/ui compatible</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>PWA installation support</span>
            </div>
          </div>
        </div>
      </div>

      <A2HDrawer
        appName="A2H Drawer Demo"
        autoDetectIcon={true}
        showDemoVideo={false}
        theme="ios"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onInstall={handleInstall}
      />
    </div>
  )
}

export default App