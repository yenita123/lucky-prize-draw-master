
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Gift, User, Download } from "lucide-react";
import { Winner, Prize, Participant } from "@/hooks/useGiveaway";
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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

  const exportToExcel = () => {
    try {
      if (winners.length === 0) {
        toast.error('Tidak ada data pemenang untuk diekspor');
        return;
      }

      const exportData = winners.map(winner => {
        const { prize, participant } = getWinnerDetails(winner);
        return {
          'Nama Pemenang': participant?.name || 'Tidak ditemukan',
          'Email': participant?.email || '',
          'Telepon': participant?.phone || '',
          'Alamat': participant?.address || '',
          'Hadiah': prize?.name || 'Tidak ditemukan',
          'Deskripsi Hadiah': prize?.description || '',
          'Tanggal Undian': winner.drawDate.toLocaleDateString('id-ID'),
          'Waktu Undian': winner.drawDate.toLocaleTimeString('id-ID'),
          'Catatan': winner.notes || ''
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Pemenang');
      
      // Auto-size columns
      const colWidths = Object.keys(exportData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      ws['!cols'] = colWidths;
      
      const fileName = `pemenang_undian_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Data pemenang berhasil diekspor');
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      toast.error('Gagal mengekspor data. Silakan coba lagi.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Riwayat Pemenang
            </CardTitle>
            <CardDescription>
              Daftar semua pemenang undian ({winners.length} pemenang)
            </CardDescription>
          </div>
          {winners.length > 0 && (
            <Button onClick={exportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          )}
        </div>
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
