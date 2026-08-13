import json
from app.database import engine, SessionLocal
from app import models
from app.database import Base

# ── Course & Roadmap Data for 10 Popular Languages ──────────────────────────────
# Visual assets for quiz options
APPLE_IMG = "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80"
MAN_IMG   = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
WOMAN_IMG = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
BOY_IMG   = "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80"
GIRL_IMG  = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
DOG_IMG   = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"
CAT_IMG   = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80"
HOUSE_IMG = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80"
WATER_IMG = "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80"
CAR_IMG   = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80"

DEFAULT_UNITS = [
    {
        "title": "Unit 1",
        "description": "Order food, greet people",
        "color": "#58cc02",
        "skills": [
            {"title": "Basics 1", "icon": "star", "position": 0},
            {"title": "Food & Drinks", "icon": "star", "position": -1},
            {"title": "Bonus Chest", "icon": "chest", "position": -2},
            {"title": "Key Words", "icon": "star", "position": 0, "character": "duo"},
            {"title": "Unit 1 Trophy", "icon": "trophy", "position": 1},
        ],
    },
    {
        "title": "Unit 2",
        "description": "Greet people, say goodbye",
        "color": "#ce82ff",
        "skills": [
            {"title": "Jump to Unit 2", "icon": "fast-forward", "position": 0},
            {"title": "Greetings", "icon": "star", "position": 1},
            {"title": "Treasure Chest", "icon": "chest", "position": 2, "character": "duo"},
            {"title": "Phrases", "icon": "star", "position": 0},
            {"title": "Unit 2 Trophy", "icon": "trophy", "position": -1},
        ],
    },
    {
        "title": "Unit 3",
        "description": "Daily routine & hobbies",
        "color": "#00cd9c",
        "skills": [
            {"title": "People", "icon": "star", "position": 0},
            {"title": "Animals", "icon": "star", "position": -1},
            {"title": "Lucky Chest", "icon": "chest", "position": -2, "character": "duo"},
            {"title": "Family", "icon": "star", "position": 0},
            {"title": "Unit 3 Trophy", "icon": "trophy", "position": 1},
        ],
    },
    {
        "title": "Unit 4",
        "description": "Travel, directions & culture",
        "color": "#ff4b4b",
        "skills": [
            {"title": "Jump to Unit 4", "icon": "fast-forward", "position": 0},
            {"title": "Travel", "icon": "star", "position": 1},
            {"title": "Golden Chest", "icon": "chest", "position": 2, "character": "duo"},
            {"title": "Places", "icon": "star", "position": 0},
            {"title": "Unit 4 Trophy", "icon": "trophy", "position": -1},
        ],
    },
]

