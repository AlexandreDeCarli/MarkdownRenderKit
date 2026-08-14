import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, QrCode, ExternalLink, X, Heart, Coffee } from "lucide-react";

/**
 * Unified Floating Support Widget (PIX + Buy Me a Coffee)
 * Incorpora os mesmos controles interativos do widget oficial do Buy Me a Coffee (checkout ao vivo via iframe e QR Code)
 * juntamente com o PIX (QR Code e chave copiável).
 */
export default function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pix"); // 'pix' | 'bmc' | 'bmc-qr'
  const [copiedPix, setCopiedPix] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const widgetRef = useRef(null);

  const PIX_KEY = "29c45fd6-e6e0-4708-9b49-3b049cde040f";
  const BMC_ID = "alexandredecarli";
  const BMC_URL = `https://buymeacoffee.com/widget/page/${BMC_ID}?description=Support%20me%20on%20Buy%20me%20a%20coffee!&color=%235F7FFF`;

  // Controla a exibição inicial do balão de mensagem "Valeeeu demais!"
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

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
    <div ref={widgetRef} className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Floating Speech Bubble Tooltip ("Valeeeu demais!") */}
      {showBubble && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="absolute bottom-1 right-20 mb-1 mr-1 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.18)] border border-slate-200/80 cursor-pointer animate-fade-in whitespace-nowrap hover:bg-slate-50 transition-all active:scale-95"
        >
          <span className="text-sm">✨</span>
          <span>Valeeeu demais!</span>
          <div className="absolute -right-2 bottom-4 h-3 w-3 rotate-45 border-r border-t border-slate-200/80 bg-white" />
        </div>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div
          className={`absolute bottom-16 right-0 max-h-[85vh] rounded-3xl border border-slate-200/90 bg-white/95 shadow-[0_25px_65px_-12px_rgba(15,23,42,0.28)] backdrop-blur-xl animate-modal-scale-in flex flex-col overflow-hidden transition-all duration-300 ${
            activeTab === "bmc" ? "w-[360px] sm:w-[420px] h-[580px] sm:h-[620px]" : "w-[340px] sm:w-[390px] p-5"
          }`}
        >
          {/* Top Gradient Bar */}
          <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#00bdae] via-[#5F7FFF] to-amber-400" />

          {/* Popover Header */}
          <div className={`flex items-center justify-between border-b border-slate-100 ${activeTab === "bmc" ? "px-5 py-3.5 bg-slate-50/80" : "pb-3"}`}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5F7FFF] to-indigo-600 text-white shadow-sm">
                <Heart className="h-4 w-4 fill-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-outfit text-slate-900 leading-tight">Apoie o Projeto</h3>
                <p className="text-[11px] font-medium text-slate-500">Valeeeu demais! ☕✨</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-full border border-slate-200/80 bg-white p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 shadow-2xs"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Segmented Control / Tabs */}
          <div className={`${activeTab === "bmc" ? "px-5 pt-3 pb-2 bg-slate-50/50 border-b border-slate-100" : "mt-3.5"} flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 shrink-0`}>
            <button
              type="button"
              onClick={() => setActiveTab("pix")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "pix"
                  ? "bg-white text-teal-900 shadow-xs border border-teal-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg viewBox="0 0 512 512" fill="currentColor" className="h-3.5 w-3.5 text-[#00bdae]">
                <path d="M112.5 124.7c19.3-19.3 50.7-19.3 70 0l47.5 47.5c7.8 7.8 20.5 7.8 28.3 0l47.5-47.5c19.3-19.3 50.7-19.3 70 0l23.5 23.5c19.3 19.3 19.3 50.7 0 70l-47.5 47.5c-7.8 7.8-7.8 20.5 0 28.3l47.5 47.5c19.3 19.3 19.3 50.7 0 70l-23.5 23.5c-19.3 19.3-50.7 19.3-70 0l-47.5-47.5c-7.8-7.8-20.5-7.8-28.3 0l-47.5 47.5c-19.3 19.3-50.7 19.3-70 0l-23.5-23.5c-19.3-19.3-19.3-50.7 0-70l47.5-47.5c7.8-7.8 7.8-20.5 0-28.3l-47.5-47.5c-19.3-19.3-19.3-50.7 0-70l23.5-23.5z"/>
              </svg>
              <span>PIX</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bmc")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "bmc"
                  ? "bg-white text-indigo-900 shadow-xs border border-indigo-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Coffee className="h-3.5 w-3.5 text-[#5F7FFF]" />
              <span>Checkout BMC</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bmc-qr")}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "bmc-qr"
                  ? "bg-white text-amber-900 shadow-xs border border-amber-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="h-3.5 w-3.5 text-amber-500" />
              <span>QR BMC</span>
            </button>
          </div>

          {/* Tab Content: PIX */}
          {activeTab === "pix" && (
            <div className="mt-3.5 flex flex-col items-center gap-3 animate-fade-in overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 font-outfit">
                <QrCode className="h-3.5 w-3.5 text-[#00bdae]" />
                <span>Escaneie o QR Code no seu banco</span>
              </div>

              {/* QR Code PIX */}
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
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

          {/* Tab Content: Buy Me a Coffee Live Embedded Checkout (Do Script Oficial) */}
          {activeTab === "bmc" && (
            <div className="flex-1 w-full relative bg-slate-50 flex flex-col">
              <iframe
                id="bmc-iframe"
                src={BMC_URL}
                title="Buy Me a Coffee Widget"
                allow="publickey-credentials-get *; payment *"
                className="w-full flex-1 border-0 bg-white"
              />
              <div className="px-4 py-2 bg-white border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Não carregou o checkout?</span>
                <a
                  href={`https://buymeacoffee.com/${BMC_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#5F7FFF] hover:underline flex items-center gap-1"
                >
                  <span>Abrir no site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Tab Content: Buy Me a Coffee QR Code Oficial */}
          {activeTab === "bmc-qr" && (
            <div className="mt-3.5 flex flex-col items-center gap-3 animate-fade-in overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 font-outfit">
                <QrCode className="h-3.5 w-3.5 text-amber-500" />
                <span>Escaneie o QR Code do Buy Me a Coffee</span>
              </div>

              {/* QR Code BMC Oficial */}
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
                <img
                  src="/bmc-qrcode.png"
                  alt="QR Code Buy Me a Coffee - Alexandre De Carli"
                  className="w-44 h-44 rounded-lg object-contain select-none"
                  loading="eager"
                />
              </div>

              <a
                href={`https://buymeacoffee.com/${BMC_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5F7FFF] hover:bg-[#4d6feb] text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-[#5F7FFF]/20 active:scale-[0.98] transition-all duration-200 cursor-pointer mt-1"
              >
                <Coffee className="h-4 w-4" />
                <span>Abrir Perfil no Buy Me a Coffee</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Apoie com cartão internacional, Apple Pay ou PayPal. ☕✨
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Trigger Button (Estilo Oficial BMC com Toque PIX) */}
      <button
        type="button"
        id="btn-floating-support"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowBubble(true)}
        className="inline-flex items-center gap-2.5 rounded-full bg-[#5F7FFF] hover:bg-[#4e70f5] text-white px-4 py-3 text-xs font-bold shadow-[0_10px_35px_-5px_rgba(95,127,255,0.45)] hover:shadow-[0_15px_40px_-5px_rgba(95,127,255,0.55)] border border-white/20 backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Apoiar o projeto via PIX ou Buy Me a Coffee"
      >
        <div className="flex items-center -space-x-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs shadow-sm">
            ☕
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00bdae] text-white shadow-sm p-1">
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
              <path d="M112.5 124.7c19.3-19.3 50.7-19.3 70 0l47.5 47.5c7.8 7.8 20.5 7.8 28.3 0l47.5-47.5c19.3-19.3 50.7-19.3 70 0l23.5 23.5c19.3 19.3 19.3 50.7 0 70l-47.5 47.5c-7.8 7.8-7.8 20.5 0 28.3l47.5 47.5c19.3 19.3 19.3 50.7 0 70l-23.5 23.5c-19.3 19.3-50.7 19.3-70 0l-47.5-47.5c-7.8-7.8-20.5-7.8-28.3 0l-47.5 47.5c-19.3 19.3-50.7 19.3-70 0l-23.5-23.5c-19.3-19.3-19.3-50.7 0-70l47.5-47.5c7.8-7.8 7.8-20.5 0-28.3l-47.5-47.5c-19.3-19.3-19.3-50.7 0-70l23.5-23.5z"/>
            </svg>
          </span>
        </div>

        <span className="font-outfit tracking-tight text-sm">Buy me a coffee / PIX</span>

        <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>
    </div>
  );
}
