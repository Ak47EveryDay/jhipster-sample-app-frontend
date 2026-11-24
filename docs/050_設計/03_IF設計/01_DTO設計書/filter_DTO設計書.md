# filter DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/shared/filter/filter.model.ts` | 同左 |
| モデル化対象 | 一覧画面の絞り込み（フィルター）の状態。名前と値の一覧を持ち、クエリパラメーターとの相互変換と変更の通知を行う | `src/app/shared/filter/filter.model.ts`（`initializeFromParams()`、`nameAsQueryParam()`、`filterChanges`） |
| 対応するバックエンド | なし。バックエンドとやり取りしない | バックエンドの `src/main/java/` 配下に該当するクラスはない |
| エクスポート | 4 つ（`interface` 2、`class` 2） | `src/app/shared/filter/filter.model.ts` |
| 依存するモデル | なし。Angular の `ParamMap` と RxJS の `Subject` を使う | `src/app/shared/filter/filter.model.ts`（import 文） |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IFilterOptions` | `interface` | フィルター全体の状態のインターフェース。共通部品 `Filter` の `input` の型 | `src/app/shared/filter/filter.model.ts`（`IFilterOptions`） |
| `IFilterOption` | `interface` | フィルター 1 つ（名前と値の一覧）のインターフェース | 同上（`IFilterOption`） |
| `FilterOption` | `class`（`IFilterOption` を実装） | フィルター 1 つの実装 | 同上（`FilterOption`） |
| `FilterOptions` | `class`（`IFilterOptions` を実装） | フィルター全体の実装 | 同上（`FilterOptions`） |

## 3. 項目定義

対応するバックエンドはない。以下の表の「対応するバックエンド」の欄は「なし」であるため省略する。

### `IFilterOptions`

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `filterChanges` | `Subject<FilterOption[]>`（読み取り専用） | 必須 | フィルターが変わったときに流れる Observable。値は設定済みのフィルターの複製 | `src/app/shared/filter/filter.model.ts`（`filterChanges`） |
| `filterOptions` | `IFilterOption[]`（getter） | 必須 | 値が設定されているフィルターの一覧 | 同上（`filterOptions`） |
| `hasAnyFilterSet()` | 戻り値は `boolean` | 必須 | 値が設定されたフィルターがあるか | 同上（`hasAnyFilterSet`） |
| `clear()` | 戻り値は `boolean` | 必須 | 全フィルターを解除する。変更があれば `true` | 同上（`clear`） |
| `initializeFromParams(params)` | 引数は `ParamMap`、戻り値は `boolean` | 必須 | ルートのクエリパラメーターからフィルターを組み立て直す。前と違えば `true` | 同上（`initializeFromParams`） |
| `addFilter(name, ...values)` | 引数は `string` と可変長の `string`、戻り値は `boolean` | 必須 | フィルターに値を加える。加えれば `true` | 同上（`addFilter`） |
| `removeFilter(name, value)` | 引数は `string` 2 つ、戻り値は `boolean` | 必須 | フィルターから値を除く。除けば `true` | 同上（`removeFilter`） |

### `IFilterOption`

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `name` | `string` | 必須 | フィルター名 | `src/app/shared/filter/filter.model.ts`（`IFilterOption.name`） |
| `values` | `string` の配列 | 必須 | このフィルターに設定された値の一覧 | 同上（`values`） |
| `nameAsQueryParam()` | 戻り値は `string` | 必須 | クエリパラメーターとしての名前を返す | 同上（`nameAsQueryParam`） |

### `FilterOption`

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `name` | `string`（コンストラクターの引数） | 必須 | フィルター名 | `src/app/shared/filter/filter.model.ts`（`FilterOption` のコンストラクター） |
| `values` | `string` の配列（コンストラクターの引数、既定値は `[]`） | 必須 | 値の一覧。コンストラクターは重複を除いた新しい配列を代入する | 同上 |
| `nameAsQueryParam()` | 戻り値は `string` | 必須 | `filter[` と `]` で名前を括った文字列を返す | 同上（`nameAsQueryParam()`） |
| `isSet()` | 戻り値は `boolean` | － | 値が 1 つ以上あるか | 同上（`isSet()`） |
| `addValue(...values)` | 引数は可変長の `string`、戻り値は `boolean` | － | 空でなく未設定の値を加える。加えれば `true` | 同上（`addValue()`） |
| `removeValue(value)` | 引数は `string`、戻り値は `boolean` | － | 値を除く。除けば `true` | 同上（`removeValue()`） |
| `clone()` | 戻り値は `FilterOption` | － | 同じ名前と値の複製を作る | 同上（`clone()`） |
| `equals(other)` | 引数は `IFilterOption`、戻り値は `boolean` | － | 名前が同じで、値の一覧が同じ集合か | 同上（`equals()`） |

### `FilterOptions`

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `filterChanges` | `Subject<FilterOption[]>` | 必須 | 変更の通知。`changed()` が設定済みのフィルターの複製の配列を流す | `src/app/shared/filter/filter.model.ts`（`FilterOptions.filterChanges`、`changed()`） |
| `_filterOptions` | `FilterOption[]`（`private`） | 必須 | 全フィルターの配列。コンストラクターの引数（既定値は `[]`）で初期化する | 同上（`_filterOptions`、コンストラクター） |
| `filterOptions` | `FilterOption[]`（getter） | 必須 | 値が設定されているフィルターだけを返す | 同上（`filterOptions`） |
| `hasAnyFilterSet()` | 戻り値は `boolean` | 必須 | 値が設定されたフィルターがあるか | 同上（`hasAnyFilterSet()`） |
| `clear()` | 戻り値は `boolean` | 必須 | 全フィルターを空にし、変更があれば `changed()` を呼ぶ | 同上（`clear()`） |
| `initializeFromParams(params)` | 引数は `ParamMap`、戻り値は `boolean` | 必須 | クエリパラメーターから組み立て直し、前と違えば `true` を返す | 同上（`initializeFromParams()`） |
| `addFilter(name, ...values)` | 引数は `string` と可変長の `string`、戻り値は `boolean` | 必須 | 名前のフィルター（なければ新しく作る）に値を加え、加われば `changed()` を呼ぶ | 同上（`addFilter()`） |
| `removeFilter(name, value)` | 引数は `string` 2 つ、戻り値は `boolean` | 必須 | 名前のフィルターから値を除き、除ければ `changed()` を呼ぶ | 同上（`removeFilter()`） |
| `changed()`、`equals()`、`clone()`、`getFilterOptionByName()` | メソッド（`protected`） | － | 通知、比較、複製、名前による検索（`add` が `true` のときはなければ新しく作る） | 同上 |

- 「必須」はメンバーの省略ができないことである。「－」はメソッドであるため必須・任意の区別がないことを表す。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| 部品 | `src/app/shared/filter/filter.ts` | `Filter`（セレクター `jhi-filter`） | `IFilterOptions` | `input.required<IFilterOptions>()` の `filters`。`clearAllFilters()` が `clear()`、`clearFilter()` が `removeFilter()` を呼ぶ |
| バレル | `src/app/shared/filter/index.ts` | `export * from './filter.model'` | `IFilterOptions`、`IFilterOption`、`FilterOption`、`FilterOptions` | 再エクスポート |

- このモデルを使う画面と共通部品はない。`Filter`（`jhi-filter`）をテンプレートに置いた画面はなく、`Filter` を `imports` に書いたコンポーネントもない。
- `FilterOption`、`FilterOptions`、`IFilterOption` を本体で参照する箇所はない。`FilterOptions` と `FilterOption` を使うのは単体テスト `src/app/shared/filter/filter.model.spec.ts` だけである。
- エンティティの 5 つの一覧画面は、このモデルを使わずに `SortState`（[sort-state_DTO設計書](sort-state_DTO設計書.md)）でクエリパラメーターを扱う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（3.3）
- [sort-state_DTO設計書](sort-state_DTO設計書.md)

## 5. 変換規則

このモデルは本体で使われていないが、ファイルに定義されている変換の規則は次のとおりである。

### 5.1 クエリパラメーターとの対応

- フィルター名のクエリパラメーターへの対応は `FilterOption.nameAsQueryParam()` による。名前を `filter[` と `]` で括った文字列をキーにする。
- `FilterOptions.initializeFromParams(params)` は、キーが正規表現 `/filter\[(.+)\]/` に一致するクエリパラメーターを探し、括弧の中をフィルター名、`params.getAll()` の値をそのフィルターの値として組み立てる。
- 変換の結果をクエリパラメーターに書き戻すメソッドは、このファイルにはない。

### 5.2 値の正規化

- `FilterOption` のコンストラクターは、引数の `values` を `new Set()` に通して重複を除き、新しい配列を `values` に代入する。
- `addValue()` は、空文字列の値と既に含まれる値を加えない。

### 5.3 変更の通知

- `clear()`、`addFilter()`、`removeFilter()` は、状態が変わったときにだけ `changed()` を呼び、`true` を返す。
- `changed()` は `filterChanges.next(...)` で、設定済みのフィルター (`filterOptions`) をそれぞれ `clone()` した配列を流す。
- `initializeFromParams()` は通知せず、変更があったかどうかを戻り値で返す。
