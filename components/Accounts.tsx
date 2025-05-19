import { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Account({ session }: { session: Session }) {
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState("");
	const [website, setWebsite] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [session]);

	useEffect(() => {
		if (session) getProfile();
	}, [session, getProfile]);

	async function updateProfile({
		username,
		website,
		avatar_url,
	}: {
		username: string;
		website: string;
		avatar_url: string;
	}) {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const updates = {
				id: session?.user.id,
				username,
				website,
				avatar_url,
				updated_at: new Date(),
			};

			const { error } = await supabase.from("profiles").upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.container}>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Text>Email</Text>
				<TextInput
					value={session?.user?.email || ""}
					editable={false}
					style={styles.input}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<Text>Username</Text>
				<TextInput
					placeholder="Username"
					value={username || ""}
					onChangeText={(text: string) => setUsername(text)}
					style={styles.input}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<Text>Website</Text>
				<TextInput
					placeholder="Website"
					value={website || ""}
					onChangeText={(text: string) => setWebsite(text)}
					style={styles.input}
				/>
			</View>

			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button
					title={loading ? "Loading ..." : "Update"}
					onPress={() =>
						updateProfile({ username, website, avatar_url: avatarUrl })
					}
					disabled={loading}
				/>
			</View>

			<View style={styles.verticallySpaced}>
				<Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	mt20: {
		marginTop: 20,
	},
	input: {
		borderColor: "gray",
		borderWidth: 1,
		padding: 10,
		borderRadius: 5,
		marginTop: 5,
	},
});
