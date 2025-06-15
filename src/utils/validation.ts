
// Validation utilities for security enhancements

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
  return phoneRegex.test(phone);
};

export const sanitizeText = (text: string, maxLength: number = 255): string => {
  return text.trim().slice(0, maxLength).replace(/[<>]/g, '');
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' };
  }
  
  return { isValid: true };
};

export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung. Gunakan file Excel (.xlsx atau .xls).' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Ukuran file terlalu besar. Maksimal 10MB.' };
  }
  
  return { isValid: true };
};

export const validateParticipantData = (data: any): { isValid: boolean; error?: string } => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { isValid: false, error: 'Nama peserta harus diisi' };
  }
  
  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    return { isValid: false, error: 'Email tidak valid' };
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    return { isValid: false, error: 'Format nomor telepon tidak valid' };
  }
  
  return { isValid: true };
};

export const validatePrizeData = (data: any): { isValid: boolean; error?: string } => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { isValid: false, error: 'Nama hadiah harus diisi' };
  }
  
  const quantity = parseInt(data.quantity);
  if (isNaN(quantity) || quantity < 1 || quantity > 1000) {
    return { isValid: false, error: 'Jumlah hadiah harus antara 1-1000' };
  }
  
  return { isValid: true };
};
