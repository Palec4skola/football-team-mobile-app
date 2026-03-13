import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 18,
  },
  profileCard: {
    borderRadius: 24,
    marginBottom: 16,
  },
  profileCardInner: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 14,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarFallbackText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    alignSelf: "stretch",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
  },
  teamBox: {
    width: "100%",
  },
  pickerWrap: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    overflow: "hidden",
  },
  teamSingleBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  teamNameMuted: {
    fontSize: 15,
    color: "#6B7280",
  },
  actionsCard: {
    borderRadius: 24,
  },
  actionsInner: {
    padding: 18,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  actionButton: {
    borderRadius: 14,
    marginBottom: 12,
  },
  actionButtonContent: {
    paddingVertical: 6,
  },
  button: {
    borderRadius: 14,
    marginBottom: 12,
  },
  buttonText: {
    fontWeight: "700",
  },
  logoutButton: {
    borderRadius: 14,
    marginTop: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#E5E7EB",
    marginBottom: 14,
  },
  userTeam: {
    fontSize: 15,
    color: "#374151",
  },
  errorText: {
    fontSize: 15,
    color: "#B00020",
    textAlign: "center",
  },
});

export default profileStyles;