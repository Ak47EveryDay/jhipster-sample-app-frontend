# configuration DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/admin/configuration/configuration.model.ts` | 同左 |
| モデル化対象 | アプリケーション設定画面が表示する、Spring の構成プロパティー (`management/configprops`) と、環境のプロパティーソース (`management/env`) の応答 | `src/app/admin/configuration/configuration.service.ts`（`getBeans()`、`getPropertySources()`） |
| 対応するバックエンド | ライブラリーの応答（Spring Boot Actuator）であり、バックエンドの `src/main/java/` 配下に対応するクラスはない。バックエンドは `spring-boot-starter-actuator` に依存し、`management.endpoints.web.exposure.include` に `configprops` と `env` を指定している | バックエンドの `pom.xml`（`spring-boot-starter-actuator`）、バックエンドの `src/main/resources/config/application.yml` |
| エクスポート | 9 つ（`interface` 6、`type` 3） | `src/app/admin/configuration/configuration.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `ConfigProps` | `interface` | `management/configprops` の応答全体 | `src/app/admin/configuration/configuration.model.ts`（`ConfigProps`） |
| `Contexts` | `type` | コンテキスト名をキーとした `Context` のマップ | 同上（`Contexts`） |
| `Context` | `interface` | コンテキスト 1 つ分の構成プロパティー | 同上（`Context`） |
| `Beans` | `type` | Bean 名をキーとした `Bean` のマップ | 同上（`Beans`） |
| `Bean` | `interface` | 構成プロパティーを持つ Bean 1 つ。画面のテーブルの行 | 同上（`Bean`） |
| `Env` | `interface` | `management/env` の応答全体 | 同上（`Env`） |
| `PropertySource` | `interface` | プロパティーソース 1 つ。画面の見出しとテーブル | 同上（`PropertySource`） |
| `Properties` | `type` | プロパティー名をキーとした `Property` のマップ | 同上（`Properties`） |
| `Property` | `interface` | プロパティー 1 つ | 同上（`Property`） |

## 3. 項目定義

対応するバックエンドはライブラリーの応答（Spring Boot Actuator）である。以下の表の「ライブラリーの応答」の欄には、ライブラリーのエンドポイントのクラスと、その応答を作るクラスの名前を書く。これらのクラス名はリポジトリのコードには現れない（バックエンドの `pom.xml` の `spring-boot-starter-actuator` に含まれる）。

### `ConfigProps`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `contexts` | `Contexts` | 必須 | コンテキスト名をキーとした `Context` のマップ | ライブラリーの応答: ConfigurationPropertiesReportEndpoint の `contexts` | `src/app/admin/configuration/configuration.model.ts`（`contexts`）、`src/app/admin/configuration/configuration.service.ts`（`getBeans()`） |

### `Context`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `beans` | `Beans` | 必須 | このコンテキストの Bean のマップ | ライブラリーの応答: ConfigurationPropertiesReportEndpoint のコンテキストの `beans` | `src/app/admin/configuration/configuration.model.ts`（`beans`）、`src/app/admin/configuration/configuration.service.ts`（`getBeans()`） |
| `parentId` | `any` | 任意 | 親コンテキストの ID。画面は使わない | ライブラリーの応答: 同じクラスの `parentId` | 同上 |

### `Bean`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `prefix` | `string` | 必須 | 構成プロパティーの接頭辞。画面の 1 列目。絞り込みと並び替えの対象 | ライブラリーの応答: ConfigurationPropertiesReportEndpoint の Bean の `prefix` | `src/app/admin/configuration/configuration.model.ts`（`prefix`）、`src/app/admin/configuration/configuration.ts`（`beans`） |
| `properties` | `any` | 必須 | プロパティーのマップ。画面は `keyvalue` パイプで展開し、値を `json` パイプで表示する | ライブラリーの応答: 同じクラスの Bean の `properties` | 同上、`src/app/admin/configuration/configuration.html` |

- ライブラリーの応答には、Bean ごとに inputs もあるが、`Bean` は宣言していない。

### `Contexts`、`Beans`

- `Contexts` は `Record<string, Context>`、`Beans` は `Record<string, Bean>` である。キーはそれぞれコンテキスト名と Bean 名であるが、フロントエンドはキーを使わず、値だけを取り出す（5.1）。

### `Env`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `activeProfiles` | `string` の配列 | 任意 | 有効なプロファイル | ライブラリーの応答: EnvironmentEndpoint の `activeProfiles` | `src/app/admin/configuration/configuration.model.ts`（`activeProfiles`）、`src/app/admin/configuration/configuration.service.ts`（`getPropertySources()`） |
| `propertySources` | `PropertySource` の配列 | 必須 | プロパティーソースの一覧 | ライブラリーの応答: EnvironmentEndpoint の `propertySources` | 同上 |

- `activeProfiles` は宣言にあるが、設定画面は使わない。
- ライブラリーの応答には defaultProfiles もあるが、`Env` は宣言していない。

### `PropertySource`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | 必須 | プロパティーソースの名前。画面の見出し | ライブラリーの応答: EnvironmentEndpoint のプロパティーソースの `name` | `src/app/admin/configuration/configuration.model.ts`（`name`）、`src/app/admin/configuration/configuration.ts`（`propertySources`） |
| `properties` | `Properties` | 必須 | プロパティーのマップ | ライブラリーの応答: 同じクラスのプロパティーソースの `properties` | 同上、`src/app/admin/configuration/configuration.html` |

### `Property`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | 必須 | プロパティーの値。画面は `property.value.value` として表示する | ライブラリーの応答: EnvironmentEndpoint のプロパティーの `value` | `src/app/admin/configuration/configuration.model.ts`（`value`）、`src/app/admin/configuration/configuration.html` |
| `origin` | `string` | 任意 | 値の由来。画面は使わない | ライブラリーの応答: 同じクラスのプロパティーの `origin` | 同上 |

- ライブラリーの応答では `value` は文字列とは限らない型であり、originParents もあるが、フロントエンドは `value` を `string` と宣言し、originParents は宣言していない。
- `Properties` は `Record<string, Property>` である。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/admin/configuration/configuration.service.ts` | `ConfigurationService` | `ConfigProps`、`Beans`、`Bean`、`Env`、`PropertySource` | `getBeans()`（`http.get<ConfigProps>` の戻り値を `Bean` の配列に変える）、`getPropertySources()`（`http.get<Env>` の戻り値から `PropertySource` の配列を取り出す） |
| 画面 | `src/app/admin/configuration/configuration.ts` | `Configuration` | `Bean`、`PropertySource` | シグナル `allBeans`（`Bean` の配列または `undefined`）、`propertySources`、`computed` の `beans` |

