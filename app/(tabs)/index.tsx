import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UrlForm from "../../components/UrlForm";

export default function Index() {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});
	}, []);

	if (!session) {
		return <Redirect href="/login" />;
	}

	return (
		<SafeAreaView className="flex-1 my-4 mx-4">
			<Text className="text-2xl font-bold mb-4">ホーム</Text>
			<UrlForm />
		</SafeAreaView>
	);
}
