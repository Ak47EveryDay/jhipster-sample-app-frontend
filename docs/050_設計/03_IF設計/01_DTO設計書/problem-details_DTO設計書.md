# problem-details DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/shared/jhipster/problem-details.ts` | 同左 |
| モデル化対象 | バックエンドがエラー時に返す Problem Details（RFC 7807 形式のエラー応答の本文）の型と、その判定関数。ただし本体からは使われていない（4 章） | `src/app/shared/jhipster/problem-details.ts` |
| 対応するバックエンド | バックエンドの `ExceptionTranslator` が作るエラー応答の本文。入力検証のエラーはバックエンドの `FieldErrorVM`、種類を示す URI の既定値はバックエンドの `ErrorConstants` にある | バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java`、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/FieldErrorVM.java`、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ErrorConstants.java` |
| エクスポート | 5 つ（`type` 3、定数 1、関数 1） | `src/app/shared/jhipster/problem-details.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `ProblemDetails` | `type`（オブジェクトの型） | RFC 7807 の Problem Details の基本 5 項目 | `src/app/shared/jhipster/problem-details.ts`（`ProblemDetails`） |
| `ProblemWithMessageType` | 定数（`string`） | メッセージ付きの Problem Details の種類を示す URI | 同上（`ProblemWithMessageType`） |
| `FieldErrorVM` | `type`（オブジェクトの型） | 入力検証のエラー 1 件 | 同上（`FieldErrorVM`） |
| `ProblemWithMessage` | `type`（`ProblemDetails` と `{ type: typeof ProblemWithMessageType }` の交差型に、省略できる 4 項目を加えたもの） | メッセージ、埋め込む値、パス、入力検証のエラーを含む Problem Details | 同上（`ProblemWithMessage`） |
| `isProblemWithMessage` | 関数（型ガード） | `type` が `ProblemWithMessageType` と一致するかを判定する | 同上（`isProblemWithMessage`） |

## 3. 項目定義

### `ProblemDetails`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `type` | `string` | 必須 | 問題の種類を示す URI | バックエンドの `ExceptionTranslator` が設定する `type`。既定値はバックエンドの `ErrorConstants.DEFAULT_TYPE` | `src/app/shared/jhipster/problem-details.ts`（`type`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java`（`customizeProblem()`） |
| `title` | `string` | 必須 | 問題の概要 | バックエンドの `ExceptionTranslator` が設定する `title` | 同上（`title`） |
| `status` | `number` | 必須 | HTTP ステータスコード | バックエンドの `ExceptionTranslator` が設定する `status` | 同上（`status`） |
| `detail` | `string` | 必須 | 問題の説明 | バックエンドの `ExceptionTranslator` が設定する `detail` | 同上（`detail`） |
| `instance` | `string` | 必須 | 発生箇所を示す URI | バックエンドの `ExceptionTranslator` に `instance` を設定する箇所はない | 同上 |

- 「必須」はプロパティーの省略ができないことである。
- バックエンドの `ExceptionTranslator` は、基本 5 項目のほかに `message`、`path`、`fieldErrors` を設定する。これらは `ProblemWithMessage` に対応する。

### `ProblemWithMessage`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `type` | `ProblemWithMessageType` と同じ文字列 | 必須 | 値は `https://www.jhipster.tech/problem/problem-with-message` に固定 | バックエンドの `ErrorConstants.DEFAULT_TYPE`（`PROBLEM_BASE_URL` に `/problem-with-message` を付けた値） | `src/app/shared/jhipster/problem-details.ts`（`ProblemWithMessage`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ErrorConstants.java` |
| `title`、`status`、`detail`、`instance` | `ProblemDetails` に同じ | 必須 | `ProblemDetails` に同じ | `ProblemDetails` に同じ | 同上 |
| `message` | `string` | 任意 | 翻訳キー | バックエンドの `ExceptionTranslator` が `message` に設定する。`BadRequestAlertException` では `error.` にエラーキーを付けた値 | `src/app/shared/jhipster/problem-details.ts`（`message`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/BadRequestAlertException.java` |
| `params` | `string` | 任意 | 翻訳に埋め込む値。エンティティ名である | `BadRequestAlertException` が `params` にエンティティ名を設定する | 同上 |
| `path` | `string` | 任意 | 要求のパス | バックエンドの `ExceptionTranslator` が `path` に要求の URI を設定する | `src/app/shared/jhipster/problem-details.ts`（`path`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java` |
| `fieldErrors` | `FieldErrorVM` の配列 | 任意 | 入力検証のエラーの一覧 | バックエンドの `ExceptionTranslator` が、入力検証の失敗 (`MethodArgumentNotValidException`) のとき `fieldErrors` に `FieldErrorVM` の一覧を設定する | 同上（`fieldErrors`、`getFieldErrors()`） |

