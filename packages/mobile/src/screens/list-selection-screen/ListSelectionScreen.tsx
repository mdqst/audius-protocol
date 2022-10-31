import type { ComponentType } from 'react'
import { useState, useCallback } from 'react'

import type { ListRenderItem } from 'react-native'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import type { SvgProps } from 'react-native-svg'

import {
  FlatList,
  Screen,
  TextInput,
  Text,
  RadioButton,
  Divider,
  Button
} from 'app/components/core'
import { useNavigation } from 'app/hooks/useNavigation'
import { useRoute } from 'app/hooks/useRoute'
import { makeStyles } from 'app/styles'

export type ListSelectionData = { label: string; value: string }

export type ListSelectionParams = {
  screenTitle: string
  icon: ComponentType<SvgProps>
  searchText: string
  data: ListSelectionData[]
  renderItem: ListRenderItem<ListSelectionData>
  onChange: (value: string) => void
  value: string
}

const messages = {
  selected: 'Selected',
  done: 'Done'
}

const useStyles = makeStyles(({ spacing, typography, palette }) => ({
  root: {
    justifyContent: 'space-between'
  },
  content: { flex: 1 },
  search: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(6)
  },
  searchInput: {
    paddingVertical: spacing(3),
    fontSize: typography.fontSize.large
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(4)
  },
  listItemContent: {
    flexDirection: 'row'
  },
  radio: {
    marginRight: spacing(4)
  },
  confirmSelection: {
    padding: spacing(4),
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.neutralLight6
  }
}))

export const ListSelectionScreen = () => {
  const { params } = useRoute<'ListSelection'>()
  const {
    screenTitle,
    icon,
    searchText,
    renderItem: renderItemProp,
    onChange,
    value: valueProp,
    ...other
  } = params

  const styles = useStyles()

  const [value, setValue] = useState(valueProp)

  const navigation = useNavigation()

  const handleSubmit = useCallback(() => {
    onChange(value)
    navigation.goBack()
  }, [onChange, value, navigation])

  const renderItem: ListRenderItem<ListSelectionData> = useCallback(
    (info) => {
      const { value: itemValue } = info.item
      const isSelected = value === itemValue

      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => setValue(itemValue)}
        >
          <View style={styles.listItemContent}>
            <RadioButton checked={isSelected} style={styles.radio} />
            <Text fontSize='large' weight='bold' color='neutralLight4'>
              {renderItemProp(info)}
            </Text>
          </View>
          {isSelected ? (
            <Text variant='body' color='secondary'>
              {messages.selected}
            </Text>
          ) : null}
        </TouchableOpacity>
      )
    },
    [renderItemProp, value, styles]
  )

  return (
    <Screen title={screenTitle} icon={icon} variant='white' style={styles.root}>
      <View style={styles.content}>
        <TextInput
          placeholder={searchText}
          styles={{ root: styles.search, input: styles.searchInput }}
        />
        <FlatList
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          {...other}
        />
      </View>
      <View style={styles.confirmSelection}>
        <Button
          variant='primary'
          size='large'
          title={messages.done}
          onPress={handleSubmit}
          fullWidth
          disabled={!value}
        />
      </View>
    </Screen>
  )
}
