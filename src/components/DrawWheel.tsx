
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, Crown } from "lucide-react";
import { Prize, Participant, Winner } from "@/hooks/useGiveaway";

interface DrawWheelProps {
  isDrawing: boolean;
  selectedPrize?: Prize;
  participants: Participant[];
  currentWinners: Winner[];
  prizes: Prize[];
}

export const DrawWheel = ({ isDrawing, selectedPrize, participants, currentWinners, prizes }: DrawWheelProps) => {
  const [spinningName, setSpinningName] = useState('');
  const [spinIndex, setSpinIndex] = useState(0);

  useEffect(() => {
    if (isDrawing && participants.length > 0) {
      const interval = setInterval(() => {
        setSpinIndex(prev => (prev + 1) % participants.length);
        setSpinningName(participants[spinIndex]?.name || '');
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isDrawing, participants, spinIndex]);

  const getWinnerDetails = (winner: Winner) => {
    const prize = prizes.find(p => p.id === winner.prizeId);
    const participant = participants.find(p => p.id === winner.participantId);
    return { prize, participant };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Roda Undian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg relative overflow-hidden">
            {selectedPrize?.image && (
              <div className="absolute top-4 right-4 z-10">
                <img 
                  src={selectedPrize.image} 
                  alt={selectedPrize.name}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-lg"
                />
              </div>
            )}
            
            {isDrawing ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-800 animate-pulse">
                    {spinningName}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">Sedang mengacak peserta...</p>
              </div>
            ) : (
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Siap untuk Undian</p>
                <p className="text-sm text-gray-500">
                  {selectedPrize ? `Hadiah: ${selectedPrize.name}` : 'Pilih hadiah dan mulai undian'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Pemenang Undian Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {currentWinners.map((winner) => {
                const { prize, participant } = getWinnerDetails(winner);
                return (
                  <div key={winner.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    {prize?.image && (
                      <img 
                        src={prize.image} 
                        alt={prize.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {participant?.name || 'Peserta tidak ditemukan'}
                      </h3>
                      <p className="text-gray-600">
                        Memenangkan: {prize?.name || 'Hadiah tidak ditemukan'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {winner.drawDate.toLocaleTimeString('id-ID')}
                      </p>
                    </div>
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
