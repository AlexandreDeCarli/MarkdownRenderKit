import React from "react";
import { User, Globe, ExternalLink, X } from "lucide-react";

/**
 * Premium Modal "Sobre o Desenvolvedor" (About the Developer) in Light Theme.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com blur e animação de esmaecimento */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={onClose}
      />
      
      {/* Container do Modal Premium */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-all duration-300 animate-modal-scale-in">
        {/* Efeito de brilho de gradiente superior suave */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Botão de Fechar Premium */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 cursor-pointer rounded-full border border-slate-100 bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200"
          title="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Informações do Perfil */}
        <div className="flex flex-col items-center text-center space-y-4 pb-2">
          {/* Avatar com Gradiente Premium e Letra Inicial */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg shadow-purple-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl font-black tracking-tight text-slate-950 font-outfit select-none">
              AC
            </div>
            {/* Ícone de Usuário como Badge Flutuante */}
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md">
              <User className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 font-outfit">Alexandre De Carli</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-sans">
              Empreendedor, PM & Engenheiro de Software
            </p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-[320px]">
            Sou profundamente apaixonado por projetar interfaces fluidas, integrar fluxos inteligentes de IA e desenvolver arquiteturas web de última geração que surpreendem os usuários.
          </p>
        </div>

        {/* Links de Conexão e Apoio */}
        <div className="mt-6 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Conecte-se comigo</span>
          
          <div className="flex flex-col gap-2">
            <a 
              href="https://potencial.tec.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-all duration-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="font-outfit text-[13px]">potencial.tec.br</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>

            <a 
              href="https://www.linkedin.com/in/alexandredecarli/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-[#0077b5]/5 hover:border-[#0077b5]/30 text-slate-700 hover:text-[#0077b5] text-xs font-semibold transition-all duration-200 group"
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#0077b5] group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                <span className="font-outfit text-[13px]">LinkedIn</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>

            <a 
              href="https://github.com/AlexandreDeCarli" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-900/5 hover:border-slate-800/30 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all duration-200 group"
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-800 group-hover:scale-110 transition-transform"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                <span className="font-outfit text-[13px]">GitHub</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>

            <a 
              href="https://www.buymeacoffee.com/AlexandreDeCarli" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-[#ffdd00]/5 hover:border-[#ffdd00]/30 text-slate-700 hover:text-[#b39b00] text-xs font-semibold transition-all duration-200 group"
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#e6c200] group-hover:scale-110 transition-transform"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="14" y1="2" y2="2" /></svg>
                <span className="font-outfit text-[13px]">Apoie no Buy Me a Coffee</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
