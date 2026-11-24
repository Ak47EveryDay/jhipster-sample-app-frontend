# sort-state DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/shared/sort/sort-state.ts` | 同左 |
| モデル化対象 | 並び替えの状態（並び替えの列と順序）と、その状態を持つシグナルを作る関数。一覧画面と管理画面の並び替えに使う | `src/app/shared/sort/sort-state.ts`、`src/app/shared/sort/sort.directive.ts` |
| 対応するバックエンド | なし。状態は URL のクエリパラメーター `sort` に反映されるだけで、バックエンドの型には対応しない | バックエンドの `src/main/java/` 配下に該当するクラスはない |
| エクスポート | 3 つ（`type` 2、関数 1） | `src/app/shared/sort/sort-state.ts` |
| 依存するモデル | なし。Angular の `signal` を使う | 同上（import 文） |
| 関連する定数 | `ASC`（`'asc'`）、`DESC`（`'desc'`）、`SORT`（`'sort'`）、`DEFAULT_SORT_DATA`（`'defaultSort'`） | `src/app/config/navigation.constants.ts` |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `SortOrder` | `type` | 並び順（昇順か降順か） | `src/app/shared/sort/sort-state.ts`（`SortOrder`） |
| `SortState` | `type`（オブジェクトの型） | 並び替えの状態。並び替えの列 (`predicate`) と順序 (`order`) | 同上（`SortState`） |
| `sortStateSignal` | 関数 | `SortState` を値にとるシグナルを作る | 同上（`sortStateSignal`） |

## 3. 項目定義

対応するバックエンドはない。以下の表の「対応するバックエンド」の欄は「なし」であるため省略する。

### `SortOrder`

| 値 | 説明 | 根拠 |
| --- | --- | --- |
| `'asc'` | 昇順 | `src/app/shared/sort/sort-state.ts`（`SortOrder`） |
| `'desc'` | 降順 | 同上 |

### `SortState`

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `predicate` | `string` | 任意 | 並び替えの対象の項目名。列の見出しの `jhiSortBy` の値と同じ文字列（例: `id`、`name`） | `src/app/shared/sort/sort-state.ts`（`predicate`）、`src/app/shared/sort/sort-by.directive.ts`（`jhiSortBy`） |
| `order` | `SortOrder` | 任意 | 並び順 | 同上（`order`） |

- 「任意」はプロパティーを省略できること（`?`）を表す。両方を省略した `{}` は、並び替えが未指定であることを表す。

### `sortStateSignal(state)`

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| 引数 | 初期状態の `SortState` | `src/app/shared/sort/sort-state.ts`（`sortStateSignal`） |
| 戻り値 | `SortState` を値にとる書き込み可能なシグナル (`WritableSignal<SortState>`) | 同上 |
| 等価の判定 | `predicate` と `order` が両方とも等しければ等しいとみなす。オブジェクトが新しく作られても、内容が同じならシグナルの値は変わった扱いにならない | 同上（`equal`） |

## 4. 使用箇所

本体（単体テストを除く）のうち、このファイルを import しているファイルである。`src/app/shared/sort/index.ts` が `export * from './sort-state'` で再エクスポートするため、バレルの `app/shared/sort` から import する箇所もある。

| 分類 | ファイル | クラス | 使っている型・関数 | 用途 |
| --- | --- | --- | --- | --- |
| ディレクティブ | `src/app/shared/sort/sort.directive.ts` | `SortDirective` | `SortOrder`、`SortState`（直接 import） | `model.required<SortState>()` の `sortState`、`output<SortState>()` の `sortChange`、`sort(field)` の処理 |
| サービス | `src/app/shared/sort/sort.service.ts` | `SortService` | `SortState`（直接 import） | `startSort()`、`parseSortParam()`、`buildSortParam()` の引数と戻り値 |
| 画面 | `src/app/entities/bank-account/list/bank-account.ts` | `BankAccount` | `SortState`、`sortStateSignal`（`app/shared/sort` から） | フィールド `sortState = sortStateSignal({})`、`fillComponentAttributeFromRoute()`、`refineData()`、`handleNavigation()` |
| 画面 | `src/app/entities/label/list/label.ts` | `Label` | 同上 | 同じ使われ方 |
| 画面 | `src/app/entities/operation/list/operation.ts` | `Operation` | 同上 | `sortState`、`handleNavigation()`。続きのページの取得でも `sortState()` を使う |
| 画面 | `src/app/entities/admin/user-management/list/user-management.ts` | `UserManagement` | 同上 | `sortState`、`fillComponentAttributeFromRoute()`、`queryBackend()`、`handleNavigation(page, sortState)` |
| 画面 | `src/app/entities/admin/authority/list/authority.ts` | `Authority` | 同上 | `BankAccount` と同じ使われ方 |
| 画面 | `src/app/admin/configuration/configuration.ts` | `Configuration` | `sortStateSignal`（`app/shared/sort` から） | `sortState = sortStateSignal({ predicate: 'prefix', order: 'asc' })`、`computed` の `beans` |
| 画面 | `src/app/admin/logs/logs.ts` | `Logs` | `sortStateSignal`（`app/shared/sort` から） | `sortState = sortStateSignal({ predicate: 'name', order: 'asc' })`、`computed` の `filteredAndOrderedLoggers` |
| バレル | `src/app/shared/sort/index.ts` | `export * from './sort-state'` | `SortOrder`、`SortState`、`sortStateSignal` | 再エクスポート |

