// src/styles/homeStyles.ts
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },

  // Card wrapper (react-native-paper Card/Button look)
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardInner: {
    padding: 14,
    gap: 8,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  // small badge next to title
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  line: {
    fontSize: 13,
    opacity: 0.85,
  },
  strongLine: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.95,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 18,
    opacity: 0.6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    opacity: 0.85,
    lineHeight: 18,
  },

  // Professional grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    borderRadius: 18,
    overflow: "hidden",
  },
  gridInner: {
    padding: 16,
    minHeight: 96,
    justifyContent: "space-between",
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  gridHint: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 6,
  },
});