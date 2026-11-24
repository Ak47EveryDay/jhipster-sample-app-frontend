# 電文レイアウト（03_IF設計/02_電文レイアウト）

このディレクトリには、フロントエンドとバックエンドの間の HTTP の電文（要求と応答）を API グループごとにまとめます。すべての記述は現在のコード（フロントエンドのコミット `570a360`、バックエンドのコミット `423e462`）に基づきます。文書とコードが食い違う場合はコードを正としてください。

各文書の本文は常体、この README は敬体で書きます。ファイルのパスはリポジトリルート基準です。バックエンドのパスには「バックエンドの」を添えます（バックエンドのパスはフロントエンドのリポジトリには存在しません）。

## 1. 文書一覧

文書名は `<API グループ>_電文レイアウト.md` です。各文書の章立ては `0. 改訂履歴`、`1. 概要`、`2. API 一覧`、`3.` 以降は API ごとの章（`要求電文`、`応答電文`、必要に応じて `フロントエンドの処理`）、最後に `参照資料` です。

| 文書 | 対象のパス | フロントエンドのサービス | 対応するバックエンド | 主な使い先 |
| --- | --- | --- | --- | --- |
| [共通_電文レイアウト](共通_電文レイアウト.md) | （すべて） | `authInterceptor` など 4 つのインターセプター | `SecurityConfiguration`、`ExceptionTranslator` | すべての API に共通する事項 |
| [認証_電文レイアウト](認証_電文レイアウト.md) | `api/authenticate` | `AuthServerProvider` | `AuthenticateController` | ログイン |
| [アカウント_電文レイアウト](アカウント_電文レイアウト.md) | `api/account`、`api/register`、`api/activate`、`api/account/change-password`、`api/account/reset-password/init`、`api/account/reset-password/finish` | `AccountService`、`RegisterService`、`ActivateService`、`PasswordService`、`PasswordResetInitService`、`PasswordResetFinishService` | `AccountResource`、`UserService` | アカウント状態、設定、登録、アカウント有効化、パスワード変更、パスワード再設定依頼、パスワード再設定完了 |
| [ユーザ管理_電文レイアウト](ユーザ管理_電文レイアウト.md) | `api/admin/users` | `UserManagementService` | `UserResource` | ユーザ管理の一覧・詳細・登録・編集・削除 |
| [権限_電文レイアウト](権限_電文レイアウト.md) | `api/authorities` | `AuthorityService` | `AuthorityResource` | 権限の一覧・詳細・登録・削除、ユーザ管理の登録・編集（権限の選択肢） |
| [銀行口座_電文レイアウト](銀行口座_電文レイアウト.md) | `api/bank-accounts` | `BankAccountService` | `BankAccountResource` | 銀行口座の各画面、取引の登録・編集（選択肢） |
| [ラベル_電文レイアウト](ラベル_電文レイアウト.md) | `api/labels` | `LabelService` | `LabelResource` | ラベルの各画面、取引の登録・編集（選択肢） |
| [取引_電文レイアウト](取引_電文レイアウト.md) | `api/operations` | `OperationService` | `OperationResource` | 取引の各画面、ラベルの登録・編集（選択肢） |
| [管理_電文レイアウト](管理_電文レイアウト.md) | `management/info`、`management/configprops`、`management/env`、`management/health`、`management/loggers`、`management/jhimetrics`、`management/threaddump`、`api/users` | `ProfileService`、`ConfigurationService`、`HealthService`、`LogsService`、`MetricsService`、`UserService` | Spring Boot Actuator と JHipster のライブラリー（`api/users` だけは `PublicUserResource`） | ページリボン、ナビゲーションバー、アプリケーション設定、ヘルスチェック、ログ、メトリクス、銀行口座の登録・編集（選択肢） |

公開ユーザーの一覧（`api/users`）は管理 API ではありませんが、管理画面以外に適切なグループがないため、[管理_電文レイアウト](管理_電文レイアウト.md) にまとめます。

