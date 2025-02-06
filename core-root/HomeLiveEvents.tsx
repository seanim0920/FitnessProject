import { TiFBottomSheet } from "@components/BottomSheet"
import {
  NavigatorContext,
  NavigatorProvider,
  useTiFNavigation
} from "@components/Navigation"
import { Title } from "@components/Text"
import { IoniconCloseButton } from "@components/common/Icons"
import { ClientSideEvent, eventSecondsToStart } from "@event/ClientSideEvent"
import { EventCard } from "@event/EventCard"
import {
  LiveEventsFeature,
  isEmptyLiveEvents,
  useLiveEvents
} from "@event/LiveEvents"
import {
  BottomSheetFlatList,
  BottomSheetHandle,
  BottomSheetHandleProps
} from "@gorhom/bottom-sheet"
import { UserID } from "TiFShared/domain-models/User"
import dayjs from "dayjs"
import { useCallback, useEffect, useState } from "react"
import { ViewStyle, StyleProp, View, StyleSheet } from "react-native"

const TWO_HOURS = dayjs.duration(2, "hours").asSeconds()

export const useHomeLiveEvents = (id: UserID) => {
  const { store } = LiveEventsFeature.useContext()
  const [isModalClosed, setIsModalClosed] = useState(false)
  useEffect(() => {
    return store.beginObserving(id)
  }, [store, id])
  const liveEvents = useLiveEvents((events) => {
    if (isModalClosed || isEmptyLiveEvents(events)) {
      return undefined
    }
    const startingSoon = events.startingSoon.filter(
      (e) => eventSecondsToStart(e.time) <= TWO_HOURS
    )
    return [...events.ongoing, ...startingSoon]
  }) as ClientSideEvent[] | undefined
  return {
    modalEvents: liveEvents,
    modalClosed: useCallback(() => setIsModalClosed(true), [])
  }
}

export type HomeLiveEventsProps = {
  id: UserID
  style?: StyleProp<ViewStyle>
}

const SNAP_POINTS = ["50%", "75%"]

export const HomeLiveEventsView = ({ id, style }: HomeLiveEventsProps) => {
  const state = useHomeLiveEvents(id)
  return (
    <TiFBottomSheet
      sizing={{ snapPoints: SNAP_POINTS }}
      isPresented={!!state.modalEvents}
      HandleView={useCallback(
        (props: BottomSheetHandleProps) => (
          <HandleView {...props} onCloseTapped={state.modalClosed} />
        ),
        [state.modalClosed]
      )}
      onDismiss={state.modalClosed}
      style={style}
    >
      <BottomSheetFlatList
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <EventCard event={item} style={styles.eventCard} />
        )}
        data={state.modalEvents ?? []}
      />
    </TiFBottomSheet>
  )
}

const keyExtractor = (e: ClientSideEvent) => `event-${e.id}`

const HandleView = (
  props: BottomSheetHandleProps & { onCloseTapped: () => void }
) => (
  <View style={styles.handle}>
    <BottomSheetHandle {...props} />
    <View style={styles.closeButtonRow}>
      <View style={styles.closeButtonSpacer} />
      <IoniconCloseButton size={20} onPress={props.onCloseTapped} />
    </View>
    <Title>Don&apos;t miss out on your upcoming events!</Title>
  </View>
)

const styles = StyleSheet.create({
  handle: {
    rowGap: 8,
    paddingHorizontal: 24,
    paddingBottom: 16
  },
  eventCard: { paddingHorizontal: 24 },
  closeButtonRow: { display: "flex", flexDirection: "row" },
  closeButtonSpacer: { flex: 1 }
})
