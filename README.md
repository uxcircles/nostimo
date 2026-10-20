# Nostimo — 網站改版提案

純靜態網站（HTML / CSS / JS），不需要建置步驟，任何靜態主機都能直接部署。

> **概念設計展示**：這是由 [UX CIRCLES](https://ux-circles.com/web) 設計的改版提案，並非 Nostimo 官方網站。
> 每頁頂端有「Concept」標示列，所有頁面都設為 `noindex`，`robots.txt` 也禁止搜尋引擎收錄，避免和官方網站搶搜尋結果。
> 如果店家正式採用：刪掉各頁的 `.concept-bar`、`<meta name="robots" content="noindex, nofollow">`，並把 `robots.txt` 改回 `Allow: /`。

## 檔案結構

```
index.html            首頁（招牌菜、分享拼盤、用餐方式、故事、相簿、交通）
menu.html             完整菜單（HTML 版，可搜尋、側邊目錄）
book.html             訂位頁（嵌入 OpenTable，rid=325902，與現有網站同一間）
styles.css            全站樣式（顏色、字體都在最上面的 :root 變數）
main.js               互動：手機選單、相簿燈箱、菜單搜尋與目錄、捲動淡入
assets/img/           照片（WebP，每張兩種尺寸）、logo.svg、logo-light.svg、og.jpg 分享圖
favicon.svg, apple-touch-icon.png
robots.txt
_redirects            舊網址轉址（Netlify / Cloudflare Pages）
vercel.json           舊網址轉址＋快取設定（Vercel）
```

照片與 logo 取自現有的 nostimo.london。

## 本機預覽

```bash
python3 -m http.server 5173
```

然後打開 http://localhost:5173 。OpenTable 訂位工具和地圖一定要透過 http(s) 開啟，直接雙擊 HTML 檔是不會出現的。

## 部署

選一個就好：

- **Netlify**：把整個資料夾拖到 app.netlify.com/drop，會自動讀取 `_redirects`。
- **Cloudflare Pages**：建立專案，選「直接上傳」，上傳這個資料夾。同樣會讀取 `_redirects`。
- **Vercel**：在資料夾裡執行 `npx vercel`，會讀取 `vercel.json`。
- **GitHub Pages**：可以展示，但不支援轉址。

各頁的 `canonical`、`og:url` 和 JSON-LD 目前寫的是 `https://uxcircles.github.io/nostimo/`，換網域時記得一起改。

舊網址（`/about-us/`、`/food-drink/`、`/culinary-gallery/`、`/contact-us/`）會 301 轉到新頁面。

## 設計方向

- **配色**：石灰白牆（`--lime`）、愛琴海深夜藍（`--ink`，對應照片裡的藍綠磚牆）、logo 的希臘藍（`--sea`）、陶土紅（`--clay`）
- **字體**：標題 Gloock（高對比襯線，呼應 logo）、希臘文 GFS Didot、內文 Hanken Grotesk
- **母題**：基克拉澤斯拱門形狀的照片框、藍色圓頂、希臘回紋分隔線、`νόστιμο` 字典詞條

## 現有網站檢視結果（2026-10-20）

| # | 問題 | 改版怎麼處理 |
|---|---|---|
| 1 | 全站**沒有營業時間** | 首頁 Visit 區塊預留位置（見下方待確認） |
| 2 | 首頁的 meta description 還是**八月的休假公告**，Google 搜尋結果和社群分享會顯示過期訊息 | 重寫各頁 description 與 og 標籤 |
| 3 | 菜單**只有 PDF**，英文版 19.8 MB，手機很難打開；其中一顆「Click Here」按鈕連結是 `#`，點了沒反應 | 做成 HTML 菜單，可搜尋、有分類目錄；PDF 留作下載 |
| 4 | 「BOOK NOW」導到聯絡表單，要等人工回覆；OpenTable 即時訂位藏在頁面下方 | 訂位頁直接放 OpenTable，6 人以上才請客人打電話 |
| 5 | Email 連結寫成 `mailto:mailto:info@…`，點了會開出錯誤地址 | 修正 |
| 6 | 大部分頁面**沒有 H1**，菜單頁的 H1 是「ORDER NOW」 | 每頁一個正確的 H1，標題層級完整 |
| 7 | 相簿 44 張照片有 42 張 **alt 是空的**，讀屏軟體和 Google 圖片搜尋都看不到內容 | 每張照片都有描述 |
| 8 | 結構化資料只有 Organization，沒有地址、電話、菜單 | 改用 Restaurant，含地址、座標、電話、菜單連結 |
| 9 | WordPress 每頁載入 15–29 支 script、約 100 KB 行內 CSS | 一支 CSS、一支 JS，沒有第三方追蹤 |
| 10 | Cookie 橫幅寫「繼續使用即視為同意」，不符合 UK GDPR 的同意要求 | 新網站不設 cookie，不需要橫幅 |

## 上線前待確認

還需要店家提供：
- [ ] **營業時間**：填入 `index.html` 的 Visit 區塊（搜尋 `TODO`），並在 JSON-LD 加上 `openingHoursSpecification`
- [ ] **菜單 PDF**：目前連到 nostimo.london 上的檔案，換網域前要下載放進 `assets/menus/`，並改 `menu.html` 的連結
- [ ] **飲料／酒單**：現在只有 PDF 連結，要不要也做成 HTML
- [ ] **素食／純素／無麩質標示**：PDF 有圖例但看不出哪道菜有標，目前只在菜名寫明 vegetarian / vegan 的品項標了 V / VG
- [ ] **故事區的事實**：「Nikos & Alex」出自菜單 PDF，「covered terrace」出自第三方評論，請店家確認
- [ ] 菜單價格以 2025–2026 英文 PDF 為準，請店家確認是否有更新

## 日常更新

| 要改什麼 | 改哪裡 |
|---|---|
| 菜色／價格 | `menu.html` 的各 `.menu-section`；首頁招牌菜與燒烤區的價格也要一起改 |
| 營業時間 | `index.html` 的 Visit 區塊與 JSON-LD |
| 照片 | 放進 `assets/img/`，建議做成 WebP，橫式 800 / 1600、直式 600 / 1200 兩種寬度 |
| 改了 CSS／JS | 把各頁 `styles.css?v=1`、`main.js?v=1` 的版本號 +1，避免訪客看到快取的舊版 |
