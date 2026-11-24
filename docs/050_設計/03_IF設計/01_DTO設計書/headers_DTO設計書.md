# headers DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/shared/jhipster/headers.ts` | 同左 |
| モデル化対象 | バックエンドがレスポンスヘッダーで返す通知（成功アラート、エラー、埋め込む値）の読み取り。`HeaderMessage` は読み取った結果の型である | `src/app/shared/jhipster/headers.ts`（`getMessageFromHeaders()`） |
| 対応するバックエンド | ライブラリー（JHipster の HeaderUtil）が付けるレスポンスヘッダーであり、バックエンドの `src/main/java/` 配下にヘッダーを作るクラスはない。バックエンドの Resource と `ExceptionTranslator` がライブラリーを呼び出す | バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/BankAccountResource.java`（`HeaderUtil.createEntityCreationAlert()` など）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java`（`HeaderUtil.createFailureAlert()`） |
| エクスポート | 2 つ（`type` 1、関数 1） | `src/app/shared/jhipster/headers.ts` |
| 依存する定数 | `MESSAGE_ALERT_HEADER_NAME`、`MESSAGE_ERROR_HEADER_NAME`、`MESSAGE_PARAM_HEADER_NAME` | `src/app/shared/jhipster/constants.ts`、`src/app/shared/jhipster/headers.ts`（import 文） |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `HeaderMessage` | `type`（オブジェクトの型） | レスポンスヘッダーから読み取った通知の内容 | `src/app/shared/jhipster/headers.ts`（`HeaderMessage`） |
| `getMessageFromHeaders` | 関数 | ヘッダーの一覧から `HeaderMessage` を作る | 同上（`getMessageFromHeaders`） |

`headerToString`、`decodeHeaderValue` は `getMessageFromHeaders` が使うファイル内の関数であり、export していない。

## 3. 項目定義

### `HeaderMessage`

対応するバックエンドは、ライブラリーが付けるレスポンスヘッダーである。ヘッダー名はフロントエンドの定数 (`src/app/shared/jhipster/constants.ts`) にあり、値はライブラリーが組み立てる。

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `alert` | `string` | 任意 | 成功通知のヘッダーの生の値。翻訳キーかメッセージである | ヘッダー `x-jhipstersampleapplicationapp-alert` | `src/app/shared/jhipster/headers.ts`（`alert`）、`src/app/shared/jhipster/constants.ts`（`MESSAGE_ALERT_HEADER_NAME`） |
| `alertKey` | `string` | 任意 | `alert` が翻訳キーの形のとき、その値 | 同上 | 同上（`alertKey`） |
| `alertMessage` | `string` | 任意 | `alert` が翻訳キーの形でないとき、その値 | 同上 | 同上（`alertMessage`） |
| `error` | `string` | 任意 | エラー通知のヘッダーの生の値。翻訳キーかメッセージである | ヘッダー `x-jhipstersampleapplicationapp-error` | 同上（`error`）、`src/app/shared/jhipster/constants.ts`（`MESSAGE_ERROR_HEADER_NAME`） |
| `errorKey` | `string` | 任意 | `error` が翻訳キーの形のとき、その値 | 同上 | 同上（`errorKey`） |
| `errorMessage` | `string` | 任意 | `error` が翻訳キーの形でないとき、その値 | 同上 | 同上（`errorMessage`） |
| `param` | `string` | 任意 | 翻訳に埋め込む値。URL デコードしてある | ヘッダー `x-jhipstersampleapplicationapp-params` | 同上（`param`）、`src/app/shared/jhipster/constants.ts`（`MESSAGE_PARAM_HEADER_NAME`） |

- 「任意」はプロパティーを省略できること（`?`）を表す。
- バックエンドの呼び出しでは、成功通知にエンティティ名と ID を渡す（例: バックエンドの `BankAccountResource` の `HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bankAccount.getId().toString())`）。ユーザ管理では翻訳キー (`userManagement.created` など) とログイン ID を渡す（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/UserResource.java`）。エラー通知にはエンティティ名、エラーキー、既定のメッセージを渡す（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java` の `buildHeaders()`）。
- ヘッダー名とヘッダーの値を組み立てるのはライブラリーであり、コードからは確認できない。フロントエンドの翻訳データには `jhipsterSampleApplicationApp.bankAccount.created`、`jhipsterSampleApplicationApp.bankAccount.updated`、`jhipsterSampleApplicationApp.bankAccount.deleted` などのキーがあり、文言は `{{ param }}` を含む（`src/i18n/en/bankAccount.json`）。
- ヘッダー名の大文字・小文字は、呼び出し側が `headers.keys()` で得たキーをそのまま使うため、HTTP の応答における表記に依存する（コードからは確認できない）。

