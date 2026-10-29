extends SceneTree
## Gerador de sala (scaffold). Cria uma sala vazia (chão + paredes) e salva num .tscn.
## Rodar: godot4 --headless --path . --script res://tools/build_room.gd
## Depois adiciona-se Player / portas / NPCs à mão no editor (ou editando o .tscn).
## Deixa o Godot serializar o tile_map_data no formato correto da versão.

const W := 24
const H := 15
const FLOOR := Vector2i(1, 10)
const WALL := Vector2i(1, 3)
const SRC := 0
const OUT := "res://scenes/setor_suporte.tscn"
const ROOT_NAME := "SetorSuporte"

func _init() -> void:
	var tileset: TileSet = load("res://scenes/dungeon_tileset.tres")

	var root := Node2D.new()
	root.name = ROOT_NAME

	var floor_layer := TileMapLayer.new()
	floor_layer.name = "Floor"
	floor_layer.tile_set = tileset

	var walls_layer := TileMapLayer.new()
	walls_layer.name = "Walls"
	walls_layer.tile_set = tileset

	for y in range(H):
		for x in range(W):
			var is_border := x == 0 or y == 0 or x == W - 1 or y == H - 1
			if is_border:
				walls_layer.set_cell(Vector2i(x, y), SRC, WALL)
			else:
				floor_layer.set_cell(Vector2i(x, y), SRC, FLOOR)

	root.add_child(floor_layer)
	root.add_child(walls_layer)
	floor_layer.owner = root
	walls_layer.owner = root

	var packed := PackedScene.new()
	packed.pack(root)
	var err := ResourceSaver.save(packed, OUT)
	print("build_room: saved ", OUT, " err=", err, " (0 = OK)")
	quit()
