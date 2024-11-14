import {
  updateStartPage,
  type FormDefinition,
  type FormMetadata
} from '@defra/forms-model'
import { useCallback, useMemo, useState } from 'react'

import { Menu } from '~/src/components/Menu/Menu.jsx'
import { Visualisation } from '~/src/components/Visualisation/Visualisation.jsx'
import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import {
  FlyoutContext,
  type FlyoutContextType
} from '~/src/context/FlyoutContext.js'
import { updateConditions } from '~/src/data/condition/updateConditions.js'
import * as form from '~/src/lib/form.js'

interface Props {
  data: FormDefinition
  meta: FormMetadata
  previewUrl: string
}

/**
 * Manage form data
 */
function useData(props: Readonly<Props>): DataContextType {
  const [data, setData] = useState<FormDefinition>(props.data)

  /**
   * Get form definition
   */
  const get = useCallback(async () => {
    const updated = await form.get(props.meta.id)
    setData(updateConditions(updated))
    return updated
  }, [props])

  /**
   * Save form definition
   */
  const save = useCallback(
    async (updated: FormDefinition) => {
      const definition = updateConditions(updateStartPage(updated))
      await form.save(props.meta.id, definition)
      return get()
    },
    [props, get]
  )

  return useMemo(() => {
    return { ...props, data, save }
  }, [props, data, save])
}

/**
 * Manage flyout count
 */
function useFlyout(): FlyoutContextType {
  const [count, setCount] = useState<number>(0)

  function increment() {
    setCount((countPrev) => countPrev + 1)
  }

  function decrement() {
    setCount((countPrev) => countPrev - 1)
  }

  return useMemo(
    () => ({
      count,
      increment,
      decrement
    }),
    [count]
  )
}

export function Designer(props: Readonly<Props>) {
  const { data, meta, previewUrl } = props

  return (
    <DataContext.Provider value={useData({ data, meta, previewUrl })}>
      <FlyoutContext.Provider value={useFlyout()}>
        <div className="govuk-width-container">
          <Menu />
        </div>
        <Visualisation />
      </FlyoutContext.Provider>
    </DataContext.Provider>
  )
}
