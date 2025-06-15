
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Gift, User } from "lucide-react";
import { Winner, Prize, Participant } from "@/hooks/useGiveaway";

interface WinnerHistoryProps {
  winners: Winner[];
  prizes: Prize[];
  participants: Participant[];
}

export const WinnerHistory = ({ winners, prizes, participants }: WinnerHistoryProps) => {
  const getWinnerDetails = (winner: Winner) => {
    const prize = prizes.find(p => p.id === winner.prizeId);
    const participant = participants.find(p => p.id === winner.participantId);
    return { prize, participant };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Riwayat Pemenang
        </CardTitle>
        <CardDescription>
          Daftar semua pemenang undian ({winners.length} pemenang)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {winners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Belum ada pemenang</p>
            <p className="text-sm">Mulai undian untuk melihat pemenang di sini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner) => {
              const { prize, participant } = getWinnerDetails(winner);
              return (
                <Card key={winner.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">{participant?.name || 'Peserta tidak ditemukan'}</span>
                          <Badge variant="secondary">Pemenang</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Gift className="w-4 h-4" />
                          <span>{prize?.name || 'Hadiah tidak ditemukan'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{winner.drawDate.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        {winner.notes && (
                          <p className="text-sm text-gray-500 italic">{winner.notes}</p>
                        )}
                      </div>
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
