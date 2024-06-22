import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const App = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return false;
        }
        return true;
    };

    const getLocationAndSend = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        let { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;
        const deviceId = "unique-device-id"; // Você pode obter o ID do dispositivo de alguma outra maneira

        const payload = {
            deviceId,
            latitude,
            longitude
        };

        console.log('Enviando payload:', payload);

        axios.post('https://0a99-2804-90-6000-8b0b-d1ce-3982-8474-2b8b.ngrok-free.app/api/location', payload)
            .then(response => {
                console.log('Localização enviada:', response.data);
            })
            .catch(error => {
                console.error('Erro ao enviar localização:', error.message);
            });

        setLocation(coords);
    };

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{text}</Text>
            <Button title="Enviar Localização" onPress={getLocationAndSend} />
        </View>
    );
};

export default App;
