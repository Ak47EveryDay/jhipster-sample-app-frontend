# alert-error DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/shared/alert/alert-error.model.ts` | 同左 |
| モデル化対象 | エラーアラート 1 件の内容（メッセージ、翻訳キー、埋め込む値）。共通部品 `AlertError` がイベント `jhipsterSampleApplicationApp.error` の内容の型として使う | `src/app/shared/alert/alert-error.ts`（`errorListener`） |
| 対応するバックエンド | なし。HTTP の応答や要求の型ではなく、フロントエンドの内部で受け渡す値の型である | バックエンドの `src/main/java/` 配下に該当するクラスはない |
| エクスポート | 1 つ（`class`） | `src/app/shared/alert/alert-error.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `AlertErrorModel` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | エラーアラート 1 件の内容 | `src/app/shared/alert/alert-error.model.ts`（`AlertErrorModel`） |

## 3. 項目定義

### `AlertErrorModel`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `message` | `string` | 必須 | 表示するメッセージ。翻訳キーが解決できなかったときの代替の文言にもなる | なし | `src/app/shared/alert/alert-error.model.ts`（`message`）、`src/app/core/util/alert.service.ts`（`addAlert()`） |
| `key` | `string` | 任意 | 翻訳キー。`AlertService.addAlert()` の `translationKey` になる | なし | `src/app/shared/alert/alert-error.model.ts`（`key`）、`src/app/shared/alert/alert-error.ts`（`addErrorAlert()`） |
| `params` | `unknown` を値にとるレコード | 任意 | 翻訳に埋め込む値。`AlertService.addAlert()` の `translationParams` になる | なし | 同上（`params`） |

- 「必須」はプロパティーの省略ができないこと、「任意」は省略できること（`?`）を表す。
- `AlertErrorModel` のコンストラクターを呼ぶ箇所は `src/` 配下にない。`AlertError` はイベントの内容をこの型として扱うだけで、値を作っていない。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| 部品 | `src/app/shared/alert/alert-error.ts` | `AlertError` | `AlertErrorModel`（直接 import） | イベント `jhipsterSampleApplicationApp.error` の内容を `EventWithContent<AlertErrorModel>` として受け、`message`、`key`、`params` を `addErrorAlert()` に渡す |
| バレル | `src/app/shared/alert/index.ts` | `export * from './alert-error.model'` | `AlertErrorModel` | 再エクスポート |

- イベント `jhipsterSampleApplicationApp.error` を配信する箇所は本体にない。`EventManager.broadcast()` を本体で呼ぶのは `src/app/core/interceptor/error-handler.interceptor.ts` だけであり、配信するイベントは `jhipsterSampleApplicationApp.httpError` である。
- HTTP エラーの表示 (`AlertError.handleHttpError()`) は、イベントの内容を Angular の `HttpErrorResponse` として扱い、このモデルを使わない。
- したがって、このモデルの値が実際に作られる経路はコードからは確認できない。

使う画面と共通部品は次のとおりである。

- 共通部品のアラート（[アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md)）。`AlertError`（`jhi-alert-error`）が型として使う。`AlertError` 自体はエンティティ 5 種の一覧・詳細・登録・編集・削除ダイアログと、設定、パスワード再設定依頼の 22 のテンプレートに置かれている。
- 単体テストからも参照していない。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.5、7.3）
- [headers_DTO設計書](headers_DTO設計書.md)（HTTP エラーの 400 の応答ヘッダーの読み方）
- [problem-details_DTO設計書](problem-details_DTO設計書.md)（HTTP エラーの応答本文の形）

## 5. 変換規則

### 5.1 `AlertErrorModel` から `AlertModel` への変換（`AlertError.addErrorAlert()`）

- `addErrorAlert(message?, translationKey?, translationParams?)` は `alertService.addAlert({ type: 'danger', message, translationKey, translationParams }, this.alerts)` を呼ぶ。`AlertErrorModel` の 3 項目が、種類を `danger` に定めて `AlertModel` に渡される。
- `AlertModel` は `AlertService` のファイルで export している型であり（`src/app/core/util/alert.service.ts`）、独立した設計書にはしない。内容は次のとおりである。

| 項目 | 型 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 必須 | アラートの連番。`addAlert()` が振る | `src/app/core/util/alert.service.ts`（`AlertModel.id`、`alertId`） |
| `type` | `'success'`、`'danger'`、`'warning'`、`'info'` のいずれか | 必須 | アラートの種類 | 同上（`AlertType`） |
| `message` | `string` | 任意 | 表示するメッセージ。翻訳キーが翻訳できればその結果で上書きされる | 同上（`message`） |
| `translationKey` | `string` | 任意 | 翻訳キー | 同上（`translationKey`） |
| `translationParams` | `unknown` を値にとるレコード | 任意 | 翻訳に埋め込む値 | 同上（`translationParams`） |
| `timeout` | `number` | 任意 | 自動的に閉じるまでのミリ秒。既定値は `5000` | 同上（`timeout`） |
| `toast` | `boolean` | 任意 | トースト表示かどうか。既定値は `false` | 同上（`toast`） |
| `position` | `string` | 任意 | 表示位置。既定値は `'top right'` | 同上（`position`） |
| `close` | 関数 | 任意 | アラートを閉じる関数。`addAlert()` が設定する | 同上（`close`、`closeAlert()`） |

- `addAlert()` の第 1 引数は `Omit<AlertModel, 'id'>` である。
- `AlertError` は `addAlert()` の第 2 引数に自分のシグナル `alerts` を渡す。アラートは `AlertService` 内部のシグナルではなく、`AlertError` のシグナルに入る。
- `addAlert()` は `translationKey` を `translateService.instant()` で翻訳し、結果が `translationNotFoundMessage` を含む未定義キーの形でなければ `message` に上書きする。最後に `DomSanitizer.sanitize(SecurityContext.HTML, ...)` を通す。

### 5.2 HTTP エラーのアラート（`AlertError`）

- HTTP エラーは `AlertErrorModel` を使わず、ステータスに応じて `addErrorAlert()` に直接値を渡す（`src/app/shared/alert/alert-error.ts` の `handleHttpError()`、`handleBadRequest()`、`handleDefaultError()`、`handleFieldsError()`）。詳細は [アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md) と [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md) の 7.3 に書く。
