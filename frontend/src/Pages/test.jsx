<Card>
<CardHeader>
  <CardTitle className="flex items-center gap-2">
    <Settings className="w-5 h-5 text-blue-600" />
    Voice Settings
  </CardTitle>
</CardHeader>
<CardContent className="space-y-6">
  {/* Previous settings content... */}
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Voice Selection</label>
    <select
      value={selectedVoice}
      onChange={(e) => setSelectedVoice(e.target.value)}
      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {voiceList.map((voice, index) => (
        <option key={index} value={voice.name}>
          {voice.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Speed: {speed}x</label>
    <input
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={speed}
      onChange={(e) => setSpeed(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Pitch: {pitch}</label>
    <input
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={pitch}
      onChange={(e) => setPitch(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-slate-600" />
        Volume: {volume}
      </div>
    </label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
</CardContent>
</Card>