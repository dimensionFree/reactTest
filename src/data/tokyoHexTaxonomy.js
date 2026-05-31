export const HEX_TYPE_META = {
  campus: {
    kind: "district",
    kindLabel: "区域",
    label: "学院",
    shortLabel: "学",
    icon: "/static/civ6/district-campus.png",
    color: "#536fb1",
    accent: "#b9c9ff",
    yields: ["科技 +2", "文化 +1"],
    gisRule: "大学、学校、图书馆、研究机构等教育/研究 POI 在 hex 内占优。",
    mapping: "对应文明风格里的学院区域，用教育和研究设施密度来抽象。",
    description: "教育和研究设施集中的格子。放在东京语境里，就是科技值开始说话的地方。",
    quote: "学院格。东京的研究力在这里露头，论文和截止日期大概也一起露头。"
  },
  industrial_zone: {
    kind: "district",
    kindLabel: "区域",
    label: "工业区",
    shortLabel: "工",
    icon: "/static/civ6/district-industrial-zone.png",
    color: "#78624f",
    accent: "#d2b48c",
    yields: ["生产力 +2", "金币 +1"],
    gisRule: "工业用地、仓储、物流、工厂相关 POI 或 landuse 占优。",
    mapping: "对应文明风格里的工业区。",
    description: "偏生产力的格子。东京湾岸、物流和工业用地会更容易落到这里。",
    quote: "工业区格。生产力很高，空气的存在感可能也很高。"
  },
  commercial_hub: {
    kind: "district",
    kindLabel: "区域",
    label: "商业中心",
    shortLabel: "商",
    icon: "/static/civ6/district-commercial-hub.png",
    color: "#b88943",
    accent: "#f6d37d",
    yields: ["金币 +3"],
    gisRule: "商店、办公、餐饮、银行、大型车站等 POI 密度高。",
    mapping: "对应文明风格里的商业中心。",
    description: "贸易和办公密度高的格子。丸之内、新宿、涩谷一类区域会更接近这个分类。",
    quote: "商业中心格。金币应该会涨，房租也会涨。"
  },
  theater_square: {
    kind: "district",
    kindLabel: "区域",
    label: "剧院广场",
    shortLabel: "剧",
    icon: "/static/civ6/district-theater-square.png",
    color: "#8f58a1",
    accent: "#efb6ff",
    yields: ["文化 +2", "旅游 +1"],
    gisRule: "博物馆、剧场、影院、美术馆、艺术中心等文化 POI 占优。",
    mapping: "对应文明风格里的剧院广场。",
    description: "文化设施集中的格子。上野、六本木、日比谷这类地方会比较有机会。",
    quote: "剧院广场格。文化值很高，钱包防御力很低。"
  },
  entertainment_complex: {
    kind: "district",
    kindLabel: "区域",
    label: "娱乐中心",
    shortLabel: "娱",
    icon: "/static/civ6/district-entertainment-complex.png",
    color: "#c05a6b",
    accent: "#ffb0bd",
    yields: ["宜居度 +2", "文化 +1"],
    gisRule: "LU_1=125 的运动・兴行设施面积占优时出现，普通公园仍交给市立公园改良。",
    mapping: "对应文明风格里的娱乐中心，用体育场、演艺、兴行设施表达城市娱乐槽位。",
    description: "体育和大型娱乐设施集中的格子。不是安静的绿地，而是人流和活动声量很高的地方。",
    quote: "娱乐中心格。宜居度增加，散场时的电车压力也增加。"
  },
  holy_site: {
    kind: "district",
    kindLabel: "区域",
    label: "圣地",
    shortLabel: "圣",
    icon: "/static/civ6/district-holy-site.png",
    color: "#8171b5",
    accent: "#d8ccff",
    yields: ["信仰 +2", "文化 +1"],
    gisRule: "神社、寺庙、教会、墓地、place_of_worship 等 POI 占优。",
    mapping: "对应文明风格里的圣地区域。",
    description: "宗教和历史存在感较强的格子。东京这种点其实不少，只是普通地图里不一定显眼。",
    quote: "圣地格。与其说信仰值，不如说历史的压迫感。"
  },
  government_plaza: {
    kind: "district",
    kindLabel: "区域",
    label: "市政广场",
    shortLabel: "政",
    icon: "/static/civ6/district-government-plaza.png",
    color: "#6f6b61",
    accent: "#e5d6a6",
    yields: ["行政 +2", "文化 +1"],
    gisRule: "少量人工叙事优先规则：千代田、皇居、国会和政府中枢周边，不按 POI 数量粗暴归类。",
    mapping: "对应文明风格里的市政/政府广场，用来表达城市的制度核心。",
    description: "政治、行政和象征性公共空间集中的格子。这里不是铁路最多就叫铁路，而是先看城市语境。",
    quote: "市政广场格。数据很多，但这里最响的是制度感，不是便利店密度。"
  },
  harbor: {
    kind: "district",
    kindLabel: "区域",
    label: "港口",
    shortLabel: "港",
    icon: "/static/civ6/district-harbor.png",
    color: "#2f7f9f",
    accent: "#9fe3ff",
    yields: ["金币 +1", "食物 +1", "贸易 +1"],
    gisRule: "水域或湾岸条件成立，并且存在港湾、码头、物流等相关 POI。",
    mapping: "对应文明风格里的港口区域。",
    description: "水域和贸易相关的格子。东京湾岸不应该只是普通水格。",
    quote: "港口格。很想拉贸易路线，但这里是现实湾岸。"
  },
  aerodrome: {
    kind: "district",
    kindLabel: "区域",
    label: "航空港",
    shortLabel: "空",
    icon: "/static/civ6/district-aerodrome.png",
    color: "#5d7384",
    accent: "#b7d7ea",
    yields: ["移动力 +3", "贸易 +1"],
    gisRule: "当前用羽田机场 landmark override；后续可接国土数値情報的空港数据自动判定。",
    mapping: "对应文明风格里的航空港，用羽田周边表达东京对外移动能力。",
    description: "航空交通相关的格子。东京的移动力不只在铁路，也在湾岸尽头的跑道上。",
    quote: "航空港格。移动力很高，行李转盘的等待时间另算。"
  },
  aqueduct: {
    kind: "district",
    kindLabel: "区域",
    label: "水渠",
    shortLabel: "渠",
    icon: "/static/civ6/district-aqueduct.png",
    color: "#4f8e9b",
    accent: "#b9eff5",
    yields: ["住房 +2", "食物 +1"],
    gisRule: "当前用日本桥/神田川水路 landmark override；后续可接更细水路数据区分河川、运河和水渠。",
    mapping: "对应文明风格里的水渠，把都市水路作为基础设施而不是普通水面处理。",
    description: "水路基础设施感更强的格子。它不是单纯蓝色地形，而是城市如何处理水的痕迹。",
    quote: "水渠格。水看起来很安静，工程量通常不安静。"
  },
  dam: {
    kind: "district",
    kindLabel: "区域",
    label: "堤坝",
    shortLabel: "坝",
    icon: "/static/civ6/district-dam.png",
    color: "#68716f",
    accent: "#c9d6cf",
    yields: ["防灾 +2", "生产力 +1"],
    gisRule: "当前用荒川治水边界 landmark override；后续可接河川管理设施、堤防或防灾设施数据。",
    mapping: "对应文明风格里的堤坝，用东京低地和荒川治水语境表达防灾基础设施。",
    description: "治水和防灾意味较强的格子。平时不显眼，出事时才知道它的存在感。",
    quote: "堤坝格。平时像背景板，暴雨时突然变成主线任务。"
  },
  neighborhood: {
    kind: "district",
    kindLabel: "区域",
    label: "社区",
    shortLabel: "住",
    icon: "/static/civ6/district-neighborhood.png",
    color: "#9b674f",
    accent: "#f0b99a",
    yields: ["住房 +2"],
    gisRule: "住宅倾向明显，或没有更强的区域、改良、地形信号。",
    mapping: "对应文明风格里的社区区域。",
    description: "住宅密度和生活感更强的格子。不是特殊区域，但城市就是靠这些格子连起来的。",
    quote: "社区格。朴素，但城市不是只靠奇观活着。"
  },
  farm: {
    kind: "improvement",
    kindLabel: "改良",
    label: "农场",
    shortLabel: "田",
    icon: "/static/civ6/improvement-farm.png",
    color: "#8f9b45",
    accent: "#dbe487",
    yields: ["食物 +2", "住房 +0.5"],
    gisRule: "farmland、farmyard、allotments、community garden 等城市农业信号存在。",
    mapping: "对应文明风格里的农场改良，在东京语境里解释为城市农业或残存农地。",
    description: "城市里的农地或社区菜园。23 区里如果出现，反而很有信息量。",
    quote: "农场改良。东京地图里找到食物格，会有一点赚到的感觉。"
  },
  park: {
    kind: "improvement",
    kindLabel: "改良",
    label: "市立公园",
    shortLabel: "园",
    icon: "/static/civ6/improvement-park.png",
    color: "#3f8d4e",
    accent: "#b7de8a",
    yields: ["魅力 +2", "文化 +1"],
    gisRule: "green_count > 0，来自东京都公开绿地/公园 GIS 图层。",
    mapping: "使用东京都公开绿地/公园 GIS 数据映射成公园改良。",
    description: "绿地和公园带来的改良。这里不只是绿色，而是城市里的魅力值来源。",
    quote: "市立公园改良。都市里的回复点，维护费大概也不低。"
  },
  railway: {
    kind: "improvement",
    kindLabel: "改良",
    label: "铁路",
    shortLabel: "铁",
    icon: "/static/civ6/improvement-railway.svg",
    color: "#b98f42",
    accent: "#f1d486",
    yields: ["移动力 +2", "金币 +1"],
    gisRule: "车站或铁路相关 POI 存在。当前不再用假规则生成，后续接 OSM/铁路数据。",
    mapping: "把东京的轨道交通抽象成移动力改良。",
    description: "移动力相关改良。没有铁路的东京地图，基本就不像东京。",
    quote: "铁路改良。移动力增加，通勤伤害也增加。"
  },
  river: {
    kind: "terrain",
    kindLabel: "地形",
    label: "河川",
    shortLabel: "河",
    color: "#2f8fb5",
    accent: "#91d8e7",
    yields: ["食物 +1", "金币 +1"],
    gisRule: "water_count > 0，来自河川、运河、湖沼等水系 GIS 图层。",
    mapping: "基础地形，用水系公开数据决定。",
    description: "水域地形。先决定这个格子是不是水，再考虑港口或其他区域。",
    quote: "河川格。很想放港口，但先看看是不是只是河道。"
  },
  coast: {
    kind: "terrain",
    kindLabel: "地形",
    label: "海岸",
    shortLabel: "海",
    color: "#3d93a2",
    accent: "#a8edf4",
    yields: ["食物 +1", "金币 +1"],
    gisRule: "后续规则：海岸线或东京湾岸几何条件成立。",
    mapping: "为东京湾岸预留的海岸地形。",
    description: "湾岸地形。后续接海岸线数据后，会从普通水域里拆出来。",
    quote: "海岸格。东京湾不是地图边缘，它可以是主角。"
  },
  urban_plain: {
    kind: "terrain",
    kindLabel: "地形",
    label: "市街地",
    shortLabel: "市",
    color: "#8f6a52",
    accent: "#e7c098",
    yields: ["生产力 +1"],
    gisRule: "没有更强的水域、绿地、区域、改良信号时的 fallback。",
    mapping: "普通城市地形。接入 OSM POI/landuse 后，一部分会分化成学院、商业中心、工业区等。",
    description: "普通市街地。它不是空白格，而是东京城市肌理的底色。",
    quote: "市街地格。现在还是底色；等 POI 接进来，就会有人开始抢区域槽位。"
  }
};

