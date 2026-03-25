import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  playerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flex:1,
    width:"100%",
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 10,
},

avatarFallback: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

avatarFallbackText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#374151",
},
name: {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
},
textWrap: {
  flex: 1,
},

role: {
  fontSize: 13,
  color: "#6B7280",
  marginTop: 2,
},
});
