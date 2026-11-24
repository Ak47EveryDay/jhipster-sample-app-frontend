# APIドキュメント 画面設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 画面基本情報

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| 画面ID | `/admin/docs` | `src/app/admin/admin.routes.ts`（`path: 'docs'`）、`src/app/app.routes.ts`（`path: 'admin'`） |
| 画面名称 | APIドキュメント。Angular の画面にはページ見出しがなく、`iframe` に静的ページの Swagger UI を表示する。静的ページのタイトルは「jhipsterSampleApplication - Swagger UI」。ブラウザーのタイトルは翻訳キー `global.menu.admin.apidocs`（「API」）である | `src/app/admin/docs/docs.html`（`<iframe>`）、`src/swagger-ui/index.html`（`<title>`）、`src/app/admin/admin.routes.ts`（`title`）、`src/i18n/en/global.json` |
| ルート定義 | `src/app/admin/admin.routes.ts` の `path: 'docs'`（`loadComponent` で `Docs` を読み込む。`resolve`、`canActivate`、`data` の指定はない）。親は `src/app/app.routes.ts` の `path: 'admin'`（`loadChildren`、`canActivate: [userRouteAccessService]`、`data`（`authorities: [Authority.ADMIN]`）） | 各ファイルの `path`、`loadComponent`、`loadChildren`、`canActivate`、`data` |
| コンポーネント | `Docs`（`src/app/admin/docs/docs.ts`、セレクター `jhi-docs`） | 同ファイルの `@Component` |
| テンプレート | `src/app/admin/docs/docs.html` | `Docs` の `templateUrl` |
| 表示に必要な権限 | `ROLE_ADMIN`（`Authority.ADMIN`）。親ルートの `data.authorities` による要求と `userRouteAccessService` による判定。ナビゲーションバーのメニューも同じ権限の要求 | `src/app/app.routes.ts`（`data.authorities`、`canActivate`）、`src/app/shared/jhipster/constants.ts`（`Authority.ADMIN`）、`src/app/core/auth/user-route-access.service.ts`、`src/app/layouts/navbar/navbar.html`（`*jhiHasAnyAuthority="'ROLE_ADMIN'"`） |
| 主な遷移元 | ナビゲーションバーの「Administration」メニューの「API」。メニュー項目は `openAPIEnabled()` が真のときだけ表示される | `src/app/layouts/navbar/navbar.html`（`routerLink="/admin/docs"`、`@if (openAPIEnabled())`）、`src/app/layouts/navbar/navbar.ts`（`openAPIEnabled`） |
| 主な遷移先 | なし（画面内に他画面へのリンクはない） | `src/app/admin/docs/docs.html` |

関連文書:

- [ナビゲーションバー_画面設計書](../../共通/ナビゲーションバー/ナビゲーションバー_画面設計書.md)
- [ルートガードと認可_画面設計書](../../共通/ルートガードと認可/ルートガードと認可_画面設計書.md)
- [HTTP共通処理_画面設計書](../../共通/HTTP共通処理/HTTP共通処理_画面設計書.md)
- [管理_電文レイアウト](../../../03_IF設計/02_電文レイアウト/管理_電文レイアウト.md)

## 2. 機能概要

- バックエンドの OpenAPI の定義を Swagger UI で閲覧する画面である。Swagger UI を `iframe` で埋め込む。
- 画面のコンポーネント `Docs` は状態もメソッドも持たず、API を呼ばない。テンプレートは `<iframe>` 1 つである。
- `iframe` の中身は静的ページ `src/swagger-ui/index.html` である。Angular のルーティング、`HttpClient` のインターセプター、翻訳の対象外である。
- 静的ページは起動すると `GET management/jhiopenapigroups` で API ドキュメントのグループの一覧を取る。グループごとの URL（`v3/api-docs/<グループ>`）を Swagger UI に渡す。取得に失敗したときと一覧が空のときは `v3/api-docs` を渡す。
- 認証トークンは静的ページのスクリプトがストレージから直接読み、`Authorization` ヘッダーに付ける。
- Swagger UI はフィルターと Try it out が有効な状態で起動する。API の一覧の絞り込みや API の試行は Swagger UI（ライブラリー）の機能であり、本リポジトリの Angular のコードではない。
- バックエンドはプロファイル `api-docs` が有効のときだけ OpenAPI の定義を公開する。`dev` プロファイルは `api-docs` を含む。`prod` プロファイル単独では有効にならない。
- ナビゲーションバーは、バックエンドの有効なプロファイルに `api-docs` が含まれるときだけ「API」のメニュー項目を表示する。ルート `/admin/docs` 自体にはこの条件はない。
- 入力項目はない。この画面に `入力チェック一覧` はない。

