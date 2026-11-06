import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Wifi, 
  Globe, 
  Smartphone, 
  Laptop, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Radio,
  Share2
} from 'lucide-react';

interface NetworkInfo {
  port: number;
  host: string;
  localIps: { name: string; address: string; type: string }[];
  mobileUrls: { url: string; name: string; type: string; ip: string }[];
  cloudUrl: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'wifi' | 'cloud'>('wifi');
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [selectedIpIndex, setSelectedIpIndex] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNetworkInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/network-info');
      if (res.ok) {
        const data: NetworkInfo = await res.json();
        setNetworkInfo(data);
      }
    } catch (e) {
      console.error('Failed to fetch network info:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNetworkInfo();
    }
  }, [isOpen]);

  // Determine current active mobile URL
  const currentMobileUrl = networkInfo?.mobileUrls && networkInfo.mobileUrls.length > 0
    ? networkInfo.mobileUrls[selectedIpIndex]?.url || networkInfo.mobileUrls[0].url
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Generate QR Code when URL changes or tab changes
  useEffect(() => {
    const targetUrl = activeTab === 'wifi' ? currentMobileUrl : (networkInfo?.cloudUrl || window.location.origin);
    if (!targetUrl) return;

    QRCode.toDataURL(targetUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [activeTab, currentMobileUrl, networkInfo]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span>بەستنەوە و کردنەوە لەسەر مۆبایل</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                  هاوکاتکردنی ڕاستەوخۆ
                </span>
              </h2>
              <p className="text-[11px] text-blue-200 mt-0.5">
                سیستەمەکە لەسەر شاشەی مۆبایلەکەت بکەرەوە بەبێ پێویستی بە هیچ بەرنامەیەکی زیادە
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'wifi'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Wifi className="w-4 h-4 text-blue-600" />
            <span>لەسەر هەمان Wi-Fi یان Hotspot (ئۆفلاین و خێرا)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cloud'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>لەسەر وایفای جیاواز یان 4G (لە دوورەوە)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">

          {activeTab === 'wifi' && (
            <div className="space-y-5">
              
              {/* QR Code and Quick Scan */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="QR Code بۆ مۆبایل" 
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 font-medium mt-2 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>کامێرای مۆبایل ئاراستە بکە</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-right">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>لینکی ڕاستەوخۆ بۆ وێبگەڕی مۆبایل:</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      ئەم ناونیشانە لە براوزەری مۆبایلەکەت (Chrome یان Safari) بکەرەوە:
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-2 font-mono text-xs text-blue-900 font-bold" dir="ltr">
                    <span className="truncate flex-1 px-1">{currentMobileUrl}</span>
                    <button
                      onClick={() => handleCopy(currentMobileUrl)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-sans shrink-0 font-medium"
                      title="کۆپیکردن"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'کۆپیکرا' : 'کۆپیکردن'}</span>
                    </button>
                  </div>

                  {/* Multiple network adapters dropdown if present */}
                  {networkInfo?.mobileUrls && networkInfo.mobileUrls.length > 1 && (
                    <div className="pt-1">
                      <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                        هەڵبژاردنی هێڵی وایفای یان هۆتسپۆت:
                      </label>
                      <select
                        value={selectedIpIndex}
                        onChange={(e) => setSelectedIpIndex(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      >
                        {networkInfo.mobileUrls.map((item, idx) => (
                          <option key={idx} value={idx}>
                            {item.type} - {item.ip} ({item.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>هەموو شتێک بە شێوەی خۆکار هاوکات دەبێت!</span>
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-relaxed">
                      هەر کڕیار، گرێبەست یان وەسڵێک لە لاپتۆپ تۆمار بکەیت دەستبەجێ لە مۆبایلیش دەبینرێت و بەپێچەوانەشەوە.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <span>ڕێنمایی بەستنەوە بە ٣ هەنگاوی سادە:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-1">
                      ١
                    </div>
                    <div className="font-bold text-slate-900">هەمان Wi-Fi</div>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      مۆبایلەکەت و لاپتۆپەکەت لەسەر هەمان وایفای بن، یان لاپتۆپەکە بە هۆتسپۆتی مۆبایلەکەت ببەستەوە.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-1">
                      ٢
                    </div>
                    <div className="font-bold text-slate-900">سکانکردنی کۆد</div>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      کامێرای مۆبایلەکەت بگرە لەسەر QR کۆدی سەرەوە بۆ ئەوەی ڕاستەوخۆ پەڕەکە بکاتەوە.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-1">
                      ٣
                    </div>
                    <div className="font-bold text-slate-900">چوونەژوورەوە</div>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      بە هەمان یوزەرنەیم و وشەی نهێنی خۆت بچۆ ژوورەوە و لە مۆبایلەکەتەوە کار بکە.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-950 text-xs">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>کردنەوە لە ڕێگەی ئینتەرنێت لە هەر شوێنێک بیت (4G یان وایفای دەرەوە)</span>
                </div>
                <p className="text-[11px] text-indigo-900 leading-relaxed">
                  ئەگەر لە دەرەوەی دووکان بوویت و مۆبایلەکەت لەسەر وایفایەکی تر بوو یان لەسەر هێڵی 4G/5G بوو، دەتوانیت لە ڕێگەی لینکی وێبی گشتی سیستەمەکەت بکەیتەوە:
                </p>

                <div className="flex items-center gap-2 bg-white border border-indigo-300 rounded-xl p-2 font-mono text-xs text-indigo-950 font-bold" dir="ltr">
                  <span className="truncate flex-1 px-1">
                    {networkInfo?.cloudUrl || 'https://ais-pre-bp5soyigu44j656r4gxd7s-138408115845.europe-west1.run.app'}
                  </span>
                  <button
                    onClick={() => handleCopy(networkInfo?.cloudUrl || 'https://ais-pre-bp5soyigu44j656r4gxd7s-138408115845.europe-west1.run.app')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-sans shrink-0 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کۆپی</span>
                  </button>
                  <a
                    href={networkInfo?.cloudUrl || 'https://ais-pre-bp5soyigu44j656r4gxd7s-138408115845.europe-west1.run.app'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-sans shrink-0 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>کردنەوە</span>
                  </a>
                </div>
              </div>

              {/* Cloud Sync Information */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>هاوکاتکردنی داتاکان لە نێوان لاپتۆپ و مۆبایل بە Google Drive:</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  کاتێک لە بەشی ڕێکخستنەکان Google Drive چالاک دەکەیت، لەگەڵ تۆمارکردنی هەر قیست و گرێبەستێک بە ئۆتۆماتیکی لە درایڤەکەت دەمێنێتەوە، و دەتوانیت لەسەر مۆبایلەکەت بە یەک کلیک داتاکان بهێنیتەوە.
                </p>
              </div>

              {/* Local Tunnel info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-slate-800 text-xs">
                  دەتەوێت سێرڤەری لاپتۆپەکەت ڕاستەوخۆ بۆ هەموو جیهان ئۆنلاین بێت؟
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  دەتوانیت لە ناو فۆڵدەری پڕۆژەکەت لە لاپتۆپ لە CMD ئەم فەرمانە لێبدەیت:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-xs select-all text-left" dir="ltr">
                  npx localtunnel --port 3000
                </div>
                <p className="text-[10px] text-slate-500">
                  ئەم فەرمانە لینکێکی گشتی ئینتەرنێتت پێدەدات کە لەسەر هەر وایفایەک یان هێڵێکی 4G لە جیهاندا بێیت ڕاستەوخۆ دەتوانیت بچیتە سەر لاپتۆپەکەت.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>پۆرت 3000 کراوەیە و ئامادەیە بۆ وەرگرتنی پەیوەندی مۆبایل</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            داخستن
          </button>
        </div>

      </div>
    </div>
  );
};
