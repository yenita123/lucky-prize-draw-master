
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Prize {
  id: string;
  name: string;
  description: string;
  quantity: number;
  image?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Winner {
  id: string;
  prizeId: string;
  participantId: string;
  drawDate: Date;
  notes?: string;
}

export const useGiveaway = () => {
  // Sample data
  const [prizes, setPrizes] = useState<Prize[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Smartphone terbaru Apple dengan teknologi Pro',
      quantity: 1
    },
    {
      id: '2',
      name: 'Laptop Gaming',
      description: 'Laptop gaming dengan spesifikasi tinggi',
      quantity: 1
    },
    {
      id: '3',
      name: 'Voucher Belanja 500K',
      description: 'Voucher belanja senilai 500 ribu rupiah',
      quantity: 5
    },
    {
      id: '4',
      name: 'Headphone Wireless',
      description: 'Headphone bluetooth premium',
      quantity: 3
    }
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Ahmad Rizki', email: 'ahmad.rizki@email.com', phone: '081234567890' },
    { id: '2', name: 'Siti Nurhaliza', email: 'siti.nur@email.com', phone: '081234567891' },
    { id: '3', name: 'Budi Santoso', email: 'budi.santoso@email.com', phone: '081234567892' },
    { id: '4', name: 'Dewi Lestari', email: 'dewi.lestari@email.com', phone: '081234567893' },
    { id: '5', name: 'Eko Prasetyo', email: 'eko.prasetyo@email.com', phone: '081234567894' },
    { id: '6', name: 'Fitri Handayani', email: 'fitri.handayani@email.com', phone: '081234567895' },
    { id: '7', name: 'Gunawan Sutrisno', email: 'gunawan.sutrisno@email.com', phone: '081234567896' },
    { id: '8', name: 'Hesti Purnamasari', email: 'hesti.purnamasari@email.com', phone: '081234567897' },
    { id: '9', name: 'Indra Wijaya', email: 'indra.wijaya@email.com', phone: '081234567898' },
    { id: '10', name: 'Joko Widodo', email: 'joko.widodo@email.com', phone: '081234567899' }
  ]);

  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null);
  const [winnerCount, setWinnerCount] = useState(1);

  const startDraw = useCallback(async () => {
    if (!selectedPrizeId) {
      toast.error('Pilih hadiah terlebih dahulu');
      return;
    }

    const selectedPrize = prizes.find(p => p.id === selectedPrizeId);
    if (!selectedPrize) {
      toast.error('Hadiah tidak ditemukan');
      return;
    }

    const availableParticipants = participants.filter(p => 
      !winners.some(w => w.participantId === p.id && w.prizeId === selectedPrizeId)
    );

    if (availableParticipants.length < winnerCount) {
      toast.error('Tidak cukup peserta yang tersedia');
      return;
    }

    if (selectedPrize.quantity < winnerCount) {
      toast.error('Kuantitas hadiah tidak mencukupi');
      return;
    }

    setIsDrawing(true);

    // Simulate drawing process with delay
    setTimeout(() => {
      // Randomly select winners
      const shuffled = [...availableParticipants].sort(() => 0.5 - Math.random());
      const selectedWinners = shuffled.slice(0, winnerCount);

      const newWinners: Winner[] = selectedWinners.map(participant => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        prizeId: selectedPrizeId,
        participantId: participant.id,
        drawDate: new Date(),
        notes: 'Undian otomatis'
      }));

      // Update winners
      setWinners(prev => [...prev, ...newWinners]);

      // Update prize quantity
      setPrizes(prev => prev.map(p => 
        p.id === selectedPrizeId 
          ? { ...p, quantity: p.quantity - winnerCount }
          : p
      ));

      setIsDrawing(false);
      
      const winnerNames = selectedWinners.map(w => w.name).join(', ');
      toast.success(`Selamat kepada pemenang: ${winnerNames}!`);
    }, 3000);
  }, [selectedPrizeId, winnerCount, prizes, participants, winners]);

  const addPrize = useCallback((prize: Omit<Prize, 'id'>) => {
    const newPrize: Prize = {
      ...prize,
      id: Date.now().toString()
    };
    setPrizes(prev => [...prev, newPrize]);
    toast.success('Hadiah berhasil ditambahkan');
  }, []);

  const deletePrize = useCallback((prizeId: string) => {
    setPrizes(prev => prev.filter(p => p.id !== prizeId));
    setWinners(prev => prev.filter(w => w.prizeId !== prizeId));
    toast.success('Hadiah berhasil dihapus');
  }, []);

  const addParticipant = useCallback((participant: Omit<Participant, 'id'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: Date.now().toString()
    };
    setParticipants(prev => [...prev, newParticipant]);
    toast.success('Peserta berhasil ditambahkan');
  }, []);

  const deleteParticipant = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setWinners(prev => prev.filter(w => w.participantId !== participantId));
    toast.success('Peserta berhasil dihapus');
  }, []);

  return {
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
  };
};
