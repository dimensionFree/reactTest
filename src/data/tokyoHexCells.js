const tokyoHexCells = [
  {
    id: "sumida-river",
    q: 4,
    r: 1,
    type: "water",
    symbol: "≈",
    name: "隅田川ライン",
    areaHint: "中央区 / 台東区周辺",
    attributes: "water_ratio high",
    description: "河川レイヤーと重なる想定の水タイル。文明なら港を考えたくなる場所。"
  },
  {
    id: "tokyo-bay",
    q: 6,
    r: 4,
    type: "water",
    symbol: "≈",
    name: "東京湾エッジ",
    areaHint: "港区 / 江東区周辺",
    attributes: "water_ratio high, coastline true",
    description: "海岸線に近いタイル。実データ版では水域ポリゴンとの交差面積で分類する。"
  },
  {
    id: "ueno-green",
    q: 3,
    r: 1,
    type: "green",
    symbol: "♣",
    name: "上野グリーン",
    areaHint: "台東区周辺",
    attributes: "green_ratio medium",
    description: "公園・緑地がまとまっている想定の森タイル。都市の中の回復ポイント。"
  },
  {
    id: "imperial-green",
    q: 3,
    r: 3,
    type: "green",
    symbol: "♣",
    name: "皇居グリーン",
    areaHint: "千代田区周辺",
    attributes: "green_ratio high",
    description: "緑地面積が大きい想定のタイル。Web 版では見た目をゲーム風に抽象化する。"
  },
  {
    id: "shinjuku-core",
    q: 1,
    r: 3,
    type: "urban",
    symbol: "◆",
    name: "新宿コア",
    areaHint: "新宿区周辺",
    attributes: "urban_density high",
    description: "市街地として扱う都市タイル。生産力は高そう、家賃も高そう。"
  },
  {
    id: "shibuya-core",
    q: 1,
    r: 4,
    type: "urban",
    symbol: "◆",
    name: "渋谷コア",
    areaHint: "渋谷区周辺",
    attributes: "urban_density high",
    description: "市街地・商業地として見せるタイル。実データ版では土地利用や POI 密度を使える。"
  },
  {
    id: "tokyo-station",
    q: 4,
    r: 3,
    type: "transit",
    symbol: "⇄",
    name: "東京駅ノード",
    areaHint: "千代田区 / 中央区周辺",
    attributes: "station_count high",
    description: "鉄道・駅密度で分類する交通タイル。通勤ダメージの発生源。"
  },
  {
    id: "shinagawa-node",
    q: 3,
    r: 5,
    type: "transit",
    symbol: "⇄",
    name: "品川ノード",
    areaHint: "港区 / 品川区周辺",
    attributes: "station_count medium",
    description: "南側の交通タイル。完成版では駅ポイントとの空間結合で数値化する。"
  },
  {
    id: "ikebukuro-node",
    q: 1,
    r: 1,
    type: "transit",
    symbol: "⇄",
    name: "池袋ノード",
    areaHint: "豊島区周辺",
    attributes: "station_count high",
    description: "北西側の交通タイル。鉄道ネットワークをゲーム的に読むための抽象化。"
  },
  {
    id: "roppongi-urban",
    q: 2,
    r: 4,
    type: "urban",
    symbol: "◆",
    name: "六本木アーバン",
    areaHint: "港区周辺",
    attributes: "urban_density high",
    description: "都市タイル。実際の地図とは違い、ここでは読みやすさ優先で簡略化している。"
  },
  {
    id: "koto-waterfront",
    q: 5,
    r: 4,
    type: "water",
    symbol: "≈",
    name: "江東ウォーターフロント",
    areaHint: "江東区周辺",
    attributes: "water_ratio medium",
    description: "運河や湾岸に近いタイル。水域データが入ると分類の説得力が増す。"
  },
  {
    id: "meiji-green",
    q: 0,
    r: 4,
    type: "green",
    symbol: "♣",
    name: "明治神宮グリーン",
    areaHint: "渋谷区周辺",
    attributes: "green_ratio high",
    description: "大きな緑地を森タイルとして表現するためのセル。"
  },
  {
    id: "asakusa-urban",
    q: 5,
    r: 2,
    type: "urban",
    symbol: "◆",
    name: "浅草アーバン",
    areaHint: "台東区 / 墨田区周辺",
    attributes: "urban_density medium",
    description: "歴史と観光の密度がありそうな都市タイル。文化力は高そう。"
  },
  {
    id: "odaiba-bay",
    q: 4,
    r: 5,
    type: "water",
    symbol: "≈",
    name: "お台場ベイ",
    areaHint: "港区 / 江東区周辺",
    attributes: "coastline true",
    description: "湾岸側の水タイル。完成版では海岸線の処理が見せ場になる。"
  },
  {
    id: "nakano-urban",
    q: 0,
    r: 2,
    type: "urban",
    symbol: "◆",
    name: "中野アーバン",
    areaHint: "中野区周辺",
    attributes: "urban_density medium",
    description: "通常の都市タイル。派手ではないけど、こういうセルが地図の密度を作る。"
  },
  {
    id: "yoyogi-green",
    q: 1,
    r: 5,
    type: "green",
    symbol: "♣",
    name: "代々木グリーン",
    areaHint: "渋谷区周辺",
    attributes: "green_ratio medium",
    description: "公園データとの重なりを想定した森タイル。"
  },
  {
    id: "akihabara-node",
    q: 4,
    r: 2,
    type: "transit",
    symbol: "⇄",
    name: "秋葉原ノード",
    areaHint: "千代田区 / 台東区周辺",
    attributes: "station_count high",
    description: "交通と趣味の圧が高そうなタイル。文明なら特殊区域扱いしたい。"
  },
  {
    id: "meguro-urban",
    q: 2,
    r: 6,
    type: "urban",
    symbol: "◆",
    name: "目黒アーバン",
    areaHint: "目黒区周辺",
    attributes: "urban_density medium",
    description: "南西側の都市タイル。実データ版では地形差も入れたい。"
  }
];

export default tokyoHexCells;
