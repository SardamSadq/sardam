import React, { useState, useEffect } from 'react';
import { X, Printer, ArrowLeft, CheckCircle2, Sliders } from 'lucide-react';
import { LegalContractDocument } from './LegalContractDocument.tsx';
import { BankAuthorizationDocument } from './BankAuthorizationDocument.tsx';
import { ReceiptDocument } from './ReceiptDocument.tsx';
import { Contract, Customer, PaymentRecord, ShopSettings } from '../types/index.ts';

export type PrintMode = 'legal' | 'bank' | 'receipt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: PrintMode;
  contract?: Contract | null;
  customer?: Customer | null;
  payment?: PaymentRecord | null;
  settings: ShopSettings;
  autoPrint?: boolean;
}

export const PrintPreviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  contract,
  customer,
  payment,
  settings,
  autoPrint = false,
}) => {
  const [paperSize, setPaperSize] = useState<'a5' | 'thermal80'>(() => {
    return (localStorage.getItem('sarvan_receipt_format') as any) || 'a5';
  });

  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);

  useEffect(() => {
    if (isOpen && autoPrint && !hasAutoPrinted) {
      setHasAutoPrinted(true);
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      setHasAutoPrinted(false);
    }
  }, [isOpen, autoPrint, hasAutoPrinted]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handlePaperSizeChange = (size: 'a5' | 'thermal80') => {
    setPaperSize(size);
    localStorage.setItem('sarvan_receipt_format', size);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6" dir="rtl">
      
      {/* Top Bar for Action (Hidden on Print) */}
      <div className="no-print w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="گەڕانەوە"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              {mode === 'legal' && 'گرێبەست و کۆمپیالەی فرۆشتنی مۆبایل بە قیست (A4)'}
              {mode === 'bank' && 'فۆرمی ڕەزامەندی بانکی و وەرگرتنی مووچە (A4)'}
              {mode === 'receipt' && 'وەسڵی فەرمی پارەدانی قیست'}
              {autoPrint && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  چاپکردنی دەستبەجێ بە پرینتەری LAN
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ئامادەکراو بۆ پرینتکردنی دەستبەجێ لەسەر پرینتەری لوکاڵ بە کیبڵی LAN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'receipt' && (
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => handlePaperSizeChange('a5')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  paperSize === 'a5' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                A5 ستاندارد
              </button>
              <button
                type="button"
                onClick={() => handlePaperSizeChange('thermal80')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  paperSize === 'thermal80' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                حەراری 80mm POS
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>دووبارە چاپکردن (Print)</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
            title="داخستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Auto-print Banner Notification (Hidden on Print) */}
      {autoPrint && (
        <div className="no-print w-full max-w-4xl mb-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>فەرمانی چاپکردنی وەسڵ ڕاستەوخۆ نێردرا بۆ پرینتەری LAN. پەنجەرەی پرینتەر دەستبەجێ کرایەوە.</span>
          </div>
          <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-300 font-mono">
            Direct LAN Print
          </span>
        </div>
      )}

      {/* Document Viewport */}
      <div className="w-full max-w-[215mm] bg-white text-slate-900 shadow-2xl rounded-sm print:rounded-none print:shadow-none print:p-0 my-auto">
        {mode === 'legal' && contract && (
          <LegalContractDocument
            contract={contract}
            customer={customer || undefined}
            settings={settings}
          />
        )}

        {mode === 'bank' && contract && (
          <BankAuthorizationDocument
            contract={contract}
            customer={customer || undefined}
            settings={settings}
          />
        )}

        {mode === 'receipt' && payment && (
          <div className="p-4">
            <ReceiptDocument
              payment={payment}
              contract={contract || undefined}
              settings={settings}
              paperSize={paperSize}
            />
          </div>
        )}
      </div>

    </div>
  );
};
