import React, {useState, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
  sigla: string;
}

interface IBGECityResponse{
  nome: string;
}

interface Uf{
  label: string;
  key: string;
  value: string;
}

interface City{
  label: string;
  key: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<Uf[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      const ufInitialsMapped = ufInitials.map(uf => ({
        label: uf,
        value: uf,
        key: uf
      }));
      setUfs(ufInitialsMapped);
    });
  }, [])

  useEffect(() => {
    // carregar as cidades toda vez que o usuário selecionar uma UF diferente.
    if(selectedUf === "0"){
        return
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const cityNames = response.data.map(city => city.nome);
        const cityNamesMapped = cityNames.map(city => ({
          label: city,
          value: city,
          key: city
        }));
        setCities(cityNamesMapped);
    });
  }, [selectedUf]);

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    });
  }

  return (
    <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368}} style={styles.container}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.input}>
          <RNPickerSelect placeholder={{label: 'Selecione uma UF...', value: null, color:'grey'}} onValueChange={value => {
                setSelectedUf(value);
              }}
              items={ufs}>
          </RNPickerSelect>
        </View>
        
        <View style={styles.input}>
          <RNPickerSelect placeholder={{label: 'Selecione uma cidade...', value: null, color:'grey'}} onValueChange={value => {
                setSelectedCity(value);
              }}
              items={cities}>
          </RNPickerSelect>
        </View>

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text> 
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingLeft: 8,
      fontSize: 16,
      justifyContent: 'center',
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
}); 

export default Home;