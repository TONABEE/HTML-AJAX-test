/**
 * メインコントローラー
 * アプリケーションの状態管理とイベント処理
 */

import { fetchPhotos, normalizeItems, filterItems, paginate, findItemById } from './api.js';
import { 
    setLoading, 
    setError, 
    clearError, 
    renderCards, 
    renderPaging, 
    getSearchQuery, 
    scrollToTop,
    showCardDetail 
} from './dom.js';

// アプリケーション状態
const state = {
    allItems: [],
    filteredItems: [],
    currentPage: 1,
    perPage: 12,
    searchQuery: ''
};

/**
 * アプリケーションの初期化
 */
async function init() {
    try {
        setLoading(true);
        clearError();
        
        // データ取得
        const rawData = await fetchPhotos();
        
        // データの正規化
        state.allItems = normalizeItems(rawData);
        state.filteredItems = [...state.allItems];
        state.currentPage = 1;
        state.searchQuery = '';
        
        // 初回描画
        renderCurrentPage();
        
        setLoading(false);
        
    } catch (error) {
        console.error('初期化エラー:', error);
        setLoading(false);
        setError('読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

/**
 * 現在の状態に基づいて画面を描画
 */
function renderCurrentPage() {
    // ページネーション適用
    const { items, totalPages, page } = paginate(
        state.filteredItems, 
        state.currentPage, 
        state.perPage
    );
    
    // カード描画
    renderCards(items);
    
    // ページネーション描画
    renderPaging(page, totalPages);
    
    // 状態を更新
    state.currentPage = page;
}

/**
 * 検索入力イベントハンドラ
 */
function onSearchInput() {
    const query = getSearchQuery();
    
    // 検索クエリが変更された場合のみ処理
    if (query !== state.searchQuery) {
        state.searchQuery = query;
        state.filteredItems = filterItems(state.allItems, query);
        state.currentPage = 1; // 検索時は1ページ目に戻る
        
        renderCurrentPage();
    }
}

/**
 * ページ変更イベントハンドラ
 * @param {string} direction - 'prev' または 'next'
 */
function onPageChange(direction) {
    const { totalPages } = paginate(state.filteredItems, state.currentPage, state.perPage);
    
    if (direction === 'prev' && state.currentPage > 1) {
        state.currentPage--;
    } else if (direction === 'next' && state.currentPage < totalPages) {
        state.currentPage++;
    } else {
        return; // 無効な操作の場合は何もしない
    }
    
    renderCurrentPage();
    scrollToTop();
}

/**
 * カード詳細表示イベントハンドラ
 * @param {number} itemId - 表示するアイテムのID
 */
function onShowDetail(itemId) {
    const item = findItemById(state.allItems, itemId);
    if (item) {
        showCardDetail(item);
    }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // 検索フォーム
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    // フォーム送信の抑止
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    
    // リアルタイム検索（input イベント）
    searchInput.addEventListener('input', onSearchInput);
    
    // ページネーションボタン
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', () => onPageChange('prev'));
    nextBtn.addEventListener('click', () => onPageChange('next'));
    
    // カードのクリックイベント（イベント委譲）
    const cardsList = document.getElementById('cardsList');
    cardsList.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action="detail"]');
        if (button) {
            const itemId = parseInt(button.dataset.id, 10);
            onShowDetail(itemId);
        }
    });
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        // 検索フィールドがフォーカスされていない場合のショートカット
        if (document.activeElement !== searchInput) {
            if (e.key === 'ArrowLeft' || e.key === 'h') {
                e.preventDefault();
                onPageChange('prev');
            } else if (e.key === 'ArrowRight' || e.key === 'l') {
                e.preventDefault();
                onPageChange('next');
            } else if (e.key === '/') {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
}

/**
 * DOM読み込み完了時に実行
 */
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
});

// デバッグ用（開発時のみ）
if (process?.env?.NODE_ENV === 'development') {
    window.appState = state;
    window.appControls = {
        init,
        onSearchInput,
        onPageChange,
        onShowDetail
    };
}