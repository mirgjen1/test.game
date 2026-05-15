/**
 * world.js — de_dust2 (Dust II) 2D Top-Down Map Configuration
 *
 * Coordinate System:
 *   (0, 0) = bottom-left corner of map
 *   X → increases rightward (East)
 *   Y → increases upward   (North)
 *
 * Map canvas: 1024 × 1024 units (maps 1:1 to the minimap image).
 * All measurements are in "map units" (mu), proportionally derived from
 * the classic Dust II minimap at standard resolution.
 *
 * Sections:
 *   1.  MAP_META          — global map metadata
 *   2.  MATERIALS         — named colour/texture tokens
 *   3.  SPAWN_POINTS      — team start positions
 *   4.  WALKABLE_AREAS    — passable floor polygons per zone
 *   5.  WALLS             — solid collision rectangles / polygons
 *   6.  DOORS             — toggleable thin-wall passages
 *   7.  PROPS             — cover objects (crates, boxes, vehicle)
 *   8.  POINTS_OF_INTEREST — callout labels + representative coords
 *   9.  ELEVATION_HINTS   — Z-layer metadata (for 2.5D renderers)
 *  10.  NAV_GRAPH         — bidirectional adjacency for pathfinding
 *  11.  worldData         — master export object
 */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// 1. MAP META
// ─────────────────────────────────────────────────────────────────────────────

