import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { AttendanceStatus } from "@/data/firebase/AttendanceRepo";

export function AttendanceButtons({
  value,
  disabled,
  onChange,
}: {
  value: AttendanceStatus;
  disabled?: boolean;
  onChange: (v: AttendanceStatus) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Button
        mode={value === "yes" ? "contained" : "outlined"}
        disabled={disabled}
        onPress={() => onChange("yes")}
        compact
      >
        Prídem
      </Button>
      <Button
        mode={value === "no" ? "contained" : "outlined"}
        disabled={disabled}
        onPress={() => onChange("no")}
        compact
      >
        Neprídem
      </Button>
      {/* ak chceš aj maybe */}
      {/* <Button mode={value==="maybe"?"contained":"outlined"} onPress={()=>onChange("maybe")} compact>Možno</Button> */}
    </View>
  );
}