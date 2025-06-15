
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Gift, Upload, Download } from "lucide-react";
import { Prize } from "@/hooks/useGiveaway";
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { sanitizeText, validateImageFile, validateExcelFile, validatePrizeData } from '@/utils/validation';

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
  const [isImporting, setIsImporting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'File gambar tidak valid');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target?.result as string }));
    };
    reader.onerror = () => {
      toast.error('Gagal membaca file gambar');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize input
    const sanitizedData = {
      name: sanitizeText(formData.name, 100),
      description: sanitizeText(formData.description, 500),
      quantity: Math.max(1, Math.min(1000, formData.quantity)),
      image: formData.image
    };
    
    if (!sanitizedData.name.trim()) {
      toast.error('Nama hadiah harus diisi');
      return;
    }
    
    // Check for duplicate prize name
    if (prizes.some(p => p.name.toLowerCase() === sanitizedData.name.toLowerCase())) {
      toast.error('Nama hadiah sudah ada');
      return;
    }
    
    onAddPrize(sanitizedData);
    setFormData({ name: '', description: '', quantity: 1, image: '' });
    setShowAddForm(false);
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const fileValidation = validateExcelFile(file);
    if (!fileValidation.isValid) {
      toast.error(fileValidation.error || 'File tidak valid');
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('File Excel kosong');
          setIsImporting(false);
          return;
        }

        if (jsonData.length > 500) {
          toast.error('Terlalu banyak data. Maksimal 500 hadiah per import');
          setIsImporting(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        jsonData.forEach((row: any, index) => {
          try {
            const prize = {
              name: sanitizeText(String(row.name || row.Name || row.NAMA || ''), 100),
              description: sanitizeText(String(row.description || row.Description || row.DESKRIPSI || row.deskripsi || ''), 500),
              quantity: Math.max(1, Math.min(1000, parseInt(row.quantity || row.Quantity || row.JUMLAH || row.jumlah || '1') || 1)),
              image: sanitizeText(String(row.image || row.Image || row.GAMBAR || row.gambar || ''), 2048)
            };

            const validation = validatePrizeData(prize);
            if (!validation.isValid) {
              errorCount++;
              errors.push(`Baris ${index + 2}: ${validation.error}`);
              return;
            }

            // Check for duplicate prize name
            if (prizes.some(p => p.name.toLowerCase() === prize.name.toLowerCase())) {
              errorCount++;
              errors.push(`Baris ${index + 2}: Hadiah ${prize.name} sudah ada`);
              return;
            }

            onAddPrize(prize);
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push(`Baris ${index + 2}: Error tidak diketahui`);
          }
        });

        if (successCount > 0) {
          toast.success(`Berhasil mengimpor ${successCount} hadiah`);
        }
        
        if (errorCount > 0) {
          toast.error(`${errorCount} data gagal diimpor. Periksa format data.`);
          console.error('Import errors:', errors.slice(0, 10)); // Log first 10 errors
        }
      } catch (error) {
        console.error('Error importing Excel file:', error);
        toast.error('Gagal mengimpor file Excel. Pastikan format file benar.');
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      toast.error('Gagal membaca file');
      setIsImporting(false);
    };
    
    reader.readAsArrayBuffer(file);
    
    // Reset input
    e.target.value = '';
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
              <Button variant="outline" asChild disabled={isImporting}>
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {isImporting ? 'Mengimpor...' : 'Import Excel'}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isImporting}
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
                      maxLength={100}
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
                      maxLength={500}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize-quantity">Jumlah</Label>
                    <Input
                      id="prize-quantity"
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize-image">Gambar Hadiah</Label>
                    <Input
                      id="prize-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">Maksimal 5MB. Format: JPEG, PNG, GIF, WebP</p>
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
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
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
