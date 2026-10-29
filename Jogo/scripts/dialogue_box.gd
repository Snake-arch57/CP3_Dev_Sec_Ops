extends CanvasLayer
## Caixa de diálogo reutilizável (autoload "Dialogue").
## Qualquer NPC chama: Dialogue.start(["linha 1", "linha 2"], "Nome").
## Avança/fecha com a ação "interact" (E / Espaço / Enter).

@onready var box: Panel = $Box
@onready var name_label: Label = $Box/Margin/VBox/Name
@onready var text_label: Label = $Box/Margin/VBox/Text

var _lines: PackedStringArray = []
var _index: int = 0
var _active: bool = false

func _ready() -> void:
	# Fica na frente de tudo e começa escondida.
	layer = 100
	box.hide()

## Outros scripts perguntam isto pra não abrir dois diálogos ao mesmo tempo.
func is_open() -> bool:
	return _active

## Inicia um diálogo com uma lista de falas e o nome de quem fala.
func start(lines: Array, speaker: String = "") -> void:
	if lines.is_empty():
		return
	_lines = PackedStringArray(lines)
	_index = 0
	_active = true
	name_label.text = speaker
	name_label.visible = speaker != ""
	_show_line()
	box.show()

func _show_line() -> void:
	text_label.text = _lines[_index]

func _advance() -> void:
	_index += 1
	if _index >= _lines.size():
		_close()
	else:
		_show_line()

func _close() -> void:
	_active = false
	box.hide()

func _unhandled_input(event: InputEvent) -> void:
	if not _active:
		return
	if event.is_action_pressed("interact"):
		_advance()
		get_viewport().set_input_as_handled()
