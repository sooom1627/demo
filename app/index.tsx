import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	return (
		<SafeAreaView className="flex-1 my-4 mx-4">
			<Text className="text-blue-500">Hello</Text>
		</SafeAreaView>
	);
}
