// script.js
console.log("ATHJ Website Loaded");

// 登録者数APIのURL（Google Apps Script等のWebアプリURLをここに設定）
// プレースホルダー: "COUNT_API_URL"
const COUNT_API_URL = "https://script.google.com/macros/s/AKfycbwrfDpyN8zViUGB4HhVF9ZuGdA0go7Eeegg4uXQts09AH5-6Ro-BuG1EBclOvW-1XqS6w/exec";

document.addEventListener('DOMContentLoaded', () => {
    fetchMemberCount();
});

/**
 * 登録者数を取得して表示を更新する
 */
async function fetchMemberCount() {
    const countElement = document.getElementById('member-count');
    if (!countElement) return;

    // API URLが未設定(プレースホルダー)の場合は処理を中断
    if (COUNT_API_URL === "COUNT_API_URL") {
        console.warn("Member count API URL is not set.");
        // エラー時のフォールバック表示（または初期表示のまま）
        countElement.textContent = "登録者数：—人";
        return;
    }

    try {
        // キャッシュ回避のためにtimestampを付与してもよい
        const response = await fetch(COUNT_API_URL);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // レスポンス形式: { "count": 123, ... } を想定
        if (data && typeof data.count === 'number') {
            countElement.textContent = `登録者数：${data.count}人`;
        } else {
            throw new Error("Invalid data format");
        }

    } catch (error) {
        console.error("Failed to fetch member count:", error);
        // エラー時は「—人」で表示
        countElement.textContent = "登録者数：—人";
    }
}
