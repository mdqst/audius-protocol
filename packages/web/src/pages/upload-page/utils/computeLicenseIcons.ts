import type { ComponentType, SVGProps } from 'react'

import type { Nullable } from '@audius/common'

import { IconCcBy as IconAllowAttribution } from '@audius/harmony'
import { IconCcCC as IconCreativeCommons } from '@audius/harmony'
import { IconCcNC as IconNonCommercialUse } from '@audius/harmony'
import { IconCcND as IconNoDerivatives } from '@audius/harmony'
import { IconCcSA as IconShareAlike } from '@audius/harmony'

export const computeLicenseIcons = (
  allowAttribution: boolean,
  commercialUse: boolean,
  derivativeWorks: Nullable<boolean>
) => {
  if (!allowAttribution) return null
  const icons: [Icon: ComponentType<SVGProps<SVGSVGElement>>, key: string][] = [
    [IconCreativeCommons, 'cc'],
    [IconAllowAttribution, 'by']
  ]
  if (!commercialUse) icons.push([IconNonCommercialUse, 'nc'])
  if (derivativeWorks === true) icons.push([IconShareAlike, 'sa'])
  else if (derivativeWorks === false) icons.push([IconNoDerivatives, 'nd'])

  return icons
}
