import type { ComponentType, SVGProps } from 'react'

import type { IconColors, ShadowOptions } from 'foundations'

export const iconSizes = {
  xs: 14,
  s: 16,
  m: 20,
  l: 24,
  xl: 30,
  '2xl': 32
}

type IconSize = keyof typeof iconSizes

type SVGBaseProps = SVGProps<SVGSVGElement>

export type IconProps = {
  color?: IconColors
  size?: IconSize
  sizeW?: IconSize
  sizeH?: IconSize
  shadow?: ShadowOptions
}

type SVGIconProps = SVGBaseProps & IconProps

export type IconComponent = ComponentType<SVGBaseProps | SVGIconProps>
