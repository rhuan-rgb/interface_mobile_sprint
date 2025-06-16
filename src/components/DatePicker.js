import React, { useState } from "react";
import { View, Button } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

const DatePickerDefault = ({ type, buttonTitle, dateKey, setValue }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date) => {
  // zera hora/minuto/segundo para não haver salto de fuso
  const iso = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toISOString().split("T")[0]; // "YYYY-MM-DD" local

  setValue((prev) => ({
    ...prev,
    [dateKey]: iso,  // grava a string correta
  }));

  hideDatePicker();
};


  return (
    <View>
      <Button title={buttonTitle} onPress={showDatePicker} color="#0077bb" />
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode={type}            // "date" ou "datetime"
        locale="pt_BR"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        pickerContainerStyleIOS={{ backgroundColor: "#fff" }}
        textColor="#000"
      />
    </View>
  );
};

export default DatePickerDefault;
