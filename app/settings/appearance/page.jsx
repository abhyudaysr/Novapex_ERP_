"use client"

import { useState } from "react"
import { ArrowLeft, Palette, Monitor, Sun, Moon, Smartphone, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AppearanceSettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [compactMode, setCompactMode] = useState(false)

  const themes = [
    { id: "light", name: "Light", icon: Sun, description: "Clean and bright interface" },
    { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes" },
    { id: "auto", name: "Auto", icon: Monitor, description: "Matches system preference" },
  ]

  const colorSchemes = [
    { id: "blue", name: "Blue", color: "bg-blue-600", border: "border-blue-200" },
    { id: "green", name: "Green", color: "bg-emerald-600", border: "border-emerald-200" },
    { id: "purple", name: "Purple", color: "bg-purple-600", border: "border-purple-200" },
    { id: "orange", name: "Orange", color: "bg-orange-500", border: "border-orange-200" },
    { id: "red", name: "Red", color: "bg-rose-600", border: "border-rose-200" },
    { id: "teal", name: "Teal", color: "bg-teal-600", border: "border-teal-200" },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${selectedTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} p-8`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Appearance</h1>
            <p className="text-slate-500 font-medium">Personalize your Novapex workspace.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          
          {/* Settings Section */}
          <div className="xl:col-span-3 space-y-10">
            
            {/* Theme Grid */}
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Interface Theme
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => {
                  const Icon = theme.icon
                  const isActive = selectedTheme === theme.id
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`relative p-6 rounded-[24px] border-2 text-left transition-all group overflow-hidden ${
                        isActive ? "border-blue-600 bg-white shadow-xl shadow-blue-100/50" : "border-slate-200 bg-transparent hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-black text-lg">{theme.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">{theme.description}</p>
                      {isActive && <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Accent Color */}
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Accent Color</h2>
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {colorSchemes.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className="group flex flex-col items-center gap-3"
                    >
                      <div className={`w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center p-1 border-2 ${selectedColor === color.id ? 'border-slate-900' : 'border-transparent group-hover:scale-110'}`}>
                        <div className={`w-full h-full ${color.color} rounded-full flex items-center justify-center shadow-inner`}>
                          {selectedColor === color.id && <Check className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      <span className={`text-xs font-black uppercase tracking-tighter ${selectedColor === color.id ? 'text-slate-900' : 'text-slate-400'}`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Layout Options */}
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Typography & Density</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900">Compact Mode</h4>
                    <p className="text-sm text-slate-500 font-medium">Maximize data visibility</p>
                  </div>
                  <button 
                    onClick={() => setCompactMode(!compactMode)}
                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${compactMode ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <motion.div animate={{ x: compactMode ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-md" />
                  </button>
                </div>
                <div className="bg-white p-4 rounded-[28px] border border-slate-100 flex items-center gap-4 px-6">
                  <span className="text-sm font-black text-slate-400 uppercase">Size</span>
                  <select className="flex-1 bg-transparent font-bold text-slate-900 outline-none">
                    <option>Small</option>
                    <option selected>Standard</option>
                    <option>Comfortable</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Real-time Preview Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-8">
              <div className={`rounded-[40px] p-1 border shadow-2xl ${selectedTheme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-blue-900/20' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                <div className="p-6">
                   <h3 className="font-black text-xs uppercase tracking-widest mb-6 opacity-50">Live Preview</h3>
                   
                   {/* Mock UI Element */}
                   <div className={`rounded-3xl p-4 mb-4 ${selectedTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-lg ${colorSchemes.find(c => c.id === selectedColor)?.color}`} />
                        <div className="h-2 w-24 rounded bg-slate-300 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded bg-slate-200" />
                        <div className="h-2 w-3/4 rounded bg-slate-200" />
                      </div>
                      <div className={`mt-6 h-10 w-full rounded-xl flex items-center justify-center text-[10px] font-black uppercase text-white ${colorSchemes.find(c => c.id === selectedColor)?.color}`}>
                        Primary Action
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mt-8">
                      <Button variant="outline" className="rounded-2xl border-slate-200 font-bold text-xs h-12">Export</Button>
                      <Button className="rounded-2xl bg-slate-900 text-white font-bold text-xs h-12">Save</Button>
                   </div>
                </div>
              </div>

              {/* Advanced CSS Toggle */}
              <div className="mt-6 p-6 rounded-[32px] bg-slate-900 text-white shadow-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <Palette className="w-4 h-4 text-blue-400" />
                    <span className="font-black text-xs uppercase tracking-widest">Custom CSS</span>
                 </div>
                 <p className="text-[11px] text-slate-400 mb-4 font-medium leading-relaxed">Override variables for brand-specific styling.</p>
                 <textarea className="w-full bg-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-300 outline-none border border-slate-700 min-h-[100px]" placeholder=":root { --primary: #000; }"/>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}

function Button({ children, variant, className }) {
  const styles = variant === 'outline' ? 'border hover:bg-slate-50' : 'hover:opacity-90'
  return <button className={`${styles} transition-all ${className}`}>{children}</button>
}