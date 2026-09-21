import React from "react";
import { presets } from "../../domain/valueObjects/presets.js";
import { fontOptions, codeFontOptions } from "../../domain/entities/settings.js";
import { Sparkles, RotateCcw, Type, Palette, Layout, Layers } from "lucide-react";
import Field from "./Field.jsx";
import Select from "./Select.jsx";
import ColorInput from "./ColorInput.jsx";
import Slider from "./Slider.jsx";

/**
 * Painel compacto e refinado de configuração de estilos.
 * @param {{ settings: Object, onUpdate: (key: string, value: any) => void, onApplyPreset: (preset: Object) => void, onReset: () => void }} props
 */
export default function SettingsPanel({ settings, onUpdate, onApplyPreset, onReset }) {
  return (
    <div className="absolute left-0 right-0 top-[50px] z-30 max-h-[68vh] overflow-auto border-b border-slate-200 bg-white/95 px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl animate-fade-in custom-scrollbar">
      <div className="mx-auto grid max-w-[1550px] gap-3.5 md:grid-cols-2 lg:grid-cols-5">

        {/* Section 1: Presets */}
        <section className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-2xs">
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <h3 className="font-outfit text-xs font-bold tracking-tight text-slate-800">Estilos rápidos</h3>
              </div>
              <button
                id="btn-reset-settings"
                onClick={onReset}
                className="inline-flex cursor-pointer items-center gap-1 text-[10.5px] font-bold text-slate-400 transition-colors hover:text-indigo-600"
                title="Restaurar padrões"
              >
                <RotateCcw className="h-3 w-3" />
                <span>reset</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((preset) => {
                const isActive = settings.titleColor === preset.titleColor && settings.h2Color === preset.h2Color;
                return (
                  <button
                    key={preset.name}
                    onClick={() => onApplyPreset(preset)}
                    className={`group cursor-pointer rounded-lg border p-1.5 text-left transition-all duration-150 active:scale-95 ${
                      isActive
                        ? "border-indigo-400 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-300/50"
                        : "border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-indigo-50/20"
                    }`}
                  >
                    <div className="mb-1 flex gap-1">
                      <span className="h-3 w-3 rounded-full border border-slate-200/40 transition-transform group-hover:scale-105" style={{ background: preset.titleColor }} />
                      <span className="h-3 w-3 rounded-full border border-slate-200/40 transition-transform group-hover:scale-105" style={{ background: preset.h2Color }} />
                      <span className="h-3 w-3 rounded-full border border-slate-200/40 transition-transform group-hover:scale-105" style={{ background: preset.highlightColor }} />
                    </div>
                    <span className={`block truncate text-[10.5px] font-bold leading-tight ${isActive ? "text-indigo-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Fonts */}
        <section className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-2xs">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-indigo-500" />
            <h3 className="font-outfit text-xs font-bold tracking-tight text-slate-800">Fontes e Tipografia</h3>
          </div>
          <div className="space-y-2">
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
        <section className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-2xs">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-indigo-500" />
            <h3 className="font-outfit text-xs font-bold tracking-tight text-slate-800">Paleta de Cores</h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
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
            <div className="col-span-2">
              <Field label="Fundo do Papel">
                <ColorInput value={settings.paperBg} onChange={(v) => onUpdate("paperBg", v)} />
              </Field>
            </div>
          </div>
        </section>

        {/* Section 4: Layout & PDF */}
        <section className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-2xs">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Layout className="h-3.5 w-3.5 text-indigo-500" />
            <h3 className="font-outfit text-xs font-bold tracking-tight text-slate-800">Layout & PDF</h3>
          </div>
          <div className="space-y-2">
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
            <div className="space-y-2 border-t border-slate-200/70 pt-2">
              <Field label="Nome do Documento">
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-2xs outline-none transition-all hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                  value={settings.documentName || ""}
                  onChange={(e) => onUpdate("documentName", e.target.value)}
                  placeholder="Ex: Relatório Técnico"
                />
              </Field>
              <Field label="URL da Marca D'água">
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-2xs outline-none transition-all hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                  value={settings.watermarkUrl || ""}
                  onChange={(e) => onUpdate("watermarkUrl", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Section 5: Flowchart / Mermaid */}
        <section className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-2xs">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <h3 className="font-outfit text-xs font-bold tracking-tight text-slate-800">Fluxogramas (Mermaid)</h3>
          </div>
          
          {/* Controle de Tamanho / Escala dos Diagramas */}
          <div className="mb-2">
            <Field label="Tamanho do Diagrama">
              <Slider
                value={settings.mermaidScale ?? 75}
                min={30}
                max={100}
                step={5}
                suffix="%"
                onChange={(v) => onUpdate("mermaidScale", v)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-1.5 border-t border-slate-200/70 pt-2">
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
