# navbar-item DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/layouts/navbar/navbar-item.model.d.ts` | 同左 |
| モデル化対象 | ナビゲーションバーのメニュー項目 1 つ（項目名、遷移先、翻訳キー）の型 | `src/app/layouts/navbar/navbar-item.model.d.ts` |
| 対応するバックエンド | なし。バックエンドとやり取りしない | バックエンドの `src/main/java/` 配下に該当するクラスはない |
| エクスポート | 1 つ（`type`、既定のエクスポート） | `src/app/layouts/navbar/navbar-item.model.d.ts`（`export default NavbarItem`） |
| 依存するモデル | なし | 同上 |
| ファイルの種類 | 型宣言ファイル（`.d.ts`）であり、実行時のコードを含まない | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `NavbarItem` | `type`（オブジェクトの型） | メニュー項目 1 つの型。ただし本体からは使われていない（4 章） | `src/app/layouts/navbar/navbar-item.model.d.ts`（`type NavbarItem`） |

## 3. 項目定義

### `NavbarItem`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | 必須 | 項目名 | なし | `src/app/layouts/navbar/navbar-item.model.d.ts`（`name`） |
| `route` | `string` | 必須 | 遷移先のルート | なし | 同上（`route`） |
| `translationKey` | `string` | 必須 | 表示文言の翻訳キー | なし | 同上（`translationKey`） |

- 「必須」はプロパティーの省略ができないことである。
- 各項目の使われ方をコードから読むことはできない（この型を使う箇所がないため）。

## 4. 使用箇所

- このモデルを import している箇所はない。本体にも単体テストにもない。
- ナビゲーションバーのコンポーネント `Navbar`（`src/app/layouts/navbar/navbar.ts`）とテンプレート `src/app/layouts/navbar/navbar.html` は、メニュー項目をこの型で持たず、テンプレートに `<a routerLink="/bank-account">` のように直接書いている。
- したがって、このモデルを使う画面と共通部品はない。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（3.3）
- [ナビゲーションバー_画面設計書](../../02_画面設計/共通/ナビゲーションバー/ナビゲーションバー_画面設計書.md)

## 5. 変換規則

- このモデルを使った変換はない。
