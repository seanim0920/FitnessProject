import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import BasicInfoDetails from './BasicInfoDetails';

const BasicInfo = ({name, setName, age, setAge, gender, setGender}) => {
    //const [name, setName] = useState('')
    //const [age, setAge] = useState('')
    //const [gender, setGender] = useState('')

    return (
        <View>
            <BasicInfoDetails label = 'name' field = {name} updateField = {setName} /> 
            <BasicInfoDetails label = 'age' field = {age} updateField = {setAge} />
            <BasicInfoDetails label = 'gender' field = {gender} updateField = {setGender} />
        </View>
    )
}

const styles = new StyleSheet.create({
  
})

export default BasicInfo;