COURSE_DATA = {
    "es": {
        "name": "Spanish", "flag_code": "es", "learners": "41.5M learners",
        "vocab": {
            "the_apple": "la manzana", "the_man": "el hombre", "the_woman": "la mujer",
            "the_boy": "el niño", "the_girl": "la niña", "water": "agua",
            "I_am_a_man": "Yo soy un hombre", "she_is_a_woman": "Ella es una mujer",
            "a_boy_and_a_girl": "Un niño y una niña",
            "hello": "Hola", "goodbye": "Adiós", "please": "Por favor",
            "thank_you": "Gracias", "yes": "Sí", "no": "No",
            "good_morning": "Buenos días", "good_night": "Buenas noches",
            "the_cat": "el gato", "the_dog": "el perro",
            "I_eat_bread": "Yo como pan", "she_drinks_milk": "Ella bebe leche",
            "the_house": "la casa", "the_car": "el coche",
        },
        "units": DEFAULT_UNITS
    },
    "hi": {
        "name": "Hindi", "flag_code": "in", "learners": "8.4M learners",
        "vocab": {
            "the_apple": "सेब", "the_man": "आदमी", "the_woman": "औरत",
            "the_boy": "लड़का", "the_girl": "लड़की", "water": "पानी",
            "I_am_a_man": "मैं एक आदमी हूँ", "she_is_a_woman": "वह एक औरत है",
            "a_boy_and_a_girl": "एक लड़का और एक लड़की",
            "hello": "नमस्ते", "goodbye": "अलविदा", "please": "कृपया",
            "thank_you": "धन्यवाद", "yes": "हाँ", "no": "नहीं",
            "good_morning": "सुप्रभात", "good_night": "शुभ रात्रि",
            "the_cat": "बिल्ली", "the_dog": "कुत्ता",
            "I_eat_bread": "मैं रोटी खाता हूँ", "she_drinks_milk": "वह दूध पीती है",
            "the_house": "घर", "the_car": "गाड़ी",
        },
        "units": [
            {
                "title": "यूनिट 1",
                "description": "खाना ऑर्डर करना और नमस्ते कहना",
                "color": "#58cc02",
                "skills": [
                    {"title": "मूल बातें 1", "icon": "star", "position": 0},
                    {"title": "भोजन और पेय", "icon": "star", "position": -1},
                    {"title": "बोनस चेस्ट", "icon": "chest", "position": -2},
                    {"title": "महत्वपूर्ण शब्द", "icon": "star", "position": 0, "character": "duo"},
                    {"title": "यूनिट 1 ट्रॉफी", "icon": "trophy", "position": 1},
                ],
            },
            {
                "title": "यूनिट 2",
                "description": "अभिवादन और विदाई",
                "color": "#ce82ff",
                "skills": [
                    {"title": "यूनिट 2 पर जाएं", "icon": "fast-forward", "position": 0},
                    {"title": "अभिवादन", "icon": "star", "position": 1},
                    {"title": "खजाना चेस्ट", "icon": "chest", "position": 2, "character": "duo"},
                    {"title": "वाक्यांश", "icon": "star", "position": 0},
                    {"title": "यूनिट 2 ट्रॉफी", "icon": "trophy", "position": -1},
                ],
            },
            {
                "title": "यूनिट 3",
                "description": "दैनिक दिनचर्या और शौक",
                "color": "#00cd9c",
                "skills": [
                    {"title": "लोग", "icon": "star", "position": 0},
                    {"title": "जानवर", "icon": "star", "position": -1},
                    {"title": "भाग्यशाली चेस्ट", "icon": "chest", "position": -2, "character": "duo"},
                    {"title": "परिवार", "icon": "star", "position": 0},
                    {"title": "यूनिट 3 ट्रॉफी", "icon": "trophy", "position": 1},
                ],
            },
            {
                "title": "यूनिट 4",
                "description": "यात्रा, दिशा-निर्देश और संस्कृति",
                "color": "#ff4b4b",
                "skills": [
                    {"title": "यूनिट 4 पर जाएं", "icon": "fast-forward", "position": 0},
                    {"title": "यात्रा", "icon": "star", "position": 1},
                    {"title": "गोल्डन चेस्ट", "icon": "chest", "position": 2, "character": "duo"},
                    {"title": "स्थान", "icon": "star", "position": 0},
                    {"title": "यूनिट 4 ट्रॉफी", "icon": "trophy", "position": -1},
                ],
            },
        ],
    },
    "fr": {
        "name": "French", "flag_code": "fr", "learners": "23.1M learners",
        "vocab": {
            "the_apple": "la pomme", "the_man": "l'homme", "the_woman": "la femme",
            "the_boy": "le garçon", "the_girl": "la fille", "water": "eau",
            "I_am_a_man": "Je suis un homme", "she_is_a_woman": "Elle est une femme",
            "a_boy_and_a_girl": "Un garçon et une fille",
            "hello": "Bonjour", "goodbye": "Au revoir", "please": "S'il vous plaît",
            "thank_you": "Merci", "yes": "Oui", "no": "Non",
            "good_morning": "Bonjour", "good_night": "Bonne nuit",
            "the_cat": "le chat", "the_dog": "le chien",
            "I_eat_bread": "Je mange du pain", "she_drinks_milk": "Elle boit du lait",
            "the_house": "la maison", "the_car": "la voiture",
        },
        "units": [
            {
                "title": "Unité 1",
                "description": "Commander à manger, saluer",
                "color": "#58cc02",
                "skills": [
                    {"title": "Bases 1", "icon": "star", "position": 0},
                    {"title": "Nourriture et Boissons", "icon": "star", "position": -1},
                    {"title": "Coffre Bonus", "icon": "chest", "position": -2},
                    {"title": "Mots Clés", "icon": "star", "position": 0, "character": "duo"},
                    {"title": "Trophée Unité 1", "icon": "trophy", "position": 1},
                ],
            },
            {
                "title": "Unité 2",
                "description": "Saluer et dire au revoir",
                "color": "#ce82ff",
                "skills": [
                    {"title": "Sauter à l'Unité 2", "icon": "fast-forward", "position": 0},
                    {"title": "Salutations", "icon": "star", "position": 1},
                    {"title": "Coffre au Trésor", "icon": "chest", "position": 2, "character": "duo"},
                    {"title": "Phrases", "icon": "star", "position": 0},
                    {"title": "Trophée Unité 2", "icon": "trophy", "position": -1},
                ],
            },
            {
                "title": "Unité 3",
                "description": "Routine quotidienne et loisirs",
                "color": "#00cd9c",
                "skills": [
                    {"title": "Personnes", "icon": "star", "position": 0},
                    {"title": "Animaux", "icon": "star", "position": -1},
                    {"title": "Coffre de Chance", "icon": "chest", "position": -2, "character": "duo"},
                    {"title": "Famille", "icon": "star", "position": 0},
                    {"title": "Trophée Unité 3", "icon": "trophy", "position": 1},
                ],
            },
            {
                "title": "Unité 4",
                "description": "Voyages, directions et culture",
                "color": "#ff4b4b",
                "skills": [
                    {"title": "Sauter à l'Unité 4", "icon": "fast-forward", "position": 0},
                    {"title": "Voyage", "icon": "star", "position": 1},
                    {"title": "Coffre d'Or", "icon": "chest", "position": 2, "character": "duo"},
                    {"title": "Lieux", "icon": "star", "position": 0},
                    {"title": "Trophée Unité 4", "icon": "trophy", "position": -1},
                ],
            },
        ],
    },
    "de": {
        "name": "German", "flag_code": "de", "learners": "14.8M learners",
        "vocab": {
            "the_apple": "der Apfel", "the_man": "der Mann", "the_woman": "die Frau",
            "the_boy": "der Junge", "the_girl": "das Mädchen", "water": "Wasser",
            "I_am_a_man": "Ich bin ein Mann", "she_is_a_woman": "Sie ist eine Frau",
            "a_boy_and_a_girl": "Ein Junge und ein Mädchen",
            "hello": "Hallo", "goodbye": "Auf Wiedersehen", "please": "Bitte",
            "thank_you": "Danke", "yes": "Ja", "no": "Nein",
            "good_morning": "Guten Morgen", "good_night": "Gute Nacht",
            "the_cat": "die Katze", "the_dog": "der Hund",
            "I_eat_bread": "Ich esse Brot", "she_drinks_milk": "Sie trinkt Milch",
            "the_house": "das Haus", "the_car": "das Auto",
        },
        "units": DEFAULT_UNITS
    },
    "it": {
        "name": "Italian", "flag_code": "it", "learners": "7.9M learners",
        "vocab": {
            "the_apple": "la mela", "the_man": "l'uomo", "the_woman": "la donna",
            "the_boy": "il ragazzo", "the_girl": "la ragazza", "water": "acqua",
            "I_am_a_man": "Io sono un uomo", "she_is_a_woman": "Lei è una donna",
            "a_boy_and_a_girl": "Un ragazzo e una ragazza",
            "hello": "Ciao", "goodbye": "Arrivederci", "please": "Per favore",
            "thank_you": "Grazie", "yes": "Sì", "no": "No",
            "good_morning": "Buongiorno", "good_night": "Buona notte",
            "the_cat": "il gatto", "the_dog": "il cane",
            "I_eat_bread": "Io mangio pane", "she_drinks_milk": "Lei beve latte",
            "the_house": "la casa", "the_car": "l'auto",
        },
        "units": DEFAULT_UNITS
    },
    "pt": {
        "name": "Portuguese", "flag_code": "br", "learners": "12.3M learners",
        "vocab": {
            "the_apple": "a maçã", "the_man": "o homem", "the_woman": "a mulher",
            "the_boy": "o menino", "the_girl": "a menina", "water": "água",
            "I_am_a_man": "Eu sou um homem", "she_is_a_woman": "Ela é uma mulher",
            "a_boy_and_a_girl": "Um menino e uma menina",
            "hello": "Olá", "goodbye": "Adeus", "please": "Por favor",
            "thank_you": "Obrigado", "yes": "Sim", "no": "Não",
            "good_morning": "Bom dia", "good_night": "Boa noite",
            "the_cat": "o gato", "the_dog": "o cachorro",
            "I_eat_bread": "Eu como pão", "she_drinks_milk": "Ela bebe leite",
            "the_house": "a casa", "the_car": "o carro",
        },
        "units": DEFAULT_UNITS
    },
    "jp": {
        "name": "Japanese", "flag_code": "jp", "learners": "18.2M learners",
        "vocab": {
            "the_apple": "りんご", "the_man": "男の人", "the_woman": "女の人",
            "the_boy": "男の子", "the_girl": "女の子", "water": "水",
            "I_am_a_man": "私は男です", "she_is_a_woman": "彼女は女です",
            "a_boy_and_a_girl": "男の子と女の子",
            "hello": "こんにちは", "goodbye": "さようなら", "please": "お願いします",
            "thank_you": "ありがとう", "yes": "はい", "no": "いいえ",
            "good_morning": "おはようございます", "good_night": "おやすみなさい",
            "the_cat": "猫", "the_dog": "犬",
            "I_eat_bread": "私はパンを食べます", "she_drinks_milk": "彼女は牛乳を飲みます",
            "the_house": "家", "the_car": "車",
        },
        "units": DEFAULT_UNITS
    },
    "ar": {
        "name": "Arabic", "flag_code": "sa", "learners": "6.1M learners",
        "vocab": {
            "the_apple": "تفاحة", "the_man": "رجل", "the_woman": "امرأة",
            "the_boy": "ولد", "the_girl": "بنت", "water": "ماء",
            "I_am_a_man": "أنا رجل", "she_is_a_woman": "هي امرأة",
            "a_boy_and_a_girl": "ولد وبنت",
            "hello": "مرحبا", "goodbye": "مع السلامة", "please": "من فضلك",
            "thank_you": "شكرا", "yes": "نعم", "no": "لا",
            "good_morning": "صباح الخير", "good_night": "مساء الخير",
            "the_cat": "قطة", "the_dog": "كلب",
            "I_eat_bread": "أنا آكل الخبز", "she_drinks_milk": "هي تشرب الحليب",
            "the_house": "بيت", "the_car": "سيارة",
        },
        "units": DEFAULT_UNITS
    },
    "ko": {
        "name": "Korean", "flag_code": "kr", "learners": "15.4M learners",
        "vocab": {
            "the_apple": "사과", "the_man": "남자", "the_woman": "여자",
            "the_boy": "소년", "the_girl": "소녀", "water": "물",
            "I_am_a_man": "나는 남자입니다", "she_is_a_woman": "그녀는 여자입니다",
            "a_boy_and_a_girl": "소년과 소녀",
            "hello": "안녕하세요", "goodbye": "안녕히 계세요", "please": "부탁합니다",
            "thank_you": "감사합니다", "yes": "네", "no": "아니요",
            "good_morning": "좋은 아침", "good_night": "안녕히 주무세요",
            "the_cat": "고양이", "the_dog": "개",
            "I_eat_bread": "나는 빵을 먹습니다", "she_drinks_milk": "그녀는 우유를 마십니다",
            "the_house": "집", "the_car": "자동차",
        },
        "units": DEFAULT_UNITS
    },
    "ru": {
        "name": "Russian", "flag_code": "ru", "learners": "5.7M learners",
        "vocab": {
            "the_apple": "яблоко", "the_man": "мужчина", "the_woman": "женщина",
            "the_boy": "мальчик", "the_girl": "девочка", "water": "вода",
            "I_am_a_man": "Я мужчина", "she_is_a_woman": "Она женщина",
            "a_boy_and_a_girl": "Мальчик и девочка",
            "hello": "Привет", "goodbye": "До свидания", "please": "Пожалуйста",
            "thank_you": "Спасибо", "yes": "Да", "no": "Нет",
            "good_morning": "Доброе утро", "good_night": "Спокойной ночи",
            "the_cat": "кошка", "the_dog": "собака",
            "I_eat_bread": "Я ем хлеб", "she_drinks_milk": "Она пьет молоко",
            "the_house": "дом", "the_car": "машина",
        },
        "units": DEFAULT_UNITS
    },
}

