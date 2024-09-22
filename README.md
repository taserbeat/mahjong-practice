# mahjong-practice

一人麻雀練習機

# 開発環境

| 名称       | バージョン | 備考                 |
| ---------- | ---------- | -------------------- |
| Node.js    | 18.16.0    | LTS                  |
| Yarn       | 1.22.19    | パッケージ管理ツール |
| TypeScript | 5.x.x      |                      |

# フローチャート

```mermaid
flowchart TD
    Setting["設定画面"] -- "開始" --> Init["初期化処理(配牌)"]
    Init  --> Tsumo["ツモ処理"]
    Tsumo --> AvailableActions("実行可能アクションの算出")
    AvailableActions --> SelectAction{"アクションの選択"}
    SelectAction -- "和了" --> Hora["和了処理"]
    Hora --> Result["結果表示"]
    SelectAction -- "九種九牌" --> Result;
    SelectAction -- "カン" --> Kan["カン処理"]
    Kan --> AvailableActions
    SelectAction -- "打牌" --> Dahai["打牌処理"]
    Dahai["打牌処理"] --> JudgeRyuukyoku("流局判定")
    JudgeRyuukyoku -- "流局の場合" --> Result
    JudgeRyuukyoku -- "流局ではない場合" --> Tsumo
    Result --> SelectRetry{"続けるの選択"}
    SelectRetry -- "同じ設定でもう一度" --> Init
    SelectRetry -- "設定を変更" --> Setting
```

# 牌画像

- [麻雀豆腐](https://majandofu.com/mahjong-images)
