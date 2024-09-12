// src/index.tsx
import {
  Grid,
  Action,
  ActionPanel,
  List,
  Color,
  Icon,
  Clipboard,
  showToast,
  Toast
} from '@raycast/api'
import { colors } from './color'

import { colord, extend } from 'colord'
import cmykPlugin from 'colord/plugins/cmyk'
import labPlugin from 'colord/plugins/lab'
import lchPlugin from 'colord/plugins/lch'
import namesPlugin from 'colord/plugins/names'
import hwbPlugin from 'colord/plugins/hwb'

extend([cmykPlugin, labPlugin, lchPlugin, namesPlugin, hwbPlugin])

const generateColor = (color: string, name: string) => {
  const c = colord(color)

  return [
    { name: 'NAME', value: name.replace(/\s/g, '/') },
    { name: 'HEX', value: c.toHex().toUpperCase() },
    { name: 'RGB', value: c.toRgbString() },
    { name: 'Only RGB Value', value: `${c.toRgb().r} ${c.toRgb().g} ${c.toRgb().b}` },
    { name: 'HSL', value: c.toHslString() },
    { name: 'Only HSL Value', value: `${c.toHsl().h} ${c.toHsl().s} ${c.toHsl().l}` },
    { name: 'HWB', value: c.toHwbString() },
    { name: 'Only HWB Value', value: `${c.toHwb().h} ${c.toHwb().w} ${c.toHwb().b}` },
    { name: 'CMYK', value: c.toCmykString() },
    {
      name: 'Only CMYK Value',
      value: `${c.toCmyk().c} ${c.toCmyk().m} ${c.toCmyk().y} ${c.toCmyk().k}`
    },
    { name: 'LAB', value: `lab(${c.toLab().l} ${c.toLab().a} ${c.toLab().b})` },
    { name: 'Only LAB Value', value: `${c.toLab().l} ${c.toLab().a} ${c.toLab().b}` },
    { name: 'LCH', value: `lch(${c.toLch().l} ${c.toLch().c} ${c.toLch().h})` },
    { name: 'Only LCH Value', value: `${c.toLch().l} ${c.toLch().c} ${c.toLch().h}` }
  ]
}

export default function Command() {
  return (
    <Grid fit={Grid.Fit.Fill} aspectRatio="3/2" columns={8}>
      {Object.entries(colors).map(([colorName, shades]) => (
        <Grid.Section key={colorName} title={colorName}>
          {shades.map((hex, shadeIndex) => {
            const name = `${colorName} ${(shadeIndex + 0.5) * 100}`

            const colorFormats = generateColor(hex, name)

            return (
              <Grid.Item
                key={`${colorName}-${shadeIndex}`}
                title={name}
                subtitle={hex}
                content={{
                  color: hex,
                  tooltip: name
                }}
                actions={
                  <ActionPanel>
                    <Action.Push
                      title="Check Color Values"
                      target={<ColorDetail color={hex} name={name} />}
                    />
                    <ActionPanel.Section title="Quick copy">
                      {colorFormats.map(format => (
                        <Action.CopyToClipboard title={format.name} content={format.value} />
                      ))}
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            )
          })}
        </Grid.Section>
      ))}
    </Grid>
  )
}

function ColorDetail({ color, name }: { color: string; name: string }) {
  const colorFormats = generateColor(color, name)

  return (
    <List navigationTitle={name}>
      {colorFormats.map(format => (
        <List.Item
          key={format.name}
          title={format.name}
          subtitle={format.value}
          icon={{ source: Icon.Circle, tintColor: color }}
          actions={
            <ActionPanel>
              <Action
                title={`Copy ${format.name}`}
                onAction={() => {
                  Clipboard.copy(format.value as string)
                  showToast({
                    style: Toast.Style.Success,
                    title: `Copied ${format.name} to clipboard`
                  })
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  )
}
