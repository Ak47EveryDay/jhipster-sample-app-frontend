# health DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/admin/health/health.model.ts` | 同左 |
| モデル化対象 | ヘルスチェック画面が表示する、アプリケーションの稼働状況 (`management/health`) の応答 | `src/app/admin/health/health.service.ts`（`checkHealth()`） |
| 対応するバックエンド | ライブラリーの応答（Spring Boot Actuator のヘルスチェック）であり、バックエンドの `src/main/java/` 配下に対応するクラスはない。バックエンドは `management.endpoint.health` に `show-details`、`roles`、`probes` などを設定している | バックエンドの `pom.xml`（`spring-boot-starter-actuator`）、バックエンドの `src/main/resources/config/application.yml` |
| エクスポート | 4 つ（`type` 2、`interface` 2） | `src/app/admin/health/health.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `HealthStatus` | `type` | 稼働状態を表す 4 つの文字列 | `src/app/admin/health/health.model.ts`（`HealthStatus`） |
| `HealthKey` | `type` | コンポーネントのキー 7 種類 | 同上（`HealthKey`） |
| `HealthModel` | `interface` | 応答全体。全体の状態と、コンポーネントごとの状態 | 同上（`HealthModel`） |
| `HealthDetails` | `interface` | コンポーネント 1 つの状態と詳細 | 同上（`HealthDetails`） |

## 3. 項目定義

対応するバックエンドはライブラリーの応答（Spring Boot Actuator のヘルスチェック）である。クラス名はリポジトリのコードには現れない（バックエンドの `pom.xml` の `spring-boot-starter-actuator` に含まれる）。

### `HealthModel`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `status` | `HealthStatus` | 必須 | 全体の稼働状態 | ライブラリーの応答: ヘルスチェックの応答の `status` | `src/app/admin/health/health.model.ts`（`status`）、`src/app/admin/health/health.ts`（`refresh()`） |
| `components` | `HealthKey` をキーの一部に持つ部分的なレコード。値は `HealthDetails` | 任意 | コンポーネントごとの状態。画面は `keyvalue` パイプで行に展開する | ライブラリーの応答: ヘルスチェックの応答の `components` | 同上、`src/app/admin/health/health.html` |

### `HealthDetails`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `status` | `HealthStatus` | 必須 | コンポーネントの稼働状態。画面はバッジの色と文言に使う | ライブラリーの応答: コンポーネントの `status` | `src/app/admin/health/health.model.ts`（`HealthDetails.status`）、`src/app/admin/health/health.html` |
| `details` | `unknown` を値にとるレコード | 任意 | コンポーネントごとの詳細。画面は `details` があるときだけ詳細のダイアログを開けるようにする | ライブラリーの応答: コンポーネントの `details` | 同上、`src/app/admin/health/health.ts`（`showHealth()`） |

### `HealthStatus`

| 値 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- |
| `'UP'` | 正常 | ライブラリーの状態を表す定数 UP | `src/app/admin/health/health.model.ts`（`HealthStatus`） |
| `'DOWN'` | 異常 | ライブラリーの状態を表す定数 DOWN | 同上 |
| `'UNKNOWN'` | 不明 | ライブラリーの状態を表す定数 UNKNOWN | 同上 |
| `'OUT_OF_SERVICE'` | 停止中 | ライブラリーの状態を表す定数 OUT_OF_SERVICE | 同上 |

### `HealthKey`

| 値 | 画面の文言 | 根拠 |
| --- | --- | --- |
| `'diskSpace'` | Disk space | `src/app/admin/health/health.model.ts`（`HealthKey`）、`src/app/admin/health/health.html` |
| `'ssl'` | SSL | 同上 |
| `'mail'` | Email | 同上 |
| `'ping'` | Application | 同上 |
| `'livenessState'` | Liveness state | 同上 |
| `'readinessState'` | Readiness state | 同上 |
| `'db'` | Database | 同上 |

- 「画面の文言」は、テンプレートがキーに対応づけた英語の既定文言である。翻訳キーは `health.indicator.<キー>` である。
- バックエンドの設定では `management.health.mail.enabled` が `false` であり、`probes.enabled` が `true` である（バックエンドの `src/main/resources/config/application.yml`）。実際に応答に含まれるコンポーネントはバックエンドの状態と設定に依存するため、コードからは確認できない。
- バックエンドの設定では `management.endpoint.health.show-details` が `when_authorized`、`roles` が `'ROLE_ADMIN'` である（同上）。`details` が応答に含まれるかどうかはライブラリーの動きによる。
- バックエンドは `/management/health` を認証なしで呼べるようにしている（バックエンドの `src/main/java/io/github/jhipster/sample/config/SecurityConfiguration.java`）。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/admin/health/health.service.ts` | `HealthService` | `HealthModel` | `checkHealth()` の戻り値の Observable の型 |
| 画面 | `src/app/admin/health/health.ts` | `Health` | `HealthModel`、`HealthDetails`、`HealthStatus` | シグナル `health`（`HealthModel` または `null`）、`getBadgeClass()` の引数、`showHealth()` の引数 |
| 部品 | `src/app/admin/health/modal/health-modal.ts` | `HealthModal` | `HealthDetails`、`HealthKey` | フィールド `health`（`key: HealthKey`、`value: HealthDetails`） |

使う画面と共通部品は次のとおりである。

- ヘルスチェック（[ヘルスチェック_画面設計書](../../02_画面設計/300_管理画面/ヘルスチェック/ヘルスチェック_画面設計書.md)）。画面、詳細のダイアログ、サービスの型として使う。
- このモデルを画面のテンプレートで直接 import する箇所はない。

単体テストでは `src/app/admin/health/health.spec.ts` が `HealthModel` を使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.6、7.5）
- [管理_電文レイアウト](../02_電文レイアウト/管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 応答の扱い（`Health.refresh()`）

- `healthService.checkHealth()` の成功 (`next`) では、応答の `HealthModel` をそのままシグナル `health` に入れる。項目の変換はない。
- 失敗 (`error`) では、ステータスが 503 のときにエラーの本文 (`error.error`) をシグナル `health` に入れる。503 以外の失敗では何もしない。
- `getBadgeClass(status)` は、`status` が `'UP'` なら `bg-success`、それ以外なら `bg-danger` を返す（`src/app/admin/health/health.ts`）。

### 5.2 詳細の値の表示（`HealthModal.readableValue()`）

- コンポーネントのキーが `diskSpace` のときは、値をバイト数として読み替える。1073741824 で割った値が 1 を超えれば GB、超えなければ 1048576 で割って MB とし、小数第 2 位まで表示する。
- 値がオブジェクトのときは `JSON.stringify()` にする。それ以外は `String()` にする（`src/app/admin/health/modal/health-modal.ts`）。