## 3. 画面レイアウト

画面は `Main` の `<router-outlet />` の中、`<div class="card jh-card">` の内側に表示される（`src/app/layouts/main/main.html`）。テンプレートは `<iframe>` 1 つで、その中に静的ページが表示される。

```
ドキュメント領域（<iframe src="swagger-ui/index.html" width="100%" height="900" title="Swagger UI" class="border-0" data-cy="swagger-frame">）
    静的ページ src/swagger-ui/index.html
        <div id="swagger-ui">   … Swagger UI の表示先
```

| 領域 | テンプレート上の要素 | 表示条件 | 4 章の対応 |
| --- | --- | --- | --- |
| ドキュメント領域 | `<iframe>`（`src="swagger-ui/index.html"`、`data-cy="swagger-frame"`） | 常に | `### ドキュメント領域` |

## 4. 画面表示項目一覧

### ドキュメント領域

| 項目 | 種別 (表示 / 入力 / ボタン / リンク) | バインド先 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- | --- |
| Swagger UI | 表示 | `<iframe>`（`src="swagger-ui/index.html"`、`data-cy="swagger-frame"`） | － | 静的ページ `src/swagger-ui/index.html` を埋め込む。幅は `width="100%"`、高さは `height="900"`、枠線はない（`class="border-0"`）。`src` は相対パスで、`src/index.html` の `<base href="/" />` を基準に `/swagger-ui/index.html` を指す。背景は白 | `src/app/admin/docs/docs.html`、`src/app/admin/docs/docs.scss`（`iframe`）、`src/index.html`（`<base href="/" />`）、`angular.json`（`assets` の `src/swagger-ui`） |

## 5. イベント処理

### 5.1 イベント一覧

| No. | イベント発生源 | イベント | 遷移先 | イベント物理名 |
| --- | --- | --- | --- | --- |
| 1 | 画面 | 初期化（この画面への遷移。ルートガード、`iframe` の読み込み、静的ページの起動） | なし | `loadComponent`、静的ページの `globalThis.onload` |
| 2 | Swagger UI（`iframe` の中） | OpenAPI 定義の取得、API の試行（Try it out） | なし | Swagger UI の動き。本リポジトリでは静的ページの `requestInterceptor` だけが関与 |

### 5.2 イベント詳細

#### 5.2.1 画面初期化

- トリガー: `/admin/docs` への遷移。
- 処理手順:
  1. ルートガード `userRouteAccessService` が `AccountService.identity()` でアカウントを確認する。未ログインなら遷移前の URL を `StateStorageService.storeUrl()` で保存し、`/login` へ遷移してここで終わる。ログインしていても `data.authorities`（`Authority.ADMIN`）を持たなければ `router.navigate(['accessdenied'])` を実行し、この画面への遷移は完了しない。
  2. 遷移が許可されると `loadComponent` が `./docs/docs` を遅延読み込みし、`Docs` が `<iframe>` を描く。`Docs` にはライフサイクルフックはない。
  3. ブラウザーが `iframe` の `src`（`/swagger-ui/index.html`）を読み込む。このファイルは `angular.json` の `assets` に指定した `src/swagger-ui` からそのまま配信される。
  4. 静的ページは `<base href="/swagger-ui/" />` を持ち、`./swagger-ui.css`、`./swagger-ui-bundle.js`、`./swagger-ui-standalone-preset.js`、`./axios.min.js` を読み込む。これらのファイルは `src/swagger-ui/` には置いていない。ビルドのときに `build-plugins/define-esbuild.ts` が依存パッケージ（`swagger-ui-dist`、`axios`）から出力先の `swagger-ui/` に書き出す。
  5. ページの読み込みが終わると `globalThis.onload` が動く。`baseUrl` を `v3/api-docs` とし、`serverBaseUri` を `document.baseURI` から `swagger-ui/` を除いた文字列（例: `http://localhost:9060/`）とする。
  6. `fetchUrls()` が axios で `GET management/jhiopenapigroups` を送る（5.3 の No. 1）。応答の本文が配列なら、各要素の `group` と `description` から、名前が `description`、URL が `<serverBaseUri>v3/api-docs/<group>` であるオブジェクトの一覧を作る。配列でなければ一覧は作らない。
  7. `sortUrls()` が名前で並び替える。`(default)` を含む名前を先頭に、`(management)` を含む名前をその次に、残りは `localeCompare` の順にする。
  8. `initializeSwaggerUI()` が `SwaggerUIBundle` を `<div id="swagger-ui">` に対して呼び、Swagger UI が表示される。引数は `urls`（手順 6、7 の一覧）、`url`（`v3/api-docs`）、`dom_id: '#swagger-ui'`、`deepLinking: true`、`filter: true`、`layout: 'StandaloneLayout'`、`withCredentials: true`、`tryItOutEnabled: true`、`presets`、`plugins`、`requestInterceptor` である。これらは Swagger UI の指定である。
  9. 以降の OpenAPI 定義の取得（`GET v3/api-docs/<グループ>`）は Swagger UI が行う。`requestInterceptor` が各要求の `Authorization` ヘッダーを `getBearerToken()` の結果で上書きする。
