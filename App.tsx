import React, {useState, useEffect} from 'react';
import {Text, View, Button, SafeAreaView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-community/picker';
import api from './service/api';
import styles from './style';

const App = () => {
  const [timeData, setTime] = useState<{label: string; value: number}[]>([]);
  const {
    control,
    setValue,
    getValues,
    formState: {isValid},
  } = useForm({mode: 'onChange'});
  const [valueText, setValuetext] = useState('');
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    let increment = 30;
    let time: {label: string; value: number}[] = [];
    let startTime = 0;

    for (let i = 0; startTime < 24 * 60; i++) {
      let hour = Math.floor(startTime / 60);
      let min = startTime % 60;
      time[i] = {
        label: (
          ('0' + (hour % 12)).slice(-2) +
          ':' +
          ('0' + min).slice(-2)
        ).toString(),
        value: hour * 60 + min,
      };

      startTime = startTime + increment;
    }

    setTime(time);
  }, []);
  const getValuesfromform = (type: any) => {
    return getValues()[type] ? getValues()[type] : '';
  };
  const calcaluateSleep = () => {
    let durationInBed = getValues().durationInbed;
    let durationAsleep = getValues().durationAssleep;
    let result = (100 * durationAsleep) / durationInBed;
    return result.toFixed(2).toString();
  };
  const callData = () => {
    const sleepParsentage = calcaluateSleep();
    api
      .post('/health-status', {sleepParsentage})
      .then(res => {
        setValuetext(sleepParsentage);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
        // ADD THIS THROW error
        throw error;
      });
  };

  type RNPickerProps = {
    onChange: Function;
    name: string;
    label: string;
  };

  const RNPicker = ({onChange, name, label}: RNPickerProps) => (
    <View style={styles.RNPickerView}>
      <Text style={{textAlign: 'center'}}>{label}</Text>
      <Picker
        selectedValue={getValuesfromform(name)}
        onValueChange={value => {
          onChange(value);
          setValue('durationInbed', value);
        }}>
        {/* <Picker.Item label={'Duration in bed'} value={''} /> */}
        {timeData.map((i, key) => {
          return <Picker.Item key={key} label={i.label} value={i.value} />;
        })}
      </Picker>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Big Health</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({field: {onChange}}) => (
            <RNPicker
              onChange={onChange}
              name="durationInbed"
              label="Duration in bed"
            />
          )}
          rules={{
            required: true,
          }}
          name="durationInbed"
        />
        <Controller
          control={control}
          render={({field: {onChange}}) => (
            <RNPicker
              onChange={onChange}
              name="durationAssleep"
              label="Duration asleep"
            />
          )}
          rules={{
            required: true,
          }}
          name="durationAssleep"
        />
        <Button
          disabled={!isValid}
          title="Calculate"
          testID="CalculateButton"
          onPress={() => {
            setLoading(true);
            callData();
            console.log(isValid);
          }}
          color={'#18c3e5'}
        />
      </View>
      <View style={styles.container}>
        {!isLoading ? (
          <View testID="result">
            <Text>Result: {valueText}</Text>
          </View>
        ) : (
          <View testID="loading">
            <Text>Loading</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
