import { EventEmitter } from "events";

// Map interface
export interface Map {
  name: string;
  matchid: string;
  game_time: number;
  clock_time: number;
  daytime: boolean;
  nightstalker_night: boolean;
  radiant_score: number;
  dire_score: number;
  game_state: string;
  paused: boolean;
  win_team: string;
  customgamename: string;
  radiant_ward_purchase_cooldown: number;
  dire_ward_purchase_cooldown: number;
  roshan_state: string;
  roshan_state_end_seconds: number;
  radiant_win_chance: number;
}

// Player interface
export interface Player {
  steamid: string;
  accountid: string;
  name: string;
  activity: string;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  kill_streak: number;
  commands_issued: number;
  kill_list: Record<string, number>;
  team_name: string;
  player_slot: number;
  team_slot: number;
  gold: number;
  gold_reliable: number;
  gold_unreliable: number;
  gold_from_hero_kills: number;
  gold_from_creep_kills: number;
  gold_from_income: number;
  gold_from_shared: number;
  gpm: number;
  xpm: number;
  net_worth: number;
  hero_damage: number;
  hero_healing: number;
  tower_damage: number;
  wards_purchased: number;
  wards_placed: number;
  wards_destroyed: number;
  runes_activated: number;
  camps_stacked: number;
  support_gold_spent: number;
  consumable_gold_spent: number;
  item_gold_spent: number;
  gold_lost_to_death: number;
  gold_spent_on_buybacks: number;
}

// Hero interface
export interface Hero {
  facet: number;
  xpos: number;
  ypos: number;
  id: number;
  name: string;
  level: number;
  xp: number;
  alive: boolean;
  respawn_seconds: number;
  buyback_cost: number;
  buyback_cooldown: number;
  health: number;
  max_health: number;
  health_percent: number;
  mana: number;
  max_mana: number;
  mana_percent: number;
  silenced: boolean;
  stunned: boolean;
  disarmed: boolean;
  magicimmune: boolean;
  hexed: boolean;
  muted: boolean;
  break: boolean;
  aghanims_scepter: boolean;
  aghanims_shard: boolean;
  smoked: boolean;
  has_debuff: boolean;
  selected_unit: boolean;
  talent_1: boolean;
  talent_2: boolean;
  talent_3: boolean;
  talent_4: boolean;
  talent_5: boolean;
  talent_6: boolean;
  talent_7: boolean;
  talent_8: boolean;
  attributes_level: number;
}

// Ability interface
export interface Ability {
  name: string;
  level: number;
  can_cast: boolean;
  passive: boolean;
  ability_active: boolean;
  cooldown: number;
  ultimate: boolean;
}

// Item interface
export interface Item {
  name: string;
  purchaser?: number;
  item_level: number;
  can_cast?: boolean;
  cooldown?: number;
  passive?: boolean;
  item_charges?: number;
  charges?: number;
}

// BuildingHealth interface
export interface BuildingHealth {
  health: number;
  max_health: number;
}

// Buildings interface
export interface Buildings {
  radiant: Record<string, BuildingHealth>;
  dire: Record<string, BuildingHealth>;
}

// Provider interface
export interface Provider {
  name: string;
  appid: number;
  version: number;
  timestamp: number;
}

export interface Auth {
  token: string;
}

export interface Draft {
  activeteam: number; // Time atualmente ativo (0 = Radiant, 1 = Dire)
  pick: boolean; // Indica se é um turno de pick
  activeteam_time_remaining: number; // Tempo restante para o time ativo
  radiant_bonus_time: number; // Tempo bônus para o Radiant
  dire_bonus_time: number; // Tempo bônus para o Dire
  team2: DraftTeam; // Informações do time Radiant (team2)
  team3: DraftTeam; // Informações do time Dire (team3)
}

export interface DraftTeam {
  home_team: boolean; // Indica se é o time da casa
  pick0_id: number; // ID do primeiro pick
  pick0_class: string; // Classe do primeiro pick
  pick1_id: number;
  pick1_class: string;
  pick2_id: number;
  pick2_class: string;
  pick3_id: number;
  pick3_class: string;
  pick4_id: number;
  pick4_class: string;

  ban0_id: number; // ID do primeiro ban
  ban0_class: string; // Classe do primeiro ban
  ban1_id: number;
  ban1_class: string;
  ban2_id: number;
  ban2_class: string;
  ban3_id: number;
  ban3_class: string;
  ban4_id: number;
  ban4_class: string;
}

export interface GSIConfig {
  port?: number;
}

export interface IGamestateData {
  provider: Provider;
  auth: Auth;
  draft: Draft;
  map: Map;
  player: Record<string, Record<string, Player>>;
  hero: Record<string, Record<string, Hero>>;
  abilities: Record<string, Record<string, Record<string, Ability>>>;
  items: Record<string, Record<string, Record<string, Item>>>;
  buildings: Buildings;
}

export interface IGamestate {
  ip: string;
  auth: Auth;
  gamestate: IGamestateData;
  previously?: Partial<IGamestateData>;
  added?: Partial<IGamestateData>;
}

export interface Client {
  ip: string;
  auth: string | undefined;
  gamestate: IGamestateData;
}

// Export the interfaces for the GSI events
export interface GSIEvents {
  newClient: Client;
  newdata: IGamestateData;
  [key: string]: any;
}
