import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PaymentRecord, Contract, ShopSettings } from '../types/index.ts';
import { formatCurrency } from '../utils/calculations.ts';

interface Props {
  payment: PaymentRecord;
  contract?: Contract;
  settings: ShopSettings;
  paperSize?: 'a5' | 'thermal80';
}

export const ReceiptDocument: React.FC<Props> = ({ 
  payment, 
  contract, 
  settings,
  paperSize = 'a5'
}) => {
  const isThermal = paperSize === 'thermal80';
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const text = `وەسڵی #${payment.receiptNumber} | ${settings.shopName} | کڕیار: ${payment.customerName} | بڕ: ${payment.amount} IQD | بەروار: ${payment.date}`;
    QRCode.toDataURL(text, { width: 90, margin: 1, errorCorrectionLevel: 'M' }, (err, url) => {
      if (!err && url) {
        setQrCodeUrl(url);
      }
    });
  }, [payment, settings.shopName]);

  return (
    <div 
      className={`printable-receipt ${isThermal ? 'thermal-80mm max-w-[76mm] text-[10px]' : 'max-w-[148mm] text-[11px]'} bg-white text-slate-900 text-right p-4 border-2 border-slate-900 rounded mx-auto leading-normal shadow-sm`}
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-2 mb-2">
        <h2 className={`${isThermal ? 'text-sm' : 'text-base'} font-black text-slate-950`}>
          {settings.shopName}
        </h2>
        <p className="text-[10px] text-slate-600 font-medium">وەسڵی فەرمی وەرگرتنی پارەی قیست</p>
        <div className="flex justify-between items-center text-[9px] font-mono mt-1 text-slate-700">
          <span>ژ. وەسڵ: <strong>{payment.receiptNumber}</strong></span>
          <span>بەروار: <strong>{payment.date}</strong></span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 border border-slate-300 p-2 rounded mb-2 bg-slate-50/50 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-600">ناوی کڕیار:</span>
          <strong className="text-slate-950 font-bold">{payment.customerName}</strong>
        </div>

        {contract && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-600">مۆبایل:</span>
              <span>{contract.device.model} ({contract.device.storage})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">ژ. گرێبەست:</span>
              <span className="font-mono">{contract.contractNumber}</span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-slate-600">شێوازی پارەدان:</span>
          <span>
            {payment.paymentMethod === 'cash' && 'کاش / دەستی'}
            {payment.paymentMethod === 'bank_transfer' && 'حەواڵەی بانکی'}
            {payment.paymentMethod === 'fib' && 'First Iraqi Bank (FIB)'}
            {payment.paymentMethod === 'fastpay' && 'فاستپەی (FastPay)'}
          </span>
        </div>

        {payment.isEarlyPayoff ? (
          <div className="bg-emerald-50 text-emerald-900 font-bold p-1 rounded text-center text-[9.5px] border border-emerald-300">
            ⚡ پارەدانی پێشوەختە و یەکلاییکردنەوەی تەواوی قەرز
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="text-slate-600">بەرامبەر قیستی ژمارە:</span>
            <strong className="font-mono">#{payment.installmentNumbers.join('، #')}</strong>
          </div>
        )}
      </div>

      {/* Financial Numbers */}
      <div className="border-2 border-slate-900 p-2 rounded text-center mb-2 bg-slate-100/70">
        <div className="text-[10px] text-slate-600 font-medium">بڕی پارەی وەرگیراو</div>
        <div className={`${isThermal ? 'text-base' : 'text-lg'} font-black text-slate-950 font-mono tracking-wide`}>
          {formatCurrency(payment.amount)}
        </div>
        <div className="text-[9.5px] text-slate-600 border-t border-slate-300 mt-1 pt-1 flex justify-between px-1">
          <span>قەرزی ماوە لای کڕیار:</span>
          <strong className="font-mono text-red-900">{formatCurrency(payment.remainingBalanceAfter)}</strong>
        </div>
      </div>

      {payment.notes && (
        <div className="text-[9px] text-slate-600 mb-2 italic">
          تێبینی: {payment.notes}
        </div>
      )}

      {/* QR Code and Verification */}
      {qrCodeUrl && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-2 mb-2">
          <img src={qrCodeUrl} alt="Receipt QR" className="w-14 h-14 border border-slate-200 rounded p-0.5" />
          <div className="text-left text-[8.5px] text-slate-500 font-mono" dir="ltr">
            <div>RECEIPT VERIFIED</div>
            <div className="font-bold text-slate-700">{payment.receiptNumber}</div>
            <div>{payment.date}</div>
          </div>
        </div>
      )}

      {/* Signature & Stamp */}
      <div className="grid grid-cols-2 gap-2 text-center text-[9px] border-t border-slate-300 pt-2 mt-2">
        <div>
          <div className="text-slate-700">واژووی کڕیار</div>
          <div className="mt-4 border-b border-dotted border-slate-400"></div>
        </div>
        <div>
          <div className="text-slate-700 font-medium">مۆر و واژووی وەرگر ({payment.collectedBy?.userName || settings.sellerName})</div>
          <div className="mt-4 border-b border-dotted border-slate-400"></div>
        </div>
      </div>

      <div className="text-center text-[8px] text-slate-500 mt-2">
        {settings.phone} {settings.address ? `· ${settings.address}` : ''}
      </div>
    </div>
  );
};
