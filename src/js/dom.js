/**
 * DOM操作の副作用関数群
 */

/**
 * ローディング状態の表示/非表示
 * @param {boolean} isLoading - ローディング状態
 */
export function setLoading(isLoading) {
    const loadingElement = document.getElementById('loadingMessage');
    const errorElement = document.getElementById('errorMessage');
    
    if (isLoading) {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
    } else {
        loadingElement.style.display = 'none';
    }
}

/**
 * エラーメッセージの表示
 * @param {string} message - エラーメッセージ
 */
export function setError(message) {
    const loadingElement = document.getElementById('loadingMessage');
    const errorElement = document.getElementById('errorMessage');
    
    loadingElement.style.display = 'none';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * エラー表示をクリア
 */
export function clearError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'none';
}

/**
 * 単一カードのHTML要素を作成
 * @param {Object} item - カードデータ
 * @returns {HTMLElement} カード要素
 */
function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id;
    
    card.innerHTML = `
        <img src="${item.thumbnailUrl}" alt="${item.title}" loading="lazy">
        <div class="card-content">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-description">${item.description}</p>
            <button class="card-button" data-action="detail" data-id="${item.id}">詳細</button>
        </div>
    `;
    
    return card;
}

/**
 * カード一覧の表示（全置換）
 * @param {Array} items - 表示するカードデータ配列
 */
export function renderCards(items) {
    const container = document.getElementById('cardsList');
    
    // 既存の要素をすべて削除
    container.replaceChildren();
    
    if (items.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <p style="text-align: center; color: #666; font-size: 1.1rem; padding: 2rem;">
                該当する写真が見つかりませんでした。
            </p>
        `;
        container.appendChild(noResults);
        return;
    }
    
    // 新しいカードを作成して追加
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const cardElement = createCardElement(item);
        fragment.appendChild(cardElement);
    });
    
    container.appendChild(fragment);
}

/**
 * ページネーション表示の更新
 * @param {number} currentPage - 現在のページ番号
 * @param {number} totalPages - 総ページ数
 */
export function renderPaging(currentPage, totalPages) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // ボタンの有効/無効状態を設定
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    // ページ情報の表示
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
}

/**
 * 検索入力欄の値を取得
 * @returns {string} 検索クエリ
 */
export function getSearchQuery() {
    const input = document.getElementById('searchInput');
    return input.value.trim();
}

/**
 * 検索入力欄の値をクリア
 */
export function clearSearchInput() {
    const input = document.getElementById('searchInput');
    input.value = '';
}

/**
 * ページ先頭にスクロール
 */
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * カード詳細の表示（モーダル風）
 * @param {Object} item - 表示するアイテム
 */
export function showCardDetail(item) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('cardModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'cardModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        ">
            <button id="closeModal" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #f0f0f0;
                border: none;
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                font-size: 1.2rem;
            ">&times;</button>
            <img src="${item.url}" alt="${item.title}" style="
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin-bottom: 1rem;
            ">
            <h2 style="margin-bottom: 0.5rem;">${item.title}</h2>
            <p style="color: #666; margin-bottom: 1rem;">${item.description}</p>
            <p style="font-size: 0.9rem; color: #888;">画像ID: ${item.id} | アルバムID: ${item.albumId}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // モーダルを閉じるイベント
    function closeModal() {
        modal.remove();
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // ESCキーでモーダルを閉じる
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);
}