import { ClientSideEvent } from "@event/ClientSideEvent"
import { updateEventDetailsQueryEvent } from "@event/DetailsQuery"
import { AlertsObject, presentAlert } from "@lib/Alerts"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Alert } from "react-native"

export const LEAVE_EVENT_ALERTS = {
  "event-has-ended": {
    title: "Event has ended",
    description:
      "This event has ended. You will be moved to the previous screen."
  },
  "event-was-cancelled": {
    title: "Event was cancelled",
    description:
      "This event was cancelled. You will be moved to the previous screen."
  },
  "co-host-not-found": {
    title: "Event has no co-host",
    description:
      "This event has no co-host. To leave, you will need to select a new host."
  },
  genericError: {
    title: "Uh-oh!",
    description: "Something went wrong. Please try again"
  },
  confirmDelete: (deleteEvent?: () => void) => ({
    title: "Delete Event",
    description: "Are you sure you want to delete this event?",
    buttons: [
      {
        text: "Delete",
        style: "destructive",
        onPress: deleteEvent
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]
  })
} satisfies AlertsObject

export type LeaveEventResult =
  | "success"
  | "event-has-ended"
  | "event-was-cancelled"
  | "co-host-not-found"

export type UseLeaveEventEnvironment = {
  leaveEvent: (eventId: number) => Promise<LeaveEventResult>
  onSuccess: () => void
}

export type UseLeaveEventMenu =
  | {
      attendeeStatus: "hosting"
      isLoading: boolean
      deleteButtonTapped: () => void
    }
  | {
      attendeeStatus: "attending"
      isLoading: boolean
      confirmButtonTapped: () => void
    }

export type UseLeaveEventStatus =
  | { status: "success" }
  | ({ status: "select" } & UseLeaveEventMenu)
  | undefined

export const useLeaveEvent = (
  event: Pick<ClientSideEvent, "id" | "userAttendeeStatus">,
  env: UseLeaveEventEnvironment
): UseLeaveEventStatus => {
  const queryClient = useQueryClient()
  const { onSuccess, leaveEvent } = env
  const leaveEventMutation = useMutation(
    async () => await leaveEvent(event.id),
    {
      onSuccess: (status) => {
        if (status === "co-host-not-found") {
          presentAlert(LEAVE_EVENT_ALERTS[status])
          updateEventDetailsQueryEvent(queryClient, event.id, (e) => ({
            ...e,
            userAttendeeStatus: "hosting"
          }))
        } else if (status === "success") {
          onSuccess()
          updateEventDetailsQueryEvent(queryClient, event.id, (e) => ({
            ...e,
            userAttendeeStatus: "not-participating"
          }))
        } else {
          presentAlert(LEAVE_EVENT_ALERTS[status])
        }
      },
      onError: () => presentAlert(LEAVE_EVENT_ALERTS.genericError)
    }
  )

  const isSuccess =
    leaveEventMutation.isSuccess && leaveEventMutation.data === "success"

  if (isSuccess) {
    return { status: "success" }
  } else if (event.userAttendeeStatus === "attending") {
    return {
      status: "select",
      isLoading: leaveEventMutation.isLoading,
      attendeeStatus: event.userAttendeeStatus,
      confirmButtonTapped: () => leaveEventMutation.mutate()
    }
  } else if (event.userAttendeeStatus === "hosting") {
    return {
      status: "select",
      isLoading: leaveEventMutation.isLoading,
      attendeeStatus: event.userAttendeeStatus,
      deleteButtonTapped: () => {
        presentAlert(
          LEAVE_EVENT_ALERTS.confirmDelete(() => leaveEventMutation.mutate())
        )
      }
    }
  }
}
