
export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  color: string;
  pinned: boolean;
  isFavorite?: boolean; 
  type?: 'text' | 'checklist';
  deleted?: boolean;
  locked?: boolean;
  password?: string;
  stickers?: string[];
  drawings?: string[]; // New: Array of base64 images
  audio?: string[];    // New: Array of base64/blob urls
  texture?: 'none' | 'grid' | 'lines' | 'dots'; // New: Paper texture
}

export enum NoteColor {
  White = 'bg-white',
  Red = 'bg-red-100',
  Orange = 'bg-orange-100',
  Yellow = 'bg-yellow-100',
  Green = 'bg-green-100',
  Teal = 'bg-teal-100',
  Blue = 'bg-blue-100',
  Indigo = 'bg-indigo-100',
  Purple = 'bg-purple-100',
  Pink = 'bg-pink-100',
  Brown = 'bg-stone-200',
  Gray = 'bg-gray-200',
}

export enum AITask {
  Summarize = 'SUMMARIZE',
  FixGrammar = 'FIX_GRAMMAR',
  ContinueWriting = 'CONTINUE',
  MakeFun = 'MAKE_FUN',
}

export enum ViewMode {
  Notes = 'NOTES',
  CrafterAI = 'CRAFTER_AI',
  HelperAI = 'HELPER_AI',
  CrafterBoy = 'CRAFTER_BOY', // New
  MalayalamAI = 'MALAYALAM_AI',
  Settings = 'SETTINGS',
  ThemeStudio = 'THEME_STUDIO',
  Calculator = 'CALCULATOR',
  Calendar = 'CALENDAR',
  Phone = 'PHONE',
  CodeRunner = 'CODE_RUNNER',
  XmlRunner = 'XML_RUNNER',
  AndroidStudio = 'ANDROID_STUDIO',
  FlashClear = 'FLASH_CLEAR',
  CraftyBug = 'CRAFTY_BUG',
  Marketplace = 'MARKETPLACE',
  Bin = 'BIN',
  WhatsNew = 'WHATS_NEW',
  EuroTruck = 'EURO_TRUCK',
  SanAndreas = 'SAN_ANDREAS',
  HelloCpu = 'HELLO_CPU',
  CrafterCloud = 'CRAFTER_CLOUD',
  MathStudio = 'MATH_STUDIO',
  StoryReader = 'STORY_READER',
  Advancements = 'ADVANCEMENTS',
  StickerMaker = 'STICKER_MAKER',
  VoiceRecorder = 'VOICE_RECORDER',
  UnitConverter = 'UNIT_CONVERTER',
  Sketchpad = 'SKETCHPAD',
  TicTacToe = 'TIC_TAC_TOE',
  CommandBlock = 'COMMAND_BLOCK',
  Radio = 'RADIO', // New
  DynamicApp = 'DYNAMIC_APP',
  UserApp = 'USER_APP', // New: For user built apps
  CrafterStudio = 'CRAFTER_STUDIO', // YouTube Creator App
  FamilyCenter = 'FAMILY_CENTER', // NEW: Family Center
  PluginStore = 'PLUGIN_STORE', // NEW: Plugin Store
  CraftyClass = 'CRAFTY_CLASS', // NEW: Crafty Class App
  // New 20 Apps
  TodoList = 'TODO_LIST',
  HabitTracker = 'HABIT_TRACKER',
  SnakeGame = 'SNAKE_GAME',
  PongGame = 'PONG_GAME',
  Game2048 = 'GAME_2048',
  Piano = 'PIANO',
  DrumPad = 'DRUM_PAD',
  Breathing = 'BREATHING',
  QrGen = 'QR_GEN',
  ColorPicker = 'COLOR_PICKER',
  BmiCalc = 'BMI_CALC',
  DiscountCalc = 'DISCOUNT_CALC',
  TipCalc = 'TIP_CALC',
  Stopwatch = 'STOPWATCH',
  Timer = 'TIMER',
  WorldClock = 'WORLD_CLOCK',
  JsonFormatter = 'JSON_FORMATTER',
  Whiteboard = 'WHITEBOARD',
  Quotes = 'QUOTES',
  Jokes = 'JOKES',
  // Galaxy Update Suites
  DevSuite = 'DEV_SUITE',
  FocusSuite = 'FOCUS_SUITE',
  RandomSuite = 'RANDOM_SUITE',
  TextSuite = 'TEXT_SUITE',
  MathPlus = 'MATH_PLUS',
  // Universe Update (13 New)
  PeriodTracker = 'PERIOD_TRACKER',
  WaterIntake = 'WATER_INTAKE',
  Metronome = 'METRONOME',
  GuitarTuner = 'GUITAR_TUNER',
  MorseCode = 'MORSE_CODE',
  UnixTime = 'UNIX_TIME',
  GradientGen = 'GRADIENT_GEN',
  ReactionTest = 'REACTION_TEST',
  TypingTest = 'TYPING_TEST',
  MemoryGame = 'MEMORY_GAME',
  Sudoku = 'SUDOKU',
  Minesweeper = 'MINESWEEPER',
  AsciiArt = 'ASCII_ART',
  // Reality Update
  HackerTyper = 'HACKER_TYPER',
  DrawGuess = 'DRAW_GUESS',
  // New Sidebar Items
  WebPublish = 'WEB_PUBLISH',
  Multiplayer = 'MULTIPLAYER',
  Stocks = 'STOCKS',
  News = 'NEWS',
  Maps = 'MAPS',
  Photos = 'PHOTOS',
  Wallet = 'WALLET',
  Health = 'HEALTH',
  Passwords = 'PASSWORDS',
  Translate = 'TRANSLATE',
  Podcasts = 'PODCASTS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  video?: string;
  isCode?: boolean;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: string;
  avatarUrl: string;
  storagePlan?: 'basic' | 'max';
  coins: number;
  unlockedAchievements: string[];
  exp?: number;
  level?: number;
  rank?: string;
  streak?: number; // Daily usage streak
  lastLogin?: number; // Timestamp of last login
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'superman' | 'forest' | 'ocean' | 'cyberpunk' | 'sunset' | 'lavender' | 'retro' | 'terminal' | 'bw' | 'win11' | 'christmas' | 'matrix' | 'coffee' | 'glass' | 'neon' | string;
  font: 'sans' | 'serif' | 'mono' | 'playfair' | 'oswald' | 'handwriting' | string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  logoType: 'cape' | 'shield' | 'star' | 'rocket' | 'bolt' | 'crown' | 'santa' | string;
  zenMode?: boolean;
  combatMode?: boolean; 
  developerMode?: boolean;
  wallpaper?: string;
  sounds?: boolean;
  blueLight?: boolean;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  category: 'Theme' | 'Font' | 'Tool' | 'AI' | 'Logo' | 'Wallpaper' | 'Game' | 'Story' | 'Sticker' | 'App';
  originalPrice: number;
  price: number;
  priceType: 'free' | 'cnc';
  image: string;
  rating: number;
  downloads: string;
  installed: boolean;
  code?: { kotlin: string, xml: string, web?: string }; // For user created apps
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
}