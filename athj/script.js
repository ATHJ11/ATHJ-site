// script.js
console.log("ATHJ Website Loaded");

// 登録者数APIのURL（Google Apps Script等のWebアプリURL）
const COUNT_API_URL = "https://script.google.com/macros/s/AKfycbwrfDpyN8zViUGB4HhVF9ZuGdA0go7Eeegg4uXQts09AH5-6Ro-BuG1EBclOvW-1XqS6w/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 既存のメンバーカウント取得処理の実行
    fetchMemberCount();

    // 新機能の初期化
    initDarkMode();
    initScrollReveal();
});

/**
 * ダークモードの初期化・切り替えロジック
 */
function initDarkMode() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    const sunIcon = toggleButton.querySelector('.sun-icon');
    const moonIcon = toggleButton.querySelector('.moon-icon');

    // 現在のアクティブテーマを取得
    const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-theme') || 'light';
    };

    // アイコンの表示切替
    const updateIcons = (theme) => {
        if (theme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        }
    };

    // 初期起動時のアイコン表示調整
    updateIcons(getCurrentTheme());

    // ボタンクリック時の切り替えイベント
    toggleButton.addEventListener('click', () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // テーマの適用
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // アイコンの表示切替
        updateIcons(newTheme);
    });
}

/**
 * IntersectionObserverを使用したスクロールアニメーション (Reveal)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 一度表示されたら監視を解除（パフォーマンス向上のため）
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // ビューポート基準
        threshold: 0.08, // 8%が表示されたらフェードイン開始
        rootMargin: "0px 0px -50px 0px" // 画面下部に入る少し手前でトリガー
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 登録者数を取得して表示を更新する（既存機能維持）
 */
async function fetchMemberCount() {
    const countElement = document.getElementById('member-count');
    if (!countElement) return;

    if (COUNT_API_URL === "COUNT_API_URL") {
        console.warn("Member count API URL is not set.");
        countElement.textContent = "登録者数：—人";
        return;
    }

    try {
        const response = await fetch(COUNT_API_URL);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (data && typeof data.count === 'number') {
            countElement.textContent = `登録者数：${data.count}人`;
        } else {
            throw new Error("Invalid data format");
        }

    } catch (error) {
        console.error("Failed to fetch member count:", error);
        countElement.textContent = "登録者数：—人";
    }
}