- トークンの読み方: `getBearerToken()` は `localStorage`、なければ `sessionStorage` のキー `jhi-authenticationToken` を読み、`JSON.parse()` で文字列にして `Bearer <トークン>` を返す。トークンがなければ `null` を返す。キーの文字列は `src/app/shared/jhipster/constants.ts` の `AUTHENTICATION_TOKEN_KEY` と同じであるが、静的ページは Angular のコードを import せずに直接書いている。要求は `HttpClient` を通らないため、`authInterceptor` は関与しない。
- 開発時の転送: 開発サーバーは `^/(api|management|v3/api-docs|h2-console)` に一致するパスを `http://127.0.0.1:8080` へ転送する（`proxy.config.mjs` の `backendHost` と `backendPort`）。`serverBaseUri` はページの配信元と同じオリジンになるため、開発時はこの転送でバックエンドに届く。
- 状態変化: なし（`Docs` は状態を持たない）。
- 遷移: なし。

#### 5.2.2 Swagger UI による OpenAPI 定義の取得と API の試行

- トリガー: Swagger UI の中の操作（定義の切り替え、Try it out による API の実行など）。発生源は `iframe` の中の Swagger UI であり、Angular のイベントではない。
- 処理手順:
  1. Swagger UI は、`urls` の URL（`v3/api-docs/<グループ>`）へ OpenAPI 定義を要求する（5.3 の No. 2）。
  2. 各要求は静的ページの `requestInterceptor` を通る。`req.headers['Authorization'] = getBearerToken()` で、その時点のストレージにあるトークンを `Authorization` ヘッダーに付ける。
  3. 要求メソッドが GET で、本文がサンプル値 `'{"additionalProp1":"string","additionalProp2":"string","additionalProp3":"string"}'` のときは、その本文を取り除く。
  4. Try it out による API の実行も同じ `requestInterceptor` を通る。バックエンドの API はブラウザーから直接呼ばれ、Angular の `HttpClient` は関与しない。
- Try it out の設定: 静的ページは `tryItOutEnabled: true` を指定し、`AlwaysEnableTryItOutPlugin`（TryItOutButton のコンポーネントが何も描かないようにする）を加えている。コードからは、Try it out を常に有効にする意図であると読める（Swagger UI の動きであり、実機では確認していない）。
- 状態変化: なし（`Docs` は状態を持たない）。
- 遷移: なし。

#### 5.2.3 API ドキュメントが無効のときに画面を開く

- トリガー: バックエンドでプロファイル `api-docs` が無効のときに、URL を直接指定して `/admin/docs` を開く。
- 処理手順: ルートには、メニュー項目のような `openAPIEnabled()` の条件はない。ルートガードを通れば `iframe` は表示される。非表示になるのはナビゲーションバーのメニュー項目だけである。
- 状態変化: なし。
- 遷移: なし。このときに Swagger UI に何が表示されるかは、コードからは確認できない。

### 5.3 API呼び出し一覧

この画面のコンポーネントは API を呼ばない。次の 2 件は `iframe` の中の静的ページと Swagger UI が送る要求である。

