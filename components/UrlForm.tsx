import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { z } from "zod";

const UrlSchema = z.string().url({ message: "無効なURLです。" });

export default function UrlForm() {
	const [clipboardContent, setClipboardContent] = useState<string>("");
	const [validationResult, setValidationResult] = useState<{
		isValid: boolean;
		error?: string;
	}>({ isValid: false });
	const [isLoading, setIsLoading] = useState(false);
	const [isCheckingClipboard, setIsCheckingClipboard] = useState(false);

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// クリップボードの内容をチェックしてバリデーション
	const checkClipboardAndValidate = useCallback(async () => {
		setIsCheckingClipboard(true);
		try {
			const text = await Clipboard.getStringAsync();
			setClipboardContent(text);

			// URLバリデーション
			const result = UrlSchema.safeParse(text);
			if (result.success) {
				setValidationResult({ isValid: true });
			} else {
				setValidationResult({
					isValid: false,
					error: result.error.errors[0]?.message || "無効なURLです。",
				});
			}
		} catch (error) {
			setClipboardContent("");
			setValidationResult({
				isValid: false,
				error: "クリップボードの読み取りに失敗しました。",
			});
		} finally {
			setIsCheckingClipboard(false);
		}
	}, []);

	// フォームの内容をクリアする関数
	const clearFormContent = useCallback(() => {
		setClipboardContent("");
		setValidationResult({ isValid: false });
		setIsLoading(false);
		setIsCheckingClipboard(false);
	}, []);

	// callbacks
	const handlePresentModalPress = useCallback(async () => {
		bottomSheetModalRef.current?.present();
		// bottomsheetが開かれたタイミングで自動的にクリップボードをチェック
		await checkClipboardAndValidate();
	}, [checkClipboardAndValidate]);

	// bottomsheetが閉じられたときの処理
	const handleModalDismiss = useCallback(() => {
		// bottomsheetが閉じられるたびにフォームの内容をクリア
		clearFormContent();
	}, [clearFormContent]);

	const handleSubmit = async () => {
		if (!validationResult.isValid) return;

		try {
			setIsLoading(true);

			// ここでURLを送信する処理を実装します
			console.log("送信されたURL:", clipboardContent);

			// 成功時の処理
			Alert.alert("成功", "URLが送信されました！");

			// 送信成功時はフォームの内容のみクリア（bottomsheetは開いたまま）
			clearFormContent();
		} catch (e) {
			Alert.alert("エラー", "送信に失敗しました。");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = useCallback(() => {
		bottomSheetModalRef.current?.dismiss();
	}, []);

	return (
		<View className="flex-1 justify-center items-center p-4">
			<View className="w-full max-w-sm">
				<Text className="text-2xl font-bold text-gray-800 text-center mb-6">
					リンク追加
				</Text>

				<Button
					onPress={handlePresentModalPress}
					title="クリップボードからURLを追加"
					color="#3B82F6"
				/>
			</View>

			<BottomSheetModal
				ref={bottomSheetModalRef}
				enablePanDownToClose={true}
				enableDynamicSizing={true}
				detached={true}
				bottomInset={40}
				style={{ marginHorizontal: 16 }}
				backgroundStyle={{
					backgroundColor: "#ffffff",
					borderRadius: 16,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: 0.1,
					shadowRadius: 16,
					elevation: 16,
				}}
				index={0}
				onDismiss={handleModalDismiss}
			>
				<BottomSheetView className="p-6">
					{/* ヘッダー部分 */}
					<View className="mb-6 items-center">
						<Text className="text-xl font-semibold text-gray-800 text-center mb-2">
							Add Link
						</Text>
						<Text className="text-sm text-gray-500 text-center">
							クリップボードからURLを自動取得
						</Text>
					</View>

					{isCheckingClipboard ? (
						<View className="justify-center items-center mb-6 py-12">
							<ActivityIndicator size="large" color="#3B82F6" />
							<Text className="text-gray-500 mt-2">
								クリップボードを確認中...
							</Text>
						</View>
					) : (
						<View>
							{/* クリップボードの内容表示 */}
							<View className="mb-6">
								<Text className="text-sm font-medium text-gray-700 mb-3">
									取得した内容
								</Text>
								<View className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px]">
									<Text className="text-base text-gray-800" numberOfLines={4}>
										{clipboardContent || "クリップボードが空です"}
									</Text>
								</View>
							</View>

							{/* バリデーション結果 */}
							{validationResult.isValid && (
								<View className="border rounded-xl p-4 mb-6 bg-green-50 border-green-200">
									<Text className="text-base font-medium text-green-700">
										✅ 有効なURLです
									</Text>
								</View>
							)}

							{!validationResult.isValid && validationResult.error && (
								<View className="border rounded-xl p-4 mb-6 bg-red-50 border-red-200">
									<Text className="text-base font-medium text-red-700">
										⚠️ {validationResult.error}
									</Text>
								</View>
							)}

							{/* クリップボードを確認するボタンまたは再確認ボタン */}
							<View className="mb-6">
								<Button
									title="クリップボードを確認"
									onPress={checkClipboardAndValidate}
									color="#6B7280"
								/>
							</View>

							{/* 下部のボタン */}
							<View className="mt-2">
								<View className="flex-row gap-3">
									<View className="">
										<Button
											title="キャンセル"
											onPress={handleCancel}
											color="#6B7280"
										/>
									</View>
									<View className="">
										<Button
											title={isLoading ? "送信中..." : "Add Link"}
											onPress={handleSubmit}
											disabled={isLoading || !validationResult.isValid}
											color={validationResult.isValid ? "#10B981" : "#6B7280"}
										/>
									</View>
								</View>
							</View>
						</View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
