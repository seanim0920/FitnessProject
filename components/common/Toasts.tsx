import Toast from "react-native-root-toast"
import { AppStyles } from "../../lib/AppColorStyle"
import { Platform, StyleSheet, View } from "react-native"
import { Ionicon } from "./Icons"
import { BodyText } from "@components/Text"
import { UserFriendStatus } from "@lib/users/User"

const BOTTOM_TAB_HEIGHT = 80

export const showToast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM - BOTTOM_TAB_HEIGHT,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 100,
    textStyle: { fontSize: 16, fontFamily: "OpenSans" },
    textColor: "white",
    backgroundColor: AppStyles.darkColor,
    opacity: 1,
    containerStyle: { borderRadius: 12 }
  })
}

interface ToastProps {
  requestSent: boolean
  setRequestSent: React.Dispatch<React.SetStateAction<boolean>>
  isVisible: boolean
  text: string
}

export const ToastWithIcon = ({
  requestSent,
  setRequestSent,
  isVisible,
  text
}: ToastProps) => {
  return (
    <>
      {!requestSent && (
        <Toast
          visible={isVisible}
          opacity={1}
          position={Toast.positions.BOTTOM - BOTTOM_TAB_HEIGHT}
          shadow={false}
          animation={true}
          hideOnPress={true}
          containerStyle={styles.toastStyle}
          onHide={() => setRequestSent(true)}
        >
          <View style={styles.containerStyle}>
            <View style={styles.iconStyle}>
              <Ionicon color="white" name="close" />
            </View>
            <BodyText style={styles.textStyle}>{text}</BodyText>
          </View>
        </Toast>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  toastStyle: {
    borderRadius: 12,
    flex: 1,
    width: "90%",
    backgroundColor: AppStyles.darkColor,
    alignItems: "flex-start"
  },
  textStyle: {
    color: "white",
    textAlignVertical: "center",
    paddingTop: Platform.OS === "ios" ? 4 : 0
  },
  iconStyle: {
    marginRight: 16,
    paddingTop: Platform.OS === "ios" ? 4 : 0
  },
  containerStyle: {
    flexDirection: "row",
    alignItems: "center"
  }
})
