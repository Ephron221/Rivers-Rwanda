const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://172.31.239.130:5000';

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

export const parseImages = (imagesData: any): string[] => {
  if (!imagesData) return [];
  try {
    const parsed = typeof imagesData === 'string' ? JSON.parse(imagesData) : imagesData;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const parseFeatures = (featuresData: any): string[] => {
  if (!featuresData) return [];
  try {
    const parsed = typeof featuresData === 'string' ? JSON.parse(featuresData) : featuresData;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null) return 'N/A';
  return `Rwf ${Number(amount).toLocaleString()}`;
};

export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

export const getBookingStatusColor = (status: string): { bg: string; text: string } => {
  switch (status) {
    case 'confirmed':
    case 'approved':
    case 'completed':
      return { bg: '#dcfce7', text: '#16a34a' };
    case 'pending':
      return { bg: '#fff7ed', text: '#d97706' };
    case 'cancelled':
    case 'rejected':
      return { bg: '#fee2e2', text: '#dc2626' };
    default:
      return { bg: '#dbeafe', text: '#2563eb' };
  }
};

export const getAccommodationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    hotel_room: 'Hotel Room',
    event_hall: 'Event Hall',
  };
  return labels[type] || type;
};

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
