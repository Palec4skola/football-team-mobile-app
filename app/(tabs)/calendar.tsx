import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// (volitelně) lokalizace kalendáře do slovenštiny
LocaleConfig.locales['sk'] = {
  monthNames: [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ],
  monthNamesShort: [
    'jan', 'feb', 'mar', 'apr', 'máj', 'jún',
    'júl', 'aug', 'sep', 'okt', 'nov', 'dec'
  ],
  dayNames: [
    'nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'
  ],
  dayNamesShort: ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'],
};

LocaleConfig.defaultLocale = 'sk';

export default function Calendar1() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => {
          setSelectedDate(day.dateString);
          // sem můžeš doplnit logiku pro zobrazení zápasů v daný den
        }}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: 'blue', selectedTextColor: 'white'}
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  calendar: { width: '90%' },
});
