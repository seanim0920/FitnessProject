import React, {useEffect} from 'react'
import {View, StyleSheet, Text, Picker} from 'react-native'

const GenderPicker = ({field, selectedValue, setSelectedValue}) => {
    const fieldHandler = () => {
        if (field == '') {
            setSelectedValue('Male')
        }
        else {
            setSelectedValue(field)
        }
    }

    useEffect(() => fieldHandler(), [ ])

    return (
        <View>
            <Picker
                selectedValue={selectedValue}
                itemStyle={{height: 200, width: '100%'}}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label = "Male" value = "Male" />
                <Picker.Item label = "Female" value = "Female" />
                <Picker.Item label = "Other" value = "Other" />
                <Picker.Item label = "Undecided" value = "Undecided" />
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default GenderPicker