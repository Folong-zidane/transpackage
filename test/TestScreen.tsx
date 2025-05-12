import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TestScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>TestScreen</Text>
            <Text style={styles.description}>
                Ici, la page pour tester les fonctionnalités et vues
                avant de les intégrer dans l'application.
            </Text>
            <View style={styles.buttonContainer}>
                <Button title="Test" onPress={() => console.log('Test cliqué')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        alignSelf: 'center',
        width: '50%',
    },
});

export default TestScreen;
