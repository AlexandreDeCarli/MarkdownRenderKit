import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, QrCode, ExternalLink, X, Heart, Coffee, Smartphone, ChevronDown } from "lucide-react";

/**
 * Unified Floating Support Widget (PIX + Buy Me a Coffee)
 * Integração direta com a engine oficial de checkout do Buy Me a Coffee (via iframe com viewport calibrado para zero rolagem)
 * e suporte nativo completo ao PIX (QR Code e chave copiável).
 */
export default function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pix"); // 'pix' | 'bmc'
  const [copiedPix, setCopiedPix] = useState(false);
  const [showPixQr, setShowPixQr] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  // Valores sugeridos para PIX
  const [selectedPixAmount, setSelectedPixAmount] = useState(5);
  const [customPix, setCustomPix] = useState("20");

  const widgetRef = useRef(null);

  const PIX_KEY = "29c45fd6-e6e0-4708-9b49-3b049cde040f";
  const BMC_ID = "alexandredecarli";
  const BMC_EMBED_URL = `https://buymeacoffee.com/widget/page/${BMC_ID}?description=Support%20me%20on%20Buy%20me%20a%20coffee!&color=%235F7FFF`;

  // Limpa elementos residuais do script antigo caso existam no DOM
  useEffect(() => {
    const purgeOldBmc = () => {
      const oldBtn = document.getElementById("bmc-wbtn");
      if (oldBtn) oldBtn.remove();
      const oldClose = document.getElementById("bmc-close-btn");
      if (oldClose) oldClose.remove();
      const oldScript = document.querySelector('script[data-name="BMC-Widget"]');
      if (oldScript) oldScript.remove();
    };
    purgeOldBmc();
  }, []);

  // Controla o balão de mensagem "Valeeeu demais!"
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
      {/* Balão Flutuante de Boas-Vindas ("Valeeeu demais!") */}
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
          className={`absolute bottom-16 right-0 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_25px_65px_-12px_rgba(15,23,42,0.28)] backdrop-blur-xl animate-modal-scale-in flex flex-col transition-all duration-300 ${
            activeTab === "bmc"
              ? "w-[360px] sm:w-[420px] h-[670px] max-h-[90vh]"
              : "w-[340px] sm:w-[380px] max-h-[85vh]"
          }`}
        >
          {/* Top Gradient Bar - 100% Flush de ponta a ponta */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00bdae] via-[#5F7FFF] to-amber-400 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-sm">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-outfit text-slate-900 leading-tight">Apoie o Projeto</h3>
                <p className="text-[11px] font-medium text-slate-500">Escolha a forma de apoio:</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-full border border-slate-200/80 bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 shadow-2xs"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Segmented Control: [ PIX ] & [ Buy Me ] */}
          <div className="px-5 pt-3 pb-2.5 bg-slate-50/70 border-b border-slate-100 shrink-0">
            <div className="flex p-1 bg-slate-200/70 rounded-2xl">
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
                <span>PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bmc")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "bmc"
                    ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Coffee className="h-3.5 w-3.5 text-[#5F7FFF]" />
                <span>Buy Me a Coffee</span>
              </button>
            </div>
          </div>

          {/* ABA 1: PIX */}
          {activeTab === "pix" && (
            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-3 animate-fade-in bg-white">
              {/* Seletor de Valor Sugerido em Reais */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Valor sugerido:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[5, 10].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedPixAmount(val)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                        selectedPixAmount === val
                          ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedPixAmount("custom")}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                      selectedPixAmount === "custom"
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Outro
                  </button>
                </div>

                {selectedPixAmount === "custom" && (
                  <div className="flex items-center gap-2 p-1.5 px-2.5 bg-white rounded-xl border border-teal-300 shadow-2xs animate-fade-in">
                    <span className="text-xs font-bold text-teal-700">R$</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Outro valor"
                      value={customPix}
                      onChange={(e) => setCustomPix(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Chave PIX */}
              <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-200/70 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Chave PIX (Aleatória)
                  </span>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-100/80 px-2 py-0.5 rounded-full">
                    Brasil
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-teal-200/80 font-mono text-[11px] text-slate-800 break-all select-all shadow-2xs">
                  {PIX_KEY}
                </div>

                <button
                  type="button"
                  onClick={handleCopyPix}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98] ${
                    copiedPix
                      ? "bg-emerald-600 text-white shadow-emerald-600/20"
                      : "bg-teal-700 hover:bg-teal-800 text-white"
                  }`}
                >
                  {copiedPix ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-200" />
                      <span>Chave PIX Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copiar Chave PIX</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botão Sutil para Pagar pelo Celular (QR Code) */}
              <div className="flex flex-col items-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowPixQr(!showPixQr)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 py-1.5 px-2.5 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <Smartphone className="h-3.5 w-3.5 text-teal-600" />
                  <span>{showPixQr ? "Ocultar QR Code" : "Pagar pelo celular (QR Code)"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showPixQr ? "rotate-180 text-teal-600" : ""}`} />
                </button>

                {showPixQr && (
                  <div className="mt-2.5 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center gap-2 animate-fade-in w-full">
                    <img
                      src="/pix-qrcode.png"
                      alt="QR Code PIX - Alexandre De Carli"
                      className="w-44 h-44 rounded-lg object-contain select-none"
                    />
                    <span className="text-[10px] text-slate-500 font-medium">Abra o app do seu banco e aponte a câmera</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Qualquer contribuição apoia o desenvolvimento contínuo e open-source. Valeu demais! 💙
              </p>
            </div>
          )}

          {/* ABA 2: BUY ME A COFFEE (Engine Oficial de Checkout do BMC em Viewport Exato) */}
          {activeTab === "bmc" && (
            <div className="flex-1 w-full relative bg-slate-50 flex flex-col overflow-hidden animate-fade-in">
              <iframe
                id="bmc-iframe-native"
                src={BMC_EMBED_URL}
                title="Buy Me a Coffee Official Checkout"
                allow="publickey-credentials-get *; payment *"
                className="w-full flex-1 border-0 bg-white"
                loading="eager"
              />

              {/* Barra de Rodapé com Link Externo e QR Code Fallback */}
              <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <span className="text-[10px]">Cartão • Apple Pay • PayPal</span>
                <a
                  href={`https://buymeacoffee.com/${BMC_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#5F7FFF] hover:underline flex items-center gap-1"
                >
                  <span>Abrir em aba</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
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

        <span className="font-outfit tracking-tight text-sm">Buy Me & PIX</span>

        <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>
    </div>
  );
}
