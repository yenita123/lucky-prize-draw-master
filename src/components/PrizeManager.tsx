import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Gift, Upload, Download } from "lucide-react";
import { Prize } from "@/hooks/useGiveaway";
import * as XLSX from 'xlsx';

interface PrizeManagerProps {
  prizes: Prize[];
  onAddPrize: (prize: Omit<Prize, 'id'>) => void;
  onDeletePrize: (prizeId: string) => void;
}

export const PrizeManager = ({ prizes, onAddPrize, onDeletePrize }: PrizeManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    image: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onAddPrize(formData);
    setFormData({ name: '', description: '', quantity: 1, image: '' });
    setShowAddForm(false);
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((row: any) => {
          if (row.name || row.Name || row.NAMA) {
            const prize = {
              name: row.name || row.Name || row.NAMA || '',
              description: row.description || row.Description || row.DESKRIPSI || row.deskripsi || '',
              quantity: parseInt(row.quantity || row.Quantity || row.JUMLAH || row.jumlah || '1') || 1,
              image: row.image || row.Image || row.GAMBAR || row.gambar || ''
            };
            if (prize.name.trim()) {
              onAddPrize(prize);
            }
          }
        });
      } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Gagal mengimpor file Excel. Pastikan format file benar.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      { name: 'Contoh Hadiah', description: 'Deskripsi hadiah', quantity: 1, image: 'https://example.com/image.jpg' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Hadiah');
    XLSX.writeFile(wb, 'template_hadiah.xlsx');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Manajemen Hadiah
          </CardTitle>
          <CardDescription>Kelola hadiah untuk undian</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Hadiah
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Template Excel
            </Button>
            <div className="relative">
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tambah Hadiah Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prize-name">Nama Hadiah</Label>
                    <Input
                      id="prize-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama hadiah"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize-description">Deskripsi</Label>
                    <Textarea
                      id="prize-description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Masukkan deskripsi hadiah"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize-quantity">Jumlah</Label>
                    <Input
                      id="prize-quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize-image">Gambar Hadiah</Label>
                    <Input
                      id="prize-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Simpan</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prizes.map((prize) => (
              <Card key={prize.id}>
                <CardHeader>
                  {prize.image && (
                    <div className="mb-2">
                      <img 
                        src={prize.image} 
                        alt={prize.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <CardTitle className="text-lg">{prize.name}</CardTitle>
                  <CardDescription>{prize.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Tersisa: {prize.quantity}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePrize(prize.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
