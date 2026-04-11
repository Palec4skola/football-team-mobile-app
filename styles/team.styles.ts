import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  infoCardContent: {
    padding: 16,
    gap: 14,
  },
  infoLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
  addButton: {
    borderRadius: 14,
    alignSelf: "flex-start" as const,
  },

  statsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  statsCardWrap: {
    borderRadius: 20,
    overflow: "hidden" as const,
  },
  statsCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  statsLoadingWrap: {
    padding: 18,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  statsLoadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsErrorWrap: {
    padding: 18,
  },
  statsErrorText: {
    color: "#B00020",
    fontSize: 14,
  },

  listSection: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
  },
  memberCount: {
    minWidth: 30,
    textAlign: "center" as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    fontWeight: "700" as const,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
});
