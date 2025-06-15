import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Users, Mail, Phone, Upload, Download } from "lucide-react";
import { Participant } from "@/hooks/useGiveaway";
import * as XLSX from 'xlsx';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    onAddParticipant(formData);
    setFormData({ name: '', email: '', phone: '', address: '' });
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
            const participant = {
              name: row.name || row.Name || row.NAMA || '',
              email: row.email || row.Email || row.EMAIL || '',
              phone: row.phone || row.Phone || row.PHONE || row.telepon || row.Telepon || '',
              address: row.address || row.Address || row.ADDRESS || row.alamat || row.Alamat || ''
            };
            if (participant.name.trim() && participant.email.trim()) {
              onAddParticipant(participant);
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participant-address">Alamat</Label>
                    <Textarea
                      id="participant-address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Masukkan alamat"
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
