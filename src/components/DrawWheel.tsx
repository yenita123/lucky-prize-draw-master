
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";

interface DrawWheelProps {
  isDrawing: boolean;
}

export const DrawWheel = ({ isDrawing }: DrawWheelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roda Undian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
          {isDrawing ? (
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700">Sedang Mengundi...</p>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700">Siap untuk Undian</p>
              <p className="text-sm text-gray-500">Pilih hadiah dan mulai undian</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
