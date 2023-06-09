import { FontScaleFactors } from "@hooks/Fonts"
import { AppStyles } from "@lib/AppColorStyle"
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native"

export type textFieldProps = {
  style?: StyleProp<ViewStyle>
  value?: string | undefined
  onChangeText?: ((text: string) => void) | undefined
  title: string
  placeholder: string
}

export const TextField = ({ style, ...props }: textFieldProps) => {
  return (
    <View style={styles.containerStyle}>
      <TextInput
        maxFontSizeMultiplier={FontScaleFactors.xxxLarge}
        placeholderTextColor={AppStyles.colorOpacity35}
        placeholder={props.placeholder}
        secureTextEntry={true}
        style={[
          style,
          {
            paddingLeft: 8,
            fontFamily: "OpenSans",
            fontSize: 16
          }
        ]}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppStyles.colorOpacity15,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 50,
    marginBottom: 20
  }
})
