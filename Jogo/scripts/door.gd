extends Area2D
## Porta / transição — leva o player para outra cena quando ele chega perto
## e aperta a tecla de interação (E / Espaço / Enter).

## Cena de destino (arraste o .tscn no Inspetor).
@export_file("*.tscn") var target_scene: String = ""

## Texto mostrado quando o player está por perto.
@export var prompt_text: String = "[E] entrar"

var _player_near: bool = false
@onready var prompt: Label = $Prompt

func _ready() -> void:
	prompt.text = prompt_text
	prompt.hide()

func _process(_delta: float) -> void:
	prompt.visible = _player_near and not Dialogue.is_open()

func _on_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		_player_near = true

func _on_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		_player_near = false

func _unhandled_input(event: InputEvent) -> void:
	if _player_near and not Dialogue.is_open() and event.is_action_pressed("interact"):
		if target_scene != "":
			get_tree().change_scene_to_file(target_scene)
			get_viewport().set_input_as_handled()
