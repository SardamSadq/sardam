import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone, Laptop, Check } from 'lucide-react';

export const SafariInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'mac' | 'other'>('other');

  useEffect(() => {
    // Check if already running in standalone mode (already installed as app)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return; // Already running as installed app!
    }

    // Check if user previously dismissed banner
    const dismissed = sessionStorage.getItem('sarvan_safari_guide_dismissed');
    if (dismissed) {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMacSafari = /macintosh/.test(ua) && /safari/.test(ua) && !/chrome|chromium|edg/.test(ua);

    if (isIOS) {
      setDeviceType('ios');
      setShowBanner(true);
    } else if (isMacSafari) {
      setDeviceType('mac');
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('sarvan_safari_guide_dismissed', 'true');
  };

  return (
    <div 
      className="no-print fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-50 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-blue-500/40 backdrop-blur-md animate-in slide-in-from-bottom duration-300"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
          {deviceType === 'ios' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
          <span>چۆن بیکەیتە ئەپ تا سەفاری نەکرێتەوە؟</span>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          title="داخستن"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-[11px] text-slate-300 space-y-2 mt-2 leading-relaxed">
        {deviceType === 'ios' ? (
          <>
            <p className="text-slate-200 font-medium">
              بۆ ئەوەی وەک ئەپێکی ڕاستەقینە لەسەر شاشەت دابمەزرێت و بەبێ سەفاری بکرێتەوە:
            </p>
            <ol className="space-y-1.5 pr-3 list-decimal text-slate-300 text-[10.5px]">
              <li className="flex items-center gap-1.5">
                <span>١. لە خوارەوەی سەفاری دەست لە دوگمەی</span>
                <span className="inline-flex items-center gap-0.5 bg-blue-600/40 text-blue-300 px-1.5 py-0.5 rounded font-bold">
                  <Share className="w-3 h-3" /> بەشکردن (Share)
                </span>
                <span>بدە.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>٢. وەرە خوارەوە و هەڵبژێرە:</span>
                <span className="inline-flex items-center gap-0.5 bg-emerald-600/40 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  <PlusSquare className="w-3 h-3" /> Add to Home Screen
                </span>
              </li>
              <li>
                <span>٣. لە سەرەوە کلیک لە <strong>Add</strong> بکە.</span>
              </li>
            </ol>
            <p className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30">
              ✓ دەستبەجێ ئایکۆنی ئەپەکە دەچێتە سەر شاشەت و بە دەست لێدان ڕاستەوخۆ دەبێتە ئەپ بەبێ سەفاری!
            </p>
          </>
        ) : (
          <>
            <p className="text-slate-200 font-medium">
              بۆ ئەوەی لەسەر مەک وەک ئەپێکی سەربەخۆ دابمەزرێت:
            </p>
            <ol className="space-y-1 pr-3 list-decimal text-slate-300 text-[10.5px]">
              <li>لە مێنۆی سەرەوەی سەفاری بڕۆ سەر <strong>File (پەڕگە)</strong>.</li>
              <li>کلیک لە <strong>Add to Dock (زیادکردن بۆ دۆک)</strong> بکە.</li>
            </ol>
          </>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleDismiss}
          className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
        >
          تێگەیشتم
        </button>
      </div>
    </div>
  );
};