def make_exercises(lesson_id: int, level_num: int, v: dict):
    """Generate distinct exercise types depending on level number:
       Level 1: Image Choice & MCQ (Visual Recognition)
       Level 2: Fill in the Blanks & Sentence Builder (Word Bank)
       Level 3: Listen & Type / Audio Challenge (Audio Comprehension)
       Level 4: Sentence Puzzle & Word Scramble
       Level 5: Section Mastery Challenge & Speed Exam
    """
    lvl_mod = (level_num - 1) % 5 + 1

    if lvl_mod == 1:
        # LEVEL 1: ALL IMAGE CHOICE & MCQ (Visual Recognition)
        return [
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='Which one of these is "the apple"?',
                options_json=json.dumps([
                    {"text": v.get("the_apple", "la manzana"), "image": APPLE_IMG},
                    {"text": v.get("the_man", "el hombre"),     "image": MAN_IMG},
                    {"text": v.get("the_woman", "la mujer"),   "image": WOMAN_IMG},
                ]),
                correct_answer=v.get("the_apple", "la manzana"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='Which one of these is "the man"?',
                options_json=json.dumps([
                    {"text": v.get("the_man", "el hombre"),     "image": MAN_IMG},
                    {"text": v.get("the_woman", "la mujer"),   "image": WOMAN_IMG},
                    {"text": v.get("the_boy", "el niño"),       "image": BOY_IMG},
                ]),
                correct_answer=v.get("the_man", "el hombre"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='Which one of these is "the dog"?',
                options_json=json.dumps([
                    {"text": v.get("the_dog", "el perro"),   "image": DOG_IMG},
                    {"text": v.get("the_cat", "el gato"),   "image": CAT_IMG},
                    {"text": v.get("the_house", "la casa"), "image": HOUSE_IMG},
                ]),
                correct_answer=v.get("the_dog", "el perro"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='Which one of these is "water"?',
                options_json=json.dumps([
                    {"text": v.get("water", "agua"),       "image": WATER_IMG},
                    {"text": v.get("the_apple", "la manzana"), "image": APPLE_IMG},
                    {"text": v.get("the_car", "el coche"), "image": CAR_IMG},
                ]),
                correct_answer=v.get("water", "agua"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='Which one of these is "the woman"?',
                options_json=json.dumps([
                    {"text": v.get("the_woman", "la mujer"), "image": WOMAN_IMG},
                    {"text": v.get("the_girl", "la niña"),   "image": GIRL_IMG},
                    {"text": v.get("the_man", "el hombre"),   "image": MAN_IMG},
                ]),
                correct_answer=v.get("the_woman", "la mujer"),
            ),
        ]

    elif lvl_mod == 2:
        # LEVEL 2: FILL IN THE BLANKS & SENTENCE BUILDER (Word Bank)
        return [
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='Translate: "The boy drinks water"',
                options_json=json.dumps(
                    v.get("the_boy", "el niño").split() + [v.get("water", "agua")] + v.get("the_apple", "la manzana").split()[:1]
                ),
                correct_answer=f'{v.get("the_boy", "el niño")} {v.get("water", "agua")}',
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='Translate: "She drinks milk"',
                options_json=json.dumps(
                    v.get("she_drinks_milk", "Ella bebe leche").split() + v.get("I_eat_bread", "Yo como pan").split()[:1]
                ),
                correct_answer=v.get("she_drinks_milk", "Ella bebe leche"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='Translate: "I eat bread"',
                options_json=json.dumps(
                    v.get("I_eat_bread", "Yo como pan").split() + [v.get("water", "agua")]
                ),
                correct_answer=v.get("I_eat_bread", "Yo como pan"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='Translate: "A boy and a girl"',
                options_json=json.dumps(
                    v.get("a_boy_and_a_girl", "Un niño y una niña").split() + [v.get("yes", "sí")]
                ),
                correct_answer=v.get("a_boy_and_a_girl", "Un niño y una niña"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='Translate: "Hello, good morning"',
                options_json=json.dumps(
                    [v.get("hello", "Hola"), v.get("good_morning", "Buenos días"), v.get("thank_you", "Gracias")]
                ),
                correct_answer=f'{v.get("hello", "Hola")} {v.get("good_morning", "Buenos días")}',
            ),
        ]

    elif lvl_mod == 3:
        # LEVEL 3: LISTEN AND TYPE / AUDIO EXERCISES (Listening Comprehension)
        return [
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question=f'🔊 Listen and translate: "{v.get("hello", "Hola")}"',
                options_json=json.dumps([
                    {"text": "Hello", "correct": True},
                    {"text": "Goodbye", "correct": False},
                    {"text": "Thank you", "correct": False},
                ]),
                correct_answer="Hello",
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question=f'🔊 Listen and translate: "{v.get("thank_you", "Gracias")}"',
                options_json=json.dumps([
                    {"text": "Thank you", "correct": True},
                    {"text": "Please", "correct": False},
                    {"text": "Yes", "correct": False},
                ]),
                correct_answer="Thank you",
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question=f'🔊 Listen and translate: "{v.get("good_morning", "Buenos días")}"',
                options_json=json.dumps([
                    {"text": "Good morning", "correct": True},
                    {"text": "Good night", "correct": False},
                    {"text": "Goodbye", "correct": False},
                ]),
                correct_answer="Good morning",
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question=f'🔊 Listen and translate: "{v.get("water", "Agua")}"',
                options_json=json.dumps([
                    {"text": "Water", "correct": True},
                    {"text": "Milk", "correct": False},
                    {"text": "Bread", "correct": False},
                ]),
                correct_answer="Water",
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question=f'🔊 Listen and translate: "{v.get("goodbye", "Adiós")}"',
                options_json=json.dumps([
                    {"text": "Goodbye", "correct": True},
                    {"text": "Hello", "correct": False},
                    {"text": "Please", "correct": False},
                ]),
                correct_answer="Goodbye",
            ),
        ]

    elif lvl_mod == 4:
        # LEVEL 4: SENTENCE PUZZLE / WORD SCRAMBLE
        return [
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🧩 Puzzle: Unscramble the words to mean "I am a man"',
                options_json=json.dumps(
                    v.get("I_am_a_man", "Yo soy un hombre").split()[::-1] + [v.get("the_woman", "mujer")]
                ),
                correct_answer=v.get("I_am_a_man", "Yo soy un hombre"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🧩 Puzzle: Unscramble the words to mean "She is a woman"',
                options_json=json.dumps(
                    v.get("she_is_a_woman", "Ella es una mujer").split()[::-1] + [v.get("the_man", "hombre")]
                ),
                correct_answer=v.get("she_is_a_woman", "Ella es una mujer"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🧩 Puzzle: Unscramble the words to mean "She drinks milk"',
                options_json=json.dumps(
                    v.get("she_drinks_milk", "Ella bebe leche").split()[::-1] + [v.get("water", "agua")]
                ),
                correct_answer=v.get("she_drinks_milk", "Ella bebe leche"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🧩 Puzzle: Unscramble the words to mean "I eat bread"',
                options_json=json.dumps(
                    v.get("I_eat_bread", "Yo como pan").split()[::-1] + [v.get("milk", "leche")]
                ),
                correct_answer=v.get("I_eat_bread", "Yo como pan"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🧩 Puzzle: Unscramble "The boy and the girl"',
                options_json=json.dumps(
                    v.get("a_boy_and_a_girl", "Un niño y una niña").split()[::-1]
                ),
                correct_answer=v.get("a_boy_and_a_girl", "Un niño y una niña"),
            ),
        ]

    else:
        # LEVEL 5: SECTION MASTERY CHALLENGE / SPEED EXAM
        return [
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question='🏆 Mastery Exam: Select the correct translation for "I am a man"',
                options_json=json.dumps([
                    {"text": v.get("I_am_a_man", "Yo soy un hombre"), "correct": True},
                    {"text": v.get("she_is_a_woman", "Ella es una mujer"), "correct": False},
                    {"text": v.get("a_boy_and_a_girl", "Un niño y una niña"), "correct": False},
                ]),
                correct_answer=v.get("I_am_a_man", "Yo soy un hombre"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🏆 Mastery Exam: Translate "The boy drinks water"',
                options_json=json.dumps(
                    v.get("the_boy", "el niño").split() + [v.get("water", "agua")] + [v.get("the_apple", "manzana")]
                ),
                correct_answer=f'{v.get("the_boy", "el niño")} {v.get("water", "agua")}',
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="image_choice",
                question='🏆 Mastery Exam: Which one of these is "the apple"?',
                options_json=json.dumps([
                    {"text": v.get("the_apple", "la manzana"), "image": APPLE_IMG},
                    {"text": v.get("the_man", "el hombre"),     "image": MAN_IMG},
                    {"text": v.get("the_woman", "la mujer"),   "image": WOMAN_IMG},
                ]),
                correct_answer=v.get("the_apple", "la manzana"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="select_translation",
                question='🏆 Mastery Exam: Select the correct translation for "Good morning"',
                options_json=json.dumps([
                    {"text": v.get("good_morning", "Buenos días"), "correct": True},
                    {"text": v.get("goodbye", "Adiós"), "correct": False},
                    {"text": v.get("thank_you", "Gracias"), "correct": False},
                ]),
                correct_answer=v.get("good_morning", "Buenos días"),
            ),
            models.Exercise(
                lesson_id=lesson_id,
                type="word_bank",
                question='🏆 Mastery Exam: Translate "She drinks milk"',
                options_json=json.dumps(
                    v.get("she_drinks_milk", "Ella bebe leche").split() + [v.get("bread", "pan")]
                ),
                correct_answer=v.get("she_drinks_milk", "Ella bebe leche"),
            ),
        ]


def seed_database():
    print("Initializing database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # ── Users ──────────────────────────────────────────────────────
        print("Seeding Users...")
        default_user = models.User(
            name="Guest Learner",
            email=None,
            is_guest=True,
            streak=3,
            xp=120,
            hearts=5,
            gems=500,
        )
        db.add(default_user)
        db.commit()

        # ── Courses ────────────────────────────────────────────────────
        total_courses = len(COURSE_DATA)
        for idx, (lang_code, cdata) in enumerate(COURSE_DATA.items(), 1):
            print(f"  [{idx}/{total_courses}] Seeding course: {cdata['name']} ({lang_code})...")

            course = models.Course(
                language_code=lang_code,
                name=cdata["name"],
                flag_code=cdata["flag_code"],
                learners=cdata.get("learners"),
            )
            db.add(course)
            db.commit()
            db.refresh(course)

            vocab = cdata["vocab"]
            units_template = cdata.get("units", DEFAULT_UNITS)

            # ── Units for this course ──────────────────────────────────
            for u_idx, ut in enumerate(units_template):
                unit = models.Unit(
                    course_id=course.id,
                    title=ut["title"],
                    description=ut["description"],
                    color=ut["color"],
                    order_index=u_idx + 1,
                )
                db.add(unit)
                db.commit()
                db.refresh(unit)

                # ── Skills ─────────────────────────────────────────────
                for s_idx, st in enumerate(ut["skills"]):
                    skill = models.Skill(
                        unit_id=unit.id,
                        title=st["title"],
                        icon=st["icon"],
                        position=st["position"],
                        character=st.get("character"),
                    )
                    db.add(skill)
                    db.commit()
                    db.refresh(skill)

                    # ── Lesson + Exercises ──────────────────────────────
                    lesson = models.Lesson(
                        skill_id=skill.id,
                        title=f"Lesson for {st['title']}",
                        xp_reward=20,
                    )
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)

                    level_num = s_idx + 1
                    exercises = make_exercises(lesson.id, level_num, vocab)
                    db.add_all(exercises)

            db.commit()

        print(f"\n[OK] Database seeded successfully!")
        print(f"   • {total_courses} courses (languages)")
        print(f"   • Distinct exercise types per level (Level 1: MCQ/Images, Level 2: Fill-in-blanks, Level 3: Listening, Level 4: Word Puzzle, Level 5: Mastery Exam)")

    except Exception as e:
        print(f"[ERROR] Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
