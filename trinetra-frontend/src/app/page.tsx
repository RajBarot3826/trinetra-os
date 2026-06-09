import CrimeMap from "./components/CrimeMap";
import NetworkGraph from "./components/NetworkGraph";
import CrimeGPT from "./components/CrimeGPT";
import { ShieldAlert, Activity, Users, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-cyan-500" />
            Project TRINETRA
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-mono">AI CRIME INTELLIGENCE OPERATING SYSTEM v1.0</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-red-900/50 rounded-lg p-3 flex items-center gap-3">
            <Activity className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Threat Level</p>
              <p className="text-red-500 font-mono text-lg font-bold">ELEVATED</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-cyan-900/50 rounded-lg p-3 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Active Hotspots</p>
              <p className="text-cyan-400 font-mono text-lg font-bold">4</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-blue-900/50 rounded-lg p-3 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Active Networks</p>
              <p className="text-blue-400 font-mono text-lg font-bold">12</p>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-500" />
              Live Geospatial Intelligence & Hotspots
            </h2>
            <CrimeMap />
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Criminal Network Graph Analytics
            </h2>
            <NetworkGraph />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Recent AI Alerts
            </h2>
            <div className="space-y-3">
              <div className="border-l-2 border-red-500 pl-3 py-1">
                <p className="text-sm font-mono text-gray-300">Anomaly Detected: 8 Vehicle Thefts in Whitefield</p>
                <p className="text-xs text-red-400 mt-1">Confidence: 94% | 15 mins ago</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <p className="text-sm font-mono text-gray-300">Network Alert: Suspect 42 contacted Suspect 12</p>
                <p className="text-xs text-amber-400 mt-1">Confidence: 88% | 1 hr ago</p>
              </div>
              <div className="border-l-2 border-cyan-500 pl-3 py-1">
                <p className="text-sm font-mono text-gray-300">Prediction: Koramangala hotspot forming</p>
                <p className="text-xs text-cyan-400 mt-1">Confidence: 85% | 3 hrs ago</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              CrimeGPT Copilot
            </h2>
            <CrimeGPT />
          </div>
        </div>
      </main>
    </div>
  );
}
