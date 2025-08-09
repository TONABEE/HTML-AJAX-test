/**
 * データ取得とデータ操作の純粋関数群
 */

/**
 * JSONPlaceholder APIから写真データを取得
 * @returns {Promise<Array>} 写真データの配列
 */
export async function fetchPhotos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=60');
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: データの取得に失敗しました`);
    }
    
    const data = await response.json();
    return data;
}

/**
 * API生データを使いやすい形に整形（純粋関数）
 * @param {Array} rawItems - API生データ
 * @returns {Array} 整形済みデータ
 */
export function normalizeItems(rawItems) {
    return rawItems.map(item => ({
        id: item.id,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
        url: item.url,
        albumId: item.albumId,
        // 説明文を生成（タイトルの一部を使用）
        description: `アルバム ${item.albumId} の写真です。`
    }));
}

/**
 * タイトルで部分一致フィルタリング（純粋関数）
 * @param {Array} items - フィルタ対象のアイテム配列
 * @param {string} query - 検索クエリ
 * @returns {Array} フィルタ結果
 */
export function filterItems(items, query) {
    if (!query || query.trim() === '') {
        return [...items]; // 空文字の場合は全件返す
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return items.filter(item => 
        item.title.toLowerCase().includes(normalizedQuery)
    );
}

/**
 * ページネーション処理（純粋関数）
 * @param {Array} items - ページネーション対象のアイテム配列
 * @param {number} page - 現在のページ番号（1から開始）
 * @param {number} perPage - 1ページあたりの表示件数
 * @returns {Object} {items: Array, totalPages: number, page: number}
 */
export function paginate(items, page, perPage) {
    const totalPages = Math.ceil(items.length / perPage);
    const validPage = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (validPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    return {
        items: items.slice(startIndex, endIndex),
        totalPages: totalPages || 1,
        page: validPage
    };
}

/**
 * 配列から指定IDのアイテムを検索（純粋関数）
 * @param {Array} items - 検索対象の配列
 * @param {number} id - 検索するID
 * @returns {Object|undefined} 見つかったアイテム
 */
export function findItemById(items, id) {
    return items.find(item => item.id === id);
}

/**
 * アイテム配列の統計情報を取得（純粋関数）
 * @param {Array} items - 統計対象の配列
 * @returns {Object} 統計情報
 */
export function getItemsStats(items) {
    const albumIds = items.map(item => item.albumId);
    const uniqueAlbums = [...new Set(albumIds)];
    
    return {
        totalItems: items.length,
        totalAlbums: uniqueAlbums.length,
        itemsPerAlbum: items.reduce((acc, item) => {
            acc[item.albumId] = (acc[item.albumId] || 0) + 1;
            return acc;
        }, {})
    };
}