const HEX_TYPE_I18N = {
  ja: {
    campus: {
      kindLabel: "区域",
      label: "キャンパス",
      shortLabel: "学",
      yields: ["科学力 +2", "文化力 +1"],
      gisRule: "LU_1=112 かつ LU_2=1 の教育施設、または学校点群の高密度を Campus として扱う。",
      mapping: "Civilization 風の Campus。教育・研究機能が強い場所を抽象化する。",
      description: "教育・研究施設が集まるタイル。東京の文脈では、研究力と締切が同時に見え始める場所。",
      quote: "キャンパスタイル。研究力は高いけど、締切圧もたぶん高い。"
    },
    industrial_zone: {
      kindLabel: "区域",
      label: "工業地帯",
      shortLabel: "工",
      yields: ["生産力 +2", "ゴールド +1"],
      gisRule: "LU_1=141-143 の工場・倉庫・物流系土地利用が十分に強い場合に判定する。",
      mapping: "Civilization 風の Industrial Zone。生産・物流の存在感を表す。",
      description: "生産力寄りのタイル。湾岸や物流系の土地利用が強い場所に出やすい。",
      quote: "工業地帯タイル。生産力は高い。空気の存在感も少し高い。"
    },
    commercial_hub: {
      kindLabel: "区域",
      label: "商業ハブ",
      shortLabel: "商",
      yields: ["ゴールド +3"],
      gisRule: "LU_1=121-124 の商業・業務系土地利用、または主要商業地の landmark rule で判定する。",
      mapping: "Civilization 風の Commercial Hub。商業・業務・人流の密度を表す。",
      description: "取引と業務の密度が高いタイル。丸の内、新宿、渋谷のような場所に近い読み方。",
      quote: "商業ハブタイル。ゴールドは増える。家賃も増える。"
    },
    theater_square: {
      kindLabel: "区域",
      label: "劇場広場",
      shortLabel: "劇",
      yields: ["文化力 +2", "観光 +1"],
      gisRule: "LU_1=112 かつ LU_2=2 の文化施設、または文化的 landmark rule で判定する。",
      mapping: "Civilization 風の Theater Square。美術館・博物館・劇場などの文化機能を表す。",
      description: "文化施設が集まるタイル。上野や日比谷のような場所を読むための分類。",
      quote: "劇場広場タイル。文化力は高い。財布の防御力は低い。"
    },
    entertainment_complex: {
      kindLabel: "区域",
      label: "総合娯楽施設",
      shortLabel: "娯",
      yields: ["快適性 +2", "文化力 +1"],
      gisRule: "LU_1=125 のスポーツ・興行施設が十分に強い場合に判定する。",
      mapping: "Civilization 風の Entertainment Complex。スポーツ・興行・大型娯楽施設を表す。",
      description: "スポーツや大規模イベントの気配が強いタイル。静かな緑地ではなく、人の流れが主役。",
      quote: "総合娯楽施設タイル。快適性は上がる。帰りの混雑も上がる。"
    },
    holy_site: {
      kindLabel: "区域",
      label: "聖地",
      shortLabel: "聖",
      yields: ["信仰力 +2", "文化力 +1"],
      gisRule: "LU_1=112 かつ LU_2=3 の宗教施設、または明治神宮などの landmark rule で判定する。",
      mapping: "Civilization 風の Holy Site。宗教施設と歴史的存在感を表す。",
      description: "宗教施設や歴史の厚みが強いタイル。普通の地図では目立たないが、都市の記憶としては強い。",
      quote: "聖地タイル。信仰力というより、歴史の圧がある。"
    },
    government_plaza: {
      kindLabel: "区域",
      label: "政府複合施設",
      shortLabel: "政",
      yields: ["行政 +2", "文化力 +1"],
      gisRule: "千代田、皇居、国会、官庁街などを少数の landmark / ward rule で優先判定する。",
      mapping: "Civilization 風の Government Plaza。都市の制度的中心を表す。",
      description: "政治・行政・象徴的公共空間が集まるタイル。POI 数ではなく都市文脈を優先する。",
      quote: "政府複合施設タイル。データは多いけど、ここで一番強いのは制度感。"
    },
    harbor: {
      kindLabel: "区域",
      label: "港",
      shortLabel: "港",
      yields: ["ゴールド +1", "食料 +1", "交易 +1"],
      gisRule: "現在は東京港・お台場周辺の landmark rule。後続で港湾データを接続予定。",
      mapping: "Civilization 風の Harbor。湾岸・物流・交易の読みを表す。",
      description: "水域と交易に関係するタイル。東京湾岸をただの水タイルにしないための分類。",
      quote: "港タイル。交易路を引きたくなるけど、ここは現実の湾岸。"
    },
    aerodrome: {
      kindLabel: "区域",
      label: "飛行場",
      shortLabel: "空",
      yields: ["移動力 +3", "交易 +1"],
      gisRule: "現在は羽田空港の landmark rule。後続で国土数値情報の空港データを接続予定。",
      mapping: "Civilization 風の Aerodrome。東京の対外移動能力を表す。",
      description: "航空交通のタイル。東京の移動力は鉄道だけではなく、湾岸の滑走路にもある。",
      quote: "飛行場タイル。移動力は高い。荷物待ちは別計算。"
    },
    aqueduct: {
      kindLabel: "区域",
      label: "用水路",
      shortLabel: "渠",
      yields: ["住宅 +2", "食料 +1"],
      gisRule: "現在は日本橋・神田川周辺の waterway landmark rule。後続で細かい水路データを接続予定。",
      mapping: "Civilization 風の Aqueduct。都市水路を単なる水面ではなくインフラとして扱う。",
      description: "水路インフラの意味が強いタイル。水は静かでも、背後の工事量は静かではない。",
      quote: "用水路タイル。水面は静か。工学は静かじゃない。"
    },
    dam: {
      kindLabel: "区域",
      label: "ダム",
      shortLabel: "堤",
      yields: ["防災 +2", "生産力 +1"],
      gisRule: "現在は荒川治水エッジの landmark rule。後続で堤防・河川管理施設データを接続予定。",
      mapping: "Civilization 風の Dam。低地東京の治水・防災インフラを表す。",
      description: "治水と防災の意味が強いタイル。普段は背景、豪雨時だけ急に主役になる。",
      quote: "ダムタイル。普段は背景、豪雨の日だけメインクエスト。"
    },
    neighborhood: {
      kindLabel: "区域",
      label: "近郊部",
      shortLabel: "住",
      yields: ["住宅 +2"],
      gisRule: "LU_1=131-133 の住宅系土地利用が強く、より強い特殊分類がない場合に判定する。",
      mapping: "Civilization 風の Neighborhood。住宅地と生活感を表す。",
      description: "住宅密度と生活感が強いタイル。派手ではないが、都市はこのタイルでつながっている。",
      quote: "近郊部タイル。地味だけど、都市は奇観だけでは生きていない。"
    },
    farm: {
      label: "農場",
      shortLabel: "田",
      yields: ["食料 +2", "住宅 +0.5"],
      gisRule: "LU_1=150/611/612/613/620 の農林漁業・田畑・樹園地・採草放牧地を集計する。",
      mapping: "Civilization 風の Farm。23 区内では都市農地や残存農地として読む。",
      description: "都市の中に残る農地・菜園のタイル。23 区で見つかるとむしろ情報量が高い。",
      kindLabel: "施設",
      quote: "農場施設。東京の地図で食料タイルを見つけると少し得した気分。"
    },
    park: {
      kindLabel: "施設",
      label: "都市公園",
      shortLabel: "園",
      yields: ["快適性 +2", "文化力 +1"],
      gisRule: "東京都の緑地・公園データ、または LU_1=300 の公園・運動場等を使う。",
      mapping: "Civilization 風の City Park。都市の魅力値の源泉として扱う。",
      description: "緑地と公園の施設タイル。緑色というより、都市内の回復地点。",
      quote: "都市公園施設。都会の回復地点。維持費もたぶん安くない。"
    },
    railway: {
      kindLabel: "施設",
      label: "鉄道",
      shortLabel: "鉄",
      yields: ["移動力 +2", "ゴールド +1"],
      gisRule: "国土数値情報の鉄道・駅データと LU_1=520 の鉄道・港湾等を補助的に使う。",
      mapping: "Civilization 風の Railroad。東京の移動力を表す。",
      description: "移動力に関係する施設。鉄道がない東京地図は、かなり東京らしくない。",
      quote: "鉄道施設。移動力が増える。通勤ダメージも増える。"
    },
    river: {
      kindLabel: "地形",
      label: "河川",
      shortLabel: "河",
      yields: ["食料 +1", "ゴールド +1"],
      gisRule: "水系 GIS 図層、または LU_1=700 の水面・河川・水路を強い場合だけ使う。",
      mapping: "基礎地形。水域としての読みを先に決める。",
      description: "水域地形。港や用水路にする前に、まず水として読めるかを確認する。",
      quote: "河川タイル。港を置きたくなるけど、まずはただの川か確認。"
    },
    coast: {
      kindLabel: "地形",
      label: "海岸",
      shortLabel: "海",
      yields: ["食料 +1", "ゴールド +1"],
      gisRule: "後続ルール。海岸線または東京湾岸の幾何条件で判定する。",
      mapping: "東京湾岸のために予約している Coast 地形。",
      description: "湾岸地形。東京湾は地図の端ではなく、主役にもなれる。",
      quote: "海岸タイル。東京湾は地図の余白ではない。"
    },
    urban_plain: {
      kindLabel: "地形",
      label: "市街地",
      shortLabel: "市",
      yields: ["生産力 +1"],
      gisRule: "より強い地形・区域・施設シグナルがない場合の fallback。",
      mapping: "普通の都市地形。東京の都市肌理のベースとして扱う。",
      description: "普通の市街地タイル。空白ではなく、東京の地の色。",
      quote: "市街地タイル。まだ地の色。データが増えると誰かが区域枠を取りに来る。"
    }
  }
};

export const KIND_LABELS = {
  district: "区域",
  improvement: "改良",
  terrain: "地形"
};

const KIND_LABELS_I18N = {
  ja: {
    district: "区域",
    improvement: "施設",
    terrain: "地形"
  }
};

export const DEFAULT_ACTIVE_TYPES = Object.keys(HEX_TYPE_META);

export const getHexTypeMeta = (type, lang = "zh") => {
  const safeType = HEX_TYPE_META[type] ? type : "urban_plain";
  return {
    ...HEX_TYPE_META[safeType],
    ...(HEX_TYPE_I18N[lang]?.[safeType] || {})
  };
};

export const getKindLabels = (lang = "zh") => KIND_LABELS_I18N[lang] || KIND_LABELS;
