import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { OGData } from "../lib/ogUtils";

interface OGPreviewProps {
	ogData: OGData;
	url: string;
	onClear?: () => void;
}

export default function OGPreview({ ogData, url, onClear }: OGPreviewProps) {
	return (
		<View className="border border-gray-300 rounded-xl p-4 bg-gray-50 relative">
			{/* クリアボタン */}
			{onClear && (
				<TouchableOpacity
					onPress={onClear}
					className="absolute top-2 right-2 w-6 h-6 bg-gray-600 rounded-full items-center justify-center z-10"
					hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
				>
					<Text className="text-white text-xs font-bold">×</Text>
				</TouchableOpacity>
			)}

			<View className="flex-row">
				{/* OG Image */}
				{ogData.image && (
					<View className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 mr-3">
						<Image
							source={{ uri: ogData.image }}
							style={{ width: "100%", height: "100%", borderRadius: 8 }}
							contentFit="cover"
							placeholder={{
								uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
							}}
						/>
					</View>
				)}

				{/* Content */}
				<View
					className={`flex-1 justify-center ${ogData.image ? "" : "pl-0"} pr-6`}
				>
					{/* Domain */}
					{ogData.domain && (
						<Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
							{ogData.domain}
						</Text>
					)}

					{/* Title */}
					{ogData.title && (
						<Text
							className="text-sm font-medium text-gray-900 mb-1"
							numberOfLines={1}
						>
							{ogData.title}
						</Text>
					)}

					{/* Description */}
					{ogData.description && (
						<Text className="text-xs text-gray-600" numberOfLines={1}>
							{ogData.description}
						</Text>
					)}
				</View>
			</View>

			{/* Keywords and URL - 一番下に小さく表示 */}
			{(ogData.keywords || url) && (
				<View className="mt-3 pt-2 border-t border-gray-200">
					{ogData.keywords && (
						<Text className="text-xs text-blue-600 mb-1" numberOfLines={1}>
							{ogData.keywords}
						</Text>
					)}
					<Text className="text-xs text-gray-400" numberOfLines={1}>
						{url}
					</Text>
				</View>
			)}
		</View>
	);
}
