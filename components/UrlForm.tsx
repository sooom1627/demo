import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { z } from "zod";

const UrlSchema = z.string().url({ message: "無効なURLです。" });

export default function UrlForm() {
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = () => {
		try {
			UrlSchema.parse(url);
			setError(null);
			// ここでURLを送信する処理を実装します
			console.log("送信されたURL:", url);
			alert("URLが送信されました！");
			setUrl(""); // 入力フィールドをクリア
		} catch (e) {
			if (e instanceof z.ZodError) {
				setError(e.errors[0].message);
			}
		}
	};

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index);
	}, []);

	return (
		<View className="my-5">
			<Text className="text-red-800">URLを入力してください</Text>
			<Button
				onPress={handlePresentModalPress}
				title="Present Modal"
				color="black"
			/>
			<BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
				<BottomSheetView className="p-4">
					<Text className="text-zinc-800">Awesome 🎉</Text>
					<TextInput
						className="border border-gray-300 p-2.5 mb-2.5 rounded-md"
						placeholder="URLを入力してください"
						value={url}
						onChangeText={setUrl}
						keyboardType="url"
						autoCapitalize="none"
					/>
					{error && <Text className="text-red-500 mb-2.5">{error}</Text>}
					<Button title="送信" onPress={handleSubmit} />
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
