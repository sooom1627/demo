export interface OGData {
	image?: string;
	title?: string;
	description?: string;
	domain?: string;
	keywords?: string;
}

// URLからパラメータを削除する関数
export function cleanUrl(url: string): string {
	try {
		const urlObj = new URL(url);
		// パラメータを削除
		urlObj.search = "";
		urlObj.hash = "";
		return urlObj.toString();
	} catch (error) {
		return url;
	}
}

// HTMLからOGタグを抽出する関数
function extractOGTags(html: string): OGData {
	const ogData: OGData = {};

	// og:image
	const imageMatch = html.match(
		/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i
	);
	if (imageMatch) {
		ogData.image = imageMatch[1];
	}

	// og:title
	const titleMatch = html.match(
		/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i
	);
	if (titleMatch) {
		ogData.title = titleMatch[1];
	} else {
		// フォールバック: <title>タグから取得
		const fallbackTitleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		if (fallbackTitleMatch) {
			ogData.title = fallbackTitleMatch[1];
		}
	}

	// og:description
	const descMatch = html.match(
		/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i
	);
	if (descMatch) {
		ogData.description = descMatch[1];
	} else {
		// フォールバック: meta descriptionから取得
		const fallbackDescMatch = html.match(
			/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
		);
		if (fallbackDescMatch) {
			ogData.description = fallbackDescMatch[1];
		}
	}

	// keywords
	const keywordsMatch = html.match(
		/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i
	);
	if (keywordsMatch) {
		ogData.keywords = keywordsMatch[1];
	}

	return ogData;
}

// URLからドメインを取得する関数
function extractDomain(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch (error) {
		return "";
	}
}

// OG情報を取得するメイン関数
export async function fetchOGData(url: string): Promise<OGData> {
	try {
		const cleanedUrl = cleanUrl(url);
		const domain = extractDomain(cleanedUrl);

		const response = await fetch(cleanedUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; OGBot/1.0)",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const html = await response.text();
		const ogData = extractOGTags(html);

		// ドメインを追加
		ogData.domain = domain;

		return ogData;
	} catch (error) {
		console.error("OG情報の取得に失敗しました:", error);
		throw error;
	}
}
