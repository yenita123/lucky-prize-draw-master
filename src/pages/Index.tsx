
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Gift, Crown } from "lucide-react";
import { PrizeManager } from "@/components/PrizeManager";
import { ParticipantManager } from "@/components/ParticipantManager";
import { DrawWheel } from "@/components/DrawWheel";
import { WinnerHistory } from "@/components/WinnerHistory";
import { useGiveaway } from "@/hooks/useGiveaway";

const Index = () => {
  const {
    prizes,
    participants,
    winners,
    isDrawing,
    selectedPrizeId,
    winnerCount,
    setSelectedPrizeId,
    setWinnerCount,
    startDraw,
    addPrize,
    deletePrize,
    addParticipant,
    deleteParticipant
  } = useGiveaway();

  const [currentWinners, setCurrentWinners] = useState<typeof winners>([]);

  const selectedPrize = prizes.find(p => p.id === selectedPrizeId);
  const availableParticipants = participants.filter(p => 
    !winners.some(w => w.participantId === p.id && w.prizeId === selectedPrizeId)
  );

  const handleStartDraw = async () => {
    setCurrentWinners([]);
    const newWinners = await startDraw();
    if (newWinners) {
      setCurrentWinners(newWinners);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Crown className="text-yellow-500" />
            Aplikasi Undian Berhadiah
          </h1>
          <p className="text-gray-600">Kelola hadiah, peserta, dan lakukan undian dengan mudah</p>
        </header>

        <Tabs defaultValue="draw" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="draw" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Undian
            </TabsTrigger>
            <TabsTrigger value="prizes" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Hadiah
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Peserta
            </TabsTrigger>
            <TabsTrigger value="winners" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Pemenang
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Undian</CardTitle>
                  <CardDescription>Pilih hadiah dan jumlah pemenang</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prize-select">Pilih Hadiah</Label>
                    <Select value={selectedPrizeId || ""} onValueChange={setSelectedPrizeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih hadiah untuk diundi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prizes.filter(p => p.quantity > 0).map((prize) => (
                          <SelectItem key={prize.id} value={prize.id}>
                            {prize.name} (Tersisa: {prize.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="winner-count">Jumlah Pemenang</Label>
                    <Input
                      id="winner-count"
                      type="number"
                      min="1"
                      max={Math.min(selectedPrize?.quantity || 1, availableParticipants.length)}
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                      placeholder="Masukkan jumlah pemenang"
                    />
                  </div>

                  <Button 
                    onClick={handleStartDraw}
                    disabled={!selectedPrizeId || isDrawing || availableParticipants.length < winnerCount}
                    className="w-full"
                    size="lg"
                  >
                    {isDrawing ? "Sedang Mengundi..." : "Mulai Undian"}
                  </Button>

                  {selectedPrizeId && availableParticipants.length < winnerCount && (
                    <p className="text-sm text-red-500 text-center">
                      Peserta tersedia: {availableParticipants.length}, dibutuhkan: {winnerCount}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <DrawWheel 
                  isDrawing={isDrawing}
                  selectedPrize={selectedPrize}
                  participants={availableParticipants}
                  currentWinners={currentWinners}
                  prizes={prizes}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prizes">
            <PrizeManager 
              prizes={prizes}
              onAddPrize={addPrize}
              onDeletePrize={deletePrize}
            />
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantManager 
              participants={participants}
              onAddParticipant={addParticipant}
              onDeleteParticipant={deleteParticipant}
            />
          </TabsContent>

          <TabsContent value="winners">
            <WinnerHistory 
              winners={winners}
              prizes={prizes}
              participants={participants}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
