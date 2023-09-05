import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GeneralButton({title, onPress}) {
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgb(61, 152, 154)",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        minWidth: 130,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
})