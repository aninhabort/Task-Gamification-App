import React, { createContext, useContext, useState } from 'react';

interface Voucher {
  id: string;
  title: string;
  points: number;
  category: string;
  description: string;
}

interface FeaturedVouchersContextType {
  featuredVouchers: Voucher[];
  addToFeatured: (voucher: Voucher) => { success: boolean; message: string };
  removeFromFeatured: (voucherId: string) => void;
  isVoucherFeatured: (voucherId: string) => boolean;
}

const FeaturedVouchersContext = createContext<FeaturedVouchersContextType | undefined>(undefined);

export const FeaturedVouchersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featuredVouchers, setFeaturedVouchers] = useState<Voucher[]>([
    {
      id: "featured-1",
      title: "Mystery Box Especial",
      points: 1000,
      category: "Mystery Box",
      description: "Voucher aleatório (qualquer categoria) - Pode vir algo comum ou raro",
    },
    {
      id: "featured-2", 
      title: "Comprar 1 Livro",
      points: 300,
      category: "Educação",
      description: "Voucher para compra de um livro físico ou digital",
    },
    {
      id: "featured-3",
      title: "Spa Day",
      points: 500,
      category: "Self-Care",
      description: "Voucher de skincare, massagem, produto de beleza",
    },
    {
      id: "featured-4",
      title: "Curso Online Premium",
      points: 700,
      category: "Educação",
      description: "Ebook, curso curto, desconto em app de estudo",
    },
  ]);

  const addToFeatured = (voucher: Voucher) => {
    const isAlreadyFeatured = featuredVouchers.some(fv => 
      fv.title === voucher.title && fv.category === voucher.category
    );
    
    if (isAlreadyFeatured) {
      return { success: false, message: "This voucher is already in the Featured section!" };
    }

    // Limit featured vouchers to 6
    if (featuredVouchers.length >= 6) {
      return { 
        success: false, 
        message: "Featured Limit Reached. You can only have 6 featured vouchers. Remove one first to add a new one."
      };
    }

    // Criar um novo ID único para evitar conflitos
    const uniqueId = `featured-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const featuredVoucher = { ...voucher, id: uniqueId };
    
    setFeaturedVouchers(prev => [...prev, featuredVoucher]);
    
    return { success: true, message: `"${voucher.title}" has been added to the Featured section.` };
  };

  const removeFromFeatured = (voucherId: string) => {
    setFeaturedVouchers(prev => prev.filter(v => v.id !== voucherId));
  };

  const isVoucherFeatured = (voucherId: string) => {
    return featuredVouchers.some(fv => fv.id === voucherId || fv.id === `featured-${voucherId}`);
  };

  return (
    <FeaturedVouchersContext.Provider value={{
      featuredVouchers,
      addToFeatured,
      removeFromFeatured,
      isVoucherFeatured
    }}>
      {children}
    </FeaturedVouchersContext.Provider>
  );
};

export const useFeaturedVouchers = () => {
  const context = useContext(FeaturedVouchersContext);
  if (context === undefined) {
    throw new Error('useFeaturedVouchers must be used within a FeaturedVouchersProvider');
  }
  return context;
};