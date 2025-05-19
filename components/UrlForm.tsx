import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
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

	return (
		<View className="my-5">
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
		</View>
	);
}
