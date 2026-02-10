import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';


export default function App() {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.EXPO_PUBLIC_EXCHANGERATES_API_KEY;

  const fetchRates = () => {
    setLoading(true);

    fetch('https://api.apilayer.com/exchangerates_data/latest', {
      headers: { 'apikey': API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        setRates(data.rates || {});
        setCurrencies(Object.keys(data.rates));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!amount || !selectedCurrency || !rates[selectedCurrency]) return;

    const euro = parseFloat(amount) / rates[selectedCurrency];
    setResult(euro.toFixed(2) + ' €');
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" style={{ marginBottom: 20 }} />}

      <FontAwesome name="euro" size={80} color="#4CAF50" style={{ alignSelf: 'center', marginBottom: 20 }} />

      <Text style={styles.result}>{result ? ` ${result}` : ''}</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.inputRow}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          style={styles.pickerRow}
          mode="dropdown"
        >
          {currencies.map(code => (
            <Picker.Item key={code} label={code} value={code} />
          ))}
        </Picker>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 190,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    marginRight: 10,
  },
  pickerRow: {
    width: 120,
  },
  result: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  convertButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }

});
//so pleased with how this one looks
