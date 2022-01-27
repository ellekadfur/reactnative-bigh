import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";
import api from "./service/api";
import styles from "./style";

const App = () => {
  const [timeData, setTime] = useState<{ label: string; value: number }[]>([]);
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [valueText, setValuetext] = useState("");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    let increment = 30;
    let time: { label: string; value: number }[] = [];
    let startTime = 0;

    for (let i = 0; startTime < 24 * 60; i++) {
      let hour = Math.floor(startTime / 60);
      let min = startTime % 60;
      time[i] = {
        label: (
          ("0" + (hour % 12)).slice(-2) +
          ":" +
          ("0" + min).slice(-2)
        ).toString(),
        value: hour * 60 + min,
      };

      startTime = startTime + increment;
    }

    setTime(time);
  }, []);
  const getValuesfromform = (type: any) => {
    return getValues()[type] ? getValues()[type] : "";
  };
  const calcaluateSleep = () => {
    let durationInBed = getValues()["durationInbed"];
    let durationAsleep = getValues()["durationAssleep"];
    let result = (100 * durationAsleep) / durationInBed;
    return result.toFixed(2).toString();
  };
  const callData = () => {
    const sleepParsentage = calcaluateSleep();
    api
      .post("/health-status", { sleepParsentage })
      .then((res) => {
        setValuetext(sleepParsentage);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        // ADD THIS THROW error
        throw error;
      });
  };
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
          render={({ field: { onChange } }) => (
            <RNPickerSelect
              onValueChange={(value) => {
                onChange(value);
                setValue("durationInbed", value);
              }}
              items={timeData}
              value={getValuesfromform("durationInbed")}
              style={StyleSheet.create({
                inputIOSContainer: {
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  marginBottom: 5,
                },
                inputIOS: {
                  fontSize: 14,
                },
              })}
            />
          )}
          rules={{
            required: true,
          }}
          name="durationInbed"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <RNPickerSelect
              onValueChange={(value) => {
                onChange(value);
                setValue("durationAssleep", value);
              }}
              items={timeData}
              style={StyleSheet.create({
                inputIOSContainer: {
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  marginBottom: 5,
                },
                inputIOS: {
                  fontSize: 14,
                },
              })}
              value={getValuesfromform("durationAssleep")}
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
          }}
          color={"#18c3e5"}
        />
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
