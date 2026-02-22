import { FlatList, Text } from "react-native";
import { TeamPlayerRow } from "./teamPlayerRow";
import { auth } from "../../firebase";
type TeamMember = {
  id: string; // userId (docId)
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[];
  joinedAt?: any;
};
type Props = {
    members: TeamMember[];
    onPressPlayer: (playerId: string) => void;
    renderRight?: (player: TeamMember) => React.ReactNode;
}


export function PlayersTable({ members, onPressPlayer, renderRight }: Props) {
    return <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeamPlayerRow
            player={item}
            isMe={item.id === auth.currentUser?.uid}
            onPress={() => onPressPlayer(item.id)}
            rightElement={renderRight?.(item)}
          />
        )}
        ListEmptyComponent={<Text>Žiadni členovia tímu</Text>}
      />
}