- 「任意」はプロパティーを省略できること（`?`）を表す。
- バックエンドの `ExceptionTranslator` は、入力検証の失敗のとき `type` をバックエンドの `ErrorConstants.CONSTRAINT_VIOLATION_TYPE` にする。このときの `type` は `ProblemWithMessageType` と異なるため、応答は `isProblemWithMessage()` では `ProblemWithMessage` と判定されないと読める。

### `FieldErrorVM`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `message` | `string` | 必須 | エラーのメッセージ。バックエンドは既定のメッセージを使い、なければコードを使う | バックエンドの `FieldErrorVM` の `message` | `src/app/shared/jhipster/problem-details.ts`（`FieldErrorVM.message`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/FieldErrorVM.java`、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java`（`getFieldErrors()`） |
| `objectName` | `string` | 必須 | オブジェクトの名前。バックエンドは名前の末尾の `DTO` を除く | バックエンドの `FieldErrorVM` の `objectName` | 同上 |
| `field` | `string` | 必須 | 項目の名前 | バックエンドの `FieldErrorVM` の `field` | 同上 |

### `ProblemWithMessageType`

| 定数 | 値 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- |
| `ProblemWithMessageType` | `'https://www.jhipster.tech/problem/problem-with-message'` | バックエンドの `ErrorConstants.DEFAULT_TYPE` と同じ値 | `src/app/shared/jhipster/problem-details.ts`（`ProblemWithMessageType`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ErrorConstants.java` |

### `isProblemWithMessage`

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| 引数 | `any` | `src/app/shared/jhipster/problem-details.ts`（`isProblemWithMessage`） |
| 戻り値 | 引数の `type` が `ProblemWithMessageType` と一致すれば `true`。型ガードであり、`true` のとき引数を `ProblemWithMessage` として扱える | 同上 |

## 4. 使用箇所

- 本体（単体テストを除く）に、このモデルを import している箇所はない。
- 単体テストでは `src/app/shared/alert/alert-error.spec.ts` が `ProblemWithMessageType` を import する。
- エラー応答の本文を実際に読むのは `AlertError`（`src/app/shared/alert/alert-error.ts`）であるが、`AlertError` は本文を Angular の `HttpErrorResponse` の `error` として、このモデルの型を使わずに読む (`httpErrorResponse.error.message`、`.detail`、`.params`、`.fieldErrors`)。
- したがって、このモデルを使う画面と共通部品はない。エラー応答の本文を扱う画面は [アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md) と [HTTP共通処理_画面設計書](../../02_画面設計/共通/HTTP共通処理/HTTP共通処理_画面設計書.md) に書く。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（7.3）
- [alert-error_DTO設計書](alert-error_DTO設計書.md)
- [headers_DTO設計書](headers_DTO設計書.md)
- [register_DTO設計書](register_DTO設計書.md)（エラー応答の `type` による判別）

## 5. 変換規則

- このモデルを使った変換はない。`isProblemWithMessage()` を本体から呼ぶ箇所もない。
- 参考として、`AlertError` がエラー応答の本文を読む箇所と、このモデルとの対応は次のとおりである（`src/app/shared/alert/alert-error.ts`）。

| `AlertError` の箇所 | 読む項目 | `ProblemWithMessage` の項目 |
| --- | --- | --- |
| `handleBadRequest()` | `httpErrorResponse.error.fieldErrors` | `fieldErrors` |
| `handleBadRequest()` | `httpErrorResponse.error.message`、`.detail`、`.params` | `message`、`detail`、`params` |
| `handleDefaultError()` | `httpErrorResponse.error.message`、`.detail`、`.params` | `message`、`detail`、`params` |
| `handleFieldsError()` | `fieldErrors` の各要素の `message`、`objectName`、`field` | `FieldErrorVM` の同名の項目 |

- `AlertError` は本文の `params` を `addErrorAlert()` の第 3 引数（`translationParams`）に渡す。`ProblemWithMessage` では `params` を `string` として宣言しており、`AlertModel` の `translationParams` は `unknown` を値にとるレコードである。このモデルが import されていないため、この 2 つの型の違いはコンパイラーには検査されない。
