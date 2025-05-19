import Account from "@/components/Accounts";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function AccountScreen() {
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
		<View className="flex-1">
			<Account session={session} />
		</View>
	);
}