使う画面と共通部品は次のとおりである。

- アプリケーション設定（[アプリケーション設定_画面設計書](../../02_画面設計/300_管理画面/アプリケーション設定/アプリケーション設定_画面設計書.md)）。サービスと画面の型として使う。
- `Contexts`、`Context`、`Properties`、`Property` はモデルのファイルの中だけで参照する。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートは画面のシグナルを通じて値を読む）。

単体テストでは `src/app/admin/configuration/configuration.service.spec.ts` が使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.6、7.5）
- [管理_電文レイアウト](../02_電文レイアウト/管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 応答から `Bean` の配列への変換（`ConfigurationService.getBeans()`）

- `GET management/configprops` の応答 (`ConfigProps`) を、次の順で `Bean` の配列に変える。
  1. `configProps.contexts` の値 (`Context` の配列) を取り出す。
  2. 各 `Context` の `beans` を 1 つのオブジェクトにマージする（`reduce` で `{ ...allBeans, ...contextBeans }` を繰り返す）。
  3. マージしたオブジェクトの値 (`Object.values`) を `Bean` の配列として返す。
- したがって、コンテキスト名と Bean 名は画面に渡らない。

### 5.2 応答から `PropertySource` の配列への変換（`ConfigurationService.getPropertySources()`）

- `GET management/env` の応答 (`Env`) から `env.propertySources` を取り出して返す。

### 5.3 画面での絞り込みと並び替え（`Configuration.beans`）

- `computed` の `beans` は、`allBeans()`（なければ空配列）のうち、`prefix` が絞り込みの文字列 (`beansFilter`) を大文字・小文字を区別なく含むものだけを残す。
- 残ったものを `sortState`（初期値は `predicate: 'prefix'`、`order: 'asc'`）に従い `sortService.startSort()` で並び替える。
- テンプレートは `Bean` の `properties` を `keyvalue` パイプで展開し、値を `json` パイプで表示する。プロパティーソースは `PropertySource` ごとに見出しとテーブルを描き、プロパティーの値は `property.value.value` を表示する（`src/app/admin/configuration/configuration.html`）。
