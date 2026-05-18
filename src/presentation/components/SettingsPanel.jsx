import React from "react";
import { presets } from "../../domain/valueObjects/presets.js";
import { fontOptions, codeFontOptions, defaultSettings } from "../../domain/entities/settings.js";
import Icon from "./Icon.jsx";
import Field from "./Field.jsx";
import Select from "./Select.jsx";
import ColorInput from "./ColorInput.jsx";
import Slider from "./Slider.jsx";

/**
 * Painel colapsável de configurações de estilo.
 * @param {{ settings: Object, onUpdate: (key: string, value: any) => void, onApplyPreset: (preset: Object) => void, onReset: () => void }} props
 */
export default function SettingsPanel({ settings, onUpdate, onApplyPreset, onReset }) {
  return (
    <div className="absolute left-0 right-0 top-[49px] z-30 max-h-[70vh] overflow-auto border-b border-slate-200 bg-white/95 px-6 py-5 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1600px] gap-6 md:grid-cols-2 lg:grid-cols-5">

        {/* Presets */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950">Estilos rápidos</h3>
            <button
              id="btn-reset-settings"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700"
            >
              <Icon name="reset" className="text-[11px]" /> reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onApplyPreset(preset)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <div className="mb-1.5 flex gap-1">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: preset.titleColor }} />
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: preset.h2Color }} />
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: preset.highlightColor }} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">{preset.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Fonts */}
        <section>
          <h3 className="mb-3 text-sm font-black text-slate-950">Fontes</h3>
          <div className="space-y-3">
            <Field label="Texto" icon="type">
              <Select value={settings.bodyFont} onChange={(v) => onUpdate("bodyFont", v)}>
                {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
            <Field label="Títulos" icon="type">
              <Select value={settings.headingFont} onChange={(v) => onUpdate("headingFont", v)}>
                {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
            <Field label="Código" icon="type">
              <Select value={settings.codeFont} onChange={(v) => onUpdate("codeFont", v)}>
                {codeFontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </Select>
            </Field>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h3 className="mb-3 text-sm font-black text-slate-950">Cores</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Títulos H1" icon="highlight">
              <ColorInput value={settings.titleColor} onChange={(v) => onUpdate("titleColor", v)} />
            </Field>
            <Field label="Subtítulos H2">
              <ColorInput value={settings.h2Color} onChange={(v) => onUpdate("h2Color", v)} />
            </Field>
            <Field label="Destaque fundo">
              <ColorInput value={settings.highlightColor} onChange={(v) => onUpdate("highlightColor", v)} />
            </Field>
            <Field label="Destaque texto">
              <ColorInput value={settings.highlightTextColor} onChange={(v) => onUpdate("highlightTextColor", v)} />
            </Field>
            <Field label="Links">
              <ColorInput value={settings.linkColor} onChange={(v) => onUpdate("linkColor", v)} />
            </Field>
            <Field label="Fundo página">
              <ColorInput value={settings.pageBg} onChange={(v) => onUpdate("pageBg", v)} />
            </Field>
            <Field label="Fundo papel">
              <ColorInput value={settings.paperBg} onChange={(v) => onUpdate("paperBg", v)} />
            </Field>
          </div>
        </section>

        {/* Layout */}
        <section>
          <h3 className="mb-3 text-sm font-black text-slate-950">Layout e PDF</h3>
          <div className="space-y-3">
            <Field label="Fonte">
              <Slider value={settings.fontSize} min={9} max={16} suffix="px" onChange={(v) => onUpdate("fontSize", v)} />
            </Field>
            <Field label="Linha">
              <Slider value={settings.lineHeight} min={1.2} max={2.2} step={0.02} onChange={(v) => onUpdate("lineHeight", v)} />
            </Field>
            <Field label="Papel">
              <Select value={settings.paperSize} onChange={(v) => onUpdate("paperSize", v)}>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="A3">A3</option>
              </Select>
            </Field>
            <Field label="Margem PDF">
              <Slider value={settings.printMargin} min={6} max={32} suffix="mm" onChange={(v) => onUpdate("printMargin", v)} />
            </Field>
            <div className="pt-2 mt-2 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rodapé / Cabeçalho</h4>
              <Field label="Nome do Doc.">
                <input
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 text-slate-800"
                  value={settings.documentName || ""}
                  onChange={(e) => onUpdate("documentName", e.target.value)}
                  placeholder="Ex: Relatório Anual"
                />
              </Field>
              <Field label="URL Marca D'água">
                <input
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 text-slate-800"
                  value={settings.watermarkUrl || ""}
                  onChange={(e) => onUpdate("watermarkUrl", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
              <p className="text-[10px] text-slate-500 leading-tight">
                * Para os <b>números de página</b>, ative a opção nativa "Cabeçalhos e rodapés" na tela de impressão do seu navegador.
              </p>
            </div>
          </div>
        </section>

        {/* Flowchart */}
        <section>
          <h3 className="mb-3 text-sm font-black text-slate-950">Fluxograma</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nó primário">
              <ColorInput value={settings.flowPrimaryBg} onChange={(v) => onUpdate("flowPrimaryBg", v)} />
            </Field>
            <Field label="Borda primária">
              <ColorInput value={settings.flowPrimaryBorder} onChange={(v) => onUpdate("flowPrimaryBorder", v)} />
            </Field>
            <Field label="Nó secundário">
              <ColorInput value={settings.flowSecondaryBg} onChange={(v) => onUpdate("flowSecondaryBg", v)} />
            </Field>
            <Field label="Borda secundária">
              <ColorInput value={settings.flowSecondaryBorder} onChange={(v) => onUpdate("flowSecondaryBorder", v)} />
            </Field>
            <Field label="Nó terciário">
              <ColorInput value={settings.flowTertiaryBg} onChange={(v) => onUpdate("flowTertiaryBg", v)} />
            </Field>
            <Field label="Borda terciária">
              <ColorInput value={settings.flowTertiaryBorder} onChange={(v) => onUpdate("flowTertiaryBorder", v)} />
            </Field>
            <Field label="Linhas">
              <ColorInput value={settings.flowLineColor} onChange={(v) => onUpdate("flowLineColor", v)} />
            </Field>
            <Field label="Texto">
              <ColorInput value={settings.flowTextColor} onChange={(v) => onUpdate("flowTextColor", v)} />
            </Field>
          </div>
        </section>

      </div>
    </div>
  );
}
