
import { useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FileBrowser } from "@/components/FileBrowser";
import { MarkerControls } from "@/components/MarkerControls";
import { LocalAudioLoader } from "@/components/LocalAudioLoader";
import { useAudio } from "@/hooks/useAudio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { settings } = useSettings();
  
  const {
    audioFiles,
    isLoading,
    markers,
    addMarker,
    removeMarker,
    exportTrimmedAudio,
    loadAudioFile,
    loadFilesFromUNC,
    formatTime,
    formatTimeDetailed,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    changeVolume,
    currentAudioFile,
    isBuffering,
    showMarkerControls,
    setShowMarkerControls,
    isExporting,
    exportProgress
  } = useAudio();

  const handleFileSelect = (file) => {
    setShowMarkerControls(false);
    loadAudioFile(file);
  };

  const handleSearch = (path, city, date, hour) => {
    setShowMarkerControls(false);
    loadFilesFromUNC(path, city, date, hour);
  };

  if (!settings) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading settings...</h2>
          <p>Retrieving settings from the server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="bg-background border-b py-4 px-6">
        <div>
          <h1 className="text-2xl font-bold">
            <span style={{ color: settings.buttonColors.primary }}>A</span>udio 
            <span style={{ color: settings.buttonColors.primary }}> M</span>arker 
            <span style={{ color: settings.buttonColors.primary }}> I</span>nterface
          </h1>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 overflow-hidden">
        <div className="md:col-span-1 h-full overflow-hidden">
          <Tabs defaultValue="browser" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="browser">Server</TabsTrigger>
              <TabsTrigger value="local">Local files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browser" className="flex-1 overflow-hidden">
              <FileBrowser
                files={audioFiles}
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                onPathChange={handleSearch}
              />
            </TabsContent>
            
            <TabsContent value="local" className="flex-1 overflow-hidden">
              <LocalAudioLoader onFileLoad={handleFileSelect} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 lg:col-span-3 flex flex-col space-y-4 h-full overflow-hidden">
          <div className="flex-1 min-h-0">
            <AudioPlayer
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              onPlayPause={togglePlay}
              onVolumeChange={changeVolume}
              onSeek={seek}
              formatTime={formatTime}
              audioTitle={currentAudioFile ? currentAudioFile.name : "No audio loaded"}
              isLoading={isLoading}
              isBuffering={isBuffering}
            />
          </div>

          <div className="h-fit">
            {currentAudioFile && !showMarkerControls && (
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={() => setShowMarkerControls(true)}
                  className="animate-fade-in"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Edit audio
                </Button>
              </div>
            )}
            
            {showMarkerControls && (
              <MarkerControls
                markers={markers}
                onAddMarker={addMarker}
                onExport={exportTrimmedAudio}
                currentTime={currentTime}
                formatTimeDetailed={formatTimeDetailed}
                isExporting={isExporting}
                exportProgress={exportProgress}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