## 2. 記載の約束

- パスは `serverApiUrl` を除いた `api/...`、`management/...` の形で書きます。パスパラメーターは `{id}`、`{login}`、`{name}` のように波括弧で書きます。
- 項目の表は、参考プロジェクトの電文レイアウトに合わせて `№`、`Lv`、`項目名称`、`カラム名`、`システム属性`、`必須` と、API ごとに必要な欄（`桁数`、`その他チェック`、`既定値`、`項目説明`、`根拠`）で書きます。
- 「必須」の「あり」は項目が常に現れること、「任意」は省略されうることを表します。バックエンドの検証アノテーションによる必須は「その他チェック」に書きます。
- `根拠` の欄には、フロントエンドのソースのパス（識別子）、バックエンドのソースのパス（クラスとメソッド）、翻訳ファイルのパスを書きます。
- ライブラリー（Spring Boot Actuator、JHipster のフレームワーク、Angular、ngx-translate）の動きは「ライブラリーの動きであり、本リポジトリのコードではない」と明示します。ライブラリーのクラス名はバッククォートで囲まず、出典を添えます。
- コードから確認できないことは「コードからは確認できない」と書きます。コードから読けるが実行して確かめていない動きは「コードからは〜と読める」と書きます。
- 表のセルの中に縦線を書く場合は `\|` でエスケープします。

## 3. 対応するバックエンドによる分類

| 分類 | API | 備考 |
| --- | --- | --- |
| バックエンドのリポジトリにソースがあるもの | `api/authenticate`、`api/account` とアカウント系、`api/admin/users`、`api/authorities`、`api/bank-accounts`、`api/labels`、`api/operations`、`api/users` | バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/` 配下のクラスで、電文の内容をコードで確認できます |
| ライブラリーが提供するもの | `management/info`、`management/configprops`、`management/env`、`management/health`、`management/loggers`、`management/threaddump` | Spring Boot Actuator のエンドポイントです。バックエンドのリポジトリにソースはなく、応答の項目はフロントエンドの型定義を基準に書いています |
| ライブラリーが提供するもの（JHipster） | `management/jhimetrics` | JHipster フレームワークのエンドポイントです。同上 |

## 4. 特記事項

本文書を作成するにあたってコードで確認した、ほかの文書にも影響する事項です。

- アラートのヘッダー名はバックエンドの設定 `jhipster.clientApp.name`（`jhipsterSampleApplicationApp`）から組み立てられます。バックエンドが付ける名前は `X-jhipsterSampleApplicationApp-alert` などであり、フロントエンドはすべて小文字の `x-jhipstersampleapplicationapp-alert` などで読みます。HTTP ヘッダー名は大文字と小文字を区別しないため一致します。
- ユーザ管理の登録（`/user-management/new`）は `POST api/admin/users` を呼びます。フォームの `id` のコントロールの値は `null` になるためです（`FormControl` のコンストラクターの第 1 引数の既定値）。
- ユーザ管理の削除確認の文言は、プレースホルダーの名前（`login`）とテンプレートが渡す値の名前（`id`）が一致しないため、ログイン名が表示されないと読めます。詳細は [ユーザ管理_電文レイアウト](ユーザ管理_電文レイアウト.md) の 7.3 に書いています。

## 5. 関連文書

- [DTO設計書（索引）](../01_DTO設計書/README.md)
- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)
- [HTTP共通処理_画面設計書](../../02_画面設計/共通/HTTP共通処理/HTTP共通処理_画面設計書.md)
- [アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md)
- [アカウント状態と認証_画面設計書](../../02_画面設計/共通/アカウント状態と認証/アカウント状態と認証_画面設計書.md)
- [ルートガードと認可_画面設計書](../../02_画面設計/共通/ルートガードと認可/ルートガードと認可_画面設計書.md)
