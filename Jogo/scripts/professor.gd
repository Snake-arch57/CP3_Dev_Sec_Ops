extends StaticBody2D
## NPC Professor — bloqueia passagem e conversa quando o player se aproxima
## e aperta a tecla de interação (E / Espaço / Enter).

## Nome exibido na caixa de diálogo.
@export var speaker: String = "Professor"

## Falas do Professor (editável no Inspetor depois).
@export var lines: Array[String] = [
	"Conexão estabelecida... você foi digitalizado com sucesso. Eu sou o Professor.",
	"O Mundo Virtual foi infectado. Worms, ransomware e golpes de phishing se espalham por aqui.",
	"Cada brecha aqui dentro vira prejuízo real lá fora: dados vazados, contas invadidas, dinheiro perdido.",
	"Comece pelo Setor de Suporte. E cuidado: nem todo link, e-mail ou recompensa é o que parece.",
	"Aperte E para falar comigo quando precisar. Boa sorte, Guardião.",
]

var _player_near: bool = false
@onready var prompt: Label = $Prompt

func _ready() -> void:
	prompt.hide()

func _process(_delta: float) -> void:
	# Mostra o "[E] falar" só quando o player está perto e não há diálogo aberto.
	prompt.visible = _player_near and not Dialogue.is_open()

func _on_interact_area_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		_player_near = true

func _on_interact_area_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		_player_near = false

func _unhandled_input(event: InputEvent) -> void:
	if _player_near and not Dialogue.is_open() and event.is_action_pressed("interact"):
		Dialogue.start(lines, speaker)
		get_viewport().set_input_as_handled()
