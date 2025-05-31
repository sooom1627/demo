import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../assets/global.css";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// 初回のみセッションチェック
		supabase.auth.getSession().then(({ data: { session } }) => {
			setIsAuthenticated(!!session);
			setIsLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	if (isLoading) {
		return null; // ロード中表示
	}

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView>
				<BottomSheetModalProvider>
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
							redirect={!isAuthenticated} // 未認証ならリダイレクト
						/>
						<Stack.Screen
							name="(auth)/login"
							options={{ headerShown: false, presentation: "modal" }}
							redirect={isAuthenticated} // 認証済みならリダイレクト
						/>
						<Stack.Screen name="+not-found" />
					</Stack>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
