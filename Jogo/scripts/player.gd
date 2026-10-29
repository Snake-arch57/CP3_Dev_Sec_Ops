extends CharacterBody2D
## Player — movimento top-down em 8 direções, com sprite animado.
## Anda com WASD e com as setas (controles definidos no Input Map do projeto).

## Velocidade de movimento, em pixels por segundo.
## A anotação @export faz este valor aparecer no Inspetor do Godot.
@export var speed: float = 120.0

## Referência ao nó de sprite animado (filho chamado "Sprite").
## @onready espera a cena terminar de carregar antes de pegar a referência.
@onready var sprite: AnimatedSprite2D = $Sprite

## Guarda a última direção para onde o player olhou (pra ficar parado virado certo).
var facing: String = "down"

## Ao entrar na cena, registra o player no grupo "player".
## NPCs usam isso pra saber que foi o jogador que se aproximou.
func _ready() -> void:
	add_to_group("player")

## _physics_process roda a cada quadro de física (ideal para movimento e colisão).
func _physics_process(_delta: float) -> void:
	# Vetor de direção a partir dos controles (WASD + setas).
	var direction: Vector2 = Input.get_vector("move_left", "move_right", "move_up", "move_down")

	# Move o corpo e trata colisão com paredes.
	velocity = direction * speed
	move_and_slide()

	# Atualiza a animação de acordo com o movimento.
	_update_animation(direction)

## Decide qual animação tocar.
func _update_animation(direction: Vector2) -> void:
	# Parado: toca a animação de "respiração" (idle) virado para o último lado.
	if direction == Vector2.ZERO:
		sprite.play("idle_" + facing)
		return

	# Em movimento: descobre a direção dominante (horizontal ou vertical).
	if abs(direction.x) > abs(direction.y):
		facing = "right" if direction.x > 0.0 else "left"
	else:
		facing = "down" if direction.y > 0.0 else "up"

	# Toca a animação de caminhada correspondente.
	sprite.play("walk_" + facing)
