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
zh/                   繁體中文版（index / menu / book），右上角「中文／EN」切換
styles.css            全站樣式（顏色、字體都在最上面的 :root 變數）
main.js               互動：手機選單、相簿燈箱、菜單搜尋與目錄、捲動淡入
assets/map.js         地圖樣式與標記（顏色都在檔案最上面的 C 物件）
assets/vendor/maplibre 地圖套件 MapLibre GL JS 4.7.1（BSD-3 授權），地圖捲到附近才載入
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

- **配色**：基克拉澤斯白牆（`--lime`，純白）、淡愛琴海藍（`--sand`，分享拼盤區底色）、愛琴海深夜藍（`--ink`，對應照片裡的藍綠磚牆）、logo 的希臘藍（`--sea`）、陶土紅（`--clay`）
- **字體**：標題 Gloock（高對比襯線，呼應 logo）、希臘文 GFS Didot、內文 Hanken Grotesk
- **中文字體**：標題 Noto Serif TC、內文 Noto Sans TC，只在中文頁載入；英文字母仍用 Gloock / Hanken Grotesk
- **地圖**：MapLibre 向量地圖，街道資料來自 OpenFreeMap（免費、不需金鑰），每一層顏色都照網站配色自訂：石灰白地面、淡愛琴海藍建築、白色街道、橄欖綠公園、愛琴海藍水域；自訂 logo「n」定位針和羅素廣場地鐵站標示。手機單指會捲動頁面，兩指才移動地圖
- **母題**：基克拉澤斯拱門形狀的照片框、藍色圓頂、希臘回紋分隔線、`νόστιμο` 字典詞條

## 日常更新

| 要改什麼 | 改哪裡 |
|---|---|
| 菜色／價格 | `menu.html` **和** `zh/menu.html` 的各 `.menu-section`；中英文首頁的招牌菜與燒烤區價格也要一起改 |
| 營業時間 | `index.html` **和** `zh/index.html` 的 Visit 區塊與 JSON-LD |
| 其他文字 | 中英文頁面是各自獨立的 HTML，改一邊記得也改另一邊 |
| 照片 | 放進 `assets/img/`，建議做成 WebP，橫式 800 / 1600、直式 600 / 1200 兩種寬度 |
| 改了 CSS／JS | 把六個頁面 `styles.css?v=8`、`main.js?v=4` 的版本號 +1，避免訪客看到快取的舊版 |

## 內部筆記

原網站檢視結果、待店家確認事項和 pitch 資料放在本機的 `.private/`（已被 `.gitignore` 排除，不會進 git）。

第一次 clone 後啟用 git hooks：

```
git config core.hooksPath .githooks
```

之後每次 commit / push 會擋下 `.private/` 的檔案和 `.private/blocklist.txt` 裡的敏感字詞，並列出 `.private/NOTES.md` 裡未完成的待辦。隨時查看：`sh .githooks/remind.sh`
