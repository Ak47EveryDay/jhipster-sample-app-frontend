# request DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/core/request/request.model.ts` | 同左 |
| モデル化対象 | ページングと検索のクエリパラメーターの型。`createRequestOption()` に渡す要求の形として定義されている | `src/app/core/request/request.model.ts`、`src/app/core/request/request-util.ts` |
| 対応するバックエンド | なし。バックエンドに対応するクラスはない | バックエンドの `src/main/java/` 配下に該当するクラスはない |
| エクスポート | 3 つ（`interface`） | `src/app/core/request/request.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `Pagination` | `interface` | ページ番号、1 ページの件数、並び順 | `src/app/core/request/request.model.ts`（`Pagination`） |
| `Search` | `interface` | 検索語 | 同上（`Search`） |
| `SearchWithPagination` | `interface` | `Search` と `Pagination` を継承した型（独自の項目はない） | 同上（`SearchWithPagination`） |

## 3. 項目定義

### `Pagination`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `page` | `number` | 必須 | ページ番号 | 対応するバックエンドの型はない。バックエンドの一覧の API は Spring Data の `Pageable` を引数に取る（ライブラリーの型） | `src/app/core/request/request.model.ts`（`page`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/UserResource.java`（`getAllUsers()` の引数） |
| `size` | `number` | 必須 | 1 ページの件数 | 同上 | 同上 |
| `sort` | `string` の配列 | 必須 | 並び順。`SortService.buildSortParam()` が作る `<列>,<asc または desc>` の形の文字列の配列 | 同上 | 同上、`src/app/shared/sort/sort.service.ts`（`buildSortParam()`） |

### `Search`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `query` | `string` | 必須 | 検索語 | 対応するバックエンドの型はない | `src/app/core/request/request.model.ts`（`query`） |

### `SearchWithPagination`

`Search` と `Pagination` を継承した型であり、項目は `query`、`page`、`size`、`sort` の 4 つである（`src/app/core/request/request.model.ts`）。

補足:

- この 3 つの型を本体で使っている箇所はない（4 章）。
- ページングに近い要求を実際に送っているのはユーザ管理の一覧画面だけである。`{ page: pageToLoad - 1, size: this.itemsPerPage(), sort: this.sortService.buildSortParam(this.sortState()) }` をオブジェクトリテラルとして作り、`Pagination` の型は使っていない（`src/app/entities/admin/user-management/list/user-management.ts` の `queryBackend()`）。`page` は 0 始まりで送る。
- 検索語 `query` を送る画面はない（`src/` 配下の各 `queryBackend()` と各サービス）。

## 4. 使用箇所

- 本体（単体テストを除く）に、このモデルを import して使う箇所はない。
- `src/app/core/request/index.ts` が `export * from './request.model'` で再エクスポートするだけである。バレルの `app/core/request` を import している 6 ファイル（エンティティの各サービス）が使うのは `createRequestOption` だけであり、このモデルの型は使わない。
- 単体テストからも参照していない。
- したがって、このモデルを使う画面と共通部品はない。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（3.3、7.5）
- [sort-state_DTO設計書](sort-state_DTO設計書.md)（`sortState` とクエリパラメーター `sort` の変換）

## 5. 変換規則

- このモデル自体の変換はない。
- 同じバレルに入る `createRequestOption(req?)`（`src/app/core/request/request-util.ts`）が、オブジェクトを `HttpParams` に変換する。引数の型は `any` であり、このモデルの型とは結びついていない。
- `createRequestOption()` の動きは次のとおりである。
  1. オブジェクトの各プロパティーのうち、値が `undefined` または `null` のものを除く。
  2. 値を配列に包んで平坦化し (`[req[key]].flat()`)、配列なら要素ごとに、そうでなければ 1 回、キーに追加する。
  3. 空文字列 (`''`) の要素を除く。
- エンティティの各サービスの `query(req?)` が `createRequestOption(req)` を使い、結果を `HttpClient` の `get` の `params` に渡す（`src/app/entities/**/service/*.service.ts`）。`query()` の呼び出し元は引数を渡していない。
