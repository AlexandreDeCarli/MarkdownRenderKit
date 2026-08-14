import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, QrCode, ExternalLink, X, Heart } from "lucide-react";

/**
 * Floating Support Widget (PIX + Buy Me a Coffee)
 * Componente flutuante no canto inferior direito que permite apoiar via PIX (QR Code e chave) ou Buy Me a Coffee.
 */
export default function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pix"); // 'pix' | 'bmc'
  const [copiedPix, setCopiedPix] = useState(false);
  const widgetRef = useRef(null);

  const PIX_KEY = "29c45fd6-e6e0-4708-9b49-3b049cde040f";

  // Fecha o popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2200);
    } catch (err) {
      console.error("Erro ao copiar chave PIX", err);
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-5 right-5 z-40 font-sans select-none">
      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] max-h-[85vh] overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.22)] backdrop-blur-xl animate-modal-scale-in">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-amber-400 rounded-t-3xl" />

          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-sm">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-outfit text-slate-900 leading-tight">Apoie o Projeto</h3>
                <p className="text-[11px] font-medium text-slate-500">Vaaaaleeeeuuu demaaais! ☕✨</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-full border border-slate-100 bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Segmented Control / Tabs */}
          <div className="mt-3.5 flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab("pix")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "pix"
                  ? "bg-white text-teal-900 shadow-xs border border-teal-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg viewBox="0 0 512 512" fill="currentColor" className="h-3.5 w-3.5 text-[#00bdae]">
                <path d="M112.5 124.7c19.3-19.3 50.7-19.3 70 0l47.5 47.5c7.8 7.8 20.5 7.8 28.3 0l47.5-47.5c19.3-19.3 50.7-19.3 70 0l23.5 23.5c19.3 19.3 19.3 50.7 0 70l-47.5 47.5c-7.8 7.8-7.8 20.5 0 28.3l47.5 47.5c19.3 19.3 19.3 50.7 0 70l-23.5 23.5c-19.3 19.3-50.7 19.3-70 0l-47.5-47.5c-7.8-7.8-20.5-7.8-28.3 0l-47.5 47.5c-19.3 19.3-50.7 19.3-70 0l-23.5-23.5c-19.3-19.3-19.3-50.7 0-70l47.5-47.5c7.8-7.8 7.8-20.5 0-28.3l-47.5-47.5c-19.3-19.3-19.3-50.7 0-70l23.5-23.5z"/>
              </svg>
              <span>PIX (Brasil)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bmc")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "bmc"
                  ? "bg-white text-slate-900 shadow-xs border border-amber-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-[#e6c200]">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                <line x1="6" x2="14" y1="2" y2="2" />
              </svg>
              <span>Buy Me a Coffee</span>
            </button>
          </div>

          {/* Tab Content: PIX */}
          {activeTab === "pix" && (
            <div className="mt-3.5 flex flex-col items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 font-outfit">
                <QrCode className="h-3.5 w-3.5 text-teal-600" />
                <span>Escaneie o QR Code no seu banco</span>
              </div>

              {/* QR Code Frame */}
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                <img
                  src="/pix-qrcode.png"
                  alt="QR Code PIX - Alexandre De Carli"
                  className="w-44 h-44 rounded-lg object-contain select-none"
                  loading="eager"
                />
              </div>

              {/* Chave PIX Container */}
              <div className="w-full space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                  Chave aleatória (copia e cola):
                </span>
                <div className="flex items-center gap-2 p-1.5 pl-3 bg-slate-50 rounded-xl border border-slate-200/80 shadow-inner">
                  <span className="font-mono text-[11px] text-slate-700 truncate select-all flex-1" title={PIX_KEY}>
                    {PIX_KEY}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
                      copiedPix
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                    title="Copiar chave PIX"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-200" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Qualquer contribuição apoia o desenvolvimento contínuo do projeto. Muito obrigado! 💙
              </p>
            </div>
          )}

          {/* Tab Content: Buy Me a Coffee */}
          {activeTab === "bmc" && (
            <div className="mt-3.5 flex flex-col items-center gap-3.5 py-2 animate-fade-in">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 text-[#e6c200] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" x2="14" y1="2" y2="2" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-outfit text-sm font-bold text-slate-900">Apoio Internacional</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                  Pague com cartão de crédito internacional, Apple Pay, Google Pay ou PayPal via Buy Me a Coffee.
                </p>
              </div>

              <a
                href="https://www.buymeacoffee.com/AlexandreDeCarli"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5F7FFF] hover:bg-[#4d6feb] text-white px-4 py-3 text-xs font-bold shadow-md shadow-[#5F7FFF]/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" x2="14" y1="2" y2="2" />
                </svg>
                <span>Acessar Buy Me a Coffee</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        id="btn-floating-support"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 rounded-full bg-slate-900/95 hover:bg-slate-950 text-white px-4 py-2.5 text-xs font-bold shadow-[0_10px_30px_-5px_rgba(15,23,42,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(15,23,42,0.45)] border border-white/10 backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Apoiar o projeto via PIX ou Buy Me a Coffee"
      >
        <div className="flex items-center -space-x-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] shadow-sm">
            ☕
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00bdae] text-white shadow-sm p-1">
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
              <path d="M112.5 124.7c19.3-19.3 50.7-19.3 70 0l47.5 47.5c7.8 7.8 20.5 7.8 28.3 0l47.5-47.5c19.3-19.3 50.7-19.3 70 0l23.5 23.5c19.3 19.3 19.3 50.7 0 70l-47.5 47.5c-7.8 7.8-7.8 20.5 0 28.3l47.5 47.5c19.3 19.3 19.3 50.7 0 70l-23.5 23.5c-19.3 19.3-50.7 19.3-70 0l-47.5-47.5c-7.8-7.8-20.5-7.8-28.3 0l-47.5 47.5c-19.3 19.3-50.7 19.3-70 0l-23.5-23.5c-19.3-19.3-19.3-50.7 0-70l47.5-47.5c7.8-7.8 7.8-20.5 0-28.3l-47.5-47.5c-19.3-19.3-19.3-50.7 0-70l23.5-23.5z"/>
            </svg>
          </span>
        </div>

        <span className="font-outfit tracking-tight">Support / Apoiar</span>

        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    </div>
  );
}
