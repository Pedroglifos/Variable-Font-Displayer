'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClipboardCopy, RefreshCw, RotateCcw, Save, Trash } from 'lucide-react'
import Image from 'next/image'

const defaultGlobalStyle = {
  roundness: 100,
  color: '#FDFC9A',
  lineWeight: 3,
  lineColor: '#D3D3D3',
  knobHeight: 20,
  knobWidth: 20,
  initialText: "The quick brown fox jumps over the lazy dog",
  textColor: '#FFFFFF',
  backgroundColor: '#25264F'
}

type GlobalStyle = typeof defaultGlobalStyle

interface Preset {
  name: string
  style: GlobalStyle
}

export default function Component() {
  const [fontUrl, setFontUrl] = useState('https://freight.cargo.site/m/P2070178689860556056872869598546/SenteiaVF.woff2')
  const [fontAxes, setFontAxes] = useState<{ [key: string]: { min: number; max: number; default: number; displayName: string } }>({})
  const [axesValues, setAxesValues] = useState<{ [key: string]: number }>({})
  const [fontSize, setFontSize] = useState(48)
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog")
  const [newAxis, setNewAxis] = useState({ name: '', displayName: '', min: 0, max: 100 })
  const [generatedJS, setGeneratedJS] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [containerId, setContainerId] = useState('')
  const [sliderKnobRoundness, setSliderKnobRoundness] = useState(defaultGlobalStyle.roundness)
  const [sliderKnobColor, setSliderKnobColor] = useState(defaultGlobalStyle.color)
  const [sliderLineWeight, setSliderLineWeight] = useState(defaultGlobalStyle.lineWeight)
  const [sliderLineColor, setSliderLineColor] = useState(defaultGlobalStyle.lineColor)
  const [sliderKnobHeight, setSliderKnobHeight] = useState(defaultGlobalStyle.knobHeight)
  const [sliderKnobWidth, setSliderKnobWidth] = useState(defaultGlobalStyle.knobWidth)
  const [initialText, setInitialText] = useState(defaultGlobalStyle.initialText)
  const [textColor, setTextColor] = useState(defaultGlobalStyle.textColor)
  const [backgroundColor, setBackgroundColor] = useState(defaultGlobalStyle.backgroundColor)
  const [appliedGlobalStyle, setAppliedGlobalStyle] = useState(defaultGlobalStyle)
  const [successMessage, setSuccessMessage] = useState('')
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [newPresetName, setNewPresetName] = useState('')
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)

  useEffect(() => {
    loadFont(fontUrl)
    loadPresets()
  }, [fontUrl])

  const loadFont = (url: string) => {
    const font = new FontFace('CustomFont', `url(${url})`)
    font.load().then(() => {
      document.fonts.add(font)
      setFontAxes({})
      setAxesValues({})
    }).catch(err => {
      console.error('Error loading font:', err)
    })
  }

  const loadPresets = () => {
    const savedPresets = localStorage.getItem('globalStylePresets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }

  const savePreset = () => {
    if (newPresetName) {
      const newPreset: Preset = {
        name: newPresetName,
        style: {
          roundness: sliderKnobRoundness,
          color: sliderKnobColor,
          lineWeight: sliderLineWeight,
          lineColor: sliderLineColor,
          knobHeight: sliderKnobHeight,
          knobWidth: sliderKnobWidth,
          initialText: initialText,
          textColor: textColor,
          backgroundColor: backgroundColor
        }
      }
      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)
      localStorage.setItem('globalStylePresets', JSON.stringify(updatedPresets))
      setNewPresetName('')
      setIsPresetModalOpen(false)
      showSuccessMessage('Preset saved successfully!')
    }
  }

  const loadPreset = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    if (preset) {
      setSliderKnobRoundness(preset.style.roundness)
      setSliderKnobColor(preset.style.color)
      setSliderLineWeight(preset.style.lineWeight)
      setSliderLineColor(preset.style.lineColor)
      setSliderKnobHeight(preset.style.knobHeight)
      setSliderKnobWidth(preset.style.knobWidth)
      setInitialText(preset.style.initialText)
      setTextColor(preset.style.textColor)
      setBackgroundColor(preset.style.backgroundColor)
      setAppliedGlobalStyle(preset.style)
      setText(preset.style.initialText)
      setSelectedPreset(presetName)
      showSuccessMessage('Preset loaded successfully!')
    }
  }

  const removePreset = () => {
    if (selectedPreset) {
      const updatedPresets = presets.filter(p => p.name !== selectedPreset)
      setPresets(updatedPresets)
      localStorage.setItem('globalStylePresets', JSON.stringify(updatedPresets))
      setSelectedPreset(null)
      showSuccessMessage('Preset removed successfully!')
    }
  }

  const addAxis = () => {
    if (newAxis.name && !fontAxes[newAxis.name]) {
      setFontAxes(prev => ({
        ...prev,
        [newAxis.name]: { 
          min: newAxis.min, 
          max: newAxis.max, 
          default: newAxis.min, 
          displayName: newAxis.displayName || newAxis.name 
        }
      }))
      setAxesValues(prev => ({
        ...prev,
        [newAxis.name]: newAxis.min
      }))
      setNewAxis({ name: '', displayName: '', min: 0, max: 100 })
    }
  }

  const removeAxis = (axisName: string) => {
    const { [axisName]: _, ...restAxes } = fontAxes
    setFontAxes(restAxes)
    const { [axisName]: __, ...restValues } = axesValues
    setAxesValues(restValues)
  }

  const handleFontUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontUrl(e.target.value)
  }

  const fontStyle = {
    fontFamily: 'CustomFont, sans-serif',
    fontSize: `${fontSize}px`,
    fontVariationSettings: Object.entries(axesValues)
      .map(([axis, value]) => `"${axis}" ${value}`)
      .join(', '),
    color: appliedGlobalStyle.textColor,
  }

  const generateCode = () => {
    const fontName = fontUrl.split('/').pop()?.split('.')[0] || 'customFont'
    const id = `vf-displayer-${fontName}`
    setContainerId(id)

    const js = `
// ${fontName}-variable-font-displayer.js
(function() {
  const fontUrl = '${fontUrl}';
  const fontName = '${fontName}';
  const id = '${id}';
  const initialText = '${appliedGlobalStyle.initialText}';
  const initialFontSize = ${fontSize};
  const axesValues = ${JSON.stringify(axesValues)};
  const fontAxes = ${JSON.stringify(fontAxes)};

  // Create and append style
  const style = document.createElement('style');
  style.textContent = \`
    @font-face {
      font-family: 'CustomFont-\${fontName}';
      src: url('\${fontUrl}') format('woff2');
    }
    #\${id} {
      font-family: sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: ${appliedGlobalStyle.backgroundColor};
      color: ${appliedGlobalStyle.textColor};
    }
    #\${id} .vfd-sample-text {
      font-family: 'CustomFont-\${fontName}', sans-serif;
      font-size: \${initialFontSize}px;
      min-height: 100px;
      text-align: center;
      margin-bottom: 20px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      outline: none;
    }
    #\${id} .vfd-slider-wrapper {
      margin-bottom: 15px;
    }
    #\${id} .vfd-slider {
      -webkit-appearance: none;
      width: 100%;
      height: ${appliedGlobalStyle.lineWeight}px;
      background: ${appliedGlobalStyle.lineColor};
      outline: none;
      opacity: 0.7;
      transition: opacity .2s;
    }
    #\${id} .vfd-slider:hover {
      opacity: 1;
    }
    #\${id} .vfd-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: ${appliedGlobalStyle.knobWidth}px;
      height: ${appliedGlobalStyle.knobHeight}px;
      background: ${appliedGlobalStyle.color};
      cursor: pointer;
      border-radius: ${appliedGlobalStyle.roundness}%;
    }
    #\${id} .vfd-slider::-moz-range-thumb {
      width: ${appliedGlobalStyle.knobWidth}px;
      height: ${appliedGlobalStyle.knobHeight}px;
      background: ${appliedGlobalStyle.color};
      cursor: pointer;
      border-radius: ${appliedGlobalStyle.roundness}%;
    }
    #\${id} .vfd-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
  \`;
  document.head.appendChild(style);

  // Create main container
  const vfdContainer = document.createElement('div');
  vfdContainer.id = id;

  // Create sample text
  const sampleText = document.createElement('div');
  sampleText.className = 'vfd-sample-text';
  sampleText.contentEditable = 'true';
  sampleText.textContent = initialText;
  vfdContainer.appendChild(sampleText);

  // Create font size slider
  const fontSizeWrapper = document.createElement('div');
  fontSizeWrapper.className = 'vfd-slider-wrapper';
  const fontSizeLabel = document.createElement('div');
  fontSizeLabel.className = 'vfd-label';
  fontSizeLabel.innerHTML = '<span>Font Size</span><span>' + initialFontSize + 'px</span>';
  const fontSizeSlider = document.createElement('input');
  fontSizeSlider.type = 'range';
  fontSizeSlider.min = '12';
  fontSizeSlider.max = '72';
  fontSizeSlider.value = initialFontSize.toString();
  fontSizeSlider.className = 'vfd-slider';
  fontSizeWrapper.appendChild(fontSizeLabel);
  fontSizeWrapper.appendChild(fontSizeSlider);
  vfdContainer.appendChild(fontSizeWrapper);

  // Create axis sliders
  Object.entries(fontAxes).forEach(([axis, { min, max, displayName }]) => {
    const axisWrapper = document.createElement('div');
    axisWrapper.className = 'vfd-slider-wrapper';
    const axisLabel = document.createElement('div');
    axisLabel.className = 'vfd-label';
    axisLabel.innerHTML = '<span>' + displayName + '</span><span>' + axesValues[axis] + '</span>';
    const axisSlider = document.createElement('input');
    axisSlider.type = 'range';
    axisSlider.min = min.toString();
    axisSlider.max = max.toString();
    axisSlider.value = axesValues[axis].toString();
    axisSlider.className = 'vfd-slider';
    axisSlider.dataset.axis = axis;
    axisWrapper.appendChild(axisLabel);
    axisWrapper.appendChild(axisSlider);
    vfdContainer.appendChild(axisWrapper);
  });

  // Function to update font settings
  function updateFontSettings() {
    const settings = Object.entries(axesValues).map(([axis, value]) => \`"\${axis}" \${value}\`);
    sampleText.style.fontVariationSettings = settings.join(', ');
    sampleText.style.fontSize = fontSizeSlider.value + 'px';
    fontSizeLabel.lastElementChild.textContent = fontSizeSlider.value + 'px';
  }

  // Add event listeners
  fontSizeSlider.addEventListener('input', (e) => {
    fontSizeLabel.lastElementChild.textContent = e.target.value + 'px';
    updateFontSettings();
  });

  vfdContainer.querySelectorAll('.vfd-slider[data-axis]').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const axis = e.target.dataset.axis;
      axesValues[axis] = parseFloat(e.target.value);
      e.target.previousElementSibling.lastElementChild.textContent = e.target.value;
      updateFontSettings();
    });
  });

  // Initial update
  updateFontSettings();

  // Append to document
  document.body.appendChild(vfdContainer);
})();
`

    const html = `<div id="${id}"></div>`

    setGeneratedJS(js)
    setGeneratedHTML(html)
  }

  const resetCode = () => {
    setGeneratedJS('')
    setGeneratedHTML('')
    setContainerId('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000) // Hide after 3 seconds
  }

  const applyGlobalStyle = () => {
    setAppliedGlobalStyle({
      roundness: sliderKnobRoundness,
      color: sliderKnobColor,
      lineWeight: sliderLineWeight,
      lineColor: sliderLineColor,
      knobHeight: sliderKnobHeight,
      knobWidth: sliderKnobWidth,
      initialText: initialText,
      textColor: textColor,
      backgroundColor: backgroundColor
    })
    setText(initialText)
    showSuccessMessage('Style applied successfully!')
  }

  const resetGlobalStyle = () => {
    const defaultStyle = { ...defaultGlobalStyle };
    setSliderKnobRoundness(defaultStyle.roundness);
    setSliderKnobColor(defaultStyle.color);
    setSliderLineWeight(defaultStyle.lineWeight);
    setSliderLineColor(defaultStyle.lineColor);
    setSliderKnobHeight(defaultStyle.knobHeight);
    setSliderKnobWidth(defaultStyle.knobWidth);
    setInitialText(defaultStyle.initialText);
    setTextColor(defaultStyle.textColor);
    setBackgroundColor(defaultStyle.backgroundColor);
    setAppliedGlobalStyle(defaultStyle);
    setText(defaultStyle.initialText);
    showSuccessMessage('Global style reset and applied!');
  }

  const sliderStyle = {
    '--thumb-color': appliedGlobalStyle.color,
    '--line-weight': `${appliedGlobalStyle.lineWeight}px`,
    '--line-color': appliedGlobalStyle.lineColor,
    '--thumb-height': `${appliedGlobalStyle.knobHeight}px`,
    '--thumb-width': `${appliedGlobalStyle.knobWidth}px`,
    '--thumb-roundness': `${appliedGlobalStyle.roundness}%`,
  } as React.CSSProperties

  return (
    <div className="p-6 w-full" style={{ backgroundColor: appliedGlobalStyle.backgroundColor, color: appliedGlobalStyle.textColor }}>
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
          <Image
            src="https://freight.cargo.site/t/original/i/U1598472162831956459511651145042/Pedroglifos_logo.svg"
            alt="Pedroglifos Logo"
            width={40}
            height={40}
          />
          <h2 className="text-2xl font-bold ml-4">Variable Font Displayer</h2>
        </div>
        <a 
          href="https://www.pedroglifos.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm hover:underline"
        >
          by Pedroglifos
        </a>
      </div>

      <div className="mb-8 max-w-4xl mx-auto">
        <div 
          contentEditable 
          suppressContentEditableWarning
          style={fontStyle} 
          className="mb-6 text-center break-words outline-none min-h-[100px] p-4 bg-opacity-10 bg-white rounded-lg w-full"
          onBlur={(e) => setText(e.currentTarget.textContent || '')}
        >
          {text}
        </div>

        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={72}
              step={1}
              className="[&_[role=slider]]:bg-[var(--thumb-color)] [&_[role=slider]]:border-[var(--thumb-color)] [&_[role=slider]]:w-[var(--thumb-width)] [&_[role=slider]]:h-[var(--thumb-height)] [&_[role=slider]]:rounded-[var(--thumb-roundness)] [&>.relative]:h-[var(--line-weight)] [&>.relative]:bg-[var(--line-color)] [&_[role=slider]]:block"
              style={sliderStyle}
            />
          </div>
          {Object.entries(fontAxes).map(([axis, { min, max, displayName }]) => (
            <div key={axis} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  {displayName}: {axesValues[axis]?.toFixed(2)}
                </Label>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeAxis(axis)}
                >
                  Remove
                </Button>
              </div>
              <Slider
                value={[axesValues[axis] || 0]}
                onValueChange={(value) => setAxesValues(prev => ({ ...prev, [axis]: value[0] }))}
                min={min}
                max={max}
                step={(max - min) / 100}
                className="[&_[role=slider]]:bg-[var(--thumb-color)] [&_[role=slider]]:border-[var(--thumb-color)] [&_[role=slider]]:w-[var(--thumb-width)] [&_[role=slider]]:h-[var(--thumb-height)] [&_[role=slider]]:rounded-[var(--thumb-roundness)] [&>.relative]:h-[var(--line-weight)] [&>.relative]:bg-[var(--line-color)] [&_[role=slider]]:block"
                style={sliderStyle}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <section>
            <h3 className="text-xl font-semibold mb-4">Global Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="slider-knob-roundness" className="text-sm font-medium">Knob Roundness</Label>
                <Input
                  id="slider-knob-roundness"
                  type="number"
                  min="0"
                  max="100"
                  value={sliderKnobRoundness}
                  onChange={(e) => setSliderKnobRoundness(Number(e.target.value))}
                  className="w-full mt-1 bg-white text-black"
                />
              </div>
              <div>
                <Label htmlFor="slider-knob-height" className="text-sm font-medium">Knob Height</Label>
                <Input
                  id="slider-knob-height"
                  type="number"
                  value={sliderKnobHeight}
                  onChange={(e) => setSliderKnobHeight(Number(e.target.value))}
                  className="w-full mt-1 bg-white text-black"
                />
              </div>
              <div>
                <Label htmlFor="slider-knob-width" className="text-sm font-medium">Knob Width</Label>
                <Input
                  id="slider-knob-width"
                  type="number"
                  value={sliderKnobWidth}
                  onChange={(e) => setSliderKnobWidth(Number(e.target.value))}
                  className="w-full mt-1 bg-white text-black"
                />
              </div>
              <div>
                <Label htmlFor="slider-line-weight" className="text-sm font-medium">Slider Line Weight</Label>
                <Input
                  id="slider-line-weight"
                  type="number"
                  value={sliderLineWeight}
                  onChange={(e) => setSliderLineWeight(Number(e.target.value))}
                  className="w-full mt-1 bg-white text-black"
                />
              </div>
              <div>
                <Label htmlFor="slider-line-color" className="text-sm font-medium">Slider Line Color</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="slider-line-color"
                    type="color"
                    value={sliderLineColor}
                    onChange={(e) => setSliderLineColor(e.target.value)}
                    className="w-12 h-8 p-1 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={sliderLineColor}
                    onChange={(e) => setSliderLineColor(e.target.value)}
                    className="ml-2 flex-grow bg-white text-black"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="slider-knob-color" className="text-sm font-medium">Knob Color</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="slider-knob-color"
                    type="color"
                    value={sliderKnobColor}
                    onChange={(e) => setSliderKnobColor(e.target.value)}
                    className="w-12 h-8 p-1 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={sliderKnobColor}
                    onChange={(e) => setSliderKnobColor(e.target.value)}
                    className="ml-2 flex-grow bg-white text-black"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="initial-text" className="text-sm font-medium">Initial Text</Label>
                <Input
                  id="initial-text"
                  type="text"
                  value={initialText}
                  onChange={(e) => setInitialText(e.target.value)}
                  className="w-full mt-1 bg-white text-black"
                />
              </div>
              <div>
                <Label htmlFor="text-color" className="text-sm font-medium">Text Color</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-12 p-1 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="ml-2 w-28 bg-white text-black"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="background-color" className="text-sm font-medium">Background Color</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 p-1 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="ml-2 w-28 bg-white text-black"
                  />
                </div>
              </div>
              <div className="col-span-2 md:col-span-3 flex space-x-4">
                <Button onClick={applyGlobalStyle} className="flex-1">Apply Style</Button>
                <Button onClick={resetGlobalStyle} variant="outline" className="flex-1 flex items-center justify-center border border-white bg-transparent hover:bg-white/10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <Dialog open={isPresetModalOpen} onOpenChange={setIsPresetModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full col-span-2 md:col-span-3 mt-4 flex items-center justify-center border border-white bg-transparent hover:bg-white/10">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preset
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Save Preset</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={savePreset}>Save Preset</Button>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-4">My Presets</h3>
            <div className="flex space-x-4">
              <Select
                value={selectedPreset || ''}
                onValueChange={(value) => loadPreset(value)}
                disabled={presets.length === 0}
              >
                <SelectTrigger className="flex-1 bg-white text-black">
                  <SelectValue placeholder={presets.length === 0 ? "No presets saved" : "Load Preset"} />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name} className="text-black">
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={removePreset}
                variant="outline"
                className="flex items-center justify-center border border-white bg-transparent hover:bg-white/10"
                disabled={!selectedPreset}
              >
                <Trash className="w-4 h-4 mr-2" />
                Remove Preset
              </Button>
            </div>
          </section>
        </div>
        <div className="w-full lg:w-1/2">
          <section>
            <h3 className="text-xl font-semibold mb-4">Generator</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-grow">
                  <Label htmlFor="font-url" className="text-sm">Font URL</Label>
                  <Input
                    id="font-url"
                    placeholder="Enter font URL"
                    value={fontUrl}
                    onChange={handleFontUrlChange}
                    className="w-full bg-white text-black"
                  />
                </div>
                <Button onClick={() => loadFont(fontUrl)}>Load Font</Button>
              </div>

              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <Label htmlFor="axis-name" className="text-sm">Axis name</Label>
                  <Input
                    id="axis-name"
                    placeholder="Axis name"
                    value={newAxis.name}
                    onChange={(e) => setNewAxis(prev => ({ ...prev, name: e.target.value }))}
                    className="w-32 bg-white text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="axis-text" className="text-sm">Axis text</Label>
                  <Input
                    id="axis-text"
                    placeholder="Axis text"
                    value={newAxis.displayName}
                    onChange={(e) => setNewAxis(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-32 bg-white text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="axis-min" className="text-sm">Min</Label>
                  <Input
                    id="axis-min"
                    type="number"
                    placeholder="Min"
                    value={newAxis.min}
                    onChange={(e) => setNewAxis(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-24 bg-white text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="axis-max" className="text-sm">Max</Label>
                  <Input
                    id="axis-max"
                    type="number"
                    placeholder="Max"
                    value={newAxis.max}
                    onChange={(e) => setNewAxis(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-24 bg-white text-black"
                  />
                </div>
                <Button onClick={addAxis}>Add Axis</Button>
              </div>

              <div className="flex justify-between">
                <Button onClick={generateCode}>Generate Code</Button>
                <Button onClick={resetCode} variant="outline" className="flex items-center border border-white bg-transparent hover:bg-white/10">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">HTML to Copy:</Label>
                    <Button 
                      onClick={() => copyToClipboard(generatedHTML)} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center border border-white bg-transparent hover:bg-white/10"
                      disabled={!generatedHTML}
                    >
                      <ClipboardCopy className="w-4 h-4 mr-2" />
                      Copy HTML
                    </Button>
                  </div>
                  <Textarea
                    value={generatedHTML}
                    readOnly
                    placeholder="Generated HTML will appear here"
                    className="w-full h-24 bg-gray-800 text-white font-mono text-sm p-4"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">JavaScript to Copy:</Label>
                    <Button 
                      onClick={() => copyToClipboard(generatedJS)} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center border border-white bg-transparent hover:bg-white/10"
                      disabled={!generatedJS}
                    >
                      <ClipboardCopy className="w-4 h-4 mr-2" />
                      Copy JS
                    </Button>
                  </div>
                  <Textarea
                    value={generatedJS}
                    readOnly
                    placeholder="Generated JavaScript will appear here"
                    className="w-full h-64 bg-gray-800 text-white font-mono text-sm p-4"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
