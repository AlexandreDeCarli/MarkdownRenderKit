import React from "react";
import { presets } from "../../domain/valueObjects/presets.js";
import { fontOptions, codeFontOptions } from "../../domain/entities/settings.js";
import { Sparkles, RotateCcw, Type, Palette, Layout, Layers } from "lucide-react";
import Field from "./Field.jsx";
import Select from "./Select.jsx";
import ColorInput from "./ColorInput.jsx";
import Slider from "./Slider.jsx";

/**
 * Premium Collapsible Styles Configuration Panel in Light Theme.
 * @param {{ settings: Object, onUpdate: (key: string, value: any) => void, onApplyPreset: (preset: Object) => void, onReset: () => void }} props
 */
export default function SettingsPanel({ settings, onUpdate, onApplyPreset, onReset }) {
  return (
    <div className="absolute left-0 right-0 top-[52px] z-30 max-h-[75vh] overflow-auto border-b border-slate-200 bg-white/95 px-8 py-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl animate-fade-in custom-scrollbar">
      <div className="mx-auto grid max-w-[1600px] gap-6 md:grid-cols-2 lg:grid-cols-5">

        {/* Section 1: Presets */}
        <section className="bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Estilos rápidos</h3>
              </div>
              <button
                id="btn-reset-settings"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>reset</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onApplyPreset(preset)}
                  className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-left transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-sm cursor-pointer group active:scale-95"
                >
                  <div className="mb-2 flex gap-1">
                    <span className="h-3.5 w-3.5 rounded-full border border-slate-200/30 group-hover:scale-105 transition-transform" style={{ background: preset.titleColor }} />
                    <span className="h-3.5 w-3.5 rounded-full border border-slate-200/30 group-hover:scale-105 transition-transform" style={{ background: preset.h2Color }} />
                    <span className="h-3.5 w-3.5 rounded-full border border-slate-200/30 group-hover:scale-105 transition-transform" style={{ background: preset.highlightColor }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 leading-tight block">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Fonts */}
        <section className="bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl shadow-sm">
          <div className="mb-4 flex items-center gap-1.5">
            <Type className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Fontes e Tipografia</h3>
          </div>
          <div className="space-y-3.5">
            <Field label="Corpo do Texto">
              <Select value={settings.bodyFont} onChange={(v) => onUpdate("bodyFont", v)}>
                {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
            <Field label="Títulos H1-H6">
              <Select value={settings.headingFont} onChange={(v) => onUpdate("headingFont", v)}>
                {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
            <Field label="Blocos de Código">
              <Select value={settings.codeFont} onChange={(v) => onUpdate("codeFont", v)}>
                {codeFontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
          </div>
        </section>

        {/* Section 3: Colors */}
        <section className="bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl shadow-sm">
          <div className="mb-4 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Paleta de Cores</h3>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Títulos H1">
              <ColorInput value={settings.titleColor} onChange={(v) => onUpdate("titleColor", v)} />
            </Field>
            <Field label="Subtítulos H2">
              <ColorInput value={settings.h2Color} onChange={(v) => onUpdate("h2Color", v)} />
            </Field>
            <Field label="Fundo Destaque">
              <ColorInput value={settings.highlightColor} onChange={(v) => onUpdate("highlightColor", v)} />
            </Field>
            <Field label="Texto Destaque">
              <ColorInput value={settings.highlightTextColor} onChange={(v) => onUpdate("highlightTextColor", v)} />
            </Field>
            <Field label="Links Hipertexto">
              <ColorInput value={settings.linkColor} onChange={(v) => onUpdate("linkColor", v)} />
            </Field>
            <Field label="Fundo da Página">
              <ColorInput value={settings.pageBg} onChange={(v) => onUpdate("pageBg", v)} />
            </Field>
            <Field label="Fundo do Papel">
              <ColorInput value={settings.paperBg} onChange={(v) => onUpdate("paperBg", v)} />
            </Field>
          </div>
        </section>

        {/* Section 4: Layout & PDF */}
        <section className="bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl shadow-sm">
          <div className="mb-4 flex items-center gap-1.5">
            <Layout className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Layout & PDF</h3>
          </div>
          <div className="space-y-3.5">
            <Field label="Tamanho da Fonte">
              <Slider value={settings.fontSize} min={9} max={16} suffix="px" onChange={(v) => onUpdate("fontSize", v)} />
            </Field>
            <Field label="Altura da Linha">
              <Slider value={settings.lineHeight} min={1.2} max={2.2} step={0.02} onChange={(v) => onUpdate("lineHeight", v)} />
            </Field>
            <Field label="Tamanho do Papel">
              <Select value={settings.paperSize} onChange={(v) => onUpdate("paperSize", v)}>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="A3">A3</option>
              </Select>
            </Field>
            <Field label="Margem de Impressão">
              <Slider value={settings.printMargin} min={6} max={32} suffix="mm" onChange={(v) => onUpdate("printMargin", v)} />
            </Field>
            
            {/* Header/Footer Document properties */}
            <div className="pt-3.5 mt-3 border-t border-slate-200/80 space-y-3.5">
              <Field label="Nome do Documento">
                <input
                  type="text"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200 shadow-inner font-medium"
                  value={settings.documentName || ""}
                  onChange={(e) => onUpdate("documentName", e.target.value)}
                  placeholder="Ex: Relatório Técnico"
                />
              </Field>
              <Field label="URL da Marca D'água">
                <input
                  type="text"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200 shadow-inner font-medium"
                  value={settings.watermarkUrl || ""}
                  onChange={(e) => onUpdate("watermarkUrl", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Section 5: Flowchart / Mermaid */}
        <section className="bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl shadow-sm">
          <div className="mb-4 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold font-outfit text-slate-800 tracking-tight">Fluxogramas (Mermaid)</h3>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Nó Primário">
              <ColorInput value={settings.flowPrimaryBg} onChange={(v) => onUpdate("flowPrimaryBg", v)} />
            </Field>
            <Field label="Borda Primária">
              <ColorInput value={settings.flowPrimaryBorder} onChange={(v) => onUpdate("flowPrimaryBorder", v)} />
            </Field>
            <Field label="Nó Secundário">
              <ColorInput value={settings.flowSecondaryBg} onChange={(v) => onUpdate("flowSecondaryBg", v)} />
            </Field>
            <Field label="Borda Secundária">
              <ColorInput value={settings.flowSecondaryBorder} onChange={(v) => onUpdate("flowSecondaryBorder", v)} />
            </Field>
            <Field label="Nó Terciário">
              <ColorInput value={settings.flowTertiaryBg} onChange={(v) => onUpdate("flowTertiaryBg", v)} />
            </Field>
            <Field label="Borda Terciária">
              <ColorInput value={settings.flowTertiaryBorder} onChange={(v) => onUpdate("flowTertiaryBorder", v)} />
            </Field>
            <Field label="Linhas Conexão">
              <ColorInput value={settings.flowLineColor} onChange={(v) => onUpdate("flowLineColor", v)} />
            </Field>
            <Field label="Texto Diagrama">
              <ColorInput value={settings.flowTextColor} onChange={(v) => onUpdate("flowTextColor", v)} />
            </Field>
          </div>
        </section>

      </div>
    </div>
  );
}
