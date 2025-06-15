
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Users, Mail, Phone } from "lucide-react";
import { Participant } from "@/hooks/useGiveaway";

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
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Peserta
          </Button>

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
