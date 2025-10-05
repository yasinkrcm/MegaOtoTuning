export default function OrderStatus({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'iletildi':
        return 'bg-purple-100 text-purple-800';
      case 'hazırlanıyor':
        return 'bg-blue-100 text-blue-800';
      case 'kargoya verildi':
        return 'bg-yellow-100 text-yellow-800';
      case 'ulaştı':
        return 'bg-green-100 text-green-800';
      case 'iptal edildi':
        return 'bg-red-100 text-red-800';
      case 'ödeme-bekliyor':
        return 'bg-orange-100 text-orange-800';
      // Legacy status support
      case 'Hazırlanıyor':
        return 'bg-blue-100 text-blue-800';
      case 'Kargoya verildi':
        return 'bg-yellow-100 text-yellow-800';
      case 'Teslim edildi':
        return 'bg-green-100 text-green-800';
      case 'İptal edildi':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
}
