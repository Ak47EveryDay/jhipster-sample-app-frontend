# profile-info DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/layouts/profiles/profile-info.model.ts` | 同左 |
| モデル化対象 | プロファイル情報 (`management/info`) の応答と、そこから導くページリボンとナビゲーションバーの表示に必要な値 | `src/app/layouts/profiles/profile.service.ts`（`getProfileInfo()`） |
| 対応するバックエンド | ライブラリーの応答（Spring Boot Actuator の InfoEndpoint）であり、バックエンドの `src/main/java/` 配下に対応するクラスはない。応答の内容はバックエンドの設定で決まる（`info.display-ribbon-on-profiles`、`management.info.git.mode`、`management.info.env.enabled`） | バックエンドの `pom.xml`（`spring-boot-starter-actuator`）、バックエンドの `src/main/resources/config/application.yml` |
| エクスポート | 2 つ（`interface` 1、`class` 1） | `src/app/layouts/profiles/profile-info.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `InfoResponse` | `interface` | `management/info` の応答全体 | `src/app/layouts/profiles/profile-info.model.ts`（`InfoResponse`） |
| `ProfileInfo` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | 応答から導いた値。バックエンドに対応する型はない | 同上（`ProfileInfo`） |

## 3. 項目定義

### `InfoResponse`

対応するバックエンドはライブラリーの応答（Spring Boot Actuator の InfoEndpoint が返す、寄稿者ごとの値を集めたマップ）である。

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `'display-ribbon-on-profiles'` | `string` | 任意 | ページリボンを表示するプロファイルのカンマ区切りの一覧 | バックエンドの設定の `info.display-ribbon-on-profiles`（値は `'dev'`） | `src/app/layouts/profiles/profile-info.model.ts`（`'display-ribbon-on-profiles'`）、バックエンドの `src/main/resources/config/application.yml` |
| `git` | `any` | 任意 | Git の情報。フロントエンドは使わない | ライブラリーの応答: `management.info.git.mode` が `full` のときの Git の情報 | 同上 |
| `build` | `any` | 任意 | ビルドの情報。フロントエンドは使わない | ライブラリーの応答: `management.info.env.enabled` が `true` のときのビルドの情報 | 同上 |
| `activeProfiles` | `string` の配列 | 任意 | 有効なプロファイル | ライブラリーの応答: `management.info.env.enabled` が `true` のときの有効なプロファイル | 同上、`src/app/layouts/profiles/profile.service.ts`（`getProfileInfo()`） |

- 「任意」は、プロパティーを省略できること（`?`）を表す。
- `/management/info` はバックエンドで認証なしで呼べるようにしている（バックエンドの `src/main/java/io/github/jhipster/sample/config/SecurityConfiguration.java`）。

### `ProfileInfo`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `activeProfiles` | `string` の配列 | 任意 | 有効なプロファイル（`InfoResponse.activeProfiles` をそのまま入れる） | バックエンドに対応する型はない（フロントエンドの `ProfileService` が作る） | `src/app/layouts/profiles/profile-info.model.ts`（`activeProfiles`）、`src/app/layouts/profiles/profile.service.ts`（`getProfileInfo()`） |
| `ribbonEnv` | `string` | 任意 | ページリボンに表示するプロファイル名 | 同上 | 同上、`src/app/layouts/profiles/page-ribbon.ts` |
| `inProduction` | `boolean` | 任意 | `activeProfiles` が `prod` を含むか | 同上 | 同上、`src/app/layouts/navbar/navbar.ts` |
| `openAPIEnabled` | `boolean` | 任意 | `activeProfiles` が `api-docs` を含むか | 同上 | 同上 |

- 4 つの項目はいずれも省略できる（`?`）。
- `ProfileInfo` のコンストラクターを本体で呼ぶ箇所はない。`ProfileService` はオブジェクトリテラルで `ProfileInfo` の値を作る。`new ProfileInfo()` を呼ぶのは単体テストだけである。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/layouts/profiles/profile.service.ts` | `ProfileService` | `InfoResponse`、`ProfileInfo` | `http.get<InfoResponse>` の戻り値を `ProfileInfo` に変える、`getProfileInfo()` の戻り値の Observable の型 |
| 部品 | `src/app/layouts/profiles/page-ribbon.ts` | `PageRibbon` | `ProfileInfo`（`import type`） | `profileInfo.ribbonEnv` をシグナル `ribbonEnvSignal` に入れる |

モデルを import せずに `ProfileService.getProfileInfo()` の戻り値の型として間接に使う箇所は、`Navbar`（`src/app/layouts/navbar/navbar.ts`）である。`ngOnInit()` で `inProduction` と `openAPIEnabled` をシグナルに入れる。

使う画面と共通部品は次のとおりである。

- 共通部品のページリボン（[ページリボン_画面設計書](../../02_画面設計/共通/ページリボン/ページリボン_画面設計書.md)）。`ribbonEnv` を表示に使う。
- 共通部品のナビゲーションバー（[ナビゲーションバー_画面設計書](../../02_画面設計/共通/ナビゲーションバー/ナビゲーションバー_画面設計書.md)）。`inProduction` でデータベースのメニュー項目の表示を切り替え、`openAPIEnabled` で API のメニュー項目の表示を切り替える。
- 画面はこのモデルを使わない。

単体テストでは `src/app/layouts/profiles/page-ribbon.spec.ts` と `src/app/layouts/navbar/navbar.spec.ts` が使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（4.1、6.6、7.5）
- [管理_電文レイアウト](../02_電文レイアウト/管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 応答から `ProfileInfo` への変換（`ProfileService.getProfileInfo()`）

- `GET management/info` の応答 (`InfoResponse`) から、次の値を作る。
  1. `activeProfiles` は応答の `activeProfiles` をそのまま入れる。
  2. `inProduction` は `activeProfiles?.includes('prod')`、`openAPIEnabled` は `activeProfiles?.includes('api-docs')` にする。
  3. `activeProfiles` があり、かつ応答に `'display-ribbon-on-profiles'` があるとき、その値をカンマで分割し、`activeProfiles` に含まれるものだけを残す。残ったものが 1 つ以上あれば、先頭のものを `ribbonEnv` にする。
- `git` と `build` は使わない。
- 結果の Observable は `shareReplay()` で共有され、`ProfileService` のフィールド `profileInfo$` に保持される。2 回目以降の `getProfileInfo()` は同じ Observable を返す。

### 5.2 使う側での扱い

- `PageRibbon` は `catchError(() => of(undefined))` で失敗を `undefined` に変え、`ribbonEnv` をシグナル `ribbonEnvSignal` に入れる。値があるときだけリボンを表示する（`src/app/layouts/profiles/page-ribbon.ts`）。
- `Navbar` は `profileInfo.inProduction ?? true` と `profileInfo.openAPIEnabled ?? false` をシグナルに入れる（`src/app/layouts/navbar/navbar.ts`）。
