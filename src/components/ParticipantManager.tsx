
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Users, Mail, Phone, Upload, Download } from "lucide-react";
import { Participant } from "@/hooks/useGiveaway";
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { validateEmail, validatePhone, sanitizeText, validateExcelFile, validateParticipantData } from '@/utils/validation';

interface ParticipantManagerProps {
  participants: Participant[];
  onAddParticipant: (participant: Omit<Participant, 'id'>) => void;
  onDeleteParticipant: (participantId: string) => void;
}

export const ParticipantManager = ({ participants, onAddParticipant, onDeleteParticipant }: ParticipantManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize input
    const sanitizedData = {
      name: sanitizeText(formData.name, 100),
      email: sanitizeText(formData.email, 254),
      phone: sanitizeText(formData.phone, 20),
      address: sanitizeText(formData.address, 500)
    };
    
    if (!sanitizedData.name.trim()) {
      toast.error('Nama peserta harus diisi');
      return;
    }
    
    if (!validateEmail(sanitizedData.email)) {
      toast.error('Format email tidak valid');
      return;
    }
    
    if (sanitizedData.phone && !validatePhone(sanitizedData.phone)) {
      toast.error('Format nomor telepon tidak valid');
      return;
    }
    
    // Check for duplicate email
    if (participants.some(p => p.email.toLowerCase() === sanitizedData.email.toLowerCase())) {
      toast.error('Email sudah terdaftar');
      return;
    }
    
    onAddParticipant(sanitizedData);
    setFormData({ name: '', email: '', phone: '', address: '' });
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

        if (jsonData.length > 1000) {
          toast.error('Terlalu banyak data. Maksimal 1000 peserta per import');
          setIsImporting(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        jsonData.forEach((row: any, index) => {
          try {
            const participant = {
              name: sanitizeText(String(row.name || row.Name || row.NAMA || ''), 100),
              email: sanitizeText(String(row.email || row.Email || row.EMAIL || ''), 254),
              phone: sanitizeText(String(row.phone || row.Phone || row.PHONE || row.telepon || row.Telepon || ''), 20),
              address: sanitizeText(String(row.address || row.Address || row.ADDRESS || row.alamat || row.Alamat || ''), 500)
            };

            const validation = validateParticipantData(participant);
            if (!validation.isValid) {
              errorCount++;
              errors.push(`Baris ${index + 2}: ${validation.error}`);
              return;
            }

            // Check for duplicate email
            if (participants.some(p => p.email.toLowerCase() === participant.email.toLowerCase())) {
              errorCount++;
              errors.push(`Baris ${index + 2}: Email ${participant.email} sudah terdaftar`);
              return;
            }

            onAddParticipant(participant);
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push(`Baris ${index + 2}: Error tidak diketahui`);
          }
        });

        if (successCount > 0) {
          toast.success(`Berhasil mengimpor ${successCount} peserta`);
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
      { name: 'Contoh Nama', email: 'contoh@email.com', phone: '081234567890', address: 'Alamat lengkap' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Peserta');
    XLSX.writeFile(wb, 'template_peserta.xlsx');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manajemen Peserta
          </CardTitle>
          <CardDescription>Kelola peserta undian</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Peserta
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
                <CardTitle>Tambah Peserta Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="participant-name">Nama Lengkap</Label>
                    <Input
                      id="participant-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama lengkap"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participant-email">Email</Label>
                    <Input
                      id="participant-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Masukkan email"
                      maxLength={254}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participant-phone">Nomor Telepon</Label>
                    <Input
                      id="participant-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Masukkan nomor telepon"
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participant-address">Alamat</Label>
                    <Textarea
                      id="participant-address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Masukkan alamat"
                      maxLength={500}
                    />
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
            {participants.map((participant) => (
              <Card key={participant.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{participant.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {participant.email}
                  </div>
                  {participant.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {participant.phone}
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteParticipant(participant.id)}
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