| No. | 目的 | メソッド | パス | 要求パラメーター | 応答 | 成功時 | エラー時 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | API ドキュメントのグループの一覧の取得 | GET | `management/jhiopenapigroups` | なし。ヘッダー `Authorization: Bearer <トークン>`（トークンがあるとき）。タイムアウトは 5000 ミリ秒 | 200: `group` と `description` を持つオブジェクトの配列 | グループごとの URL の一覧を Swagger UI に渡す | `console.error` を出力。`v3/api-docs` だけを URL とした Swagger UI の起動 |
| 2 | OpenAPI 定義の取得 | GET | `v3/api-docs/<グループ>`（No. 1 で一覧が取れないときは `v3/api-docs`） | なし。ヘッダー `Authorization`（`requestInterceptor` が付ける） | 200: OpenAPI の定義（springdoc が出力する。本リポジトリに定義はない） | Swagger UI による API の一覧の表示 | Swagger UI の動きであり、コードからは確認できない |

補足:

- No. 1 の呼び出し元は静的ページ `src/swagger-ui/index.html` の `fetchUrls()` である。Angular のサービスは呼ばない。URL は `createAxiosConfig()` の `baseURL`（`serverBaseUri`）に `/management/jhiopenapigroups` を合わせたものである。`serverBaseUri` は `document.baseURI` から作るため、Angular のビルド時定数 `SERVER_API_URL` は使わない。`SERVER_API_URL` でバックエンドのオリジンを別に指定した場合の Swagger UI の動きは、コードからは確認できない。
- No. 2 は Swagger UI（ライブラリー）が送る要求で、要求を組み立てるコードは本リポジトリにない。URL の一覧は No. 1 で作る。
- ライブラリーのファイル: 手順 4 の 4 ファイルとアイコンは、本リポジトリの `src/swagger-ui/` には置いていない（このディレクトリーにあるのは `src/swagger-ui/index.html` だけである）。これらはビルドの出力に依存する。開発サーバー（`ng serve`）でこれらのファイルが同じように配信されるかどうかは、コードからは確認できない。
- バックエンドの公開設定（バックエンドの `src/main/resources/config/application.yml`）は次のとおりである。
  - `management.endpoints.web.exposure.include` に `jhiopenapigroups` が含まれる。
  - `springdoc.api-docs.enabled` は、プロファイル `api-docs` が無効のとき（`spring.config.activate.on-profile` が `'!api-docs'`）に `false` になる。
  - `spring.profiles.group.dev` は `api-docs` を含む。`dev` プロファイルでは OpenAPI の定義が有効である。プロファイルのグループは `dev` しか定義されておらず、`prod` プロファイルの設定（バックエンドの `src/main/resources/config/application-prod.yml`）に `api-docs` を有効にする記述はない。
  - `jhipster.api-docs.default-include-pattern` は `/api/**`、`jhipster.api-docs.management-include-pattern` は `/management/**` である。
- バックエンドの認可（バックエンドの `src/main/java/io/github/jhipster/sample/config/SecurityConfiguration.java`）: `/v3/api-docs/**` と `/management/**` は `AuthoritiesConstants.ADMIN`（`ROLE_ADMIN`）を持つことを要求する。
- サーバー側の実装: `jhiopenapigroups` のエンドポイントは JHipster フレームワーク（ライブラリー）が提供し、OpenAPI の定義は springdoc（ライブラリー）が出力する。バックエンドのリポジトリにソースはない。
- メニュー項目の表示条件: ナビゲーションバーの `openAPIEnabled` は `ProfileService.getProfileInfo()`（`GET management/info`）の結果から作る。`activeProfiles` が `api-docs` を含めば真になる。
- エラー時の共通の動き: この画面の要求は Angular の `HttpClient` を通らないため、`authExpiredInterceptor`、`errorHandlerInterceptor` は動かない。401 などの失敗を Swagger UI がどう表示するかは、コードからは確認できない。共通部品の動きは [HTTP共通処理_画面設計書](../../共通/HTTP共通処理/HTTP共通処理_画面設計書.md) に書く。

### 5.4 画面遷移

| 遷移先 | 条件 | トリガー |
| --- | --- | --- |
| ログイン（`/login`） | 未ログインのままこの画面を開いた | `userRouteAccessService`（遷移前の URL を `StateStorageService.storeUrl()` で保存してから遷移する） |
| アクセス拒否画面（`/accessdenied`） | ログインしているが `ROLE_ADMIN` を持たないユーザー | `userRouteAccessService`（`router.navigate(['accessdenied'])`） |