- `SortByDirective`（`src/app/shared/sort/sort-by.directive.ts`）はこのファイルを import しない。親の `SortDirective` の `sortState()` の値の `predicate` と `order` を読むことで、間接に使う。
- `SortOrder` を直接使うのは `SortDirective` だけである。

使う画面と共通部品は次のとおりである。

- エンティティ 5 種の一覧。銀行口座一覧（[銀行口座一覧_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/一覧/銀行口座一覧_画面設計書.md)）、ラベル一覧（[ラベル一覧_画面設計書](../../02_画面設計/400_エンティティ/ラベル/一覧/ラベル一覧_画面設計書.md)）、取引一覧（[取引一覧_画面設計書](../../02_画面設計/400_エンティティ/取引/一覧/取引一覧_画面設計書.md)）、ユーザ管理一覧（[ユーザ管理一覧_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/一覧/ユーザ管理一覧_画面設計書.md)）、権限一覧（[権限一覧_画面設計書](../../02_画面設計/400_エンティティ/権限/一覧/権限一覧_画面設計書.md)）。状態はクエリパラメーター `sort` に反映する。
- アプリケーション設定（[アプリケーション設定_画面設計書](../../02_画面設計/300_管理画面/アプリケーション設定/アプリケーション設定_画面設計書.md)）、ログ（[ログ_画面設計書](../../02_画面設計/300_管理画面/ログ/ログ_画面設計書.md)）。状態は画面の中だけで使い、クエリパラメーターには反映しない。
- 共通部品として独立した画面設計書はない。並び替えの部品 (`src/app/shared/sort/`) の概要は [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md) の 10 章にある。

単体テストでは `src/app/shared/sort/sort.directive.spec.ts` と `src/app/shared/sort/sort-by.directive.spec.ts` が使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.3、10 章）
- [request_DTO設計書](request_DTO設計書.md)（ページングの要求の型。`sort` を項目に持つが、本体では使われていない）

## 5. 変換規則

### 5.1 クエリパラメーター `sort` との変換（`SortService`）

| メソッド | 向き | 変換 | 根拠 |
| --- | --- | --- | --- |
| `buildSortParam({ predicate, order }, fallback?)` | `SortState` からクエリパラメーターへ | `predicate` と `order` が両方あれば `predicate,order` の形の文字列を 1 要素とする配列 (`['id,asc']` など) を返す。両方がなければ空配列である | `src/app/shared/sort/sort.service.ts`（`buildSortParam()`） |
| `parseSortParam(sortParam)` | クエリパラメーターから `SortState` へ | カンマを含めば `predicate` と `order` に分ける。含まなければ `predicate` だけを設定する（空文字列なら `undefined`） | 同上（`parseSortParam()`） |

- 一覧画面の `fillComponentAttributeFromRoute()` は、`this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA])` で `sortState` を設定する。クエリパラメーター `sort` がなければ、ルートの `data.defaultSort` を使う。
- `data.defaultSort` をルートに持つのは銀行口座、ラベル、取引の一覧だけで、値は `id,asc` である（`src/app/entities/bank-account/bank-account.routes.ts`、`src/app/entities/label/label.routes.ts`、`src/app/entities/operation/operation.routes.ts`）。ユーザ管理と権限の一覧のルートにはない。
- `buildSortParam()` の第 2 引数 (`fallback`) に `asc` を付けて加える。本体で第 2 引数を渡す箇所はない。

### 5.2 並び替えの操作（`SortDirective`）

- テンプレートは `<tr jhiSort [(sortState)]="sortState" (sortChange)="navigateToWithComponentValues($event)">` の形で、画面の `sortState` とディレクティブを双方向で束縛する（エンティティの 5 つの一覧画面）。アプリケーション設定とログは `(sortChange)` を付けない。
- `SortDirective.sort(field)` は、`field` が今の `predicate` と同じなら `order` を反転させ (`asc` と `desc`)、違うなら `order` を `asc` にする。`sortState` を更新し、`sortChange` に新しい状態を出す。

### 5.3 並び替えの実行（`SortService.startSort()`）

- `startSort({ predicate, order }, fallback?)` は、`predicate` と `order` の両方が必須の引数を受け、項目どうしを比較する関数を返す。
- 比較には `new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })` を使い、`a[predicate]` と `b[predicate]` を比べる。`order` が `desc` なら符号を反転する。等しくて `fallback` があれば `fallback` で比べ直す。
- 呼び出し元は、銀行口座、ラベル、権限の一覧画面の `refineData()`、アプリケーション設定の `computed` の `beans`、ログの `computed` の `filteredAndOrderedLoggers` である。ログだけは第 2 引数に `{ predicate: 'name', order: 'asc' }` を渡す。
- `a[predicate]` は項目のプロパティーをそのまま比べるため、ドットを含む `predicate` (`user.login` など) では表示順は変わらないと読める。