const MAP_META = {
  name:        "de_dust2",
  displayName: "Dust II",
  version:     "2015-08-28",   // Classic layout (reference image date)
  width:       1024,
  height:      1024,
  gridSize:    16,             // Snapping grid
  bombSites:   ["A", "B"],
  defaultGravity: 9.8,
  authors:     ["David Johnston (Spawn)"],
  description: "The most iconic map in Counter-Strike history. " +
               "Three main lanes: Long A (right), Mid (centre), B-Tunnels (left).",
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. MATERIALS  (colour tokens — swap for texture paths in a real engine)
// ─────────────────────────────────────────────────────────────────────────────

const MATERIALS = {
  SAND_LIGHT:     "#C8A96E",   // Long A, Outside Long, Mid main
  SAND_DARK:      "#A8845A",   // T-Spawn, Outside Tunnels
  CONCRETE:       "#8C8C84",   // CT-Spawn, CT-Mid floor
  STONE_DARK:     "#4A4540",   // Tunnel interiors
  BRICK_TAN:      "#BF9E6A",   // A-Site walls / architecture
  WALL_EXTERIOR:  "#D4B483",   // Outer wall surface
  WALL_INTERIOR:  "#6B5E4E",   // Interior / void face
  VOID:           "#1A1612",   // Non-playable black space
  BOMBSITE_A:     "#E8C86A",   // A-Site highlight
  BOMBSITE_B:     "#C86A6A",   // B-Site highlight
  DOOR_WOOD:      "#5A3E28",   // Double-door faces
  CRATE:          "#8C6840",   // Wooden crate props
  METAL:          "#5A5A50",   // Metal props / vehicle
  ELEVATED_FLOOR: "#B09060",   // Catwalk / Short A tint (height hint)
  SPAWN_T:        "#4CAF50",   // T-Spawn marker
  SPAWN_CT:       "#4CAF50",   // CT-Spawn marker
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SPAWN POINTS
// ─────────────────────────────────────────────────────────────────────────────

const SPAWN_POINTS = {
  // Up to 5 per team; spread across the spawn box
  t_spawn_coords: [
    { x: 480, y:  54 }, { x: 510, y:  54 }, { x: 540, y:  54 },
    { x: 480, y:  72 }, { x: 510, y:  72 },
  ],
  ct_spawn_coords: [
    { x: 574, y: 684 }, { x: 600, y: 684 }, { x: 626, y: 684 },
    { x: 574, y: 700 }, { x: 600, y: 700 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. WALKABLE AREAS
// Each entry is a named polygon the player can traverse.
// `points` = array of {x, y} vertices in counter-clockwise order.
// `floorColor` = material token for the renderer.
// `elevated` = true → render at a higher Z layer (catwalk, A-Site platform…)
// ─────────────────────────────────────────────────────────────────────────────

const WALKABLE_AREAS = [

  // ── Spawn Zones ────────────────────────────────────────────────────────────

  {
    id: "t_spawn",
    label: "T Spawn",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SPAWN_T,
    points: [
      { x: 416, y:  20 }, { x: 608, y:  20 },
      { x: 608, y: 110 }, { x: 416, y: 110 },
    ],
  },
  {
    id: "ct_spawn",
    label: "CT Spawn",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.SPAWN_CT,
    points: [
      { x: 546, y: 668 }, { x: 650, y: 668 },
      { x: 650, y: 730 }, { x: 546, y: 730 },
    ],
  },

  // ── Outside Long / Long A approach ─────────────────────────────────────────

  {
    id: "outside_long",
    label: "Outside Long",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 608, y:  20 }, { x: 1000, y:  20 },
      { x: 1000, y: 260 }, { x: 800, y: 260 },
      { x: 800, y: 150 }, { x: 608, y: 150 },
    ],
  },
  {
    id: "long_doors",
    label: "Long Doors",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 800, y: 260 }, { x: 1000, y: 260 },
      { x: 1000, y: 320 }, { x: 800, y: 320 },
    ],
  },
  {
    id: "long_a",
    label: "Long A",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 800, y: 320 }, { x: 1000, y: 320 },
      { x: 1000, y: 570 }, { x:  870, y: 570 },
      { x: 870, y:  450 }, { x:  800, y: 450 },
    ],
  },
  {
    id: "blue",
    label: "Blue",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 800, y: 390 }, { x: 870, y: 390 },
      { x: 870, y: 450 }, { x: 800, y: 450 },
    ],
  },
  {
    id: "pit",
    label: "Pit",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x: 940, y: 160 }, { x: 1004, y: 160 },
      { x: 1004, y: 400 }, { x:  940, y: 400 },
    ],
  },
  {
    id: "pit_plat",
    label: "Pit Plat",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x: 940, y: 350 }, { x: 1000, y: 350 },
      { x: 1000, y: 400 }, { x:  940, y: 400 },
    ],
  },
  {
    id: "side_pit",
    label: "Side Pit",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x: 870, y: 310 }, { x: 940, y: 310 },
      { x: 940, y: 400 }, { x: 870, y: 400 },
    ],
  },

  // ── A-Site ─────────────────────────────────────────────────────────────────

  {
    id: "a_ramp",
    label: "Ramp",
    team: "NEUTRAL",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 870, y: 570 }, { x: 1000, y: 570 },
      { x: 1000, y: 670 }, { x:  870, y: 670 },
    ],
  },
  {
    id: "a_plat",
    label: "A Plat",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_A,
    points: [
      { x: 740, y: 670 }, { x: 1004, y: 670 },
      { x: 1004, y: 860 }, { x:  740, y: 860 },
    ],
  },
  {
    id: "a_site_default",
    label: "A Default",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_A,
    bombSite: "A",
    points: [
      { x: 860, y: 720 }, { x: 1000, y: 720 },
      { x: 1000, y: 820 }, { x:  860, y: 820 },
    ],
  },
  {
    id: "goose",
    label: "Goose",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 940, y: 840 }, { x: 1004, y: 840 },
      { x: 1004, y: 920 }, { x:  940, y: 920 },
    ],
  },
  {
    id: "barrels",
    label: "Barrels",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 870, y: 860 }, { x: 940, y: 860 },
      { x: 940, y: 930 }, { x: 870, y: 930 },
    ],
  },
  {
    id: "cross",
    label: "Cross",
    team: "NEUTRAL",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 740, y: 760 }, { x: 800, y: 760 },
      { x: 800, y: 860 }, { x: 740, y: 860 },
    ],
  },
  {
    id: "ct_ramp",
    label: "CT Ramp",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 680, y: 760 }, { x: 760, y: 760 },
      { x: 760, y: 900 }, { x: 680, y: 900 },
    ],
  },
  {
    id: "elevator",
    label: "Elevator",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 740, y: 700 }, { x: 800, y: 700 },
      { x: 800, y: 760 }, { x: 740, y: 760 },
    ],
  },
  {
    id: "quad",
    label: "Quad",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 760, y: 700 }, { x: 820, y: 700 },
      { x: 820, y: 760 }, { x: 760, y: 760 },
    ],
  },
  {
    id: "fast_cat",
    label: "Fast Cat",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 660, y: 730 }, { x: 720, y: 730 },
      { x: 720, y: 790 }, { x: 660, y: 790 },
    ],
  },
  {
    id: "pizza",
    label: "Pizza",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 760, y: 840 }, { x: 820, y: 840 },
      { x: 820, y: 900 }, { x: 760, y: 900 },
    ],
  },
  {
    id: "ninja",
    label: "Ninja",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 680, y: 860 }, { x: 740, y: 860 },
      { x: 740, y: 920 }, { x: 680, y: 920 },
    ],
  },

  // ── Short A / Catwalk ──────────────────────────────────────────────────────

  {
    id: "short_a",
    label: "Short A",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 596, y: 790 }, { x: 700, y: 790 },
      { x: 700, y: 860 }, { x: 680, y: 860 },
      { x: 680, y: 840 }, { x: 596, y: 840 },
    ],
  },
  {
    id: "catwalk",
    label: "Catwalk",
    team: "NEUTRAL",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 530, y: 580 }, { x: 610, y: 580 },
      { x: 610, y: 790 }, { x: 596, y: 790 },
      { x: 596, y: 640 }, { x: 530, y: 640 },
    ],
  },
  {
    id: "stairs_short",
    label: "Stairs",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.ELEVATED_FLOOR,
    points: [
      { x: 596, y: 720 }, { x: 648, y: 720 },
      { x: 648, y: 790 }, { x: 596, y: 790 },
    ],
  },

  // ── CT Spawn / CT Mid ──────────────────────────────────────────────────────

  {
    id: "ct_mid",
    label: "CT Mid",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 258, y: 630 }, { x: 546, y: 630 },
      { x: 546, y: 668 }, { x: 650, y: 668 },
      { x: 650, y: 790 }, { x: 530, y: 790 },
      { x: 530, y: 750 }, { x: 460, y: 750 },
      { x: 460, y: 720 }, { x: 340, y: 720 },
      { x: 340, y: 730 }, { x: 258, y: 730 },
    ],
  },
  {
    id: "b_boxes",
    label: "B Boxes",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 258, y: 580 }, { x: 380, y: 580 },
      { x: 380, y: 630 }, { x: 258, y: 630 },
    ],
  },

  // ── Mid ────────────────────────────────────────────────────────────────────

  {
    id: "mid_doors",
    label: "Mid Doors",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 446, y: 560 }, { x: 530, y: 560 },
      { x: 530, y: 630 }, { x: 446, y: 630 },
    ],
  },
  {
    id: "mid_main",
    label: "Mid",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 436, y: 360 }, { x: 600, y: 360 },
      { x: 600, y: 560 }, { x: 446, y: 560 },
      { x: 446, y: 500 }, { x: 436, y: 500 },
    ],
  },
  {
    id: "xbox",
    label: "Xbox",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 470, y: 490 }, { x: 540, y: 490 },
      { x: 540, y: 560 }, { x: 470, y: 560 },
    ],
  },
  {
    id: "cat_boost",
    label: "Cat Boost",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 560, y: 490 }, { x: 620, y: 490 },
      { x: 620, y: 560 }, { x: 560, y: 560 },
    ],
  },
  {
    id: "top_mid",
    label: "Top Mid",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 436, y: 150 }, { x: 608, y: 150 },
      { x: 608, y: 360 }, { x: 436, y: 360 },
    ],
  },
  {
    id: "suicide",
    label: "Suicide",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x: 400, y: 110 }, { x: 440, y: 110 },
      { x: 440, y: 360 }, { x: 400, y: 360 },
    ],
  },
  {
    id: "palm",
    label: "Palm",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 436, y: 310 }, { x: 540, y: 310 },
      { x: 540, y: 390 }, { x: 436, y: 390 },
    ],
  },
  {
    id: "green",
    label: "Green",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.SAND_LIGHT,
    points: [
      { x: 400, y: 280 }, { x: 440, y: 280 },
      { x: 440, y: 360 }, { x: 400, y: 360 },
    ],
  },

  // ── B-Tunnels ──────────────────────────────────────────────────────────────

  {
    id: "upper_b_tunnels",
    label: "Upper B (Tunnels)",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.STONE_DARK,
    // L-shaped corridor wrapping around the Dog/Closet central pillar
    points: [
      { x:  20, y: 200 }, { x: 260, y: 200 },
      { x: 260, y: 490 }, { x: 170, y: 490 },
      { x: 170, y: 290 }, { x:  20, y: 290 },
    ],
  },
  {
    id: "lower_b_tunnels",
    label: "Lower B (Tunnels)",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.STONE_DARK,
    // Steps down — connects Upper Tunnels to Mid and B-Site approach
    points: [
      { x: 170, y: 390 }, { x: 400, y: 390 },
      { x: 400, y: 560 }, { x: 260, y: 560 },
      { x: 260, y: 490 }, { x: 170, y: 490 },
    ],
  },
  {
    id: "outside_tunnels",
    label: "Outside Tunnels",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x:  20, y:  20 }, { x: 400, y:  20 },
      { x: 400, y: 200 }, { x:  20, y: 200 },
    ],
  },
  {
    id: "t_plat",
    label: "T Plat",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.SAND_DARK,
    points: [
      { x: 120, y: 200 }, { x: 260, y: 200 },
      { x: 260, y: 280 }, { x: 120, y: 280 },
    ],
  },

  // ── B-Site ─────────────────────────────────────────────────────────────────

  {
    id: "b_site",
    label: "B",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_B,
    bombSite: "B",
    points: [
      { x:  60, y: 730 }, { x: 260, y: 730 },
      { x: 260, y: 930 }, { x:  60, y: 930 },
    ],
  },
  {
    id: "b_plat",
    label: "B Plat",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_B,
    points: [
      { x:  20, y: 780 }, { x:  90, y: 780 },
      { x:  90, y: 930 }, { x:  20, y: 930 },
    ],
  },
  {
    id: "back_plat",
    label: "Back Plat",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x:  20, y: 930 }, { x: 200, y: 930 },
      { x: 200, y: 1004 }, { x:  20, y: 1004 },
    ],
  },
  {
    id: "b_site_back",
    label: "Back Site",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_B,
    points: [
      { x: 100, y: 880 }, { x: 260, y: 880 },
      { x: 260, y: 960 }, { x: 100, y: 960 },
    ],
  },
  {
    id: "b_window",
    label: "Window",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 200, y: 820 }, { x: 260, y: 820 },
      { x: 260, y: 880 }, { x: 200, y: 880 },
    ],
  },
  {
    id: "b_scaffold",
    label: "Scaffold",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BRICK_TAN,
    points: [
      { x: 240, y: 840 }, { x: 320, y: 840 },
      { x: 320, y: 900 }, { x: 240, y: 900 },
    ],
  },
  {
    id: "b_default",
    label: "Default",
    team: "CT",
    elevated: true,
    floorColor: MATERIALS.BOMBSITE_B,
    points: [
      { x: 100, y: 760 }, { x: 220, y: 760 },
      { x: 220, y: 840 }, { x: 100, y: 840 },
    ],
  },

  // ── B Doors / CT to B ──────────────────────────────────────────────────────

  {
    id: "b_doors",
    label: "B Doors",
    team: "NEUTRAL",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 220, y: 680 }, { x: 310, y: 680 },
      { x: 310, y: 760 }, { x: 220, y: 760 },
    ],
  },
  {
    id: "closet",
    label: "Closet",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 130, y: 570 }, { x: 220, y: 570 },
      { x: 220, y: 680 }, { x: 130, y: 680 },
    ],
  },
  {
    id: "car_b",
    label: "Car",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 180, y: 520 }, { x: 258, y: 520 },
      { x: 258, y: 580 }, { x: 180, y: 580 },
    ],
  },
  {
    id: "dog",
    label: "Dog",
    team: "T",
    elevated: false,
    floorColor: MATERIALS.STONE_DARK,
    points: [
      { x:  20, y: 490 }, { x: 130, y: 490 },
      { x: 130, y: 680 }, { x:  20, y: 680 },
    ],
  },
  {
    id: "fence",
    label: "Fence",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x:  20, y: 680 }, { x:  90, y: 680 },
      { x:  90, y: 780 }, { x:  20, y: 780 },
    ],
  },
  {
    id: "big_box",
    label: "Big Box",
    team: "CT",
    elevated: false,
    floorColor: MATERIALS.CONCRETE,
    points: [
      { x: 100, y: 690 }, { x: 220, y: 690 },
      { x: 220, y: 760 }, { x: 100, y: 760 },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// 5. WALLS  (solid collision rectangles — players cannot pass through)
// Format: { id, x, y, w, h }  where (x,y) = bottom-left corner.
// ─────────────────────────────────────────────────────────────────────────────

const WALLS = [

  // ── Outer map boundary ────────────────────────────────────────────────────
  { id: "border_south",           x:    0, y:    0, w: 1024, h:   20 },
  { id: "border_north",           x:    0, y: 1004, w: 1024, h:   20 },
  { id: "border_west",            x:    0, y:    0, w:   20, h: 1024 },
  { id: "border_east",            x: 1004, y:    0, w:   20, h: 1024 },

  // ── Long A ────────────────────────────────────────────────────────────────
  { id: "wall_long_mid_sep",      x: 600, y:  20, w:  20, h: 340 },   // Separates Outside Long from Suicide
  { id: "wall_pit_inner",         x: 930, y: 160, w:  20, h: 260 },   // Between Long A and Pit
  { id: "wall_long_door_south",   x: 800, y: 230, w: 200, h:  30 },   // Below Long Doors
  { id: "wall_long_a_north",      x: 800, y: 560, w: 200, h:  15 },   // Top of Long before A-Ramp

  // ── A-Site ────────────────────────────────────────────────────────────────
  { id: "wall_asite_north",       x: 680, y: 920, w: 324, h:  20 },
  { id: "wall_asite_west",        x: 680, y: 670, w:  20, h: 250 },
  { id: "wall_fastcat_block",     x: 650, y: 730, w:  30, h: 130 },
  { id: "wall_asite_inner_n",     x: 740, y: 860, w: 130, h:  20 },

  // ── Short A / Catwalk ─────────────────────────────────────────────────────
  { id: "wall_cat_south",         x: 536, y: 540, w:  80, h:  30 },
  { id: "wall_cat_east",          x: 610, y: 580, w:  50, h: 210 },
  { id: "wall_shorta_north",      x: 596, y: 840, w: 100, h:  20 },

  // ── CT-Spawn / CT-Mid ─────────────────────────────────────────────────────
  { id: "wall_ctspawn_mid",       x: 542, y: 560, w:  20, h:  90 },
  { id: "wall_ctmid_south",       x: 258, y: 560, w: 188, h:  20 },
  { id: "wall_ctmid_north",       x: 258, y: 730, w: 100, h:  20 },

  // ── Mid ───────────────────────────────────────────────────────────────────
  { id: "wall_suicide_west",      x: 380, y: 110, w:  20, h: 260 },
  { id: "wall_topmid_east",       x: 608, y: 150, w:  20, h: 210 },
  { id: "wall_mid_long_block",    x: 620, y: 310, w: 180, h: 260 },

  // ── B-Tunnels ─────────────────────────────────────────────────────────────
  { id: "wall_upperb_north",      x:  20, y: 490, w: 150, h:  20 },
  { id: "wall_dog_closet_n",      x: 130, y: 490, w:  20, h: 200 },
  { id: "wall_lowerb_south",      x: 260, y: 390, w: 140, h:  20 },
  { id: "wall_lowerb_east",       x: 400, y: 390, w:  20, h: 170 },

  // ── B-Site ────────────────────────────────────────────────────────────────
  { id: "wall_bsite_east",        x: 260, y: 730, w:  20, h: 270 },
  { id: "wall_bsite_north",       x:  20, y: 960, w: 240, h:  20 },
  { id: "wall_bsite_west",        x:  20, y: 730, w:  20, h: 230 },
  { id: "wall_backplat_s",        x:  20, y: 920, w: 180, h:  20 },
  { id: "wall_bwindow_inner",     x: 260, y: 820, w:  60, h:  20 },

  // ── Void blocks (buildings / non-playable interior) ───────────────────────
  { id: "void_tunnels_mid",       x: 260, y: 200, w: 176, h: 360 },
  { id: "void_mid_long_a",        x: 620, y: 360, w: 180, h: 310 },
  { id: "void_ctspawn_above",     x: 320, y: 840, w: 210, h: 164 },
  { id: "void_bsite_ctmid",       x: 310, y: 730, w: 150, h: 110 },
  { id: "void_long_corner",       x: 800, y: 150, w: 200, h: 110 },  // Corner above Long Doors
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. DOORS  (toggleable thin-wall passages)
// ─────────────────────────────────────────────────────────────────────────────

const DOORS = [
  {
    id: "long_doors_left",
    label: "Long Doors (Left)",
    x: 798, y: 260, w: 10, h: 30,
    orientation: "vertical",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
  {
    id: "long_doors_right",
    label: "Long Doors (Right)",
    x: 822, y: 260, w: 10, h: 30,
    orientation: "vertical",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
  {
    id: "mid_doors_left",
    label: "Mid Doors (Left)",
    x: 446, y: 558, w: 30, h: 10,
    orientation: "horizontal",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
  {
    id: "mid_doors_right",
    label: "Mid Doors (Right)",
    x: 490, y: 558, w: 30, h: 10,
    orientation: "horizontal",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
  {
    id: "b_doors_left",
    label: "B Doors (Left)",
    x: 220, y: 700, w: 10, h: 28,
    orientation: "vertical",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
  {
    id: "b_doors_right",
    label: "B Doors (Right)",
    x: 220, y: 735, w: 10, h: 28,
    orientation: "vertical",
    isPassable: true,
    material: MATERIALS.DOOR_WOOD,
    isChokepoint: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROPS  (cover objects — solid collision, not passable)
// cx/cy = centre of the prop, w/h = half-extents for collision.
// ─────────────────────────────────────────────────────────────────────────────

const PROPS = [

  // ── Long A ────────────────────────────────────────────────────────────────
  {
    id: "blue_box",
    label: "Blue Box",
    cx: 830, cy: 420, w: 40, h: 40,
    height: 88,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "blue",
  },
  {
    id: "long_a_crate",
    label: "Crate (Long A)",
    cx: 858, cy: 368, w: 28, h: 28,
    height: 60,
    isClimbable: false,
    material: MATERIALS.CRATE,
    zone: "long_a",
  },

  // ── A-Site ────────────────────────────────────────────────────────────────
  {
    id: "a_default_stack_1",
    label: "A Crate Stack 1",
    cx: 900, cy: 760, w: 50, h: 35,
    height: 120,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "a_site_default",
  },
  {
    id: "a_default_stack_2",
    label: "A Crate Stack 2",
    cx: 950, cy: 790, w: 35, h: 35,
    height: 80,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "a_site_default",
  },
  {
    id: "a_safe_box",
    label: "Safe",
    cx: 880, cy: 730, w: 25, h: 25,
    height: 50,
    isClimbable: false,
    material: MATERIALS.METAL,
    zone: "a_plat",
  },
  {
    id: "a_barrels_ramp",
    label: "Barrels (A Ramp)",
    cx: 905, cy: 870, w: 30, h: 30,
    height: 60,
    isClimbable: false,
    material: MATERIALS.METAL,
    zone: "barrels",
  },

  // ── Mid ───────────────────────────────────────────────────────────────────
  {
    id: "xbox_box",
    label: "Xbox",
    cx: 498, cy: 522, w: 44, h: 44,
    height: 64,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "xbox",
    note: "Climbable box at Mid/Cat junction. Boost point onto Catwalk.",
  },
  {
    id: "palm_tree",
    label: "Palm",
    cx: 488, cy: 350, w: 10, h: 10,
    height: 200,
    isClimbable: false,
    material: MATERIALS.METAL,
    zone: "palm",
  },

  // ── B-Site ────────────────────────────────────────────────────────────────
  {
    id: "b_double_stack_1",
    label: "Double Stack 1",
    cx: 150, cy: 810, w: 50, h: 35,
    height: 120,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "b_default",
  },
  {
    id: "b_double_stack_2",
    label: "Double Stack 2",
    cx: 200, cy: 810, w: 35, h: 35,
    height: 80,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "b_default",
  },
  {
    id: "b_big_box_prop",
    label: "Big Box (B)",
    cx: 158, cy: 724, w: 58, h: 38,
    height: 80,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "big_box",
  },

  // ── Humvee / Car at Upper B entrance ─────────────────────────────────────
  {
    id: "humvee",
    label: "Car (Humvee)",
    cx: 216, cy: 546, w: 56, h: 40,
    height: 70,
    isClimbable: false,
    material: MATERIALS.METAL,
    zone: "car_b",
    note: "Iconic vehicle cover at Upper Tunnels → B-Site entrance.",
  },

  // ── CT-Mid ────────────────────────────────────────────────────────────────
  {
    id: "ct_mid_boxes",
    label: "B Boxes (CT)",
    cx: 318, cy: 602, w: 58, h: 38,
    height: 80,
    isClimbable: true,
    material: MATERIALS.CRATE,
    zone: "b_boxes",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. POINTS OF INTEREST  (callout labels matching the reference image)
// ─────────────────────────────────────────────────────────────────────────────

const POINTS_OF_INTEREST = [

  // T-Side
  { id: "poi_t_spawn",          label: "T Spawn",           x: 500,  y:  62 },
  { id: "poi_t_plat",           label: "T Plat",            x: 180,  y: 245 },
  { id: "poi_outside_tunnels",  label: "Outside Tunnels",   x: 140,  y: 130 },
  { id: "poi_suicide",          label: "Suicide",           x: 416,  y: 260 },

  // Long A
  { id: "poi_outside_long",     label: "Outside Long",      x: 740,  y: 110 },
  { id: "poi_long_doors",       label: "Long Doors",        x: 840,  y: 288 },
  { id: "poi_long_a",           label: "Long A",            x: 860,  y: 400 },
  { id: "poi_blue",             label: "Blue",              x: 832,  y: 418 },
  { id: "poi_pit",              label: "Pit",               x: 970,  y: 290 },
  { id: "poi_pit_plat",         label: "Pit Plat",          x: 968,  y: 376 },
  { id: "poi_side_pit",         label: "Side Pit",          x: 902,  y: 354 },
  { id: "poi_car_long",         label: "Car",               x: 980,  y: 480 },

  // A-Site
  { id: "poi_ramp",             label: "Ramp",              x: 970,  y: 610 },
  { id: "poi_a_plat",           label: "A Plat",            x: 840,  y: 755 },
  { id: "poi_a_default",        label: "A Default",         x: 900,  y: 770 },
  { id: "poi_a_bombsite",       label: "A",                 x: 926,  y: 744,  isBombsite: true },
  { id: "poi_goose",            label: "Goose",             x: 968,  y: 876 },
  { id: "poi_barrels",          label: "Barrels",           x: 902,  y: 882 },
  { id: "poi_pizza",            label: "Pizza",             x: 786,  y: 866 },
  { id: "poi_ninja",            label: "Ninja",             x: 706,  y: 886 },
  { id: "poi_elevator",         label: "Elevator",          x: 762,  y: 728 },
  { id: "poi_quad",             label: "Quad",              x: 786,  y: 728 },
  { id: "poi_fast_cat",         label: "Fast Cat",          x: 686,  y: 758 },
  { id: "poi_cross",            label: "Cross",             x: 762,  y: 806 },
  { id: "poi_ct_ramp",          label: "CT Ramp",           x: 718,  y: 838 },
  { id: "poi_safe",             label: "Safe",              x: 878,  y: 728 },

  // Short A / Catwalk
  { id: "poi_short_a",          label: "Short A",           x: 628,  y: 838 },
  { id: "poi_catwalk",          label: "Catwalk",           x: 564,  y: 704 },
  { id: "poi_stairs",           label: "Stairs",            x: 618,  y: 752 },
  { id: "poi_cat_boost",        label: "Cat Boost",         x: 588,  y: 522 },

  // CT Area
  { id: "poi_ct_spawn",         label: "CT Spawn",          x: 594,  y: 695 },
  { id: "poi_ct_mid",           label: "CT Mid",            x: 380,  y: 674 },
  { id: "poi_b_boxes_ct",       label: "B Boxes",           x: 316,  y: 602 },

  // Mid
  { id: "poi_mid_doors",        label: "Mid Doors",         x: 484,  y: 592 },
  { id: "poi_mid",              label: "Mid",               x: 510,  y: 455 },
  { id: "poi_xbox",             label: "Xbox",              x: 496,  y: 522 },
  { id: "poi_top_mid",          label: "Top Mid",           x: 510,  y: 250 },
  { id: "poi_palm",             label: "Palm",              x: 486,  y: 348 },
  { id: "poi_green",            label: "Green",             x: 418,  y: 316 },

  // B-Tunnels
  { id: "poi_upper_b",          label: "Upper B (Tunnels)", x: 128,  y: 358 },
  { id: "poi_lower_b",          label: "Lower B (Tunnels)", x: 276,  y: 473 },

  // B-Site
  { id: "poi_b_doors",          label: "B Doors",           x: 260,  y: 716 },
  { id: "poi_b_bombsite",       label: "B",                 x: 158,  y: 830,  isBombsite: true },
  { id: "poi_b_plat",           label: "B Plat",            x:  50,  y: 854 },
  { id: "poi_back_plat",        label: "Back Plat",         x:  88,  y: 962 },
  { id: "poi_back_site",        label: "Back Site",         x: 174,  y: 918 },
  { id: "poi_b_window",         label: "Window",            x: 224,  y: 846 },
  { id: "poi_b_default",        label: "Default",           x: 156,  y: 796 },
  { id: "poi_b_scaffold",       label: "Scaffold",          x: 276,  y: 868 },
  { id: "poi_b_double_stack",   label: "Double Stack",      x: 172,  y: 810 },
  { id: "poi_big_box",          label: "Big Box",           x: 146,  y: 722 },
  { id: "poi_closet",           label: "Closet",            x: 170,  y: 620 },
  { id: "poi_car_b",            label: "Car",               x: 214,  y: 546 },
  { id: "poi_dog",              label: "Dog",               x:  70,  y: 582 },
  { id: "poi_fence",            label: "Fence",             x:  50,  y: 726 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. ELEVATION HINTS  (advisory Z values for 2.5D renderers)
// ─────────────────────────────────────────────────────────────────────────────

const ELEVATION_HINTS = {
  t_spawn:            0,
  outside_long:       0,
  outside_tunnels:    0,
  long_doors:         0,
  long_a:             0,
  pit:             -128,
  pit_plat:         -64,
  side_pit:         -64,
  a_ramp:             0,    // Ramp: slopes from 0 → 160
  a_plat:           160,
  a_site_default:   160,
  goose:            160,
  barrels:          160,
  cross:            160,
  ct_ramp:            0,   // Slopes from 0 → 160
  elevator:         160,
  quad:             160,
  fast_cat:           0,
  pizza:            160,
  ninja:            160,
  short_a:           96,
  catwalk:           96,
  stairs_short:      96,
  ct_spawn:           0,
  ct_mid:             0,
  b_boxes:            0,
  mid_doors:          0,
  mid_main:           0,
  xbox:               0,
  cat_boost:          0,
  top_mid:            0,
  suicide:            0,
  palm:               0,
  green:              0,
  upper_b_tunnels:    0,
  lower_b_tunnels: -128,   // Steps down from Upper Tunnels
  t_plat:             0,
  b_site:            96,
  b_plat:            96,
  back_plat:         96,
  b_site_back:       96,
  b_window:          96,
  b_scaffold:        96,
  b_default:         96,
  b_doors:            0,
  big_box:            0,
  closet:             0,
  car_b:              0,
  dog:                0,
  fence:              0,
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. NAVIGATION GRAPH  (bidirectional edges for pathfinding / AI routing)
// ─────────────────────────────────────────────────────────────────────────────

const NAV_GRAPH = [

  // T-Spawn exits
  { from: "t_spawn",            to: "outside_long",       width: 200, type: "open"     },
  { from: "t_spawn",            to: "top_mid",            width:  80, type: "open"     },
  { from: "t_spawn",            to: "outside_tunnels",    width: 180, type: "open"     },

  // Long A lane
  { from: "outside_long",       to: "long_doors",         width:  60, type: "door"     },
  { from: "long_doors",         to: "long_a",             width: 180, type: "open"     },
  { from: "long_a",             to: "blue",               width:  70, type: "open"     },
  { from: "long_a",             to: "side_pit",           width:  60, type: "drop"     },
  { from: "side_pit",           to: "pit",                width: 100, type: "open"     },
  { from: "long_a",             to: "a_ramp",             width: 140, type: "ramp"     },

  // A-Site
  { from: "a_ramp",             to: "a_plat",             width: 140, type: "ramp"     },
  { from: "a_plat",             to: "a_site_default",     width: 200, type: "open"     },
  { from: "a_plat",             to: "goose",              width:  80, type: "open"     },
  { from: "a_plat",             to: "barrels",            width:  70, type: "open"     },
  { from: "a_plat",             to: "cross",              width:  80, type: "open"     },
  { from: "a_plat",             to: "elevator",           width:  60, type: "open"     },
  { from: "a_plat",             to: "quad",               width:  60, type: "open"     },
  { from: "a_plat",             to: "pizza",              width:  60, type: "open"     },
  { from: "a_plat",             to: "ninja",              width:  60, type: "open"     },
  { from: "a_plat",             to: "short_a",            width:  80, type: "open"     },
  { from: "cross",              to: "ct_ramp",            width:  80, type: "ramp"     },

  // Short A / Catwalk
  { from: "short_a",            to: "catwalk",            width:  64, type: "elevated" },
  { from: "short_a",            to: "stairs_short",       width:  64, type: "stairs"   },
  { from: "stairs_short",       to: "ct_spawn",           width:  64, type: "stairs"   },
  { from: "catwalk",            to: "xbox",               width:  64, type: "drop"     },
  { from: "catwalk",            to: "cat_boost",          width:  50, type: "elevated" },

  // CT-Spawn / CT-Mid
  { from: "ct_spawn",           to: "ct_mid",             width: 150, type: "open"     },
  { from: "ct_ramp",            to: "ct_spawn",           width:  80, type: "ramp"     },
  { from: "fast_cat",           to: "ct_spawn",           width:  60, type: "open"     },
  { from: "ct_mid",             to: "b_doors",            width:  60, type: "door"     },
  { from: "ct_mid",             to: "mid_doors",          width:  80, type: "door"     },
  { from: "ct_mid",             to: "b_boxes",            width: 120, type: "open"     },

  // Mid lane
  { from: "mid_doors",          to: "mid_main",           width: 100, type: "open"     },
  { from: "mid_main",           to: "xbox",               width: 100, type: "open"     },
  { from: "mid_main",           to: "cat_boost",          width:  80, type: "open"     },
  { from: "mid_main",           to: "top_mid",            width: 160, type: "open"     },
  { from: "top_mid",            to: "suicide",            width:  40, type: "narrow"   },
  { from: "top_mid",            to: "palm",               width: 100, type: "open"     },
  { from: "top_mid",            to: "green",              width:  40, type: "open"     },
  { from: "top_mid",            to: "t_spawn",            width: 170, type: "open"     },
  { from: "xbox",               to: "catwalk",            width:  64, type: "boost"    },

  // B-Tunnels lane
  { from: "outside_tunnels",    to: "upper_b_tunnels",    width: 100, type: "tunnel"   },
  { from: "outside_tunnels",    to: "t_plat",             width:  80, type: "open"     },
  { from: "upper_b_tunnels",    to: "lower_b_tunnels",    width:  80, type: "stairs"   },
  { from: "lower_b_tunnels",    to: "mid_main",           width:  80, type: "open"     },
  { from: "lower_b_tunnels",    to: "dog",                width:  80, type: "open"     },
  { from: "dog",                to: "closet",             width:  60, type: "open"     },
  { from: "closet",             to: "car_b",              width:  60, type: "open"     },
  { from: "car_b",              to: "b_boxes",            width:  80, type: "open"     },

  // B-Site
  { from: "b_doors",            to: "b_site",             width:  60, type: "door"     },
  { from: "upper_b_tunnels",    to: "b_site",             width: 120, type: "open"     },
  { from: "b_site",             to: "b_plat",             width:  70, type: "open"     },
  { from: "b_site",             to: "back_plat",          width: 100, type: "open"     },
  { from: "b_site",             to: "b_site_back",        width: 100, type: "open"     },
  { from: "b_site_back",        to: "b_window",           width:  50, type: "window"   },
  { from: "b_site",             to: "b_default",          width: 120, type: "open"     },
  { from: "b_site",             to: "b_scaffold",         width:  70, type: "open"     },
  { from: "b_site",             to: "big_box",            width:  60, type: "open"     },
  { from: "fence",              to: "b_site",             width:  50, type: "open"     },
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. MASTER EXPORT  — const worldData
// ─────────────────────────────────────────────────────────────────────────────

const worldData = {
  meta:             MAP_META,
  materials:        MATERIALS,
  spawnPoints:      SPAWN_POINTS,
  walkableAreas:    WALKABLE_AREAS,
  walls:            WALLS,
  doors:            DOORS,
  props:            PROPS,
  pointsOfInterest: POINTS_OF_INTEREST,
  elevationHints:   ELEVATION_HINTS,
  navGraph:         NAV_GRAPH,

  // ── Convenience helpers ──────────────────────────────────────────────────

  /**
   * Returns the walkable area definition for a given zone id.
   * @param {string} id
   * @returns {object|undefined}
   */
  getZone(id) {
    return this.walkableAreas.find(z => z.id === id);
  },

  /**
   * Returns all zone ids reachable in one hop from a given zone.
   * @param {string} fromId
   * @returns {string[]}
   */
  getNeighborIds(fromId) {
    return this.navGraph
      .filter(e => e.from === fromId || e.to === fromId)
      .map(e => e.from === fromId ? e.to : e.from);
  },

  /**
   * Returns walkable area objects for all one-hop neighbours.
   * @param {string} fromId
   * @returns {object[]}
   */
  getNeighbors(fromId) {
    return this.getNeighborIds(fromId)
      .map(id => this.getZone(id))
      .filter(Boolean);
  },

  /**
   * Returns all props located in the given zone.
   * @param {string} zoneId
   * @returns {object[]}
   */
  getPropsInZone(zoneId) {
    return this.props.filter(p => p.zone === zoneId);
  },

  /**
   * Returns all zones belonging to a team: "T" | "CT" | "NEUTRAL".
   * Pass null to get all zones.
   * @param {string|null} team
   * @returns {object[]}
   */
  getZonesByTeam(team) {
    if (!team) return this.walkableAreas;
    return this.walkableAreas.filter(z => z.team === team);
  },

  /**
   * Returns all zones marked as bomb sites.
   * @returns {object[]}
   */
  getBombSiteZones() {
    return this.walkableAreas.filter(z => z.bombSite);
  },

  /**
   * Returns the door object for a given door id.
   * @param {string} id
   * @returns {object|undefined}
   */
  getDoor(id) {
    return this.doors.find(d => d.id === id);
  },

  /**
   * Toggles the isPassable flag on a door (simulate open/close).
   * @param {string} id
   * @returns {boolean} New isPassable value, or false if door not found.
   */
  toggleDoor(id) {
    const door = this.getDoor(id);
    if (!door) return false;
    door.isPassable = !door.isPassable;
    return door.isPassable;
  },

  /**
   * Returns all choke-point doors (isChokepoint === true).
   * @returns {object[]}
   */
  getChokepoints() {
    return this.doors.filter(d => d.isChokepoint);
  },

  /**
   * Returns the wall with the given id.
   * @param {string} id
   * @returns {object|undefined}
   */
  getWall(id) {
    return this.walls.find(w => w.id === id);
  },

  /**
   * Point-in-AABB collision test against all wall rectangles.
   * @param {number} x
   * @param {number} y
   * @returns {object|null} First wall that contains (x,y), or null.
   */
  getWallAtPoint(x, y) {
    return this.walls.find(w =>
      x >= w.x && x <= w.x + w.w &&
      y >= w.y && y <= w.y + w.h
    ) || null;
  },

  /**
   * Point-in-polygon test (ray-casting) for walkable areas.
   * Returns the first walkable area containing (x, y), or null.
   * @param {number} x
   * @param {number} y
   * @returns {object|null}
   */
  getZoneAtPoint(x, y) {
    for (const zone of this.walkableAreas) {
      if (_pointInPolygon(x, y, zone.points)) return zone;
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper — point-in-polygon (ray-casting algorithm)
// ─────────────────────────────────────────────────────────────────────────────
function _pointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ─────────────────────────────────────────────────────────────────────────────
// Module export — supports CommonJS, ESM, and browser globals
// ─────────────────────────────────────────────────────────────────────────────
if (typeof module !== "undefined" && module.exports) {
  module.exports = worldData;
} else if (typeof exports !== "undefined") {
  exports.worldData = worldData;
} else if (typeof window !== "undefined") {
  window.worldData = worldData;
}