import { Caption, CaptionTitle } from "@components/Text"
import { SkeletonView } from "@components/common/Skeleton"
import { hashCoordinate } from "@lib/CoordinateHashing"
import {
    LocationCoordinate2D,
    coordinateDistance
} from "TiFShared/domain-models/LocationCoordinate2D"
import React, { ReactElement } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view"
import { LocationSearchLoadingResult } from "./LoadingResult"
import { LocationSearchResult, LocationsSearchQueryText } from "./SearchClient"
import {
    LocationSearchResultProps,
    LocationSearchResultView
} from "./SearchResultView"

export type LocationSearchResultsListProps = {
  query: LocationsSearchQueryText
  center?: LocationCoordinate2D
  searchResults: LocationSearchLoadingResult
  Header: JSX.Element
  SearchResultView?: (props: LocationSearchResultProps) => ReactElement
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Renders a list of location search results.
 *
 * This component uses the search text that can be edited by {@link LocationSearchBar}.
 * When the search text is empty, the user's recent locations will be loaded.
 */
export const LocationSearchResultsListView = ({
  query,
  center,
  searchResults,
  style,
  contentContainerStyle,
  Header,
  SearchResultView = LocationSearchResultView
}: LocationSearchResultsListProps) => (
  <KeyboardAwareFlatList
    style={style}
    contentContainerStyle={contentContainerStyle}
    keyExtractor={keyExtractor}
    ItemSeparatorComponent={ListItemSpacer}
    ListHeaderComponent={
      <View style={styles.horizontalPadding}>
        {Header}
        <CaptionTitle style={styles.searchResultsTitle}>
          {query.sourceType === "user-recents" ? "Recents" : "Results"}
        </CaptionTitle>
      </View>
    }
    renderItem={({ item }) => (
      <SearchResultView
        result={item}
        distanceMiles={
          center
            ? coordinateDistance(center, item.location.coordinate, "miles")
            : undefined
        }
        style={styles.horizontalPadding}
      />
    )}
    data={searchResults.data ?? []}
    ListEmptyComponent={
      <EmptyResultsView
        query={query}
        reason={searchResults.status}
        style={styles.horizontalPadding}
      />
    }
  />
)

const ListItemSpacer = () => <View style={styles.separator} />

const keyExtractor = (result: LocationSearchResult) => {
  return hashCoordinate(result.location.coordinate)
}

type EmptyResultsProps = {
  query: LocationsSearchQueryText
  reason: LocationSearchLoadingResult["status"]
  style?: StyleProp<ViewStyle>
}

const EmptyResultsView = ({ query, reason, style }: EmptyResultsProps) => {
  const noResultsText =
    query.sourceType === "user-recents"
      ? "No recent locations. Locations of events that you host and attend will appear here."
      : `Sorry, no results found for "${query}".`
  return (
    <View style={style}>
      {reason === "error" && (
        <Caption>
          Something went wrong, please check your internet connection and try
          again later.
        </Caption>
      )}
      {reason === "pending" && (
        <View testID="loading-location-options">
          <SkeletonResult />
          <SkeletonResult />
          <SkeletonResult />
          <SkeletonResult />
          <SkeletonResult />
          <SkeletonResult />
          <SkeletonResult />
        </View>
      )}
      {reason === "no-results" && <Caption>{noResultsText}</Caption>}
    </View>
  )
}

const SkeletonResult = () => (
  <View style={styles.skeletonContainer}>
    <SkeletonView style={styles.skeletonIcon} />
    <View>
      <SkeletonView style={styles.skeletionHeadline} />
      <SkeletonView style={styles.skeletonCaption} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  separator: {
    marginVertical: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%"
  },
  divider: {
    marginLeft: 32,
    width: "100%"
  },
  searchResultsTitle: {
    opacity: 0.35,
    marginVertical: 16
  },
  skeletonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8
  },
  skeletionHeadline: {
    width: 128,
    height: 16,
    marginBottom: 4,
    borderRadius: 12
  },
  skeletonCaption: {
    width: 256,
    height: 12,
    borderRadius: 12
  },
  horizontalPadding: {
    paddingHorizontal: 24
  }
})