### `getMessageFromHeaders`

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| 引数 | ヘッダー名をキーとし、値の配列を値とするオブジェクト (`Record<string, any>`) | `src/app/shared/jhipster/headers.ts`（`getMessageFromHeaders`） |
| 戻り値 | `HeaderMessage` | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このファイルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型・関数 | 用途 |
| --- | --- | --- | --- | --- |
| インターセプター | `src/app/core/interceptor/notification.interceptor.ts` | `notificationInterceptor` | `getMessageFromHeaders` | 成功応答 (`HttpResponse`) のヘッダーから成功アラートを作る |
| 部品 | `src/app/shared/alert/alert-error.ts` | `AlertError` | `getMessageFromHeaders` | 400 のエラー応答 (`HttpErrorResponse`) のヘッダーからエラーアラートを作る（`handleBadRequest()`） |

- `HeaderMessage` はファイルの中だけで使う型であり、ほかのファイルは `getMessageFromHeaders` の戻り値として受け取る。

使う画面と共通部品は次のとおりである。

- 共通部品の HTTP共通処理（[HTTP共通処理_画面設計書](../../02_画面設計/共通/HTTP共通処理/HTTP共通処理_画面設計書.md)）。`notificationInterceptor` が使う。
- 共通部品のアラート（[アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md)）。`AlertError` が使う。`<jhi-alert-error />` を置いた画面は、400 のエラー応答のヘッダーを通じて間接に使う。

単体テストでは `src/app/shared/alert/alert-error.spec.ts` が間接に使う（直接 import していない）。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（7.3、7.4）
- [alert-error_DTO設計書](alert-error_DTO設計書.md)
- [problem-details_DTO設計書](problem-details_DTO設計書.md)

## 5. 変換規則

### 5.1 ヘッダーの一覧の作り方（呼び出し側）

- 2 つの呼び出し元は、`HttpResponse` または `HttpErrorResponse` の `headers` から `Object.fromEntries(headers.keys().map(key => [key, headers.getAll(key)]))` でオブジェクトを作り、`getMessageFromHeaders()` に渡す（`src/app/core/interceptor/notification.interceptor.ts`、`src/app/shared/alert/alert-error.ts`）。

### 5.2 `getMessageFromHeaders()` の変換

1. `alert`、`error`、`param` の 3 つのヘッダーを定数の名前で取り出す。
2. `headerToString()` は、値が `undefined` なら `undefined` を返す。配列なら要素が 1 つでなければ `TypeError('Multiple header values found')` を投げ、1 つならその要素を取り出す。文字列でなければ `TypeError('Header value is not a string')` を投げる。
3. `alert` と `error` は、値が翻訳キーの形のときだけ `alertKey` または `errorKey` に入れ、そうでなければ `alertMessage` または `errorMessage` に入れる。「翻訳キーの形」とは、英数字 1 文字で始まり、英数字とピリオドだけからなり、英数字 1 文字で終わる文字列のことである。判定には英数字とピリオドだけを許す正規表現を使う（`src/app/shared/jhipster/headers.ts` の `alertIsKey`、`errorIsKey`）。
4. `param` は `decodeURIComponent()` でデコードする。その前に `+` を半角スペースに置き換える（`decodeHeaderValue()`）。

### 5.3 読み取った値の使い方

- `notificationInterceptor`: `alertKey` があれば `alertService.addAlert({ type: 'success', translationKey: alertKey, translationParams: { param } })` を、なければ `alertMessage` があれば `alertService.addAlert({ type: 'success', message: alertMessage })` を実行する。
- `AlertError.handleBadRequest()`: `errorKey` があれば `addErrorAlert(errorKey, errorKey, alertData)` を実行する。`alertData` は `param` があるとき、翻訳キー `global.menu.entities.<param>` を翻訳した `entityName` を持つオブジェクトである。`errorKey` がなく `errorMessage` があれば `addErrorAlert(errorMessage)` を実行する。
