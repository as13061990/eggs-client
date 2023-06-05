enum screen {
  MAIN,
  RATING
}

enum eggPosition {
  LEFT_UP,
  LEFT_DOWN,
  RIGHT_UP,
  RIGHT_DOWN
}

enum platforms {
  WEB = 0,
  VK = 1
}

enum eggType {
  default = 'egg',
  gold = 'egg-gold',
  good = 'egg-good',
  bad = 'egg-bad',
  score = 'egg-score',
}

export {
  eggType,
  screen,
  platforms,
  eggPosition
}